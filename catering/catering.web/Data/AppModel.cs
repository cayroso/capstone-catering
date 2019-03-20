using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace catering.web.Data
{
    public class ShortMessage
    {
        public ShortMessage()
        {
            Sender = string.Empty;
            Receiver = string.Empty;
            Subject = string.Empty;
            Body = string.Empty;
            DateCreated = DateTime.UtcNow;
            SentCount = 0;
            Result = string.Empty;
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string ShortMessageId { get; set; }
        public string ReservationId { get; set; }
        public virtual Reservation Reservation { get; set; }
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateSent { get; set; }
        public int SentCount { get; set; }
        public string Result { get; set; }
    }

    public class Reservation
    {
        public Reservation()
        {
            ReservationItems = new List<ReservationItem>();
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
        public virtual ICollection<ReservationItem> ReservationItems { get; set; }

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


    public class ReservationNote
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string ReservationNoteId { get; set; }

        public string ReservationId { get; set; }
        public Reservation Reservation { get; set; }

        public string UserId { get; set; }
        public virtual User User { get; set; }

        public string Content { get; set; }
        public DateTime DateCreated { get; set; }
    }

    public class ReservationItem
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string ReservationItemId { get; set; }
        public string ReservationId { get; set; }
        public Reservation Reservation { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
    }


    public class BusinessInfo
    {
        public string BusinessInfoId { get; set; }

        public string About { get; set; }
        public string History { get; set; }
        public string Location { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Facebook { get; set; }

        public DateTime DateCreated { get; set; }
    }
}
