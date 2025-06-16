namespace TMS.BLL.Services.Interface
{
    public interface IJwtTokenGenerate
    {
        string GenerateToken(Guid userId, string email, string role, Guid roleId);
    }
}
