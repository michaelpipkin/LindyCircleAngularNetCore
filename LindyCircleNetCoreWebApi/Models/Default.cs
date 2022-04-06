using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LindyCircleWebApi.Models
{
    public class Default
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DefaultId { get; set; }
        [Required(ErrorMessage = "Default name is required.")]
        public string DefaultName { get; set; }
        [Required(ErrorMessage = "Default value is required."), Column(TypeName = "decimal(5,2)")]
        public decimal DefaultValue { get; set; }
    }
}
