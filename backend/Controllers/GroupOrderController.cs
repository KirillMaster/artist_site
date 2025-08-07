using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupOrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GroupOrderController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<GroupOrderInfo>> GetGroupOrder()
    {
        var groupOrder = await _context.GroupOrderInfos.FirstOrDefaultAsync();
        if (groupOrder == null)
        {
            groupOrder = new GroupOrderInfo { Id = 1, OrderedGroupKeys = "[]" };
            _context.GroupOrderInfos.Add(groupOrder);
            await _context.SaveChangesAsync();
        }
        return Ok(groupOrder);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UpdateGroupOrder([FromBody] List<string> orderedGroupKeys)
    {
        var groupOrder = await _context.GroupOrderInfos.FirstOrDefaultAsync();
        if (groupOrder == null)
        {
            groupOrder = new GroupOrderInfo { Id = 1 };
            _context.GroupOrderInfos.Add(groupOrder);
        }

        groupOrder.OrderedGroupKeys = JsonSerializer.Serialize(orderedGroupKeys);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}