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
}
