using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.IO; // For MemoryStream

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AboutController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AboutController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<AboutInfoDto>> GetAboutInfo()
    {
        var aboutInfo = await _context.AboutInfos.FirstOrDefaultAsync();
        if (aboutInfo == null)
        {
            // If no AboutInfo exists, create a new one with default values and save it
            aboutInfo = new AboutInfo
            {
                Id = 1, // Assign a fixed ID for the singleton
                Biography = "[Шаблонная биография художника]\n\nАнжела Моисеенко - выдающийся мастер импрессионизма, чьи работы наполнены светом, цветом и эмоциями. Родившись в [Год] году в [Город], Анжела с ранних лет проявляла необычайный талант к рисованию, черпая вдохновение в окружающем мире.\n\nЕе творческий путь начался с изучения классической живописи, но вскоре Анжела нашла свой уникальный голос в импрессионизме. Она стремилась запечатлеть не столько точное изображение объектов, сколько мимолетные впечатления от света и атмосферы. Ее натюрморты — это не просто изображения предметов, а живые сцены, где каждый мазок кисти передает игру света на поверхности фруктов, блеск стекла или нежность лепестков.\n\nРаботы Анжелы отличаются особой палитрой, в которой преобладают чистые, яркие цвета, наложенные смелыми, свободными мазками. Она мастерски использует контрасты света и тени, создавая ощущение глубины и объема. Каждая картина — это приглашение зрителю погрузиться в мир художника, почувствовать тепло солнечного дня или прохладу утреннего воздуха.\n\nНа протяжении своей карьеры Анжела участвовала во множестве выставок, ее работы находятся в частных коллекциях и музеях по всему миру. Она продолжает творить, постоянно экспериментируя с формой и цветом, ища новые способы выразить свое видение мира. Ее вклад в искусство импрессионизма неоценим, а ее картины продолжают вдохновлять и радовать ценителей прекрасного.\n\nАнжела верит, что искусство должно быть доступно каждому, и стремится донести красоту окружающего мира до сердец людей через свои произведения. Ее натюрморты — это гимн жизни, красоте и мимолетности момента, запечатленный на холсте с неподдельной страстью и мастерством.",
                PhotoData = new byte[0], // Provide an empty byte array
                PhotoMimeType = "",
                LandingPagePhotoData = new byte[0], // Provide an empty byte array
                LandingPagePhotoMimeType = "",
                WelcomeTitle = "Добро пожаловать в искусство Анжелы Моисеенко", // Default title
                WelcomeSubtitle = "Откройте для себя мир ярких красок и увлекательного импрессионизма натюрморта." // Default subtitle
            };
            _context.AboutInfos.Add(aboutInfo);
            await _context.SaveChangesAsync();
        }
        return Ok(new AboutInfoDto
        {
            Id = aboutInfo.Id,
            Biography = aboutInfo.Biography,
            PhotoMimeType = aboutInfo.PhotoMimeType,
            LandingPagePhotoMimeType = aboutInfo.LandingPagePhotoMimeType,
            WelcomeTitle = aboutInfo.WelcomeTitle,
            WelcomeSubtitle = aboutInfo.WelcomeSubtitle
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UpdateAboutInfo([FromForm] string biography, [FromForm] IFormFile? photo, [FromForm] IFormFile? landingPagePhoto, [FromForm] string welcomeTitle, [FromForm] string welcomeSubtitle)
    {
        var aboutInfo = await _context.AboutInfos.FirstOrDefaultAsync();
        if (aboutInfo == null)
        {
            aboutInfo = new AboutInfo { Id = 1 }; // Assign a fixed ID for the singleton
            _context.AboutInfos.Add(aboutInfo);
        }

        aboutInfo.Biography = biography;
        aboutInfo.WelcomeTitle = welcomeTitle;
        aboutInfo.WelcomeSubtitle = welcomeSubtitle;

        if (photo != null && photo.Length > 0)
        {
            using (var memoryStream = new MemoryStream())
            {
                await photo.CopyToAsync(memoryStream);
                aboutInfo.PhotoData = memoryStream.ToArray();
                aboutInfo.PhotoMimeType = photo.ContentType;
            }
        }

        if (landingPagePhoto != null && landingPagePhoto.Length > 0)
        {
            using (var memoryStream = new MemoryStream())
            {
                await landingPagePhoto.CopyToAsync(memoryStream);
                aboutInfo.LandingPagePhotoData = memoryStream.ToArray();
                aboutInfo.LandingPagePhotoMimeType = landingPagePhoto.ContentType;
            }
        }

        await _context.SaveChangesAsync();

        return Ok(aboutInfo);
    }

    [HttpGet("photo")]
    public async Task<IActionResult> GetArtistPhoto()
    {
        var aboutInfo = await _context.AboutInfos.FirstOrDefaultAsync();
        if (aboutInfo == null || aboutInfo.PhotoData == null || aboutInfo.PhotoData.Length == 0)
        {
            // Serve a default placeholder image if no photo is found or data is empty
            var defaultPhotoPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "placeholder_artist.jpg");
            if (System.IO.File.Exists(defaultPhotoPath))
            {
                var defaultPhotoData = await System.IO.File.ReadAllBytesAsync(defaultPhotoPath);
                return File(defaultPhotoData, "image/jpeg"); // Assuming it's a JPEG
            }
            return NotFound();
        }
        return File(aboutInfo.PhotoData, aboutInfo.PhotoMimeType);
    }

    [HttpGet("landingphoto")]
    public async Task<IActionResult> GetLandingPagePhoto()
    {
        var aboutInfo = await _context.AboutInfos.FirstOrDefaultAsync();
        if (aboutInfo == null || aboutInfo.LandingPagePhotoData == null || aboutInfo.LandingPagePhotoData.Length == 0)
        {
            return NotFound(); // Or serve a default landing page image
        }
        return File(aboutInfo.LandingPagePhotoData, aboutInfo.LandingPagePhotoMimeType);
    }
}