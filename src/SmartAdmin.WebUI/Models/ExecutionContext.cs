using System;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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
        public DbSet<TerminDocument> TerminDocument { get; set; }
        public DbSet<ProductionAreas> ProductionAreas { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>().ToTable("users", "monitoring");
            modelBuilder.Entity<Project>().ToTable("projects", "monitoring");
            modelBuilder.Entity<MaintenanceAreas>().ToTable("maintenance_areas", "monitoring");
            modelBuilder.Entity<SubInitiations>().ToTable("sub_initiations", "monitoring");
            modelBuilder.Entity<Disciplines>().ToTable("disciplines", "monitoring");
            modelBuilder.Entity<ProjectTermin>().ToTable("project_termin", "monitoring");
            modelBuilder.Entity<TerminDocument>().ToTable("termin_document", "monitoring");
            modelBuilder.Entity<ProductionAreas>().ToTable("production_areas", "monitoring");

            modelBuilder.Entity<Users>().HasKey(u => u.id);
            modelBuilder.Entity<MaintenanceAreas>().HasKey(m => m.id);
            // modelBuilder.Entity<ProductionAreas>().HasKey(p => p.id);

            // modelBuilder.Entity<Users>().;
            modelBuilder.Entity<Users>().HasOne(p => p.MaintenanceAreas).WithMany(m => m.USR);
        }
    }
}
