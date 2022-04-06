using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace LindyCircleWebApi.Models
{
    public class RegistrationResponseDto
    {
        public bool IsRegistrationSuccessful { get; set; }
        public IEnumerable<string> Errors { get; set; }
        public string Title { get; set; }
    }
}
