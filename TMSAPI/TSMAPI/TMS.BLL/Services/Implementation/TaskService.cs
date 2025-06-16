using TMS.BLL.Mapper;
using TMS.BLL.Services.Interface;
using TMS.Common.DtoModel.TaskDtos.Response;
using TMS.Common.DtoModel.TaskDtos.Request;
using TMS.DAL.EntityModel.TaskEntity;
using TSM.DAL.Repository.Interface;
using Microsoft.AspNetCore.Identity;

namespace TMS.BLL.Services.Implementation
{
    public class TaskService : ITaskService
    {
        private readonly IGenericRepository<TaskEntity> _taskRepo;
        private readonly IGenericRepository<UserTask> _userTaskRepo;

        public TaskService(IGenericRepository<TaskEntity> taskRepo, IGenericRepository<UserTask> userTaskRepo)
        {
            _taskRepo = taskRepo;
            _userTaskRepo = userTaskRepo;
        }

        public async Task<IEnumerable<TaskListResponseDto>> GetAllTasksAsync()
        {
            var tasks = await _taskRepo.GetAllAsync();
            return tasks.Select(TaskMapper.MapToListDto);
        }

        public async Task<IEnumerable<UserTaskListResponseDto>> GetTasksByUserIdAsync(Guid userId)
        {
            var userTasks = await _userTaskRepo.FindAsync(ut => ut.UserId == userId);

            var taskIds = userTasks.Select(ut => ut.TaskId).ToList();

            var tasks = await _taskRepo.FindAsync(t => taskIds.Contains(t.TaskId) && !t.IsDeleted);

            return tasks.Select(TaskMapper.MapToUserTaskDto);
        }

        //public async Task<>

        public async Task<TaskResponseDto?> GetTaskByIdAsync(Guid id)
        {
            var task = await _taskRepo.GetByGuidAsync(id);
            if (task == null) return null;

            return TaskMapper.MapToResponseDto(task);
        }

        public async Task<TaskResponseDto> CreateTaskAsync(TaskCreateRequestDto dto)
        {
            var task = TaskMapper.MapToEntity(dto);
            var created = await _taskRepo.AddAsync(task);
            await _taskRepo.SaveChangesAsync();

            //await CreateUserTasksAsync(dto.AssignedToUserIds, created.TaskId);

            return TaskMapper.MapToResponseDto(created);
        }


        private async Task CreateUserTasksAsync(IEnumerable<Guid> userIds, Guid taskId)
        {
            var userTasks = userIds.Select(userId => new UserTask
            {
                UserId = userId,
                TaskId = taskId
            }).ToList();

            await _userTaskRepo.AddRangeAsync(userTasks);
            await _userTaskRepo.SaveChangesAsync();
        }


        public async Task<bool> UpdateTaskAsync(Guid id, TaskUpdateRequestDto dto)
        {
            var task = await _taskRepo.GetByGuidAsync(id);
            if (task == null) return false;

            TaskMapper.MapToExistingEntity(task, dto);

            _taskRepo.Update(task);
            await _taskRepo.SaveChangesAsync();  // Explicit save here
            return true;
        }

        public async Task<bool> DeleteTaskAsync(Guid id)
        {
            var task = await _taskRepo.GetByGuidAsync(id);
            if (task == null) return false;

            task.IsDeleted = true;
            task.UpdatedAt = DateTime.UtcNow;

            _taskRepo.Update(task);
            await _taskRepo.SaveChangesAsync();  // Explicit save here
            return true;
        }
    }
}
