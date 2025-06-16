namespace TMS.Common.DtoModel.TaskDtos.Response
{
    public class TaskListResponseDto
    {
        public Guid TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public TaskStatus Status { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
