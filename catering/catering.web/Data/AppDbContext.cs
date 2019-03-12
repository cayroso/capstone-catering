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

        public DbSet<ItemPrice> ItemPrices { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<ReservationNote> ReservationNotes { get; set; }
        public DbSet<Package> Packages { get; set; }
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
                new User{ UserId="administrator", UserName="administrator",  Password="1234", FirstName="Admin First", MiddleName="Admin Middle", LastName="Admin Last", Email="admin@gmail.com", Mobile="1234", Phone="2345" },
                new User{ UserId="user1", UserName="user1",  Password="1234", FirstName="User First", MiddleName= "User Middle", LastName ="User1", Email="user1@gmail.com", Mobile="1234", Phone="2345" },
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

            var menus = new List<PackageItem>();

            for (var i = 1; i <= 61; i++)
            {
                var menu = new PackageItem
                {
                    PackageItemId = $"menu{i}",
                    Name = $"Menu #{i}",
                    ImageUrl = $"images/{i}.JPG",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea."
                };

                menus.Add(menu);
            }

            var packages = new List<Package>(new[]
            {
                new Package{
                    PackageId ="wedding",
                    Name ="Wedding",
                    Description ="Wedding Package",
                    Items = new List<PackageItem>( menus.Take(15).ToArray())
                },
                new Package{
                    PackageId ="debut",
                    Name ="Debut",
                    Description ="Debut Package",
                    Items = new List<PackageItem>( menus.Skip(15).Take(15).ToArray())
                },
                new Package{
                    PackageId ="children-party",
                    Name ="Children Party",
                    Description ="Children Party Package",
                    Items = new List<PackageItem>( menus.Skip(30).Take(15).ToArray())
                },
                new Package{
                    PackageId ="corporate-event",
                    Name ="Corporate Event",
                    Description ="Corporate Event Package",
                    Items = new List<PackageItem>( menus.Skip(45).Take(16).ToArray())
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
                    ReservationStatus = ReservationStatus.Paid
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
                    ReservationStatus = ReservationStatus.Paid
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
                    ReservationStatus = ReservationStatus.Paid
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

        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
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
        Paid = 1,
        Complete = 2,
        Cancelled = 3
    }

    public class ReservationNote
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string ReservationNoteId { get; set; }

        public string ReservationId { get; set; }

        public string UserId { get; set; }
        public virtual User User { get; set; }

        public string Content { get; set; }
        public DateTime DateCreated { get; set; }
    }

    public class Reservation
    {
        public Reservation()
        {
            Notes = new List<ReservationNote>();
            PackageItems = new List<PackageItem>();
            Notes = new List<ReservationNote>();
            ShortMessages = new List<ShortMessage>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string ReservationId { get; set; }
        public ReservationStatus ReservationStatus { get; set; }

        public string UserId { get; set; }
        public virtual User User { get; set; }

        public string PackageId { get; set; }
        public virtual Package Package { get; set; }
        public virtual ICollection<PackageItem> PackageItems { get; set; }

        public int GuestCount { get; set; }

        public int PlateCount { get; set; }
        public int SpoonCount { get; set; }
        public int ForkCount { get; set; }
        public int GlassCount { get; set; }
        public int ChairCount { get; set; }
        public int TableCount { get; set; }
        public bool HasSoundSystem { get; set; }
        public bool HasFlowers { get; set; }

        public decimal PlatePrice { get; set; }
        public decimal SpoonPrice { get; set; }
        public decimal ForkPrice { get; set; }
        public decimal GlassPrice { get; set; }
        public decimal ChairPrice { get; set; }
        public decimal TablePrice { get; set; }
        public decimal SoundSystemPrice { get; set; }
        public decimal FlowerPrice { get; set; }

        public string ReferenceNumber { get; set; }

        public decimal AmountPaid { get; set; }

        public virtual ICollection<ReservationNote> Notes { get; set; }
        public virtual ICollection<ShortMessage> ShortMessages { get; set; }

        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }


        [NotMapped]
        public decimal PlateExtPrice => PlateCount * PlatePrice;
        [NotMapped]
        public decimal SpoonExtPrice => SpoonCount * SpoonPrice;
        [NotMapped]
        public decimal ForkExtPrice => ForkCount * ForkPrice;
        [NotMapped]
        public decimal GlassExtPrice => GlassCount * GlassPrice;
        [NotMapped]
        public decimal ChairExtPrice => ChairCount * ChairPrice;
        [NotMapped]
        public decimal TableExtPrice => TableCount * TablePrice;
        [NotMapped]
        public decimal FlowerExtPrice => HasFlowers ? FlowerPrice : 0M;
        [NotMapped]
        public decimal SoundSystemExtPrice => HasSoundSystem ? SoundSystemPrice : 0M;

        [NotMapped]
        public decimal TotalPrice => PlateExtPrice + SpoonExtPrice + ForkExtPrice + GlassExtPrice
            + ChairExtPrice + TableExtPrice + FlowerExtPrice + SoundSystemExtPrice;

        [NotMapped]
        public decimal AmountDue => TotalPrice - AmountPaid;
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
    }

    public class PackageItem
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string PackageItemId { get; set; }

        public string PackageId { get; set; }
        public virtual Package Package { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
    }
}



