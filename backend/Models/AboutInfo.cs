namespace backend.Models;

public class AboutInfo
{
    public int Id { get; set; } // Primary Key
    public string Biography { get; set; }
    public byte[]? PhotoData { get; set; }
    public string? PhotoMimeType { get; set; }
    public byte[]? LandingPagePhotoData { get; set; }
    public string? LandingPagePhotoMimeType { get; set; }
    public string WelcomeTitle { get; set; }
    public string WelcomeSubtitle { get; set; }
}