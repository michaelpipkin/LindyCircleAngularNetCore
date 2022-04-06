using LindyCircleWebApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LindyCircleWebApi.Models
{
    public class LindyCircleDbContext : IdentityDbContext<IdentityUser>
    {
        public LindyCircleDbContext(DbContextOptions<LindyCircleDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("dbo");
            modelBuilder.Entity<Member>().ToTable("Members");
            modelBuilder.Entity<Practice>().ToTable("Practices");
            modelBuilder.Entity<Attendance>().ToTable("Attendances");
            modelBuilder.Entity<PunchCard>().ToTable("PunchCards");
            modelBuilder.Entity<PunchCardUsage>().ToTable("PunchCardUsages");
            modelBuilder.Entity<Default>().ToTable("Defaults");
        }
        
        public DbSet<Member> Members { get; set; }
        public DbSet<Practice> Practices { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<PunchCard> PunchCards { get; set; }
        public DbSet<PunchCardUsage> PunchCardUsages { get; set; }
        public DbSet<Default> Defaults { get; set; }
        public DbSet<IdentityUser> IdentityUsers { get; set; }
    }
}
