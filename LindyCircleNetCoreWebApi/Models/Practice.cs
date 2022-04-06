using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;

namespace LindyCircleWebApi.Models
{
    public class Practice
    {
        private readonly LindyCircleDbContext _context;

        public Practice(LindyCircleDbContext context) {
            _context = context;
        }

        [JsonConstructor]
        public Practice() { }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PracticeId { get; set; }
        [Required, Display(Name = "Practice Date"), DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime PracticeDate { get; set; }
        public string PracticeDateString => PracticeDate.ToString("yyyy-MM-dd");
        [Required, Display(Name = "Practice Number")]
        public int PracticeNumber { get; set; }
        [Required, Display(Name = "Rental Cost"), Column(TypeName = "decimal(5,2)"), DisplayFormat(DataFormatString = "{0:#,##0.00}")]
        public decimal PracticeCost { get; set; }
        [Required, Display(Name = "Misc Expense"), Column(TypeName = "decimal(5,2)"), DisplayFormat(DataFormatString = "{0:#,##0.00}")]
        public decimal MiscExpense { get; set; }
        [Required, Display(Name = "Misc Revenue"), Column(TypeName = "decimal(5,2)"), DisplayFormat(DataFormatString = "{0:#,##0.00}")]
        public decimal MiscRevenue { get; set; }
        [Required, Display(Name = "Practice Topic"), MaxLength(255)]
        public string PracticeTopic { get; set; }
        [Display(Name = "Admission Revenue"), DisplayFormat(DataFormatString = "{0:#,##0.00}"), NotMapped]
        public decimal AttendanceRevenue => _context != null ? _context.Attendances.Where(w => w.PracticeId == PracticeId).Sum(s => s.PaymentAmount) : 0;
        [Display(Name = "Attendees"), NotMapped]
        public int AttendeeCount =>_context != null ? _context.Attendances.Count(c => c.PracticeId == PracticeId) : 0;
        [Display(Name = "Punch Cards Sold"), NotMapped]
        public int PunchCardsSold {
            get {
                if (_context == null) return 0;
                else if (PracticeNumber == 1)
                    return _context.PunchCards.Where(w => w.PurchaseDate <= PracticeDate).Count();
                else {
                    var lastPracticeDate = _context.Practices.Single(s => s.PracticeNumber == PracticeNumber - 1).PracticeDate;
                    return _context.PunchCards.Where(w => w.PurchaseDate > lastPracticeDate && w.PurchaseDate <= PracticeDate).Count();
                }
            }
        }
        [Display(Name = "Punch Card Revenue"), NotMapped]
        public decimal PunchCardRevenue {
            get {
                if (_context == null) return 0M;
                else if (PracticeNumber == 1)
                    return _context.PunchCards.Where(w => w.PurchaseDate <= PracticeDate).Sum(s => s.PurchaseAmount);
                else {
                    var lastPracticeDate = _context.Practices.Single(s => s.PracticeNumber == PracticeNumber - 1).PracticeDate;
                    return _context.PunchCards.Where(w => w.PurchaseDate > lastPracticeDate && w.PurchaseDate <= PracticeDate).
                        Sum(s => s.PurchaseAmount);
                }
            }
        }
        [Display(Name = "Practice Total"), NotMapped]
        public decimal PracticeTotal => AttendanceRevenue + PunchCardRevenue + MiscRevenue - PracticeCost - MiscExpense;
    }
}
