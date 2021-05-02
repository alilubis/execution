using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using SmartAdmin.WebUI.Models;
using System;
using System.Linq;
using System.Data;
using System.IO;
using System.Drawing;  
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;

namespace SmartAdmin.WebUI.Controllers
{
    public class WorkspaceController : Controller
    {

        private IWebHostEnvironment Environment;
        private readonly ExecutionContext _db;
        public WorkspaceController(ExecutionContext db, IWebHostEnvironment _environment)
        {
            _db = db;
            Environment = _environment;
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

        [Authorize]
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
            var User = _db.Users.Include(u => u.MaintenanceAreas)
            .FirstOrDefault(u => u.id == Project.user_id);
            ViewBag.Users = User;
            ViewBag.Project = Project;
            ViewBag.Inisiasi = _db.SubInitiations.FirstOrDefault(i => i.id == Project.sub_inisiasi_id);
            ViewBag.Discipline = _db.Disciplines.FirstOrDefault(i => i.id == User.discipline_id);
            ViewBag.Termin = _db.Termin.Where(t => t.project_id == Id).Sum(t => t.value);
            ViewBag.Percentage = _db.Termin.Where(t => t.project_id == Id).Sum(t => t.percentage);
            var StartDate = _db.Tasks
                            .Where(t => t.ParentId != 0)
                            .Where(t => t.Project_id == Id)
                            .Select(t => new {t.planned_start});
            if(StartDate.ToList().Count > 0) {
                ViewBag.Tasks = StartDate.Min(t => t.planned_start);
            } else {
                ViewBag.Tasks = null;
            }
            return View();
        }

