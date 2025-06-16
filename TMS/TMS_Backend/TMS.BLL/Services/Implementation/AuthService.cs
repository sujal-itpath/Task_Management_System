using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TMS.BLL.Services.Interface;
using TMS.Common.DtoModel.AuthDto.RequestDto;
using TMS.Common.DtoModel.AuthDto.ResponseDto;
using TSM.BLL.Mapper;
using TSM.BLL.Service.Interface;
using TSM.DAL.EntityModel.AuthEntity;
using TSM.DAL.Repository.Interface;

namespace TSM.BLL.Service.Implementation
{
    public class AuthService : IAuthService
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<UserProfile> _profileRepo;
        private readonly IGenericRepository<Role> _roleRepo;
        private readonly IJwtTokenGenerate _jwtTokenGenerate;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthService(
            IGenericRepository<User> userRepo,
            IGenericRepository<UserProfile> profileRepo,
            IGenericRepository<Role> roleRepo,
            IJwtTokenGenerate jwtTokenGenerate,
            PasswordHasher<User> passwordHasher)
        {
            _userRepo = userRepo;
            _profileRepo = profileRepo;
            _roleRepo = roleRepo;
            _jwtTokenGenerate = jwtTokenGenerate;
            _passwordHasher = passwordHasher;
        }

        public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto dto, IFormFile? profileImage)
        {
            var normalizedEmail = AuthMapper.NormalizeEmail(dto.Email);
            if (await _userRepo.ExistsAsync(u => u.Email == normalizedEmail))
                throw new Exception("Email already registered.");

            var userRole = (await _roleRepo.FindAsync(r => r.Name == "User")).FirstOrDefault();
            if (userRole == null)
                throw new Exception("Default role 'User' not found.");

            var userEntity = AuthMapper.ToUserEntity(dto, userRole.Id);
            userEntity.Password = _passwordHasher.HashPassword(userEntity, dto.Password);

            var createdUser = await _userRepo.AddAsync(userEntity);

            string? savedImagePath = null;
            if (profileImage != null && profileImage.Length > 0)
            {
                savedImagePath = await SaveProfileImageAsync(profileImage, createdUser.Id);
            }

            var profileEntity = AuthMapper.ToUserProfileEntity(new UserProfileRequestDto
            {
                UserId = createdUser.Id,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                ProfileImageUrl = savedImagePath
            });

            await _profileRepo.AddAsync(profileEntity);
            await _userRepo.SaveChangesAsync();

            return new RegisterResponseDto
            {
                Id = createdUser.Id,
                Email = createdUser.Email,
                FullName = $"{profileEntity.FirstName} {profileEntity.LastName}".Trim(),
                Role = userRole.Name,
                RoleId = userRole.Id
            };
        }

        public async Task<string> SaveProfileImageAsync(IFormFile file, Guid userId)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles", userId.ToString());
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"/uploads/profiles/{userId}/{uniqueFileName}";
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var normalizedEmail = AuthMapper.NormalizeEmail(dto.Email);
            var user = await _userRepo.GetWithIncludeAsync(
                u => u.Email == normalizedEmail && u.IsActive,
                u => u.Profile, u => u.Role);

            if (user == null)
                throw new Exception("Invalid credentials");

            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password);
            if (result != PasswordVerificationResult.Success)
                throw new Exception("Invalid credentials");

            var token = _jwtTokenGenerate.GenerateToken(user.Id, user.Email, user.Role?.Name ?? "", user.RoleId);

            return new LoginResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.Profile != null ? $"{user.Profile.FirstName} {user.Profile.LastName}".Trim() : string.Empty,
                Role = user.Role?.Name ?? string.Empty,
                RoleId = user.RoleId,
                Token = token
            };
        }

        public async Task<bool> ForgotPasswordAsync(ForgotPasswordRequestDto dto)
        {
            var normalizedEmail = AuthMapper.NormalizeEmail(dto.Email);
            var user = await _userRepo.GetWithIncludeAsync(u => u.Email == normalizedEmail, u => u.Profile);
            return user != null;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordRequestDto dto)
        {
            var normalizedEmail = AuthMapper.NormalizeEmail(dto.Email);
            var user = await _userRepo.GetAsync(u => u.Email == normalizedEmail);
            if (user == null)
                return false;

            AuthMapper.UpdatePassword(user, _passwordHasher.HashPassword(user, dto.NewPassword));
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<UserListResponseDto>> GetAllUsersAsync()
        {
            var users = _userRepo.GetAllQueryable()
                .Include(u => u.Profile)
                .Include(u => u.Role);

            var userList = await users
                .Select(u => new UserListResponseDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = (u.Profile != null ? $"{u.Profile.FirstName} {u.Profile.LastName}" : "").Trim(),
                    Role = u.Role != null ? u.Role.Name : "",
                    RoleId = u.RoleId
                })
                .ToListAsync();

            return userList;
        }

        public async Task<bool> UpdateUserRoleAsync(UpdateUserRoleRequestDto dto)
        {
            var user = await _userRepo.GetAsync(u => u.Id == dto.UserId);
            if (user == null)
                throw new Exception("User not found.");

            var role = await _roleRepo.GetAsync(r => r.Name == dto.role);
            if (role == null)
                throw new Exception("Role not found.");

            user.RoleId = role.Id;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();

            return true;
        }
    }
}
