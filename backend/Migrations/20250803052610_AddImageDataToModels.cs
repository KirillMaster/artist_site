using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddImageDataToModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImagePath",
                table: "Paintings",
                newName: "ImageMimeType");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Paintings",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.CreateTable(
                name: "AboutInfos",
                columns: table => new
                {
                    Biography = table.Column<string>(type: "text", nullable: false),
                    PhotoData = table.Column<byte[]>(type: "bytea", nullable: false),
                    PhotoMimeType = table.Column<string>(type: "text", nullable: false),
                    LandingPagePhotoData = table.Column<byte[]>(type: "bytea", nullable: false),
                    LandingPagePhotoMimeType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AboutInfos");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Paintings");

            migrationBuilder.RenameColumn(
                name: "ImageMimeType",
                table: "Paintings",
                newName: "ImagePath");
        }
    }
}
