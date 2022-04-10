using LindyCircleWebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LindyCircleWebApi.Controllers
{
    [Route("api/Practices")]
    [ApiController]
    public class PracticesController : ControllerBase {
        private readonly LindyCircleDbContext _context;

        public PracticesController(LindyCircleDbContext context) {
            _context = context;
        }

        // GET: api/Practices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Practice>>> GetPractices() =>
            (await _context.Practices.ToListAsync()).OrderBy(o => o.PracticeNumber).ToList();

        // GET: api/Practices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Practice>> GetPractice(int id) {
            var practice = await _context.Practices.FindAsync(id);

            if (practice == null) {
                return NotFound();
            }

            return practice;
        }

        // GET: api/Practices/Number/5
        [HttpGet("Number/{practiceNumber}")]
        public async Task<ActionResult<Practice>> GetPracticeByNumber(int practiceNumber) {
            var practice = await _context.Practices.SingleOrDefaultAsync(s => s.PracticeNumber == practiceNumber);

            if (practice == null) {
                return NotFound();
            }

            return practice;
        }

        // GET: api/Practices/5/Attendance
        [HttpGet("{id}/Attendance")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendanceByPractice(int id) =>
            (await _context.Attendances.Where(w => w.PracticeId == id).ToListAsync())
            .OrderBy(o => o.MemberName).ToList();

        // GET: api/Practices/Next
        [HttpGet("Next")]
        public int GetNextPracticeNumber() {
            if (!_context.Practices.Any()) return 1;
            else return _context.Practices.Max(m => m.PracticeNumber) + 1;
        }

        // PUT: api/Practices/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Practice>> PutPractice(int id, Practice practice) {
            if (id != practice.PracticeId) {
                return BadRequest();
            }

            _context.Entry(practice).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!PracticeExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }

            return AcceptedAtAction("GetPractice", new { id = practice.PracticeId }, practice);
        }

        // POST: api/Practices
        [HttpPost]
        public async Task<ActionResult<Practice>> PostPractice(Practice practice) {
            _context.Practices.Add(practice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPractice", new { id = practice.PracticeId }, practice);
        }

        // DELETE: api/Practices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePractice(int id) {
            var practice = await _context.Practices.FindAsync(id);
            if (practice == null) {
                return NotFound();
            }

            if (practice.AttendeeCount > 0)
                return Problem("This practice has attendees and cannot be deleted.");

            _context.Practices.Remove(practice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PracticeExists(int id) => _context.Practices.Any(e => e.PracticeId == id);
    }
}
