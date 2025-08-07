using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaintingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PaintingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PaintingDto>>> GetPaintings()
    {
        return Ok(await _context.Paintings.OrderBy(p => p.SortOrder ?? 0)
            .Select(p => new PaintingDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Year = p.Year,
                Theme = p.Theme,
                SortOrder = p.SortOrder,
                ImageData = p.ImageData,
                ImageMimeType = p.ImageMimeType
            }).ToListAsync());
    }

    [HttpPost]
    
    public async Task<IActionResult> UploadPainting([FromForm] string title, [FromForm] string description, [FromForm] int? year, [FromForm] string? theme, [FromForm] IFormFile image)
    {
        if (image == null || image.Length == 0)
        {
            return BadRequest("Image is required.");
        }

        if (!year.HasValue)
        {
            return BadRequest("Year is required.");
        }

        using (var memoryStream = new MemoryStream())
        {
            await image.CopyToAsync(memoryStream);
            var painting = new Painting
            {
                Title = title,
                Description = description,
                Year = year.Value,
                Theme = theme ?? "Без категории",
                ImageData = memoryStream.ToArray(),
                ImageMimeType = image.ContentType,
                SortOrder = await _context.Paintings.CountAsync() > 0 ? await _context.Paintings.MaxAsync(p => p.SortOrder ?? 0) + 1 : 0 // Assign a new sort order
            };

            _context.Paintings.Add(painting);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPaintings), new { id = painting.Id }, painting);
        }
    }

    [HttpPost("reorder")]
    [Authorize]
    public async Task<IActionResult> ReorderPaintings([FromBody] List<int> paintingIds)
    {
        var paintings = await _context.Paintings.ToListAsync();
        for (int i = 0; i < paintingIds.Count; i++)
        {
            var painting = paintings.FirstOrDefault(p => p.Id == paintingIds[i]);
            if (painting != null)
            {
                painting.SortOrder = i;
            }
        }
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}/image")]
    public async Task<IActionResult> GetPaintingImage(int id)
    {
        var painting = await _context.Paintings.FindAsync(id);
        if (painting == null || painting.ImageData == null)
        {
            return NotFound();
        }
        return File(painting.ImageData, painting.ImageMimeType);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeletePainting(int id)
    {
        var painting = await _context.Paintings.FindAsync(id);
        if (painting == null)
        {
            return NotFound();
        }

        _context.Paintings.Remove(painting);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
