using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartAdmin.WebUI.Models
{
    // [Table("disciplines")]
    public class Disciplines
    {
        // [Column("id")]
        public decimal id {get; set;}
        public string name {get; set;}
        public string description {get; set;}

        // public ICollection<User> Users {get;set;}
    }
}
