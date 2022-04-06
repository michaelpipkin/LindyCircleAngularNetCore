using AutoMapper;
using LindyCircleWebApi.Models;
using Microsoft.AspNetCore.Identity;

namespace LindyCircleWebApi
{
    public class MappingProfile : Profile
    {
        public MappingProfile() {
            CreateMap<UserRegistrationDto, IdentityUser>()
                .ForMember(i => i.UserName, opt => opt.MapFrom(u => u.UserName))
                .ForMember(i => i.Email, opt => opt.MapFrom(u => u.Email));
        }
    }
}
