using System.ComponentModel.DataAnnotations;

namespace LindyCircleWebApi.Models
{
    public class UserAuthenticationDto
    {
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        public string ClientUri { get; set; }
    }
}
