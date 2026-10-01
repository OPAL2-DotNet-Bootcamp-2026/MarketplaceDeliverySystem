using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceDeliverySystem.Services;

// Null Arabic fields are the durable work queue. The worker also fills older products.
public sealed class ProductTranslationWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ProductTranslationWorker> _logger;

    public ProductTranslationWorker(
        IServiceScopeFactory scopeFactory, ILogger<ProductTranslationWorker> logger)
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
                _logger.LogWarning(ex, "Product translation batch failed; it will be retried.");
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

        List<Product> pending = await db.Products.AsNoTracking()
            .Where(p => p.NextTranslationAttemptAtUtc == null || p.NextTranslationAttemptAtUtc <= now)
            .Where(p => (!p.ProductNameArIsManual && p.ProductNameAr == null) ||
                        (p.Description != null && p.Description.Trim() != "" &&
                         !p.DescriptionArIsManual && p.DescriptionAr == null))
            .OrderBy(p => p.NextTranslationAttemptAtUtc)
            .ThenBy(p => p.ProductId)
            .Take(20)
            .ToListAsync(cancellationToken);

        foreach (Product product in pending)
        {
            cancellationToken.ThrowIfCancellationRequested();
            bool translateName = !product.ProductNameArIsManual && product.ProductNameAr == null;
            bool translateDescription = !string.IsNullOrWhiteSpace(product.Description) &&
                !product.DescriptionArIsManual && product.DescriptionAr == null;
            if (!translateName && !translateDescription) continue;

            var source = new List<string>(2);
            if (translateName) source.Add(product.ProductName);
            if (translateDescription) source.Add(product.Description!);

            try
            {
                IReadOnlyList<string> translated = await translator.TranslateToArabicAsync(source, cancellationToken);
                string? nameAr = translateName ? translated[0] : product.ProductNameAr;
                string? descriptionAr = translateDescription ? translated[^1] : product.DescriptionAr;
                if (nameAr?.Length > 150 || descriptionAr?.Length > 1000)
                    throw new InvalidOperationException("The generated Arabic text exceeds the product field limit.");

                // English edits and manual corrections made during the external call win.
                await MatchingProduct(db, product).ExecuteUpdateAsync(setters => setters
                    .SetProperty(p => p.ProductNameAr, nameAr)
                    .SetProperty(p => p.DescriptionAr, descriptionAr)
                    .SetProperty(p => p.TranslationAttempts, 0)
                    .SetProperty(p => p.NextTranslationAttemptAtUtc, (DateTime?)null), cancellationToken);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                int attempts = product.TranslationAttempts + 1;
                int delayMinutes = Math.Min(5 * (1 << Math.Min(attempts - 1, 8)), 1440);
                DateTime retryAt = DateTime.UtcNow.AddMinutes(delayMinutes);
                await MatchingProduct(db, product).ExecuteUpdateAsync(setters => setters
                    .SetProperty(p => p.TranslationAttempts, attempts)
                    .SetProperty(p => p.NextTranslationAttemptAtUtc, retryAt), cancellationToken);
                _logger.LogWarning(ex, "Arabic translation for product {ProductId} will be retried after {RetryAt}.",
                    product.ProductId, retryAt);
            }
        }
    }

    private static IQueryable<Product> MatchingProduct(MarketplaceContext db, Product original) =>
        db.Products.Where(p => p.ProductId == original.ProductId &&
            p.ProductName == original.ProductName && p.Description == original.Description &&
            p.ProductNameAr == original.ProductNameAr && p.DescriptionAr == original.DescriptionAr &&
            p.ProductNameArIsManual == original.ProductNameArIsManual &&
            p.DescriptionArIsManual == original.DescriptionArIsManual &&
            p.TranslationAttempts == original.TranslationAttempts);
}