        [Authorize]
        [HttpPost]
        [ActionName("UploadFile")]
        public async Task<IActionResult> UploadFile(FileInputModel model){    
                var FileSupport = new[] { "xls", "xlsx", "pdf", "doc", "docx" };
                var message = "";
                var success = false;
                if (model.FileToUploadPunchList != null) {
                    var fileExtPL = model.FileToUploadPunchList.FileName != null ? System.IO.Path.GetExtension(model.FileToUploadPunchList.FileName).Substring(1) : null;
                    
                    if (!FileSupport.Contains(fileExtPL))
                    {
                        success = false;
                        message = "Terjadi kesalahan saat mengunggah berkas, silahkan coba lagi..!";
                    } else {
                        if(SaveFile(model)) {
                            string path = Path.Combine(this.Environment.WebRootPath, "data");
                            if (!Directory.Exists(path)) {
                                Directory.CreateDirectory(path);
                            }
                            string fileNamePL = Path.GetFileName(model.FileToUploadPunchList.FileName);
                            string filePathPL = Path.Combine(path, fileNamePL);
                            await using (FileStream streamPL = new FileStream(filePathPL, FileMode.Create))
                            {
                                model.FileToUploadPunchList.CopyTo(streamPL);
                            }
                            success = true;
                            message = "Berhasil mengunggah berkas..!";
                        } else {
                            success = false;
                            message = "Terjadi kesalahan saat mengunggah berkas, silahkan coba lagi..!";
                        }
                    }
                    
                } 
                if (model.FileToUploadBastpOne != null) {
                    var fileExtBOne = System.IO.Path.GetExtension(model.FileToUploadBastpOne.FileName).Substring(1);
                    if(!FileSupport.Contains(fileExtBOne)) {
                        success = false;
                        message = "Terjadi kesalahan saat mengunggah berkas, silahkan coba lagi..!";
                    } else {
                        if(SaveFile(model)) {
                            string path = Path.Combine(this.Environment.WebRootPath, "data");
                            if (!Directory.Exists(path)) {
                                Directory.CreateDirectory(path);
                            }
                            string fileNameBone = Path.GetFileName(model.FileToUploadBastpOne.FileName);
                            string filePathBone = Path.Combine(path, fileNameBone);
                            await using (FileStream streamOne = new FileStream(filePathBone, FileMode.Create))
                            {
                                model.FileToUploadBastpOne.CopyTo(streamOne);
                            }
                            success = true;
                            message = "Berhasil mengunggah berkas..!";
                        } else {
                            success = false;
                            message = "Terjadi kesalahan saat mengunggah berkas, silahkan coba lagi..!";
                        }
                    }
                } 

                if (model.FileToUploadBastpTwo != null) {
                    var fileExtBTwo = System.IO.Path.GetExtension(model.FileToUploadBastpTwo.FileName).Substring(1);
                    if(!FileSupport.Contains(fileExtBTwo)) {
                        success = false;
                        message = "Terjadi kesalahan saat mengunggah berkas, silahkan coba lagi..!";
                    } else {
                        if(SaveFile(model)) {
                            string path = Path.Combine(this.Environment.WebRootPath, "data");
                            if (!Directory.Exists(path)) {
                                Directory.CreateDirectory(path);
                            }
                            string fileNameBTwo = Path.GetFileName(model.FileToUploadBastpTwo.FileName);
                            string filePathBTwo = Path.Combine(path, fileNameBTwo);
                            await using (FileStream stream = new FileStream(filePathBTwo, FileMode.Create))
                            {
                                model.FileToUploadBastpTwo.CopyTo(stream);
                            }
                            success = true;
                            message = "Berhasil mengunggah berkas..!";
                        } else {
                            success = false;
                            message = "Terjadi kesalahan saat mengunggah berkas, silahkan coba lagi..!";
                        }
                    }
                }

                if (model.FileToUploadLaporan != null) {
                    var fileExtReport = System.IO.Path.GetExtension(model.FileToUploadLaporan.FileName).Substring(1);
                    if(!FileSupport.Contains(fileExtReport)) {
                        success = false;
                        message = "Terjadi kesalahan saat mengunggah berkas, silahkan coba lagi..!";
                    } else {
                        if(SaveFile(model)) {
                            string path = Path.Combine(this.Environment.WebRootPath, "data");
                            if (!Directory.Exists(path)) {
                                Directory.CreateDirectory(path);
                            }

                            string fileNameReport = Path.GetFileName(model.FileToUploadLaporan.FileName);
                            string filePathReport = Path.Combine(path, fileNameReport);
                            await using (FileStream stream = new FileStream(filePathReport, FileMode.Create))
                            {
                                model.FileToUploadLaporan.CopyTo(stream);
                            }
                            success = true;
                            message = "Berhasil mengunggah berkas..!";
                        } else {
                            success = false;
                            message = "Terjadi kesalahan saat mengunggah berkas, silahkan coba lagi..!";
                        }
                    }
                }

                return Json(new {
                    success = success,
                    message = message
                });
        }
        
