using LindyCircleWebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LindyCircleWebApi.Controllers
{
    [Route("api/Members")]
    [Authorize]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly LindyCircleDbContext _context;

        public MembersController(LindyCircleDbContext context) {
            _context = context;
        }

        // GET: api/Members
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> GetMembers() {
            return await _context.Members
                .OrderBy(o => o.LastName)
                .ThenBy(t => t.FirstName)
                .ToListAsync();
        }

        // GET: api/Members/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(int id) {
            var member = await _context.Members.FindAsync(id);

            if (member == null) {
                return NotFound();
            }

            return member;
        }

        // PUT: api/Members/5
        [HttpPut("{id}"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<Member>> PutMember(int id, Member member) {
            if (id != member.MemberId) {
                return BadRequest();
            }

            _context.Entry(member).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!MemberExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }

            return AcceptedAtAction(nameof(GetMember), new { id = member.MemberId }, member);
        }

        // POST: api/Members
        [HttpPost, Authorize(Roles = "Admin")]
        public async Task<ActionResult<Member>> PostMember(Member member) {
            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMember), new { id = member.MemberId }, member);
        }

        // DELETE: api/Members/5
        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMember(int id) {
            var member = await _context.Members.FindAsync(id);
            if (member == null) {
                return NotFound();
            }

            if (member.TotalAttendance > 0)
                return Problem("This member has attended at least one practice and cannot be deleted. Mark them inactive instead.");

            if (member.TotalPaid > 0)
                return Problem("This member has a payment history and cannot be deleted. Mark them inactive instead.");

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MemberExists(int id) {
            return _context.Members.Any(e => e.MemberId == id);
        }

        // GET: api/Members/5/Attendances
        [HttpGet("{id}/Attendances")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendancesByMember(int id) {
            return await _context.Attendances.Where(w => w.MemberId == id).ToListAsync();
        }

        // GET: api/Members/5/PunchCardsHeld
        [HttpGet("{id}/PunchCardsHeld")]
        public async Task<ActionResult<IEnumerable<PunchCard>>> GetPunchCardsHeldByMember(int id) {
            return await _context.PunchCards.Where(w => w.CurrentMemberId == id).ToListAsync();
        }

        // GET: api/Members/5/PunchCardsPurchased
        [HttpGet("{id}/PunchCardsPurchased")]
        public async Task<ActionResult<IEnumerable<PunchCard>>> GetPunchCardsPurchasedByMember(int id) {
            return await _context.PunchCards.Where(w => w.PurchaseMemberId == id).ToListAsync();
        }
    }
}
