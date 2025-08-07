using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Painting> Paintings { get; set; }
        public DbSet<AboutInfo> AboutInfos { get; set; }
        public DbSet<GroupOrderInfo> GroupOrderInfos { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<ContactInfo> ContactInfos { get; set; }
        public DbSet<Testimonial> Testimonials { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GroupOrderInfo>().HasKey(g => g.Id);
        }
    }
}