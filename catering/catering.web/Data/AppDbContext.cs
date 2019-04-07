using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace catering.web.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {

        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<BusinessInfo> BusinessInfos { get; set; }

        public DbSet<ItemPrice> ItemPrices { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<ReservationNote> ReservationNotes { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<PackageImage> PackageImages { get; set; }
        public DbSet<PackageItem> PackageItems { get; set; }


        public DbSet<ShortMessage> ShortMessages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<cateringwebUser>()
            //    .HasMany(e => e.Reservations)
            //    .WithOne(e => e.cateringwebUser)
            //    .IsRequired();

            //modelBuilder.Entity<Reservation>()
            //    .HasMany(e => e.ReservationMenus)
            //    .WithOne(e => e.Reservation)
            //    .IsRequired();

            modelBuilder.Entity<Reservation>()
                .HasMany(p => p.ShortMessages)
                .WithOne(p => p.Reservation)
                .HasForeignKey(p => p.ReservationId)
                .IsRequired();

            modelBuilder.Entity<Reservation>()
                .HasMany(p => p.ReservationItems)
                .WithOne(p => p.Reservation)
                .HasForeignKey(p => p.ReservationId)
                .IsRequired();

            modelBuilder.Entity<Reservation>()
                .HasMany(p => p.Notes)
                .WithOne(p => p.Reservation)
                .HasForeignKey(p => p.ReservationId)
                .IsRequired();

            modelBuilder.Entity<Reservation>().ToTable("Reservation");


            modelBuilder.Entity<ShortMessage>()
                .HasOne(p => p.Reservation)
                .WithMany(p => p.ShortMessages)
                .HasForeignKey(p => p.ReservationId)
                .IsRequired(false);


            modelBuilder.Entity<ShortMessage>().ToTable("ShortMessage");
        }
    }


    public static class AppDbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            if (context.Users.Any())
            {
                return;
            }

            context.AddRange(
                new Role { RoleId = AppRoles.Administrator, Name = "Administrator" },
                new Role { RoleId = AppRoles.Customer, Name = "Customer" }
                );

            var users = new List<User>(new[]
            {
                new User{ UserId="administrator", UserName="administrator",  Password="1234", FullName="Administrator", Email="admin@gmail.com", Mobile="09198262335", Address="105 Main Street" },
                new User{ UserId="user1", UserName="user1",  Password="1234", FullName="Customer #1", Email="user1@gmail.com", Mobile="+639198262335", Address="105 Main Street" },
            });

            users.ForEach(p => context.Add(p));

            context.Add(new UserRole
            {
                UserRoleId = Guid.NewGuid().ToString(),
                UserId = users[0].UserId,
                RoleId = "administrator"
            });

            context.Add(new UserRole
            {
                UserRoleId = Guid.NewGuid().ToString(),
                UserId = users[1].UserId,
                RoleId = "customer"
            });

            var menus = new List<PackageImage>();

            for (var i = 1; i <= 20; i++)
            {
                var menu = new PackageImage
                {
                    PackageImageId = $"menu{i}",
                    Name = $"Menu #{i}",
                    ImageUrl = $"images/IMG_{i}.JPG",
                    Description = "The quick brown foxs the lazy dog.",
                    Price = (i * 100) * i
                };

                menus.Add(menu);
            }

            var packages = new List<Package>(new[]
            {
                new Package{
                    PackageId ="wedding",
                    Name ="Wedding",
                    Description ="Wedding Package",
                    Images = new List<PackageImage>( menus.Take(5).ToArray()),
                    //Items = new List<PackageItem>
                    //{
                    //    new PackageItem{ PackageId="wedding", PackageItemId="wedding-item1", Name="item1", Category="category1", Price=1.25, Type="type1" },
                    //    new PackageItem{ PackageId="wedding", PackageItemId="wedding-item2", Name="item2", Category="category1", Price=1.25, Type="type1"},
                    //    new PackageItem{ PackageId="wedding", PackageItemId="wedding-item3", Name="item3", Category="category1", Price=1.25, Type="type1"},
                    //    new PackageItem{ PackageId="wedding", PackageItemId="wedding-item4", Name="item4", Category="category1", Price=1.25, Type="type1"},
                    //}
                },
                new Package{
                    PackageId ="debut",
                    Name ="Debut",
                    Description ="Debut Package",
                    Images = new List<PackageImage>( menus.Skip(5).Take(5).ToArray())
                },
                new Package{
                    PackageId ="children-party",
                    Name ="Children Party",
                    Description ="Children Party Package",
                    Images = new List<PackageImage>( menus.Skip(10).Take(5).ToArray())
                },
                new Package{
                    PackageId ="corporate-event",
                    Name ="Corporate Event",
                    Description ="Corporate Event Package",
                    Images = new List<PackageImage>( menus.Skip(15).Take(5).ToArray())
                },

            });

            packages.ForEach(p => context.Add(p));


            var now = DateTime.UtcNow.Date;

            var reservations = new List<Reservation>(new[] {
                new Reservation
                {
                    ReservationId = Guid.NewGuid().ToString(),
                    UserId = "user1",
                    PackageId = "wedding",

                     Title = "Past Reservation, Spanning 2 days",
                     Venue = "105 Main Street 1",
                    GuestCount = 500,

                    ChairCount = 100,
                    ChairPrice = 1.25m,

                    ForkCount = 200,
                    ForkPrice = 2.25M,

                    GlassCount = 10,
                    GlassPrice = 3,

                    PlateCount = 50,
                    PlatePrice = 5.5M,

                    SpoonCount = 25,
                    SpoonPrice = 10.75M,

                    TableCount = 5,
                    TablePrice = 100,

                    FlowerPrice = 1000,
                    SoundSystemPrice = 6000,
                    FixedCost = 3000,
                    FixedLabor = 3000,
                    HasFlowers = true,
                    HasSoundSystem = true,

                    DateStart = now.AddDays(-2).Date ,
                    DateEnd = now.AddDays(-1).Date.AddHours(2),
                    ReservationStatus = ReservationStatus.Pending
                },
                new Reservation
                {
                    ReservationId = Guid.NewGuid().ToString(),
                    UserId = "user1",
                    PackageId = "debut",
                     Title = "Reservation Today",
                     Venue = "105 Main Street 2",
                    GuestCount = 500,

                    ChairCount = 100,
                    ChairPrice = 1.25m,

                    ForkCount = 200,
                    ForkPrice = 2.25M,

                    GlassCount = 10,
                    GlassPrice = 3,

                    PlateCount = 50,
                    PlatePrice = 5.5M,

                    SpoonCount = 25,
                    SpoonPrice = 10.75M,

                    TableCount = 5,
                    TablePrice = 100,

                    FlowerPrice = 1000,
                    SoundSystemPrice = 6000,
                    FixedCost = 3000,
                    FixedLabor = 3000,

                    HasFlowers = true,
                    HasSoundSystem = true,


                    DateStart = now.AddHours(8).Date ,
                    DateEnd = now.AddHours(12).Date.Date.AddHours(2),
                    ReservationStatus = ReservationStatus.PaymentAccepted
                },
                new Reservation
                {
                    ReservationId = Guid.NewGuid().ToString(),
                    UserId = "user1",
                    PackageId = "children-party",
                     Title = "Reservation For Tomorrow 1",
                     Venue = "105 Main Street 3",
                    GuestCount = 500,

                    ChairCount = 100,
                    ChairPrice = 1.25m,

                    ForkCount = 200,
                    ForkPrice = 2.25M,

                    GlassCount = 10,
                    GlassPrice = 3,

                    PlateCount = 50,
                    PlatePrice = 5.5M,

                    SpoonCount = 25,
                    SpoonPrice = 10.75M,

                    TableCount = 5,
                    TablePrice = 100,

                    HasFlowers = true,
                    FlowerPrice = 2000M,
                    HasSoundSystem = true,
                    SoundSystemPrice = 6000,
                    FixedCost = 3000,
                    FixedLabor = 3000,


                    DateStart = now.AddDays(1).AddHours(7).Date ,
                    DateEnd = now.AddDays(1).AddHours(10).Date.Date.AddHours(2),
                    ReservationStatus = ReservationStatus.PaymentAccepted
                },
                new Reservation
                {
                    ReservationId = Guid.NewGuid().ToString(),
                    UserId = "user1",
                    PackageId = "corporate-event",
                     Title = "Reservation For Tomorrow 2",
                     Venue = "105 Main Street 4",
                    GuestCount = 500,

                    ChairCount = 100,
                    ChairPrice = 1.25m,

                    ForkCount = 200,
                    ForkPrice = 2.25M,

                    GlassCount = 10,
                    GlassPrice = 3,

                    PlateCount = 50,
                    PlatePrice = 5.5M,

                    SpoonCount = 25,
                    SpoonPrice = 10.75M,

                    TableCount = 5,
                    TablePrice = 100,

                    HasFlowers = true,
                    FlowerPrice = 2000M,
                    HasSoundSystem = true,
                    SoundSystemPrice = 6000,
                    FixedCost = 3000,
                    FixedLabor = 3000,

                    DateStart = now.AddDays(1).AddHours(7).Date ,
                    DateEnd = now.AddDays(1).AddHours(10).Date.Date.AddHours(2),
                    ReservationStatus = ReservationStatus.PaymentAccepted
                }
            });

            reservations.ForEach(p =>
            {
                context.Add(p);

                for (var i = 0; i < 3; i++)
                {
                    var sms = new ShortMessage
                    {
                        ShortMessageId = $"{i}-{p.ReservationId}",
                        Subject = $"subject-{i}",
                        Body = "The quick brown foxs the lazy dog.",
                        SentCount = 0,
                        DateCreated = DateTime.UtcNow,
                        DateSent = null,
                        Receiver = $"+639198262335",
                        ReservationId = p.ReservationId,
                        Result = "",
                        Sender = $"sender={i}"
                    };

                    context.Add(sms);
                }
            });

            var itemPrice = new ItemPrice
            {
                Plate = 2.50M,
                Spoon = 1,
                Fork = 1,
                Glass = 3,
                Chair = 6,
                Table = 135,
                Flower = 1600,
                SoundSystem = 6000,
                FixedCost = 3000,
                FixedLabor = 3000,
                DateCreated = now
            };

            context.Add(itemPrice);

            context.SaveChanges();
        }
    }

}



