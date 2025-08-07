namespace backend.Models;

public class PaintingDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int Year { get; set; }
    public string Theme { get; set; }
    public int? SortOrder { get; set; }
    public byte[] ImageData { get; set; }
    public string ImageMimeType { get; set; }
}