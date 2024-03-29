﻿using LindyCircleWebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LindyCircleWebApi.Controllers
{
    [Route("api/Attendances")]
    [Authorize]
    [ApiController]
    public class AttendancesController : ControllerBase
    {
        private readonly LindyCircleDbContext _context;

        public AttendancesController(LindyCircleDbContext context) {
            _context = context;
        }

        // GET: api/Attendances
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendances() =>
            await _context.Attendances.ToListAsync();

        // GET: api/Attendances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetAttendance(int id) {
            var attendance = await _context.Attendances.FindAsync(id);

            if (attendance == null) {
                return NotFound();
            }

            return attendance;
        }

        // GET: api/Attendaces/Member/5
        [HttpGet("Member/{id}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendancesByMember(int id) =>
            (await _context.Attendances.Where(w => w.MemberId == id).ToListAsync())
                .OrderBy(o => o.PracticeDate).ToList();

        // GET: api/Attendaces/Practice/5
        [HttpGet("Practice/{id}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendancesByPractice(int id) =>
            (await _context.Attendances.Where(w => w.PracticeId == id).ToListAsync())
            .OrderBy(o => o.MemberName).ToList();

        // PUT: api/Attendances/5
        [HttpPut("{id}"), Authorize(Roles = "Admin")]
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
        [HttpPost, Authorize(Roles = "Admin")]
        public async Task<ActionResult<Attendance>> PostAttendance(Attendance attendance) {
            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttendance", new { id = attendance.AttendanceId }, attendance);
        }

        // DELETE: api/Attendances/5
        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAttendance(int id) {
            var attendance = await _context.Attendances.FindAsync(id);
            if (attendance == null) {
                return NotFound();
            }

            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttendanceExists(int id) => _context.Attendances.Any(e => e.AttendanceId == id);
    }
}
