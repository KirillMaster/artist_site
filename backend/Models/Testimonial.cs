using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Testimonial
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Author { get; set; }

    [Required]
    public string Text { get; set; }

    public int? Rating { get; set; } // Optional rating from 1 to 5

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}