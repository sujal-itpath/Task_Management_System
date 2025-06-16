using TMS.Common.DtoModel.TaskDtos.Request;
using TMS.Common.DtoModel.TaskDtos.Response;
using TMS.Common.Enums;
using TMS.DAL.EntityModel.TaskEntity;

namespace TMS.BLL.Mapper
{
    public static class TaskMapper
    {
        // Create DTO -> Entity
        public static TaskEntity MapToEntity(TaskCreateRequestDto dto)
        {
            return new TaskEntity
            {
                TaskId = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                DueDate = dto.DueDate,
                Status = WorkTaskStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UserTasks = dto.AssignedToUserIds != null
                    ? dto.AssignedToUserIds.Select(userId => new UserTask
                    {
                        UserId = userId
                    }).ToList()
                    : new List<UserTask>()
            };
        }

        // Update DTO -> Existing Entity
        public static void MapToExistingEntity(TaskEntity entity, TaskUpdateRequestDto dto)
        {
            entity.Title = dto.Title;
            entity.Description = dto.Description;
            entity.DueDate = dto.DueDate;
            entity.Status = (WorkTaskStatus)dto.Status;
            entity.UpdatedAt = DateTime.UtcNow;

            if (dto.AssignedToUserIds != null)
            {
                entity.UserTasks = dto.AssignedToUserIds.Select(userId => new UserTask
                {
                    UserId = userId,
                    TaskId = entity.TaskId
                }).ToList();
            }
        }

        // Entity -> Detailed Response DTO
        public static TaskResponseDto MapToResponseDto(TaskEntity entity)
        {
            return new TaskResponseDto
            {
                TaskId = entity.TaskId,
                Title = entity.Title,
                Description = entity.Description,
                Status = (TaskStatus)entity.Status,
                DueDate = entity.DueDate,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        // Entity -> Lightweight List DTO
        public static TaskListResponseDto MapToListDto(TaskEntity entity)
        {
            return new TaskListResponseDto
            {
                TaskId = entity.TaskId,
                Title = entity.Title,
                Status = (TaskStatus)entity.Status,
                DueDate = entity.DueDate,
                CreatedAt = entity.CreatedAt
            };
        }

        // Entity -> User Task DTO for listing tasks assigned to a specific user
        public static UserTaskListResponseDto MapToUserTaskDto(TaskEntity task)
        {
            return new UserTaskListResponseDto
            {
                TaskId = task.TaskId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt
            };
        }
    }
}
