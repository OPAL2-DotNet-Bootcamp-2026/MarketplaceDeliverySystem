using System.Globalization;

namespace MarketplaceDeliverySystem.Services
{
    public static class LocalizedText
    {
        public static bool IsArabic => CultureInfo.CurrentUICulture.TwoLetterISOLanguageName == "ar";

        public static string Choose(string english, string? arabic) =>
            IsArabic && !string.IsNullOrWhiteSpace(arabic) ? arabic : english;

        public static string? ChooseOptional(string? english, string? arabic) =>
            IsArabic && !string.IsNullOrWhiteSpace(arabic) ? arabic : english;
    }
}
