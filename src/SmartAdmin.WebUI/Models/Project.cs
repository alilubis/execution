using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartAdmin.WebUI.Models
{
    public class Project
    {
        public decimal id { get; set; }
        public int user_id { get; set; }
        // public int parent_id { get; set; }
        public int sub_inisiasi_id { get; set; }
        // public int maintenance_area_id { get; set; }
        // public string work_order_number { get; set; }
        // public string reference_number { get; set; }
        // public string notification_number { get; set; }
        // public string purchase_order_number { get; set; }
        // public string purchase_request_number { get; set; }
        // public string spppmk_number { get; set; }
        // public string vendor_name { get; set; }
        // public string buyer_name { get; set; }
        public string description { get; set; }
        // public string impact { get; set; }
        public string type { get; set; }
        public string contract_type { get; set; }
        public DateTime start_date { get; set; }
        // public int is_urgent { get; set; }
        public int status { get; set; }

        // public ICollection<Tasks> Tasks {get;set;}
    }
}
