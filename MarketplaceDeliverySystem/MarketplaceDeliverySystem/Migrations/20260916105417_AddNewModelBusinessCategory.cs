using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarketplaceDeliverySystem.Migrations
{
    /// <inheritdoc />
    public partial class AddNewModelBusinessCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BusinessCategoryId",
                table: "Businesses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "BusinessCategories",
                columns: table => new
                {
                    BusinessCategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BusinessCategoryName = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BusinessCategoryImageURL = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessCategories", x => x.BusinessCategoryId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Businesses_BusinessCategoryId",
                table: "Businesses",
                column: "BusinessCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessCategories_BusinessCategoryName",
                table: "BusinessCategories",
                column: "BusinessCategoryName",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Businesses_BusinessCategories_BusinessCategoryId",
                table: "Businesses",
                column: "BusinessCategoryId",
                principalTable: "BusinessCategories",
                principalColumn: "BusinessCategoryId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Businesses_BusinessCategories_BusinessCategoryId",
                table: "Businesses");

            migrationBuilder.DropTable(
                name: "BusinessCategories");

            migrationBuilder.DropIndex(
                name: "IX_Businesses_BusinessCategoryId",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "BusinessCategoryId",
                table: "Businesses");
        }
    }
}
