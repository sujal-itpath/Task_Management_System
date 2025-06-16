using System.ComponentModel.DataAnnotations;

namespace TMS.Common.DtoModel.TaskDtos.Request
{
    public class TaskCreateRequestDto
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public List<Guid> AssignedToUserIds { get; set; } = new();
    }

}
