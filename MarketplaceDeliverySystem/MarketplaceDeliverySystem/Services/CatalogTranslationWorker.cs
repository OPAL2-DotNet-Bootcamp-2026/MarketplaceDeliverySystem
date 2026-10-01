using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceDeliverySystem.Services;

// Missing Arabic catalog fields are the queue for existing and newly created rows.
// A conditional update keeps English edits and human Arabic corrections made during
// an Azure request from being overwritten by its result.
public sealed class CatalogTranslationWorker : BackgroundService
{
    private const int BatchSize = 10;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<CatalogTranslationWorker> _logger;
    private readonly Dictionary<(CatalogKind Kind, int Id), RetryState> _retries = new();

    public CatalogTranslationWorker(
        IServiceScopeFactory scopeFactory, ILogger<CatalogTranslationWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await TranslateBatch(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Catalog translation batch failed; it will be retried.");
            }

            try
            {
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
        }
    }

    private async Task TranslateBatch(CancellationToken cancellationToken)
    {
        using IServiceScope scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MarketplaceContext>();
        var translator = scope.ServiceProvider.GetRequiredService<ITextTranslator>();
        DateTime now = DateTime.UtcNow;

        foreach (CatalogCandidate candidate in await LoadPending(db, now, cancellationToken))
        {
            cancellationToken.ThrowIfCancellationRequested();
            var key = (candidate.Kind, candidate.Id);
            bool translateName = string.IsNullOrWhiteSpace(candidate.NameAr) &&
                !string.IsNullOrWhiteSpace(candidate.Name);
            bool translateDescription = string.IsNullOrWhiteSpace(candidate.DescriptionAr) &&
                !string.IsNullOrWhiteSpace(candidate.Description);

            var source = new List<string>(2);
            if (translateName) source.Add(candidate.Name);
            if (translateDescription) source.Add(candidate.Description!);
            if (source.Count == 0) continue;

            try
            {
                IReadOnlyList<string> translated = await translator.TranslateToArabicAsync(source, cancellationToken);
                string? nameAr = translateName ? translated[0] : candidate.NameAr;
                string? descriptionAr = translateDescription ? translated[^1] : candidate.DescriptionAr;
                if (nameAr?.Length > 100 || descriptionAr?.Length > 500)
                    throw new InvalidOperationException("Generated Arabic catalog text exceeds the field limit.");

                await SaveTranslation(db, candidate, nameAr, descriptionAr, cancellationToken);
                _retries.Remove(key);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                int attempts = _retries.TryGetValue(key, out RetryState state) ? state.Attempts + 1 : 1;
                int delayMinutes = Math.Min(5 * (1 << Math.Min(attempts - 1, 8)), 1440);
                DateTime retryAt = DateTime.UtcNow.AddMinutes(delayMinutes);
                _retries[key] = new RetryState(attempts, retryAt);
                _logger.LogWarning(ex,
                    "Arabic translation for {CatalogKind} {CatalogId} will be retried after {RetryAt}.",
                    candidate.Kind, candidate.Id, retryAt);
            }
        }
    }

