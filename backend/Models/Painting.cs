namespace backend.Models;

public class Painting
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public byte[]? ImageData { get; set; }
    public string? ImageMimeType { get; set; }
    public int Year { get; set; } // Год написания работы
    public string Theme { get; set; } // Тематика или цикл работ
    public int? SortOrder { get; set; } // Порядок сортировки
}