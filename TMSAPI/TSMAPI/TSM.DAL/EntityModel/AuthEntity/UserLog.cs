namespace TSM.DAL.EntityModel.AuthEntity
{
    public class UserLog
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public User? User { get; set; }
    }
}
