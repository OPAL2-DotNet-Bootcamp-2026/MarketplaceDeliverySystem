using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

namespace MarketplaceDeliverySystem.Services;

public sealed class AzureTranslatorOptions
{
    public string Endpoint { get; set; } = "https://api.cognitive.microsofttranslator.com";
    public string? ApiKey { get; set; }
    public string? Region { get; set; }
}

public interface ITextTranslator
{
    Task<IReadOnlyList<string>> TranslateToArabicAsync(
        IReadOnlyList<string> englishTexts, CancellationToken cancellationToken);
}

public sealed class AzureTextTranslator : ITextTranslator
{
    private readonly HttpClient _client;
    private readonly AzureTranslatorOptions _options;

    public AzureTextTranslator(HttpClient client, IOptions<AzureTranslatorOptions> options)
    {
        _client = client;
        _options = options.Value;
    }

    public async Task<IReadOnlyList<string>> TranslateToArabicAsync(
        IReadOnlyList<string> englishTexts, CancellationToken cancellationToken)
    {
        if (englishTexts.Count == 0) return Array.Empty<string>();
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
            throw new InvalidOperationException("Azure Translator is not configured.");

        string endpoint = _options.Endpoint.TrimEnd('/');
        using var request = new HttpRequestMessage(HttpMethod.Post,
            $"{endpoint}/translate?api-version=3.0&from=en&to=ar");
        request.Headers.Add("Ocp-Apim-Subscription-Key", _options.ApiKey);
        if (!string.IsNullOrWhiteSpace(_options.Region))
            request.Headers.Add("Ocp-Apim-Subscription-Region", _options.Region);
        request.Content = JsonContent.Create(englishTexts.Select(text => new { Text = text }).ToArray());

        using HttpResponseMessage response = await _client.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
        var results = await response.Content.ReadFromJsonAsync<AzureTranslationResult[]>(cancellationToken);
        if (results == null || results.Length != englishTexts.Count)
            throw new InvalidOperationException("Azure Translator returned an incomplete response.");

        var translations = new List<string>(results.Length);
        foreach (var result in results)
        {
            string? value = result.Translations?.FirstOrDefault(t => t.To == "ar")?.Text;
            if (string.IsNullOrWhiteSpace(value))
                throw new InvalidOperationException("Azure Translator returned an empty Arabic translation.");
            translations.Add(value.Trim());
        }
        return translations;
    }

    private sealed class AzureTranslationResult
    {
        [JsonPropertyName("translations")]
        public AzureTranslation[]? Translations { get; set; }
    }

    private sealed class AzureTranslation
    {
        [JsonPropertyName("to")]
        public string? To { get; set; }
        [JsonPropertyName("text")]
        public string? Text { get; set; }
    }
}
