﻿namespace TMS.Common.DtoModel.AuthDto.ResponseDto
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public Guid RoleId { get; set; }
    }

}
