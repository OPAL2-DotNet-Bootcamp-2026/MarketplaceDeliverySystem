namespace MarketplaceDeliverySystem.Settings
{
    // Bound from the "Thawani" section of appsettings.json / user-secrets.
    public class ThawaniSettings
    {
        // true  = Thawani UAT (testing) API, no real money moves.
        // false = Thawani live API.
        public bool UseTestMode { get; set; } = true;

        public string TestBaseUrl { get; set; } = "https://uatcheckout.thawani.om";
        public string LiveBaseUrl { get; set; } = "https://checkout.thawani.om";

        public string TestSecretKey { get; set; } = string.Empty;
        public string TestPublishableKey { get; set; } = string.Empty;
        public string LiveSecretKey { get; set; } = string.Empty;
        public string LivePublishableKey { get; set; } = string.Empty;

        // Folder that holds PaymentResult.html, used for Thawani's success/cancel redirects.
        public string FrontendBaseUrl { get; set; } = "http://127.0.0.1:5500/html%20pages";

        public string BaseUrl => UseTestMode ? TestBaseUrl : LiveBaseUrl;
        public string SecretKey => UseTestMode ? TestSecretKey : LiveSecretKey;
        public string PublishableKey => UseTestMode ? TestPublishableKey : LivePublishableKey;
    }
}
