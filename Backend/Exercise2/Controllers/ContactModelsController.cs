using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Exercise2.Data;
using Exercise2.Models;

namespace Exercise2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactModelsController : ControllerBase
    {
        private readonly ContactsContext _context;

        public ContactModelsController(ContactsContext context)
        {
            _context = context;
        }

        // GET: api/ContactModels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactModel>>> GetContactModel()
        {
          if (_context.Contacts == null)
          {
              return NotFound();
          }
            return await _context.Contacts.ToListAsync();
        }

        // GET: api/ContactModels/id
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactModel>> GetContactModel(int id)
        {
          if (_context.Contacts == null)
          {
              return NotFound();
          }
            var contactModel = await _context.Contacts.FindAsync(id);

            if (contactModel == null)
            {
                return NotFound();
            }

            return contactModel;
        }

        // PUT: api/ContactModels/id
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContactModel(int id, ContactModel contactModel)
        {
            if (id != contactModel.Id)
            {
                return BadRequest();
            }

            _context.Entry(contactModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ContactModels
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ContactModel>> PostContactModel(ContactModel contactModel)
        {
          if (_context.Contacts == null)
          {
              return Problem("Entity set 'ContactsContext.ContactModel'  is null.");
          }
            _context.Contacts.Add(contactModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContactModel", new { id = contactModel.Id }, contactModel);
        }

        // DELETE: api/ContactModels/id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContactModel(int id)
        {
            if (_context.Contacts == null)
            {
                return NotFound();
            }
            var contactModel = await _context.Contacts.FindAsync(id);
            if (contactModel == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contactModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ContactModelExists(int id)
        {
            return (_context.Contacts?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
