using System;

namespace SmartAdmin.WebUI.Models
{
    public class Tasks
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int Project_id { get; set; }
        public DateTime StartDate { get; set; }
        public int Duration { get; set; }
        public string Progress { get; set; }
        public int? ParentId { get; set; }
        public string Type { get; set; }
        public long value { get; set; }
        public int SortOrder { get; set; }
        public int User_id { get; set; }
        public DateTime planned_start { get; set; }
        public DateTime planned_end { get; set; }
        public DateTime deadline { get; set; }
    }


    
}
