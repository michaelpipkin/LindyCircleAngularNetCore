using LindyCircleWebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LindyCircleWebApi.Controllers
{
    [Route("api/PunchCardUsages")]
    [Authorize]
    [ApiController]
    public class PunchCardUsagesController : ControllerBase
    {
        private readonly LindyCircleDbContext _context;

        public PunchCardUsagesController(LindyCircleDbContext context) {
            _context = context;
        }

        // GET: api/PunchCardUsages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PunchCardUsage>>> GetPunchCardUsages() =>
            await _context.PunchCardUsages.ToListAsync();

        // GET: api/PunchCardUsages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PunchCardUsage>> GetPunchCardUsage(int id) {
            var punchCardUsage = await _context.PunchCardUsages.FindAsync(id);

            if (punchCardUsage == null) {
                return NotFound();
            }

            return punchCardUsage;
        }

        // PUT: api/PunchCardUsages/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPunchCardUsage(int id, PunchCardUsage punchCardUsage) {
            if (id != punchCardUsage.UsageId) {
                return BadRequest();
            }

            _context.Entry(punchCardUsage).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!PunchCardUsageExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }

            return AcceptedAtAction("GetPunchCardUsage", new { id = punchCardUsage.UsageId }, punchCardUsage);
        }

        // POST: api/PunchCardUsages
        [HttpPost]
        public async Task<ActionResult<PunchCardUsage>> PostPunchCardUsage(PunchCardUsage punchCardUsage) {
            _context.PunchCardUsages.Add(punchCardUsage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPunchCardUsage", new { id = punchCardUsage.UsageId }, punchCardUsage);
        }

        // DELETE: api/PunchCardUsages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePunchCardUsage(int id) {
            var punchCardUsage = await _context.PunchCardUsages.FindAsync(id);
            if (punchCardUsage == null) {
                return NotFound();
            }

            _context.PunchCardUsages.Remove(punchCardUsage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PunchCardUsageExists(int id) => _context.PunchCardUsages.Any(e => e.UsageId == id);
    }
}
