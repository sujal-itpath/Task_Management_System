using TSM.DAL.EntityModel.AuthEntity;

namespace TMS.DAL.EntityModel.TaskEntity
{
    public class UserTask
    {
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public Guid TaskId { get; set; }
        public TaskEntity Task { get; set; } = null!;
    }
}
