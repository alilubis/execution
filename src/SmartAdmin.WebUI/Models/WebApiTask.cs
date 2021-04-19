using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace SmartAdmin.WebUI.Models
{
    public class WebApiTask
    {
        public int id { get; set; }
        public string start_date { get; set; }
        public int duration { get; set; }
        public string text { get; set; }
        public string progress { get; set; }
        public int? parent { get; set; }
        public string type { get; set; }
        public string deadline { get; set; }
        public string planned_start { get; set; }
        public string planned_end { get; set; }
        public int open
        {
            get { return 1; }
            set { }
        }
        public string target { get; set; }
        public long value { get; set; }

        public static explicit operator WebApiTask(Tasks task)
        {
            return new WebApiTask
            {
                id = task.Id,
                text = HtmlEncoder.Default.Encode(task.Text),
                start_date = task.StartDate.ToString("dd-MM-yyyy HH:mm"),
                duration = task.Duration,
                parent = task.ParentId,
                type = task.Type,
                progress = task.Progress,
                planned_start = task.planned_start.ToString("dd-MM-yyyy HH:mm"),
                planned_end = task.planned_end.ToString("dd-MM-yyyy HH:mm"),
                deadline = task.deadline.ToString("dd-MM-yyyy HH:mm"),
                value = task.value
            };
        }

        // public static explicit operator Task(WebApiTask task)
        // {
        //     return new Tasks
        //     {
        //         Id = task.id,
        //         Text = task.text,
        //         StartDate = task.start_date == null ? DateTime.ParseExact(DateTime.Now.ToString("dd-MM-yyyy HH:mm"), "dd-MM-yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture) : DateTime.ParseExact(task.start_date, "dd-MM-yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture),
        //         Duration = task.duration,
        //         ParentId = task.parent,
        //         Type = task.type,
        //         Progress = task.progress,
        //         planned_start = task.planned_start == null ? DateTime.Parse(DateTime.Now.ToString("dd-MM-yyyy HH:mm"), System.Globalization.CultureInfo.InvariantCulture) : DateTime.ParseExact(task.planned_start, "dd-MM-yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture),
        //         planned_end = task.planned_end == null ? DateTime.Parse(DateTime.Now.ToString("dd-MM-yyyy HH:mm"), System.Globalization.CultureInfo.InvariantCulture) : DateTime.ParseExact(task.planned_end, "dd-MM-yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture),
        //         deadline = task.deadline == null ? DateTime.ParseExact(DateTime.Now.ToString(), "dd-MM-yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture) : DateTime.ParseExact(task.deadline, "dd-MM-yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture),
        //         value = task.value
        //     };
        // }
    }
}