        [Authorize]
        [HttpPost]
        [ActionName("DeleteFile")]
        public JsonResult DeleteFile(int terminId, string columnName, string fileName) {
            var termin = _db.TerminDocument.FirstOrDefault(t => t.termin_id == terminId);
            if(termin != null) {
                if(columnName == "punchlist") {
                    termin.punchlist = null;
                } else if (columnName == "bastpone") {
                    termin.bastp_one = null;
                } else if (columnName == "jobreport") {
                    termin.job_progress_report = null;
                } else if (columnName == "bastptwo") {
                    termin.bastp_two = null;
                }
                _db.SaveChanges();

                var webRoot = Environment.WebRootPath;
                string path = System.IO.Path.Combine(webRoot, "data/" + fileName);

                FileInfo file = new FileInfo(path);  
                if (file.Exists) {  
                    file.Delete(); 
                    return Json(new {
                        success = true,
                        message = "Berhasil menghapus file "+fileName
                    }); 
                } else {  
                    return Json(new {
                        success = false,
                        message = "File "+fileName+ " tidak tersedia"
                    }); 
                }  
            } else {
                return Json(new {
                    success = false,
                    message = "Data pada termin ini tidak tersedia"
                });
            }

        }
        public async Task<IActionResult> ViewFile(string filename) 
        {
            var filePath = Path.Combine(this.Environment.WebRootPath, "data/"+filename);
            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            if (filename.EndsWith(".pdf")) {
                return File(memory, "application/pdf");
            } else if (filename.EndsWith(".doc")) {
                return File(memory, "application/msword");
            } else if (filename.EndsWith(".docx")) {
                return File(memory, "application/msword");
            } else if (filename.EndsWith(".xls")) {
                return File(memory, "application/vnd.ms-excel");
            } else if (filename.EndsWith(".xlsx")) {
                return File(memory, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            } else {
                return Json(new {
                    success = false,
                    message = "Berkas ini tidak support untuk ditinjau, silahkan download berkas..!"
                });
            }
        }

        private bool SaveFile(FileInputModel model)
        {
           var terminCount = _db.TerminDocument.Count(t => t.termin_id == model.TerminId);
            if (terminCount == 0) {
                var terminData = new TerminDocument() {
                    termin_id = model.TerminId,
                    punchlist = (model.FileToUploadPunchList != null) ? model.FileToUploadPunchList.FileName : null,
                    bastp_one = (model.FileToUploadBastpOne != null) ? model.FileToUploadBastpOne.FileName : null,
                    bastp_two = (model.FileToUploadBastpTwo != null) ? model.FileToUploadBastpTwo.FileName : null,
                    job_progress_report = (model.FileToUploadLaporan != null) ? model.FileToUploadLaporan.FileName : null,
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now
                };
                
                _db.TerminDocument.Add(terminData);
                _db.SaveChanges();
            } else {
                var terminDoc = _db.TerminDocument.FirstOrDefault(t => t.termin_id == model.TerminId);
                if (model.FileToUploadPunchList != null) {
                    terminDoc.punchlist = model.FileToUploadPunchList.FileName;
                }
                if (model.FileToUploadBastpOne != null) {
                    terminDoc.bastp_one = model.FileToUploadBastpOne.FileName;
                }
                if (model.FileToUploadBastpTwo != null) {
                    terminDoc.bastp_two = model.FileToUploadBastpTwo.FileName;
                }
                if (model.FileToUploadLaporan != null) {
                    terminDoc.job_progress_report = model.FileToUploadLaporan.FileName;
                }
                terminDoc.updated_at = DateTime.Now;
                
                _db.SaveChanges();
            }
            return true;
        }

        [Authorize]
        public JsonResult GetTerminDocument(int id) {
            var data = _db.TerminDocument.FirstOrDefault(t => t.termin_id == id);
            return Json( new {
                success = true,
                data = data
            });
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
                    .Join(
                        _db.TerminDocument,
                        termin => termin.id,
                        docs => docs.termin_id,
                        (termin, docs) => new {
                            id = termin.id,
                            title = termin.title,
                            sa_number = termin.sa_number, 
                            value = termin.value, 
                            percentage = termin.percentage, 
                            billing_date = termin.billing_date,
                            status_document = (
                                docs.punchlist != null && docs.bastp_one != null 
                                && docs.bastp_two != null && docs.job_progress_report != null ? 1 : 0
                            )
                        }
                    )
                    // .Select(t => new {
                    //     t.id,
                    //     t.title,
                    //     t.sa_number, 
                    //     t.value, 
                    //     t.percentage, 
                    //     t.billing_date
                    // })
                    .ToList();
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
            }
            if(Request.Form["name"] == "plan_finish") {
                Data.planned_end = DateTime.Parse(Request.Form["value"]);
            }
            if(Request.Form["name"] == "startdate") {
                Data.StartDate = DateTime.Parse(Request.Form["value"]);
            }
            _db.SaveChanges();
            return Json( new {
                success = true,
                data = Data
            });
        }

        [Authorize]
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

            var docs = new TerminDocument() {
                termin_id = termin.id,
                punchlist = null,
                bastp_one = null,
                bastp_two = null,
                job_progress_report = null,
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            _db.TerminDocument.Add(docs);
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


        [Authorize]
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

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult> DeleteTermin(int id, int project){
            var termin = _db.Termin.First(e => e.id == id);
            var docs = _db.TerminDocument.FirstOrDefault(d => d.termin_id == id);
            if(docs != null) {
                _db.Remove(docs);
                await _db.SaveChangesAsync();
            }
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