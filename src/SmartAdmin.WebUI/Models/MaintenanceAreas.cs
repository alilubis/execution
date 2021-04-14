using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartAdmin.WebUI.Models
{
    public class MaintenanceAreas
    {
        public decimal id { get; set; }
        public string name { get; set; }
    }
}
