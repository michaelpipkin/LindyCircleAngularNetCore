using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LindyCircleWebApi.CustomTokenProviders
{
    public class EmailConfirmationTokenProvider<IdentityUser> : DataProtectorTokenProvider<IdentityUser> where IdentityUser : class
    {
        public EmailConfirmationTokenProvider(IDataProtectionProvider dataProtectionProvider,
            IOptions<EmailConfirmationTokenProviderOptions> options,
            ILogger<DataProtectorTokenProvider<IdentityUser>> logger)
            : base(dataProtectionProvider, options, logger) {
        }
    }
    public class EmailConfirmationTokenProviderOptions : DataProtectionTokenProviderOptions
    {
    }
}
