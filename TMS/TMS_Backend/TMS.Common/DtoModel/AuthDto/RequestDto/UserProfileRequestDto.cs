namespace TMS.Common.DtoModel.AuthDto.RequestDto
{
    public class UserProfileRequestDto
    {
        public Guid UserId { get; set; }  // Or omit if creating during registration
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; } = null;
    }
}
