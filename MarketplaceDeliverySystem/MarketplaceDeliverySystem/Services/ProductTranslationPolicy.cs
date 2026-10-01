using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Services;

public static class ProductTranslationPolicy
{
    public static void ApplyUpdate(Product product, UpdateProductDTO dto)
    {
        bool nameChanged = product.ProductName != dto.ProductName;
        bool descriptionChanged = product.Description != dto.Description;

        product.ProductName = dto.ProductName;
        product.Description = dto.Description;

        if (dto.ProductNameAr != null)
            SetName(product, dto.ProductNameAr);
        else if (nameChanged)
        {
            if (product.ProductNameArIsManual)
                product.ProductNameArNeedsReview = true;
            else
                product.ProductNameAr = null;
        }

        if (dto.DescriptionAr != null)
            SetDescription(product, dto.DescriptionAr);
        else if (descriptionChanged)
        {
            if (product.DescriptionArIsManual)
                product.DescriptionArNeedsReview = true;
            else
                product.DescriptionAr = null;
        }

        if (nameChanged || descriptionChanged || dto.ProductNameAr != null || dto.DescriptionAr != null)
            ResetRetry(product);
    }

    public static void SetManual(Product product, string? nameAr, string? descriptionAr)
    {
        SetName(product, nameAr);
        SetDescription(product, descriptionAr);
        ResetRetry(product);
    }

    public static void SetName(Product product, string? value)
    {
        product.ProductNameAr = string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        product.ProductNameArIsManual = product.ProductNameAr != null;
        product.ProductNameArNeedsReview = false;
    }

    public static void SetDescription(Product product, string? value)
    {
        product.DescriptionAr = string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        product.DescriptionArIsManual = product.DescriptionAr != null;
        product.DescriptionArNeedsReview = false;
    }

    private static void ResetRetry(Product product)
    {
        product.TranslationAttempts = 0;
        product.NextTranslationAttemptAtUtc = null;
    }
}
