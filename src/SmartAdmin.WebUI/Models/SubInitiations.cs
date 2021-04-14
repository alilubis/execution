using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartAdmin.WebUI.Models
{
    // [Table("sub_initiations")]
    public class SubInitiations
    {
        public decimal id {get; set;}
        public int inisiasi_id {get; set;}
        public string name {get; set;}
        public string created_at {get;set;}
        public string updated_at {get;set;}

    }
}
