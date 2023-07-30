using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Exercise2.Models;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Storage;

namespace Exercise2.Data;
[Table("contacts")]
public partial class ContactsContext : DbContext
{
    
    public ContactsContext(DbContextOptions<ContactsContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
 
    public DbSet<ContactModel> Contacts { get; set; }
}
