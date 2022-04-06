using AutoMapper;
using EmailService;
using LindyCircleWebApi.Models;
using LindyCircleWebApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace LindyCircleWebApi.Controllers
{
    [Route("api/Accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;
        private readonly IEmailSender _emailSender;

        public AccountsController(UserManager<IdentityUser> userManager,
            IMapper mapper,
            JwtService jwtService,
            IEmailSender emailSender) {
            _userManager = userManager;
            _mapper = mapper;
            _jwtService = jwtService;
            _emailSender = emailSender;
        }

        [HttpPost("Registration")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationDto userRegistration) {
            if (userRegistration == null || !ModelState.IsValid)
                return BadRequest();

            var user = _mapper.Map<IdentityUser>(userRegistration);
            user.LockoutEnabled = false;
            user.TwoFactorEnabled = false;

            var result = await _userManager.CreateAsync(user, userRegistration.Password);
            if (result.Succeeded) {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var param = new Dictionary<string, string>
                {
                    {"token", token},
                    { "userName", user.UserName }
                };
                var callback = QueryHelpers.AddQueryString(userRegistration.ClientUri, param);
                var messageBody = $"Click <a href={callback}>here</a> to confirm your account.";
                var message = new Message(new string[] { user.Email }, "Lindy Circle new user confirmation", messageBody);
                await _emailSender.SendEmailAsync(message);
                
                await _userManager.AddToRoleAsync(user, "Member");

                return StatusCode(201);
            }
            else {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new RegistrationResponseDto
                {
                    IsRegistrationSuccessful = false,
                    Errors = errors,
                    Title = "Registration Error"
                });
            }
        }

        [HttpGet("EmailConfirmation")]
        public async Task<IActionResult> EmailConfirmation([FromQuery] string userName, [FromQuery] string token) {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
                return BadRequest("Invalid email confirmation request");

            var confirmResult = await _userManager.ConfirmEmailAsync(user, token);
            if (!confirmResult.Succeeded)
                return BadRequest("Invalid email confirmation request");

            return Ok();
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserAuthenticationDto userAuthentication) {
            var user = await _userManager.FindByNameAsync(userAuthentication.UserName);
            if (user == null)
                return BadRequest(new AuthResponseDto { Title = "Unable to authenticate login credentials", Detail = "Invalid username/password combination" });
            if (!await _userManager.IsEmailConfirmedAsync(user)) {
                var confirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var param = new Dictionary<string, string>
                {
                    {"token", confirmationToken},
                    { "userName", user.UserName }
                };
                var callback = QueryHelpers.AddQueryString(userAuthentication.ClientUri, param);
                var messageBody = $"Click <a href={callback}>here</a> to confirm your account.";
                var message = new Message(new string[] { user.Email }, "Lindy Circle new user confirmation", messageBody);
                await _emailSender.SendEmailAsync(message);
                return Unauthorized(new AuthResponseDto { Title = "Email not confirmed", 
                    Detail = "You must confirm your email address before you can login. A new confirmation email has been sent. " + 
                    "Please click the link the email to confirm your email address." });
            }
            if (!await _userManager.CheckPasswordAsync(user, userAuthentication.Password))
                return Unauthorized(new AuthResponseDto { Title = "Unable to authenticate login credentials", Detail = "Invalid username/password combination" });

            var signingCredentials = _jwtService.GetSigningCredentials();
            var claims = await _jwtService.GetClaims(user);
            var tokenOptions = _jwtService.GenerateTokenOptions(signingCredentials, claims);
            var authToken = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new AuthResponseDto { 
                IsAuthSuccessful = true, 
                Token = authToken,
                UserName = user.UserName,
                Email = user.Email,
                Roles = roles.ToList() });
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto) {
            if (!ModelState.IsValid) return BadRequest();
            var user = await _userManager.FindByNameAsync(forgotPasswordDto.UserName);
            if (user == null) return BadRequest("Invalid request");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var param = new Dictionary<string, string>
            {
                {"token", token},
                {"userName", forgotPasswordDto.UserName }
            };

            var callback = QueryHelpers.AddQueryString(forgotPasswordDto.ClientUri, param);
            var messageBody = $"Click <a href={callback}>here</a> to reset your password.";
            var message = new Message(new string[] { user.Email }, "Lindy Circle password reset link", messageBody);
            await _emailSender.SendEmailAsync(message);

            return Ok();
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto) {
            if (!ModelState.IsValid)
                return BadRequest();
            var user = await _userManager.FindByNameAsync(resetPasswordDto.UserName);
            if (user == null)
                return BadRequest("Invalid Request");

            var resetPasswordResult = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
            if (!resetPasswordResult.Succeeded) {
                var errors = resetPasswordResult.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }
            return Ok();
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto) {
            if (!ModelState.IsValid)
                return BadRequest();
            var user = await _userManager.FindByNameAsync(changePasswordDto.UserName);
            if (user == null)
                return BadRequest("Invalid Request");

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            if (!changePasswordResult.Succeeded) {
                var errors = changePasswordResult.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }
            return Ok();
        }
    }
}
