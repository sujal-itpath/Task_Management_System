using Microsoft.AspNetCore.Http;

namespace TMS.Common.DtoModel.AuthDto.RequestDto
{
    public class UpdateProfileImageRequestDto
    {
        public Guid UserId { get; set; }
        public IFormFile ImageFile { get; set; }
    }
}