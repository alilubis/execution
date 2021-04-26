using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartAdmin.WebUI.Models
{
    public class ProjectTermin
    {
        public int id { get; set; }
        public int project_id { get; set; }
        public string title { get; set; }
        public string sa_number { get; set; }
        public long value { get; set; }
        public int percentage { get; set; }
        public DateTime billing_date { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }

    }
}