using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;


namespace LindyCircleWebApi.Models
{
    public class PunchCard
    {
        private readonly LindyCircleDbContext _context;

        public PunchCard(LindyCircleDbContext context) {
            _context = context;
        }

        [JsonConstructor]
        public PunchCard() { }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PunchCardId { get; set; }
        public int PurchaseMemberId { get; set; }
        public string PurchaseMemberName => _context?.Members.Find(PurchaseMemberId).LastFirstName;
        public int CurrentMemberId { get; set; }
        public string CurrentMemberName => _context?.Members.Find(CurrentMemberId).LastFirstName;
        [Required, Display(Name = "Purchase Date"), DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime PurchaseDate { get; set; }
        [Required, Display(Name = "Amount"), Column(TypeName = "decimal(5,2)"), DisplayFormat(DataFormatString = "{0:#0.00}")]
        public decimal PurchaseAmount { get; set; }
        public int RemainingPunches => 5 - (_context?.PunchCardUsages.Count(c => c.PunchCardId == PunchCardId) ?? 5);
    }
}
