using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LindyCircleWebApi.Models
{
    public class Attendance
    {
        private readonly LindyCircleDbContext _context;

        public Attendance(LindyCircleDbContext context) {
            _context = context;
        }

        [JsonConstructor]
        public Attendance() { }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttendanceId { get; set; }
        public int MemberId { get; set; }
        public string MemberName => _context?.Members.Find(MemberId).LastFirstName;
        public int PracticeId { get; set; }
        [Required]
        public DateTime? PracticeDate => _context?.Practices.Find(PracticeId).PracticeDate;
        public int PaymentType { get; set; }
        [Display(Name = "Type"), NotMapped]
        public string PaymentTypeText =>
            PaymentType switch
            {
                0 => "None",
                1 => "Cash",
                2 => "Punch card",
                _ => "Other",
            };
        [Required, Display(Name = "Amount"), Column(TypeName = "decimal(5,2)"), DisplayFormat(DataFormatString = "{0:#,##0.00}")]
        public decimal PaymentAmount { get; set; }
    }
}
