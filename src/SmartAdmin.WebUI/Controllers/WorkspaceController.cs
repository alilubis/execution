using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SmartAdmin.WebUI.Models;
using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace SmartAdmin.WebUI.Controllers
{
    public class WorkspaceController : Controller
    {

        private readonly ExecutionContext _db;
        public WorkspaceController(ExecutionContext db)
        {
            _db = db;
        }
        [Authorize]
        public IActionResult Index() {
            var Usr = User.Claims.FirstOrDefault(c => c.Type == "UserId").Value;
            ViewBag.UserId = Usr;
            ViewBag.User = _db.Users.FirstOrDefault(u => u.id == decimal.Parse(Usr));
            return View();
        }
        [Authorize]
        public JsonResult Data(){
            var Project = _db.Project.OrderByDescending(p => p.id)
            .Where(p => p.status == 22 || p.status == 23 || p.status == 30 || p.status == 31)
            .Join(
                _db.SubInitiations,
                pro => pro.sub_inisiasi_id,
                ini => ini.id,
                (pro, ini) => new {
                    status = pro.status,
                    description = pro.description,
                    discipline = _db.Users.FirstOrDefault(u => u.id == pro.user_id).discipline_id,
                    disciplinename = _db.Disciplines.FirstOrDefault(d => d.id == (_db.Users.FirstOrDefault(u => u.id == pro.user_id).discipline_id)).description,
                    username = _db.Users.FirstOrDefault(u => u.id == pro.user_id).name,
                    user_id = pro.user_id,
                    hkl_estimation = pro.estimation,
                    po_number = pro.purchase_order_number,
                    day_one = _db.Tasks
                            .Where(t => t.ParentId != 0)
                            .Where(t => t.Project_id == pro.id)
                            .Select(t => new {t.planned_start})
                            .Min(t => t.planned_start),
                    end_date = _db.Tasks
                                .Where(t => t.Project_id == pro.id)
                                .Where(t => t.ParentId == 0)
                                .Max(t => t.planned_end),
                    vendor = pro.vendor_name,
                    type = pro.type,
                    contract_type = pro.contract_type,
                    // due_date = pro.Tasks.Where(t => t.Project_id == pro.id).Max(t => t.planned_end),
                    due_date = _db.Tasks.Where(t => t.Project_id == pro.id).Max(t => t.planned_end),
                    inisiasi = ini.name,
                    time_status = pro.id,
                    count_task = _db.Tasks.Where(t => t.Project_id == pro.id)
                                .Where(t => t.Type == "task")
                                .Count(),
                    task_duration = _db.Tasks.Where(t => t.Project_id == pro.id)
                                // .Where(t => t.Type == "task")
                                // .Where(t => t.Duration <= (t.planned_end - t.planned_start).TotalDays)
                                .Select(t => new { t.planned_start, t.planned_end, t.Duration, t.Type, t.ParentId, t.Progress })
                                .ToArray(),
                    progress = pro.type,
                    id = pro.id
                }
            )
            .ToList();
            return Json( new {
                success = true,
                data = Project
            });
        }

        public JsonResult UpdateDayOne(int id, string dates){
            var Task = _db.Tasks.Where(t => t.Project_id == id).ToList();

            foreach(var item in Task) {
                var Tas = _db.Tasks.FirstOrDefault(t => t.Id == item.Id);
                Tas.planned_start = DateTime.Parse(dates);
                Tas.planned_end = DateTime.Parse(dates).AddDays(item.Duration);
                _db.SaveChanges();
            }
            // Task.planned_start = DateTime.Parse(dates);

            return Json( new {
                success = true
            });
        }

        // public int TimeStatus(int Id) {
        //     var CheckTask = _db.Tasks.Where(t => t.Project_id == Id).Count();
        //     if(CheckTask > 0) {
        //         var myIntArray = new List<int>();

        //         var CountTask = _db.Tasks.Where(t => t.Project_id == Id)
        //                         .Where(t => t.Type == "task")
        //                         .Count();
        //         // var CountTaskDuration = _db.Tasks
        //         var TaskDuration = _db.Tasks.Where(t => t.Project_id == Id)
        //                         .Where(t => t.Type == "task")
        //                         .Select(t => new { t.planned_start, t.planned_end, t.Duration })
        //                         .ToList();
        //         foreach(var item in TaskDuration) {
        //             if(item.Duration <= int.Parse((item.planned_end - item.planned_start).TotalDays.ToString())) {
        //                 myIntArray.Add(1);
        //             }
        //         }
        //         if(CountTask == myIntArray.Count()) {
        //             return 1; // On Time
        //         } else {
        //             return 2; // Overdue
        //         }
        //     } else {
        //         return 4;
        //     }
        // }

        [Authorize]
        public IActionResult Detail(int Id) {
            var Project = _db.Project.FirstOrDefault(p => p.id == Id);
            var User = _db.Users.FirstOrDefault(u => u.id == Project.user_id);
            ViewBag.Project = Project;
            ViewBag.Inisiasi = _db.SubInitiations.FirstOrDefault(i => i.id == Project.sub_inisiasi_id);
            ViewBag.Discipline = _db.Disciplines.FirstOrDefault(i => i.id == User.discipline_id);
            ViewBag.Termin = _db.Termin.Where(t => t.project_id == Id).Sum(t => t.value);
            ViewBag.Percentage = _db.Termin.Where(t => t.project_id == Id).Sum(t => t.percentage);
            var StartDate = _db.Tasks
                            .Where(t => t.ParentId != 0)
                            .Where(t => t.Project_id == Id)
                            .Select(t => new {t.planned_start});
                            // .Select(t => new {t.StartDate});
            if(StartDate.ToList().Count > 0) {
                ViewBag.Tasks = StartDate.Min(t => t.planned_start);
                // ViewBag.Tasks = StartDate.Min(t => t.StartDate);
            } else {
                ViewBag.Tasks = null;
            }
            return View();
        }

        [Authorize]
        public JsonResult GetTasks(int id){
            var Data = _db.Tasks.Where(t => t.Project_id == id)
                    .Select(t => new {
                        t.Id,
                        t.Text,
                        t.planned_start, 
                        t.planned_end, 
                        t.StartDate, 
                        t.Duration,
                        t.Progress
                    }).ToList();
            return Json( new {
                success = true,
                data = Data
            });
        }

        [Authorize]
        public JsonResult GetTagihan(int id){
            var Data = _db.Termin.Where(t => t.project_id == id)
                    .Select(t => new {
                        t.id,
                        t.title,
                        t.sa_number, 
                        t.value, 
                        t.percentage, 
                        t.billing_date
                    }).ToList();
            return Json( new {
                success = true,
                data = Data
            });
        }

        [Authorize]
        [HttpPost]
        public JsonResult UpdateTask() {
            var Data = _db.Tasks.FirstOrDefault(d => d.Id == int.Parse(Request.Form["pk"][0]));
            if(Request.Form["name"] == "uraian_pekerjaan") {
                Data.Text = Request.Form["value"];
            }
            if(Request.Form["name"] == "plan_start") {
                Data.planned_start = DateTime.Parse(Request.Form["value"]);
                // Data.Duration = (Data.planned_end - DateTime.Parse(Request.Form["value"])).Days;
            }
            if(Request.Form["name"] == "plan_finish") {
                Data.planned_end = DateTime.Parse(Request.Form["value"]);
                // Data.Duration = (DateTime.Parse(Request.Form["value"]) - Data.planned_start).Days;
            }
            if(Request.Form["name"] == "startdate") {
                Data.StartDate = DateTime.Parse(Request.Form["value"]);
                // Data.Duration = (DateTime.Parse(Request.Form["value"]) - Data.planned_start).Days;
            }
            _db.SaveChanges();
            return Json( new {
                success = true,
                data = Data
            });
        }

        // [Authorize]
        [HttpPost]
        public JsonResult AddTermin(int id) {
            // var termin = new ProjectTermin() {
            //     project_id = id,
            //     title = title,
            //     billing_date = DateTime.Parse(billing_date),
            //     sa_number = sa_number,
            //     value = Convert.ToInt32(value),
            //     percentage = percentage
            // };
            var total = _db.Termin.Where(t => t.project_id == id).Count();
            var termin = new ProjectTermin() {
                project_id = id,
                title = "Termin "+(total+1),
                billing_date = DateTime.Now,
                sa_number = null,
                value = 0,
                percentage = 0
            };
            _db.Termin.Add(termin);
            _db.SaveChanges();
            var Data = _db.Termin.Where(t => t.project_id == id).Sum(t => t.value);
            var Percentage = _db.Termin.Where(t => t.project_id == id).Sum(t => t.percentage);
            return Json( new {
                success = true,
                message = "Berhasil menambahkan termin",
                data = Data,
                percentage = Percentage
            });
        }

        [Authorize]
        [HttpPost]
        public JsonResult UpdateTermin() {
            var Data = _db.Termin.FirstOrDefault(d => d.id == int.Parse(Request.Form["pk"][0]));
            if(Request.Form["name"] == "termin_title") {
                Data.title = Request.Form["value"];
            }
            if(Request.Form["name"] == "tanggal_penagihan") {
                Data.billing_date = DateTime.Parse(Request.Form["value"]);
            }
            if(Request.Form["name"] == "sa_number") {
                Data.sa_number = Request.Form["value"];
            }
            if(Request.Form["name"] == "value") {
                Data.value = Int64.Parse(Request.Form["value"]);
            }
            if(Request.Form["name"] == "percentage") {
                Data.percentage = int.Parse(Request.Form["value"]);
            }
            _db.SaveChanges();
            
            var Value = _db.Termin.Where(t => t.project_id == Data.project_id).Sum(t => t.value);
            var Percentage = _db.Termin.Where(t => t.project_id == Data.project_id).Sum(t => t.percentage);
            return Json( new {
                success = true,
                data = Value,
                percentage = Percentage
            });
        }


        [HttpPost]
        public JsonResult JumlahTermin(
            int id, int jumlah
        ) {
            var Pro = _db.Project.FirstOrDefault(p => p.id == id);
            Pro.termin = jumlah;
            _db.SaveChanges();
            return Json( new {
                success = true,
                message = "Berhasil memperbarui jumlah termin"
            });
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteTermin(int id, int project){
            var termin = _db.Termin.First(e => e.id == id);
            if(termin == null){
                return Json( new {
                    success = false,
                    message = "Error Deleted Termin !"
                });
            }

            // termin.deleted_at = DateTime.Now;
            _db.Remove(termin);
            await _db.SaveChangesAsync();
            var Data = _db.Termin.Where(t => t.project_id == project).Sum(t => t.value);
            var Percentage = _db.Termin.Where(t => t.project_id == project).Sum(t => t.percentage);
            return Json( new {
                success = true,
                message = "Success Deleted Termin !",
                data = Data,
                percentage = Percentage
            });
            
        }

        [Authorize]
        public IActionResult Gantt(int Id) {
            ViewBag.Id = Id;
            return View();
        }

        [Authorize]
        public JsonResult GetTask(int Id) {
            int[] Links = new int[] {};
            var Tasks = _db.Tasks
                    .Where(t => t.Project_id == Id)
                    // .Where(t => t.Project_id == id && t.Type == null)
                    .OrderBy(t => t.SortOrder)
                    .ToList()
                    // .Select(t => new WebApiTask{value = t.value}),
                    .Select(t => (WebApiTask)t);
            return Json( new {
                data = Tasks,
                // data = (Tasks.Any()?Tasks:null),
                links = Links
            });
        }


    }
}