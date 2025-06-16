using Microsoft.AspNetCore.Mvc;
using TMS.Common.DtoModel.AuthDto.RequestDto;
using TSM.BLL.Service.Interface;

namespace TSM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Register([FromForm] RegisterRequestDto dto, IFormFile? profileImage)
        {
            try
            {
                var result = await _authService.RegisterAsync(dto, profileImage);
                return CreatedAtAction(nameof(Register), result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            try
            {
                var result = await _authService.LoginAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto dto)
        {
            var result = await _authService.ForgotPasswordAsync(dto);
            if (result)
                return Ok(new { message = "Password reset instructions sent if email exists." });
            else
                return NotFound(new { message = "Email not found." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto dto)
        {
            var result = await _authService.ResetPasswordAsync(dto);
            if (result)
                return Ok(new { message = "Password has been reset successfully." });
            else
                return BadRequest(new { message = "Invalid reset request." });
        }

        // ✅ GET: All Users with Role & Profile Info
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _authService.GetAllUsersAsync();
            return Ok(users);
        }

        // ✅ PUT: Update User Role
        [HttpPut("update-role")]
        public async Task<IActionResult> UpdateUserRole([FromBody] UpdateUserRoleRequestDto dto)
        {
            try
            {
                var result = await _authService.UpdateUserRoleAsync(dto);
                if (result)
                    return Ok(new { message = "User role updated successfully." });
                return BadRequest(new { message = "Unable to update role." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
