using TMS.DAL.EntityModel.TaskEntity;

namespace TSM.DAL.EntityModel.AuthEntity
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public Guid RoleId { get; set; }
        public Role? Role { get; set; }

        public UserProfile? Profile { get; set; }
        public ICollection<UserLog>? Logs { get; set; }
        public ICollection<UserTask> UserTasks { get; set; } = new List<UserTask>();

    }
}
