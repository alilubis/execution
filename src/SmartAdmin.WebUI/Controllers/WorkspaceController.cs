using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SmartAdmin.WebUI.Models;
using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;

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
                    type = pro.type,
                    due_date = pro.start_date,
                    inisiasi = ini.name,
                    time_status = pro.type,
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
        [Authorize]
        public IActionResult Detail(int Id) {
            var Project = _db.Project.FirstOrDefault(p => p.id == Id);
            var User = _db.Users.FirstOrDefault(u => u.id == Project.user_id);
            ViewBag.Project = Project;
            ViewBag.Inisiasi = _db.SubInitiations.FirstOrDefault(i => i.id == Project.sub_inisiasi_id);
            ViewBag.Discipline = _db.Disciplines.FirstOrDefault(i => i.id == User.discipline_id);

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
                        t.Duration
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

    }
}