namespace backend.Models;

public class GroupOrderInfo
{
    public int Id { get; set; }
    public string OrderedGroupKeys { get; set; } = "[]"; // Store as JSON string
}