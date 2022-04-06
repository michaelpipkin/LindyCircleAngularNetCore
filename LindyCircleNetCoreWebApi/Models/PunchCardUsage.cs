using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LindyCircleWebApi.Models
{
    public class PunchCardUsage
    {
        private readonly LindyCircleDbContext _context;

        public PunchCardUsage(LindyCircleDbContext context) {
            _context = context;
        }

        [JsonConstructor]
        public PunchCardUsage() { }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UsageId { get; set; }
        public int AttendanceId { get; set; }
        public int PunchCardId { get; set; }
    }
}
