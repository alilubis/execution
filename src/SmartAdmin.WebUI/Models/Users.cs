using System;

namespace SmartAdmin.WebUI.Models
{
    public class Users
    {
        public Decimal id { get; set; }
        public string nip { get; set; }
        public string phone { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public Int16 status { get; set; }
        public string department { get; set; }
        public string? photo { get; set; }
        public int discipline_id { get; set; }
        public string role { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
    }
}
