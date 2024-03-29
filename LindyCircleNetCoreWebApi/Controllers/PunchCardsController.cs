﻿using LindyCircleWebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LindyCircleWebApi.Controllers
{
    [Route("api/PunchCards")]
    //[Authorize]
    [ApiController]
    public class PunchCardsController : ControllerBase
    {
        private readonly LindyCircleDbContext _context;

        public PunchCardsController(LindyCircleDbContext context) {
            _context = context;
        }

        // GET: api/PunchCards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PunchCard>>> GetPunchCards() =>
            await _context.PunchCards.ToListAsync();

        // GET: api/PunchCards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PunchCard>> GetPunchCard(int id) {
            var punchCard = await _context.PunchCards.FindAsync(id);

            if (punchCard == null) {
                return NotFound();
            }

            return punchCard;
        }

        // GET: api/PunchCards/Held/5
        [HttpGet("Held/{id}")]
        public async Task<ActionResult<IEnumerable<PunchCard>>> GetPunchCardsHeldByMember(int id) =>
            await _context.PunchCards.Where(w => w.CurrentMemberId == id).ToListAsync();

        // GET: api/PunchCards/Purchased/5
        [HttpGet("Purchased/{id}")]
        public async Task<ActionResult<IEnumerable<PunchCard>>> GetPunchCardsPurchasedByMember(int id) =>
            await _context.PunchCards.Where(w => w.PurchaseMemberId == id).ToListAsync();

        // GET: api/PunchCards/Member/5
        [HttpGet("Member/{id}")]
        public async Task<ActionResult<IEnumerable<PunchCard>>> GetPunchCardsByMember(int id) =>
            await _context.PunchCards.Where(w => w.PurchaseMemberId == id || w.CurrentMemberId == id).ToListAsync();

        // PUT: api/PunchCards/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPunchCard(int id, PunchCard punchCard) {
            if (id != punchCard.PunchCardId) return BadRequest();

            _context.Entry(punchCard).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!PunchCardExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }

            return AcceptedAtAction("GetPunchCard", new { id = punchCard.PunchCardId }, punchCard);
        }

        // POST: api/PunchCards
        [HttpPost]
        public async Task<ActionResult<PunchCard>> PostPunchCard(PunchCard punchCard) {
            _context.PunchCards.Add(punchCard);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPunchCard", new { id = punchCard.PunchCardId }, punchCard);
        }

        // DELETE: api/PunchCards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePunchCard(int id) {
            var punchCard = await _context.PunchCards.FindAsync(id);
            if (punchCard == null) {
                return NotFound();
            }

            if (_context.PunchCardUsages.Any(a => a.PunchCardId == id))
                return Problem("This punch card has been used and cannot be deleted.");

            _context.PunchCards.Remove(punchCard);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PunchCardExists(int id) => _context.PunchCards.Any(e => e.PunchCardId == id);
    }
}
