using LindyCircleWebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LindyCircleWebApi.Controllers
{
    [Route("api/Attendances")]
    [ApiController]
    public class AttendancesController : ControllerBase
    {
        private readonly LindyCircleDbContext _context;

        public AttendancesController(LindyCircleDbContext context) {
            _context = context;
        }

        // GET: api/Attendances
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendances() {
            return await _context.Attendances.ToListAsync();
        }

        // GET: api/Attendances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetAttendance(int id) {
            var attendance = await _context.Attendances.FindAsync(id);

            if (attendance == null) {
                return NotFound();
            }

            return attendance;
        }

        // PUT: api/Attendances/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttendance(int id, Attendance attendance) {
            if (id != attendance.AttendanceId) {
                return BadRequest();
            }

            _context.Entry(attendance).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!AttendanceExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }

            return AcceptedAtAction("GetAttendance", new { id = attendance.AttendanceId }, attendance);
        }

        // POST: api/Attendances
        [HttpPost]
        public async Task<ActionResult<Attendance>> PostAttendance(Attendance attendance) {
            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttendance", new { id = attendance.AttendanceId }, attendance);
        }

        // DELETE: api/Attendances/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendance(int id) {
            var attendance = await _context.Attendances.FindAsync(id);
            if (attendance == null) {
                return NotFound();
            }

            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttendanceExists(int id) {
            return _context.Attendances.Any(e => e.AttendanceId == id);
        }
    }
}
