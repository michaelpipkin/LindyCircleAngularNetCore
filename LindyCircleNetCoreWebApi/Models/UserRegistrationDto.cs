﻿using System.ComponentModel.DataAnnotations;

namespace LindyCircleWebApi.Models
{
    public class UserRegistrationDto
    {
        [Required(ErrorMessage = "UserName is required.")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
        public string ClientUri { get; set; }
    }
}
