using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
        [Required(ErrorMessage = "Purchase Member is required")]
        public int PurchaseMemberId { get; set; }
        [Display(Name = "Purchase Member Name"), NotMapped]
        public string PurchaseMemberName => _context != null ? _context.Members.Find(PurchaseMemberId).FirstLastName : string.Empty;
        [Required(ErrorMessage = "Current Member is required")]
        public int CurrentMemberId { get; set; }
        [Display(Name = "Current Member Name"), NotMapped]
        public string CurrentMemberName => _context != null ? _context.Members.Find(CurrentMemberId).FirstLastName: string.Empty;
        [Required(ErrorMessage = "Purchase Date is required"), Display(Name = "Purchase Date"), DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime PurchaseDate { get; set; }
        [Required(ErrorMessage = "Purchase Amount is required"), Display(Name = "Amount"), Column(TypeName = "decimal(5,2)"), DisplayFormat(DataFormatString = "{0:#0.00}")]
        public decimal PurchaseAmount { get; set; }
        [Display(Name = "Remaining Punches"), NotMapped]
        public int RemainingPunches => _context != null ? 5 - (_context?.PunchCardUsages.Count(c => c.PunchCardId == PunchCardId) ?? 5) : 0;
    }
}
