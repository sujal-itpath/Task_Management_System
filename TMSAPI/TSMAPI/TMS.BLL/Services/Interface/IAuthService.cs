using Microsoft.AspNetCore.Http;
using TMS.Common.DtoModel.AuthDto.RequestDto;
using TMS.Common.DtoModel.AuthDto.ResponseDto;

namespace TSM.BLL.Service.Interface
{
    public interface IAuthService
    {
        Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto dto, IFormFile? profileImage);
        Task<string> SaveProfileImageAsync(IFormFile file, Guid userId);
        Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);
        Task<bool> ForgotPasswordAsync(ForgotPasswordRequestDto dto);
        Task<bool> ResetPasswordAsync(ResetPasswordRequestDto dto);
        Task<IEnumerable<UserListResponseDto>> GetAllUsersAsync();
        Task<bool> UpdateUserRoleAsync(UpdateUserRoleRequestDto dto);
    }
}