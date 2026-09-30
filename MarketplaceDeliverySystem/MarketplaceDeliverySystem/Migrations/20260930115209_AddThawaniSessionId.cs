using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarketplaceDeliverySystem.Migrations
{
    /// <inheritdoc />
    public partial class AddThawaniSessionId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThawaniSessionId",
                table: "Payments",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThawaniSessionId",
                table: "Payments");
        }
    }
}
