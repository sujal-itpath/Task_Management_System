using Microsoft.AspNetCore.Mvc;
using TMS.BLL.Services.Interface;
using TMS.Common.DtoModel.TaskDtos.Request;
using TMS.Common.DtoModel.TaskDtos.Response;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }
            
        // GET: api/Task
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskListResponseDto>>> GetAllTasks()
        {
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks);
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<UserTaskListResponseDto>>> GetTaskByUserId([FromQuery] Guid userId)
        {
            var tasks = await _taskService.GetTasksByUserIdAsync(userId);
            return Ok(tasks);
        }



        // GET: api/Task/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TaskResponseDto>> GetTaskById(Guid id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null)
                return NotFound();

            return Ok(task);
        }

        // POST: api/Task
        [HttpPost]
        public async Task<ActionResult<TaskResponseDto>> CreateTask(
    [FromBody] TaskCreateRequestDto dto) 
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            var createdTask = await _taskService.CreateTaskAsync(dto);

            return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.TaskId }, createdTask);
        }


        // PUT: api/Task/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateTask(Guid id, [FromBody] TaskUpdateRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _taskService.UpdateTaskAsync(id, dto);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/Task/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var deleted = await _taskService.DeleteTaskAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