    private async Task<List<CatalogCandidate>> LoadPending(
        MarketplaceContext db, DateTime now, CancellationToken cancellationToken)
    {
        int[] blockedCategories = BlockedIds(CatalogKind.Category, now);
        int[] blockedBusinessCategories = BlockedIds(CatalogKind.BusinessCategory, now);
        int[] blockedBusinesses = BlockedIds(CatalogKind.Business, now);

        List<Category> categories = await db.Categories.AsNoTracking()
            .Where(c => !blockedCategories.Contains(c.CategoryId))
            .Where(c => (c.CategoryName.Trim() != "" && (c.CategoryNameAr == null || c.CategoryNameAr.Trim() == "")) ||
                        (c.Description != null && c.Description.Trim() != "" &&
                         (c.DescriptionAr == null || c.DescriptionAr.Trim() == "")))
            .OrderBy(c => c.CategoryId)
            .Take(BatchSize)
            .ToListAsync(cancellationToken);

        List<BusinessCategory> businessCategories = await db.BusinessCategories.AsNoTracking()
            .Where(c => !blockedBusinessCategories.Contains(c.BusinessCategoryId))
            .Where(c => c.BusinessCategoryName.Trim() != "" &&
                        (c.BusinessCategoryNameAr == null || c.BusinessCategoryNameAr.Trim() == ""))
            .OrderBy(c => c.BusinessCategoryId)
            .Take(BatchSize)
            .ToListAsync(cancellationToken);

        List<Business> businesses = await db.Businesses.AsNoTracking()
            .Where(b => !blockedBusinesses.Contains(b.BusinessId))
            .Where(b => (b.BusinessName.Trim() != "" && (b.BusinessNameAr == null || b.BusinessNameAr.Trim() == "")) ||
                        (b.Description != null && b.Description.Trim() != "" &&
                         (b.DescriptionAr == null || b.DescriptionAr.Trim() == "")))
            .OrderBy(b => b.BusinessId)
            .Take(BatchSize)
            .ToListAsync(cancellationToken);

        var result = new List<CatalogCandidate>(categories.Count + businessCategories.Count + businesses.Count);
        result.AddRange(categories.Select(c => new CatalogCandidate(
            CatalogKind.Category, c.CategoryId, c.CategoryName, c.Description,
            c.CategoryNameAr, c.DescriptionAr)));
        result.AddRange(businessCategories.Select(c => new CatalogCandidate(
            CatalogKind.BusinessCategory, c.BusinessCategoryId, c.BusinessCategoryName, null,
            c.BusinessCategoryNameAr, null)));
        result.AddRange(businesses.Select(b => new CatalogCandidate(
            CatalogKind.Business, b.BusinessId, b.BusinessName, b.Description,
            b.BusinessNameAr, b.DescriptionAr)));
        return result;
    }

    private int[] BlockedIds(CatalogKind kind, DateTime now) => _retries
        .Where(entry => entry.Key.Kind == kind && entry.Value.RetryAt > now)
        .Select(entry => entry.Key.Id)
        .ToArray();

    private static async Task SaveTranslation(
        MarketplaceContext db, CatalogCandidate candidate,
        string? nameAr, string? descriptionAr, CancellationToken cancellationToken)
    {
        switch (candidate.Kind)
        {
            case CatalogKind.Category:
                await db.Categories.Where(c => c.CategoryId == candidate.Id &&
                    c.CategoryName == candidate.Name && c.Description == candidate.Description &&
                    c.CategoryNameAr == candidate.NameAr && c.DescriptionAr == candidate.DescriptionAr)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(c => c.CategoryNameAr, nameAr)
                        .SetProperty(c => c.DescriptionAr, descriptionAr), cancellationToken);
                break;
            case CatalogKind.BusinessCategory:
                await db.BusinessCategories.Where(c => c.BusinessCategoryId == candidate.Id &&
                    c.BusinessCategoryName == candidate.Name &&
                    c.BusinessCategoryNameAr == candidate.NameAr)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(c => c.BusinessCategoryNameAr, nameAr), cancellationToken);
                break;
            case CatalogKind.Business:
                await db.Businesses.Where(b => b.BusinessId == candidate.Id &&
                    b.BusinessName == candidate.Name && b.Description == candidate.Description &&
                    b.BusinessNameAr == candidate.NameAr && b.DescriptionAr == candidate.DescriptionAr)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(b => b.BusinessNameAr, nameAr)
                        .SetProperty(b => b.DescriptionAr, descriptionAr), cancellationToken);
                break;
        }
    }

    private enum CatalogKind { Category, BusinessCategory, Business }
    private sealed record RetryState(int Attempts, DateTime RetryAt);
    private sealed record CatalogCandidate(
        CatalogKind Kind, int Id, string Name, string? Description,
        string? NameAr, string? DescriptionAr);
}
