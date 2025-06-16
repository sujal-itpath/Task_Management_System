using Microsoft.AspNetCore.Identity;
using TSM.DAL.EntityModel.AuthEntity;
using TSM.DAL.Repository.Interface;

namespace TSM.DAL.DbSeeder
{
    public class DbSeeder
    {
        private readonly IGenericRepository<Role> _roleRepo;
        private readonly IGenericRepository<User> _userRepo;

        public DbSeeder(IGenericRepository<Role> roleRepo, IGenericRepository<User> userRepo)
        {
            _roleRepo = roleRepo;
            _userRepo = userRepo;
        }

        public async Task SeedRolesAndAdminAsync()
        {
            // Step 1: Seed roles
            var predefinedRoles = new List<Role>
            {
                new Role { Id = Guid.NewGuid(), Name = "Admin", Description = "System Administrator" },
                new Role { Id = Guid.NewGuid(), Name = "User", Description = "General User" }
            };

            foreach (var role in predefinedRoles)
            {
                if (!await _roleRepo.ExistsAsync(r => r.Name == role.Name))
                    await _roleRepo.AddAsync(role);
            }

            await _roleRepo.SaveChangesAsync();

            // Step 2: Seed static Admin user
            const string adminEmail = "admin@system.com";
            const string adminPassword = "Admin@123";

            if (!await _userRepo.ExistsAsync(u => u.Email == adminEmail))
            {
                var adminRole = (await _roleRepo.FindAsync(r => r.Name == "Admin")).FirstOrDefault();
                if (adminRole == null)
                    throw new Exception("Admin role not found during seeding.");

                var passwordHasher = new PasswordHasher<User>();

                var adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    Email = adminEmail,
                    RoleId = adminRole.Id,
                    IsActive = true
                };

                adminUser.Password = passwordHasher.HashPassword(adminUser, adminPassword);

                await _userRepo.AddAsync(adminUser);
                await _userRepo.SaveChangesAsync();
            }
        }
    }
}
