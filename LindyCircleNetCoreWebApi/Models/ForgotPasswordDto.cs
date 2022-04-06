using System.ComponentModel.DataAnnotations;

namespace LindyCircleWebApi.Models
{
    public class ForgotPasswordDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string ClientUri { get; set; }
    }
}
