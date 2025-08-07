using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VideosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VideosController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VideoDto>>> GetVideos()
    {
        return Ok(await _context.Videos.OrderBy(v => v.SortOrder ?? 0)
            .Select(v => new VideoDto
            {
                Id = v.Id,
                Title = v.Title,
                Description = v.Description,
                SortOrder = v.SortOrder
            }).ToListAsync());
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UploadVideo([FromForm] string title, [FromForm] string description, [FromForm] IFormFile videoFile)
    {
        if (videoFile == null || videoFile.Length == 0)
        {
            return BadRequest("Видеофайл обязателен.");
        }

        using (var memoryStream = new MemoryStream())
        {
            await videoFile.CopyToAsync(memoryStream);
            var video = new Video
            {
                Title = title,
                Description = description,
                VideoData = memoryStream.ToArray(),
                VideoMimeType = videoFile.ContentType,
                SortOrder = await _context.Videos.CountAsync() > 0 ? await _context.Videos.MaxAsync(v => v.SortOrder ?? 0) + 1 : 0
            };

            _context.Videos.Add(video);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVideos), new { id = video.Id }, video);
        }
    }

    [HttpGet("{id}/data")]
    public async Task<IActionResult> GetVideoData(int id)
    {
        var video = await _context.Videos.FindAsync(id);
        if (video == null || video.VideoData == null)
        {
            return NotFound();
        }
        return File(video.VideoData, video.VideoMimeType);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteVideo(int id)
    {
        var video = await _context.Videos.FindAsync(id);
        if (video == null)
        {
            return NotFound();
        }

        _context.Videos.Remove(video);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("reorder")]
    [Authorize]
    public async Task<IActionResult> ReorderVideos([FromBody] List<int> videoIds)
    {
        var videos = await _context.Videos.ToListAsync();
        for (int i = 0; i < videoIds.Count; i++)
        {
            var video = videos.FirstOrDefault(v => v.Id == videoIds[i]);
            if (video != null)
            {
                video.SortOrder = i;
            }
        }
        await _context.SaveChangesAsync();
        return NoContent();
    }
}