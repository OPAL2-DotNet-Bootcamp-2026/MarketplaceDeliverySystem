using MarketplaceDeliverySystem;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarketplaceDeliverySystem.Migrations
{
    [DbContext(typeof(MarketplaceContext))]
    [Migration("20260930130000_AddProductAutoTranslation")]
    public partial class AddProductAutoTranslation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(name: "ProductNameArIsManual", table: "Products", type: "bit", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<bool>(name: "ProductNameArNeedsReview", table: "Products", type: "bit", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<bool>(name: "DescriptionArIsManual", table: "Products", type: "bit", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<bool>(name: "DescriptionArNeedsReview", table: "Products", type: "bit", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<int>(name: "TranslationAttempts", table: "Products", type: "int", nullable: false, defaultValue: 0);
            migrationBuilder.AddColumn<DateTime>(name: "NextTranslationAttemptAtUtc", table: "Products", type: "datetime2", nullable: true);

            // Translations supplied before this migration are treated as reviewed copy.
            migrationBuilder.Sql("UPDATE Products SET ProductNameAr = NULL WHERE LTRIM(RTRIM(ProductNameAr)) = ''");
            migrationBuilder.Sql("UPDATE Products SET DescriptionAr = NULL WHERE LTRIM(RTRIM(DescriptionAr)) = ''");
            migrationBuilder.Sql("UPDATE Products SET ProductNameArIsManual = 1 WHERE ProductNameAr IS NOT NULL AND LTRIM(RTRIM(ProductNameAr)) <> ''");
            migrationBuilder.Sql("UPDATE Products SET DescriptionArIsManual = 1 WHERE DescriptionAr IS NOT NULL AND LTRIM(RTRIM(DescriptionAr)) <> ''");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "ProductNameArIsManual", table: "Products");
            migrationBuilder.DropColumn(name: "ProductNameArNeedsReview", table: "Products");
            migrationBuilder.DropColumn(name: "DescriptionArIsManual", table: "Products");
            migrationBuilder.DropColumn(name: "DescriptionArNeedsReview", table: "Products");
            migrationBuilder.DropColumn(name: "TranslationAttempts", table: "Products");
            migrationBuilder.DropColumn(name: "NextTranslationAttemptAtUtc", table: "Products");
        }
    }
}
