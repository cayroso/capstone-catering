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
                .IsRequired();


            modelBuilder.Entity<ShortMessage>().ToTable("ShortMessage");
        }
    }
    public static class AppRoles
    {
        public const string Administrator = "administrator";
        public const string Customer = "customer";
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
                new User{ UserId="administrator", UserName="administrator",  Password="1234", FullName="Administrator", Email="admin@gmail.com", Mobile="1234", Phone="+639198262335" },
                new User{ UserId="user1", UserName="user1",  Password="1234", FullName="Customer #1", Email="user1@gmail.com", Mobile="1234", Phone="+639198262335" },
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
                    Images = new List<PackageImage>( menus.Take(5).ToArray())
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


            var now = DateTime.UtcNow;

            var reservations = new List<Reservation>(new[] {
                new Reservation
                {
                    ReservationId = Guid.NewGuid().ToString(),
                    UserId = "user1",
                    PackageId = "wedding",

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

                    HasFlowers = true,
                    HasSoundSystem = true,

                    DateStart = now.AddDays(-2) ,
                    DateEnd = now.AddDays(-1),
                    ReservationStatus = ReservationStatus.Pending
                },
                new Reservation
                {
                    ReservationId = Guid.NewGuid().ToString(),
                    UserId = "user1",
                    PackageId = "debut",

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

                    HasFlowers = true,
                    HasSoundSystem = true,


                    DateStart = now.AddHours(8) ,
                    DateEnd = now.AddHours(12),
                    ReservationStatus = ReservationStatus.PaymentAccepted
                },
                new Reservation
                {
                    ReservationId = Guid.NewGuid().ToString(),
                    UserId = "user1",
                    PackageId = "children-party",

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


                    DateStart = now.AddDays(1).AddHours(7) ,
                    DateEnd = now.AddDays(1).AddHours(10),
                    ReservationStatus = ReservationStatus.PaymentAccepted
                },
                new Reservation
                {
                    ReservationId = Guid.NewGuid().ToString(),
                    UserId = "user1",
                    PackageId = "corporate-event",

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

                    DateStart = now.AddDays(1).AddHours(7) ,
                    DateEnd = now.AddDays(1).AddHours(10),
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
                        ShortMessageId = $"shortmessge-{i}-{p.ReservationId}",
                        Subject = $"subject-{i}",
                        Body = "body",
                        SentCount = 0,
                        DateCreated = DateTime.UtcNow,
                        DateSent = null,
                        Receiver = $"receiver={i}",
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
                DateCreated = now
            };

            context.Add(itemPrice);

            context.SaveChanges();
        }
    }

    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string UserId { get; set; }

        public string UserName { get; set; }
        public string Password { get; set; }

        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }

        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
    }

    public class Role
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string RoleId { get; set; }

        public string Name { get; set; }
    }

    public class UserRole
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string UserRoleId { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public string RoleId { get; set; }
        public Role Role { get; set; }
    }

    public class ItemPrice
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string ItemPriceId { get; set; }

        public decimal Plate { get; set; }
        public decimal Spoon { get; set; }
        public decimal Fork { get; set; }
        public decimal Glass { get; set; }
        public decimal Chair { get; set; }
        public decimal Table { get; set; }
        public decimal Flower { get; set; }
        public decimal SoundSystem { get; set; }

        public DateTime DateCreated { get; set; }

    }

    public enum ReservationStatus
    {
        Pending = 0,
        PaymentSent = 1,
        PaymentAccepted = 2,
        PaymentRejected = 3,
        Complete = 4,
        Cancelled = 5
    }



    /// <summary>
    /// Wedding, Debut, Children Party, Corporate Event
    /// </summary>
    public class Package
    {
        public Package()
        {
            Items = new List<PackageItem>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string PackageId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        public virtual ICollection<PackageItem> Items { get; set; }
        public virtual ICollection<PackageImage> Images { get; set; }
    }

    public class PackageItem
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string PackageItemId { get; set; }

        public string PackageId { get; set; }
        public virtual Package Package { get; set; }

        public string Name { get; set; }
        public string Category { get; set; }
        public string Type { get; set; }
        public double Price { get; set; }

    }

    public class PackageImage
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string PackageImageId { get; set; }

        public string PackageId { get; set; }
        public virtual Package Package { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        public double Price { get; set; }
    }
}



