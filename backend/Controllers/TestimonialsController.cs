using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TestimonialsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TestimonialDto>>> GetTestimonials()
    {
        return Ok(await _context.Testimonials
            .Select(t => new TestimonialDto
            {
                Id = t.Id,
                Author = t.Author,
                Text = t.Text,
                Rating = t.Rating,
                CreatedAt = t.CreatedAt
            }).ToListAsync());
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Testimonial>> PostTestimonial(Testimonial testimonial)
    {
        _context.Testimonials.Add(testimonial);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTestimonials), new { id = testimonial.Id }, testimonial);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteTestimonial(int id)
    {
        var testimonial = await _context.Testimonials.FindAsync(id);
        if (testimonial == null)
        {
            return NotFound();
        }

        _context.Testimonials.Remove(testimonial);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}