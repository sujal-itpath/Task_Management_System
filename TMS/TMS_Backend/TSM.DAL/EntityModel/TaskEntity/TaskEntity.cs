using TMS.Common.Enums;
using TSM.DAL.EntityModel.AuthEntity;

namespace TMS.DAL.EntityModel.TaskEntity
{
    public class TaskEntity
    {
        public Guid TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public User? AssignedToUser { get; set; }
        public WorkTaskStatus Status { get; set; } 
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        //public User? AssignedToUser { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; } = false;
        public ICollection<UserTask> UserTasks { get; set; } = new List<UserTask>();

    }
}
