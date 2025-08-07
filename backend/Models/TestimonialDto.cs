namespace backend.Models;

public class TestimonialDto
{
    public int Id { get; set; }
    public string Author { get; set; }
    public string Text { get; set; }
    public int? Rating { get; set; }
    public DateTime CreatedAt { get; set; }
}