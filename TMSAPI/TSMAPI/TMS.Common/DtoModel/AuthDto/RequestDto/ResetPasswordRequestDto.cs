﻿
namespace TMS.Common.DtoModel.AuthDto.RequestDto
{
    public class ResetPasswordRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }

}
