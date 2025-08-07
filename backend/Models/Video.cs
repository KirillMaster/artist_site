namespace backend.Models;

public class Video
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public byte[]? VideoData { get; set; }
    public string? VideoMimeType { get; set; }
    public int? SortOrder { get; set; }
}