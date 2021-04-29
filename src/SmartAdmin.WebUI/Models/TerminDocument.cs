using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartAdmin.WebUI.Models
{
    public class TerminDocument
    {
        public int id { get; set; }
        public int termin_id { get; set; }
        public string punchlist { get; set; }
        public string bastp_one { get; set; }
        public string bastp_two { get; set; }
        public string job_progress_report { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }

    }
}