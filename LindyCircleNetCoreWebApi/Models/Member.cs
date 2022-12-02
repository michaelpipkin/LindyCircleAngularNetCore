using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LindyCircleWebApi.Models
{
    public class Member
    {
        private readonly LindyCircleDbContext _context;

        public Member(LindyCircleDbContext context) {
            _context = context;
        }

        [JsonConstructor]
        public Member() { }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MemberId { get; set; }
        [Required(ErrorMessage = "First Name is required."), Display(Name = "First Name"), MaxLength(50)]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last Name is required."), Display(Name = "Last Name"), MaxLength(50)]
        public string LastName { get; set; }
        public bool Inactive { get; set; }
        [Display(Name = "Status"), NotMapped]
        public string ActiveText => Inactive ? "Inactive" : "Active";
        [Display(Name = "Name"), NotMapped]
        public string FirstLastName => FirstName + " " + LastName;
        [Display(Name = "Name"), NotMapped]
        public string LastFirstName => LastName + ", " + FirstName;
        [Display(Name = "Remaining Punches"), NotMapped]
        public int RemainingPunches => _context != null ? _context.PunchCards.Where(w => w.CurrentMemberId == MemberId).ToList().Sum(s => s.RemainingPunches) : 0;
        [Display(Name = "Total Paid"), DisplayFormat(DataFormatString = "{0:#0.00}"), NotMapped]
        public decimal TotalPaid => _context != null ? _context.Attendances.Where(w => w.MemberId == MemberId).Sum(s => s.PaymentAmount) +
            _context.PunchCards.Where(w => w.PurchaseMemberId == MemberId).Sum(s => s.PurchaseAmount) : 0;
        [Display(Name = "Attended"), NotMapped]
        public int TotalAttendance => _context != null ? _context.Attendances.Count(c => c.MemberId == MemberId) : 0;
    }
}
