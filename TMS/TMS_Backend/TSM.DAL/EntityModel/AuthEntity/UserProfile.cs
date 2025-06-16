namespace TSM.DAL.EntityModel.AuthEntity
{
    public class UserProfile
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }

        public User? User { get; set; }
    }
}
