using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace catering.web.Migrations
{
    public partial class AppDbSchema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BusinessInfos",
                columns: table => new
                {
                    BusinessInfoId = table.Column<string>(nullable: false),
                    About = table.Column<string>(nullable: true),
                    History = table.Column<string>(nullable: true),
                    Location = table.Column<string>(nullable: true),
                    ContactNumber = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Facebook = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessInfos", x => x.BusinessInfoId);
                });

            migrationBuilder.CreateTable(
                name: "ItemPrices",
                columns: table => new
                {
                    ItemPriceId = table.Column<string>(nullable: false),
                    Plate = table.Column<decimal>(nullable: false),
                    Spoon = table.Column<decimal>(nullable: false),
                    Fork = table.Column<decimal>(nullable: false),
                    Glass = table.Column<decimal>(nullable: false),
                    Chair = table.Column<decimal>(nullable: false),
                    Table = table.Column<decimal>(nullable: false),
                    Flower = table.Column<decimal>(nullable: false),
                    SoundSystem = table.Column<decimal>(nullable: false),
                    FixedCost = table.Column<decimal>(nullable: false),
                    FixedLabor = table.Column<decimal>(nullable: false),
                    DateCreated = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemPrices", x => x.ItemPriceId);
                });

            migrationBuilder.CreateTable(
                name: "Packages",
                columns: table => new
                {
                    PackageId = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Packages", x => x.PackageId);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: true),
                    FullName = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    Mobile = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "PackageImages",
                columns: table => new
                {
                    PackageImageId = table.Column<string>(nullable: false),
                    PackageId = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    ImageUrl = table.Column<string>(nullable: true),
                    Price = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageImages", x => x.PackageImageId);
                    table.ForeignKey(
                        name: "FK_PackageImages_Packages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "Packages",
                        principalColumn: "PackageId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PackageItems",
                columns: table => new
                {
                    PackageItemId = table.Column<string>(nullable: false),
                    PackageId = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Category = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Price = table.Column<double>(nullable: false),
                    ImageUrl = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageItems", x => x.PackageItemId);
                    table.ForeignKey(
                        name: "FK_PackageItems_Packages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "Packages",
                        principalColumn: "PackageId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Reservation",
                columns: table => new
                {
                    ReservationId = table.Column<string>(nullable: false),
                    ReservationStatus = table.Column<int>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    PackageId = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    Venue = table.Column<string>(nullable: true),
                    GuestCount = table.Column<int>(nullable: false),
                    PlateCount = table.Column<int>(nullable: false),
                    SpoonCount = table.Column<int>(nullable: false),
                    ForkCount = table.Column<int>(nullable: false),
                    GlassCount = table.Column<int>(nullable: false),
                    ChairCount = table.Column<int>(nullable: false),
                    TableCount = table.Column<int>(nullable: false),
                    HasSoundSystem = table.Column<bool>(nullable: false),
                    HasFlowers = table.Column<bool>(nullable: false),
                    PlatePrice = table.Column<decimal>(nullable: false),
                    SpoonPrice = table.Column<decimal>(nullable: false),
                    ForkPrice = table.Column<decimal>(nullable: false),
                    GlassPrice = table.Column<decimal>(nullable: false),
                    ChairPrice = table.Column<decimal>(nullable: false),
                    TablePrice = table.Column<decimal>(nullable: false),
                    SoundSystemPrice = table.Column<decimal>(nullable: false),
                    FlowerPrice = table.Column<decimal>(nullable: false),
                    FixedCost = table.Column<decimal>(nullable: false),
                    FixedLabor = table.Column<decimal>(nullable: false),
                    ReferenceNumber = table.Column<string>(nullable: true),
                    AmountPaid = table.Column<decimal>(nullable: false),
                    DateStart = table.Column<DateTimeOffset>(nullable: false),
                    DateEnd = table.Column<DateTimeOffset>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservation", x => x.ReservationId);
                    table.ForeignKey(
                        name: "FK_Reservation_Packages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "Packages",
                        principalColumn: "PackageId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reservation_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserRoleId = table.Column<string>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    RoleId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.UserRoleId);
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReservationItem",
                columns: table => new
                {
                    ReservationItemId = table.Column<string>(nullable: false),
                    ReservationId = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    ImageUrl = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationItem", x => x.ReservationItemId);
                    table.ForeignKey(
                        name: "FK_ReservationItem_Reservation_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservation",
                        principalColumn: "ReservationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReservationNotes",
                columns: table => new
                {
                    ReservationNoteId = table.Column<string>(nullable: false),
                    ReservationId = table.Column<string>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    Content = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationNotes", x => x.ReservationNoteId);
                    table.ForeignKey(
                        name: "FK_ReservationNotes_Reservation_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservation",
                        principalColumn: "ReservationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReservationNotes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ShortMessage",
                columns: table => new
                {
                    ShortMessageId = table.Column<string>(nullable: false),
                    ReservationId = table.Column<string>(nullable: false),
                    Sender = table.Column<string>(nullable: true),
                    Receiver = table.Column<string>(nullable: true),
                    Subject = table.Column<string>(nullable: true),
                    Body = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateSent = table.Column<DateTime>(nullable: true),
                    SentCount = table.Column<int>(nullable: false),
                    Result = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShortMessage", x => x.ShortMessageId);
                    table.ForeignKey(
                        name: "FK_ShortMessage_Reservation_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservation",
                        principalColumn: "ReservationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PackageImages_PackageId",
                table: "PackageImages",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_PackageItems_PackageId",
                table: "PackageItems",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_PackageId",
                table: "Reservation",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_UserId",
                table: "Reservation",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationItem_ReservationId",
                table: "ReservationItem",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationNotes_ReservationId",
                table: "ReservationNotes",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationNotes_UserId",
                table: "ReservationNotes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ShortMessage_ReservationId",
                table: "ShortMessage",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UserId",
                table: "UserRoles",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BusinessInfos");

            migrationBuilder.DropTable(
                name: "ItemPrices");

            migrationBuilder.DropTable(
                name: "PackageImages");

            migrationBuilder.DropTable(
                name: "PackageItems");

            migrationBuilder.DropTable(
                name: "ReservationItem");

            migrationBuilder.DropTable(
                name: "ReservationNotes");

            migrationBuilder.DropTable(
                name: "ShortMessage");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Reservation");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Packages");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
