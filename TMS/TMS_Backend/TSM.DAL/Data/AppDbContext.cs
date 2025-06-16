using Microsoft.EntityFrameworkCore;
using TSM.DAL.EntityModel.AuthEntity;
using TMS.DAL.EntityModel.TaskEntity;

namespace TSM.DAL.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserLog> UserLogs { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<TMS.DAL.EntityModel.TaskEntity.TaskEntity> Tasks { get; set; }
        public DbSet<UserTask> UserTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ----- User -----
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.Email).IsUnique();

                entity.Property(e => e.Email)
                      .IsRequired()
                      .HasMaxLength(255);

                entity.Property(e => e.Password)
                      .IsRequired();

                entity.HasOne(e => e.Role)
                      .WithMany(r => r.Users)
                      .HasForeignKey(e => e.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Profile)
                      .WithOne(p => p.User)
                      .HasForeignKey<UserProfile>(p => p.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.Logs)
                      .WithOne(log => log.User)
                      .HasForeignKey(log => log.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ----- Role -----
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(r => r.Name)
                      .IsRequired()
                      .HasMaxLength(100);
            });

            // ----- UserLog -----
            modelBuilder.Entity<UserLog>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // ----- UserProfile -----
            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // ----- TaskEntity -----
            modelBuilder.Entity<TMS.DAL.EntityModel.TaskEntity.TaskEntity>(entity =>
            {
                entity.ToTable("Tasks");

                entity.HasKey(t => t.TaskId);

                entity.Property(t => t.Title)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(t => t.Description)
                      .HasMaxLength(1000);

                entity.Property(t => t.Status)
                      .IsRequired();

                entity.Property(t => t.CreatedAt)
                      .IsRequired();
            });

            // ----- UserTaskEntity (Join Table) -----
            modelBuilder.Entity<UserTask>(entity =>
            {
                entity.HasKey(ut => new { ut.UserId, ut.TaskId });

                entity.HasOne(ut => ut.User)
                      .WithMany(u => u.UserTasks)
                      .HasForeignKey(ut => ut.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ut => ut.Task)
                      .WithMany(t => t.UserTasks)
                      .HasForeignKey(ut => ut.TaskId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
