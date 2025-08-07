using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ContactController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ContactInfo>> GetContactInfo()
    {
        var contactInfo = await _context.ContactInfos.FirstOrDefaultAsync();
        if (contactInfo == null)
        {
            contactInfo = new ContactInfo
            {
                Id = 1,
                Instagram = "https://www.instagram.com/your_instagram",
                VK = "https://vk.com/your_vk",
                YouTube = "https://www.youtube.com/your_youtube",
                Telegram = "https://t.me/your_telegram"
            };
            _context.ContactInfos.Add(contactInfo);
            await _context.SaveChangesAsync();
        }
        return Ok(contactInfo);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ContactInfo>> UpdateContactInfo([FromBody] ContactInfo newContactInfo)
    {
        var contactInfo = await _context.ContactInfos.FirstOrDefaultAsync();
        if (contactInfo == null)
        {
            contactInfo = new ContactInfo { Id = 1 };
            _context.ContactInfos.Add(contactInfo);
        }

        contactInfo.Instagram = newContactInfo.Instagram;
        contactInfo.VK = newContactInfo.VK;
        contactInfo.YouTube = newContactInfo.YouTube;
        contactInfo.Telegram = newContactInfo.Telegram;

        await _context.SaveChangesAsync();
        return Ok(contactInfo);
    }
}
