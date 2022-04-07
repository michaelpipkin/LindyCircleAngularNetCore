using LindyCircleWebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LindyCircleWebApi.Controllers
{
    [Route("api/Defaults")]
    [ApiController]
    public class DefaultsController : ControllerBase
    {
        private readonly LindyCircleDbContext _context;

        public DefaultsController(LindyCircleDbContext context) {
            _context = context;
        }

        // GET: api/Defaults
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Default>>> GetDefaults() {
            return await _context.Defaults.ToListAsync();
        }

        // GET: api/Defaults/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Default>> GetDefault(int id) {
            var @default = await _context.Defaults.FindAsync(id);

            if (@default == null) {
                return NotFound();
            }

            return @default;
        }

        // GET: api/Defaults/value/Rental%20cost
        [HttpGet("value/{defaultName}")]
        public async Task<ActionResult<decimal>> GetDefault(string defaultName) {
            var @default = await _context.Defaults.SingleOrDefaultAsync(s => s.DefaultName.Equals(defaultName));

            if (@default == null) {
                return NotFound();
            }

            return @default.DefaultValue;
        }

        // PUT: api/Defaults/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDefault(int id, Default @default) {
            if (id != @default.DefaultId) {
                return BadRequest();
            }

            _context.Entry(@default).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!DefaultExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }

            return AcceptedAtAction("GetDefault", new { id = @default.DefaultId }, @default);
        }

        // POST: api/Defaults
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Default>> PostDefault(Default @default) {
            _context.Defaults.Add(@default);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDefault", new { id = @default.DefaultId }, @default);
        }

        // DELETE: api/Defaults/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteDefault(int id) {
        //    var @default = await _context.Defaults.FindAsync(id);
        //    if (@default == null) {
        //        return NotFound();
        //    }

        //    _context.Defaults.Remove(@default);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool DefaultExists(int id) {
            return _context.Defaults.Any(e => e.DefaultId == id);
        }
    }
}
