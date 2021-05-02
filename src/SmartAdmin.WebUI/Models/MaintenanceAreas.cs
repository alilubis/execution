﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SmartAdmin.WebUI.Models
{
    public class MaintenanceAreas
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
        public ICollection<Users> USR {get; set;}
        // public List<Users> USR {get; set;}
    }
}
