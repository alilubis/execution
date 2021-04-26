using System;
using Microsoft.EntityFrameworkCore;


namespace SmartAdmin.WebUI.Models
{
    public class ExecutionContext : DbContext
    {
        public ExecutionContext(DbContextOptions<ExecutionContext> options)
            : base(options)
        {
        }
        public DbSet<Users> Users { get; set; }
        public DbSet<Project> Project { get; set; }
        public DbSet<MaintenanceAreas> MaintenanceAreas { get; set; }
        public DbSet<SubInitiations> SubInitiations { get; set; }
        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<Disciplines> Disciplines { get; set; }
        public DbSet<ProjectTermin> Termin { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>().ToTable("users", "monitoring");
            modelBuilder.Entity<Project>().ToTable("projects", "monitoring");
            modelBuilder.Entity<MaintenanceAreas>().ToTable("maintenance_areas", "monitoring");
            modelBuilder.Entity<SubInitiations>().ToTable("sub_initiations", "monitoring");
            modelBuilder.Entity<Disciplines>().ToTable("disciplines", "monitoring");
            modelBuilder.Entity<ProjectTermin>().ToTable("project_termin", "monitoring");
            // modelBuilder.Entity<Uraian>().ToTable("Tasks");
        }
    }
}
