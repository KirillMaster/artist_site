namespace backend.Models;

public class AboutInfoDto
{
    public int Id { get; set; }
    public string Biography { get; set; }
    public string PhotoMimeType { get; set; }
    public string LandingPagePhotoMimeType { get; set; }
    public string WelcomeTitle { get; set; }
    public string WelcomeSubtitle { get; set; }
}