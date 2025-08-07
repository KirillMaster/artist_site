namespace backend.Models;

public class VideoDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int? SortOrder { get; set; }
}