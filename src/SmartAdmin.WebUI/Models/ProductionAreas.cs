using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartAdmin.WebUI.Models
{
    // [Table("production_areas")]
    public class ProductionAreas
    {
        public int id { get; set; }
        public string name { get; set; }
        // public int? id_last { get; set; }
        // public Users Users {get; set;}

    }
}
