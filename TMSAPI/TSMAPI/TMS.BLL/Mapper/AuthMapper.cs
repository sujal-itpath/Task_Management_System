using TMS.Common.DtoModel.AuthDto.ResponseDto;
using TMS.Common.DtoModel.AuthDto.RequestDto;
using TSM.DAL.EntityModel.AuthEntity;

namespace TSM.BLL.Mapper
{
    public static class AuthMapper
    {
        public static User ToUserEntity(RegisterRequestDto dto, Guid roleId)
        {
            return new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email.Trim().ToLowerInvariant(),
                Password = dto.Password,
                RoleId = roleId,
                IsActive = true
            };
        }

        public static UserProfile ToUserProfileEntity(UserProfileRequestDto dto)
        {
            return new UserProfile
            {
                Id = Guid.NewGuid(),
                UserId = dto.UserId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                ProfileImageUrl = dto.ProfileImageUrl
            };
        }

        public static UserProfileResponseDto ToUserProfileResponse(UserProfile profile)
        {
            return new UserProfileResponseDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                FirstName = profile.FirstName,
                LastName = profile.LastName,
                PhoneNumber = profile.PhoneNumber,
                ProfileImageUrl = profile.ProfileImageUrl
            };
        }

        public static RegisterResponseDto ToRegisterResponse(User user)
        {
            return new RegisterResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.Profile != null
                    ? $"{user.Profile.FirstName} {user.Profile.LastName}".Trim()
                    : string.Empty,
                Role = user.Role?.Name ?? string.Empty,
                RoleId = user.RoleId
            };
        }

        public static LoginResponseDto ToLoginResponse(User user, string token)
        {
            return new LoginResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.Profile != null
                    ? $"{user.Profile.FirstName} {user.Profile.LastName}".Trim()
                    : string.Empty,
                Role = user.Role?.Name ?? string.Empty,
                RoleId = user.RoleId,
                Token = token
            };
        }

        public static string NormalizeEmail(string email)
        {
            return email.Trim().ToLowerInvariant();
        }

        public static void UpdatePassword(User user, string newPassword)
        {
            user.Password = newPassword; // Should be hashed
        }
    }
}
