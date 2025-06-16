using TMS.Common.DtoModel.TaskDtos.Request;
using TMS.Common.DtoModel.TaskDtos.Response;

namespace TMS.BLL.Services.Interface
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskListResponseDto>> GetAllTasksAsync();

        Task<TaskResponseDto?> GetTaskByIdAsync(Guid id);
        Task<IEnumerable<UserTaskListResponseDto>> GetTasksByUserIdAsync(Guid userId);

        Task<TaskResponseDto> CreateTaskAsync(TaskCreateRequestDto dto);

        Task<bool> UpdateTaskAsync(Guid id, TaskUpdateRequestDto dto);

        Task<bool> DeleteTaskAsync(Guid id);
    }
}
