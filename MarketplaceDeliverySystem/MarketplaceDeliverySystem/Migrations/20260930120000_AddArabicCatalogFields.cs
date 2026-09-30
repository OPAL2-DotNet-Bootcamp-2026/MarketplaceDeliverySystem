using MarketplaceDeliverySystem;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarketplaceDeliverySystem.Migrations
{
    [DbContext(typeof(MarketplaceContext))]
    [Migration("20260930120000_AddArabicCatalogFields")]
    public partial class AddArabicCatalogFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(name: "BusinessNameAr", table: "Businesses", type: "nvarchar(100)", maxLength: 100, nullable: true);
            migrationBuilder.AddColumn<string>(name: "DescriptionAr", table: "Businesses", type: "nvarchar(500)", maxLength: 500, nullable: true);
            migrationBuilder.AddColumn<string>(name: "BusinessCategoryNameAr", table: "BusinessCategories", type: "nvarchar(100)", maxLength: 100, nullable: true);
            migrationBuilder.AddColumn<string>(name: "CategoryNameAr", table: "Categories", type: "nvarchar(100)", maxLength: 100, nullable: true);
            migrationBuilder.AddColumn<string>(name: "DescriptionAr", table: "Categories", type: "nvarchar(500)", maxLength: 500, nullable: true);
            migrationBuilder.AddColumn<string>(name: "ProductNameAr", table: "Products", type: "nvarchar(150)", maxLength: 150, nullable: true);
            migrationBuilder.AddColumn<string>(name: "DescriptionAr", table: "Products", type: "nvarchar(1000)", maxLength: 1000, nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "BusinessNameAr", table: "Businesses");
            migrationBuilder.DropColumn(name: "DescriptionAr", table: "Businesses");
            migrationBuilder.DropColumn(name: "BusinessCategoryNameAr", table: "BusinessCategories");
            migrationBuilder.DropColumn(name: "CategoryNameAr", table: "Categories");
            migrationBuilder.DropColumn(name: "DescriptionAr", table: "Categories");
            migrationBuilder.DropColumn(name: "ProductNameAr", table: "Products");
            migrationBuilder.DropColumn(name: "DescriptionAr", table: "Products");
        }
    }
}
