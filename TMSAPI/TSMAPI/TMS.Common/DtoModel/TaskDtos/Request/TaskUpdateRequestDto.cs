using System.ComponentModel.DataAnnotations;
using TMS.Common.Enums;

namespace TMS.Common.DtoModel.TaskDtos.Request
{
    public class TaskUpdateRequestDto
    {
        [Required]
        public Guid TaskId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public List<Guid>? AssignedToUserIds { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        public WorkTaskStatus Status { get; set; }
    }

}
