using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SmartAdmin.WebUI.Models;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace SmartAdmin.WebUI.Controllers
{
    public class DashboardController : Controller
    {

        private readonly ExecutionContext _db;
        public DashboardController(ExecutionContext db)
        {
            _db = db;
        }
        [Authorize]
        public IActionResult Index() {
            // ViewBag.Active = _db.Project.Where(p => p.status == 22 || p.status == 30).Count();
            // ViewBag.Finish = _db.Project.Where(p => p.status == 23).Count();
            // ViewBag.FinishTagihan = _db.Project.Where(p => p.status == 31).Count();
            // ViewBag.NewProject = _db.Project
            //     .Where(p => p.status == 22 || p.status == 30)
            //     .Take(10).ToList();

            // ViewBag.ProgressTagihan = _db.Project
            //     .Where(p => p.status == 22 || p.status == 23 || p.status == 30 || p.status == 31).Take(10)
            //     .ToList();    

            // var TotalRKU = _db.Project.Where(p => p.status == 20 || p.status == 31)
            //                 .Where(p => p.sub_inisiasi_id == 1).Count();
            // var TotalRKAP = _db.Project.Where(p => p.status == 20 || p.status == 31)
            //                 .Where(p => p.sub_inisiasi_id == 2).Count();
            // var TotalMOC = _db.Project.Where(p => p.status == 20 || p.status == 31)
            //             .Where(p => p.sub_inisiasi_id == 3).Count();
            // var TotalSU = _db.Project.Where(p => p.status == 20 || p.status == 31)
            //             .Where(p => p.sub_inisiasi_id == 4).Count();
            // var TotalNonRKAP = _db.Project.Where(p => p.status == 20 || p.status == 31)
            //             .Where(p => p.sub_inisiasi_id == 5).Count();
            var AllProject = _db.Project.Count();
            ViewBag.Active = GetProject("active");

            ViewBag.Finish = GetProject("finish");
            ViewBag.FinishTagihan = GetProject("tagihan");

            ViewBag.Role = GetRole();
            ViewBag.MA = GetMA();

            ViewBag.NewProject = GetNewProject();    
            ViewBag.ProgressTagihan = GetProgressTagihan();
                        
            ViewBag.RKU = GetRKU(AllProject);
            ViewBag.RKAP = GetRKAP(AllProject);
            ViewBag.MOC = GetMOC(AllProject);
            ViewBag.SU = GetSU(AllProject);
            ViewBag.NonRKAP = GetNonRKAP(AllProject);

            return View();
        }

        public string GetMA() {
            string MA = User.Claims.FirstOrDefault(c => c.Type == "ma").Value;
            return _db.MaintenanceAreas.FirstOrDefault(m => m.id == int.Parse(MA)).name;
        }
        public string GetRole() {
            var Role = User.Claims.FirstOrDefault(c => c.Type == "roles").Value;
            var Result = "";
            if(Role == "execution_spv_rotating") {
                Result = "Supervisor Rotating";
            } else if (Role == "execution_spv_mekanik") {
                Result = "Supervisor Mekanik";
            } else if (Role == "execution_spv_sipil") {
                Result = "Supervisor Sipil";
            } else if (Role == "execution_spv_ei") {
                Result = "Supervisor Elektrikal dan Instrument";
            } else if (Role == "execution") {
                Result = "Eksekutor";
            }
            return Result;
        }

        public int GetProject(string status) {
            var Role = User.Claims.FirstOrDefault(c => c.Type == "roles").Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId").Value;
            if(Role == "execution") {
                var Total = _db.Project.Where(p => p.user_id ==  int.Parse(UserId));
                if (status == "active") {
                    Total.Where(p => p.status == 22 || p.status == 30);
                } else if(status == "finish") {
                    Total.Where(p => p.status == 23);
                } else if(status == "tagihan") {
                    Total.Where(p => p.status == 31);
                }
                return Total.Count();
            } else {
                var Discipline = 0;
                var DisciplineEI = 0;
                if(Role == "execution_spv_rotating") {
                    Discipline = 4;
                } else if (Role == "execution_spv_mekanik") {
                    Discipline = 2;
                } else if (Role == "execution_spv_sipil") {
                    Discipline = 5;
                } else if (Role == "execution_spv_ei") {
                    DisciplineEI = 13;
                }
                var Total = _db.Project
                    .Join(
                        _db.Users, 
                        pro => pro.user_id,
                        usr => usr.id,
                        (pro, usr) => new {
                            DisciplineId = usr.discipline_id,
                            Status = pro.status,
                        }
                    );
                    if(status == "active") {
                        Total = Total.Where(p => p.Status == 22 || p.Status == 30);
                    } else if(status == "finish") {
                        Total = Total.Where(p => p.Status == 23);
                    } else if(status == "tagihan") {
                        Total = Total.Where(p => p.Status == 31);
                    }
                    if(DisciplineEI == 13) {
                        Total = Total.Where(t => t.DisciplineId == 1 || t.DisciplineId == 3);
                    } else {
                        Total = Total.Where(t => t.DisciplineId == Discipline);
                    }
                    return Total.Count();
            }
        }
        public int GetRKU(int project) {
            var Role = User.Claims.FirstOrDefault(c => c.Type == "roles").Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId").Value;
            if(Role == "execution") {
                var Total = _db.Project.Where(p => p.status == 20 || p.status == 31)
                                .Where(p => p.sub_inisiasi_id == 1)
                                .Where(p => p.user_id ==  int.Parse(UserId))
                                .Count();
                return 100 * Total / project;
            } else {
                var Discipline = 0;
                var DisciplineEI = 0;
                if(Role == "execution_spv_rotating") {
                    Discipline = 4;
                } else if (Role == "execution_spv_mekanik") {
                    Discipline = 2;
                } else if (Role == "execution_spv_sipil") {
                    Discipline = 5;
                } else if (Role == "execution_spv_ei") {
                    DisciplineEI = 13;
                }
                var Total = _db.Project
                    .Where(p => p.status == 20 || p.status == 31)
                    .Where(p => p.sub_inisiasi_id == 1)
                    .Join(
                        _db.Users, 
                        pro => pro.user_id,
                        usr => usr.id,
                        (pro, usr) => new {
                            DisciplineId = usr.discipline_id
                        }
                    );
                    if(DisciplineEI == 13) {
                        Total = Total.Where(t => t.DisciplineId == 1 || t.DisciplineId == 3);
                    } else {
                        Total = Total.Where(t => t.DisciplineId == Discipline);
                    }
                return 100 * Total.Count() / project;
            }
        }

        public int GetRKAP(int project) {
            var Role = User.Claims.FirstOrDefault(c => c.Type == "roles").Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId").Value;
            if(Role == "execution") {
                var Total = _db.Project.Where(p => p.status == 20 || p.status == 31)
                                .Where(p => p.sub_inisiasi_id == 2)
                                .Where(p => p.user_id ==  int.Parse(UserId))
                                .Count();
                return 100 * Total / project;
            } else {
                var Discipline = 0;
                var DisciplineEI = 0;
                if(Role == "execution_spv_rotating") {
                    Discipline = 4;
                } else if (Role == "execution_spv_mekanik") {
                    Discipline = 2;
                } else if (Role == "execution_spv_sipil") {
                    Discipline = 5;
                } else if (Role == "execution_spv_ei") {
                    DisciplineEI = 13;
                }
                var Total = _db.Project
                    .Where(p => p.status == 20 || p.status == 31)
                    .Where(p => p.sub_inisiasi_id == 2)
                    .Join(
                        _db.Users, 
                        pro => pro.user_id,
                        usr => usr.id,
                        (pro, usr) => new {
                            DisciplineId = usr.discipline_id
                        }
                    );
                    if(DisciplineEI == 13) {
                        Total = Total.Where(t => t.DisciplineId == 1 || t.DisciplineId == 3);
                    } else {
                        Total = Total.Where(t => t.DisciplineId == Discipline);
                    }
                return 100 * Total.Count() / project;
            }
        }

        public int GetMOC(int project) {
            var Role = User.Claims.FirstOrDefault(c => c.Type == "roles").Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId").Value;
            if(Role == "execution") {
                var Total = _db.Project.Where(p => p.status == 20 || p.status == 31)
                                .Where(p => p.sub_inisiasi_id == 3)
                                .Where(p => p.user_id ==  int.Parse(UserId))
                                .Count();
                return 100 * Total / project;
            } else {
                var Discipline = 0;
                var DisciplineEI = 0;
                if(Role == "execution_spv_rotating") {
                    Discipline = 4;
                } else if (Role == "execution_spv_mekanik") {
                    Discipline = 2;
                } else if (Role == "execution_spv_sipil") {
                    Discipline = 5;
                } else if (Role == "execution_spv_ei") {
                    DisciplineEI = 13;
                }
                var Total = _db.Project
                    .Where(p => p.status == 20 || p.status == 31)
                    .Where(p => p.sub_inisiasi_id == 3)
                    .Join(
                        _db.Users, 
                        pro => pro.user_id,
                        usr => usr.id,
                        (pro, usr) => new {
                            DisciplineId = usr.discipline_id
                        }
                    );
                    if(DisciplineEI == 13) {
                        Total = Total.Where(t => t.DisciplineId == 1 || t.DisciplineId == 3);
                    } else {
                        Total = Total.Where(t => t.DisciplineId == Discipline);
                    }
                return 100 * Total.Count() / project;
            }
        }

        public int GetSU(int project) {
            var Role = User.Claims.FirstOrDefault(c => c.Type == "roles").Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId").Value;
            if(Role == "execution") {
                var Total = _db.Project.Where(p => p.status == 20 || p.status == 31)
                                .Where(p => p.sub_inisiasi_id == 4)
                                .Where(p => p.user_id ==  int.Parse(UserId))
                                .Count();
                return 100 * Total / project;
            } else {
                var Discipline = 0;
                var DisciplineEI = 0;
                if(Role == "execution_spv_rotating") {
                    Discipline = 4;
                } else if (Role == "execution_spv_mekanik") {
                    Discipline = 2;
                } else if (Role == "execution_spv_sipil") {
                    Discipline = 5;
                } else if (Role == "execution_spv_ei") {
                    DisciplineEI = 13;
                }
                var Total = _db.Project
                    .Where(p => p.status == 20 || p.status == 31)
                    .Where(p => p.sub_inisiasi_id == 4)
                    .Join(
                        _db.Users, 
                        pro => pro.user_id,
                        usr => usr.id,
                        (pro, usr) => new {
                            DisciplineId = usr.discipline_id
                        }
                    );
                    if(DisciplineEI == 13) {
                        Total = Total.Where(t => t.DisciplineId == 1 || t.DisciplineId == 3);
                    } else {
                        Total = Total.Where(t => t.DisciplineId == Discipline);
                    }
                return 100 * Total.Count() / project;
            }
        }

        public int GetNonRKAP(int project) {
            var Role = User.Claims.FirstOrDefault(c => c.Type == "roles").Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId").Value;
            if(Role == "execution") {
                var Total = _db.Project.Where(p => p.status == 20 || p.status == 31)
                                .Where(p => p.sub_inisiasi_id == 5)
                                .Where(p => p.user_id ==  int.Parse(UserId))
                                .Count();
                return 100 * Total / project;
            } else {
                var Discipline = 0;
                var DisciplineEI = 0;
                if(Role == "execution_spv_rotating") {
                    Discipline = 4;
                } else if (Role == "execution_spv_mekanik") {
                    Discipline = 2;
                } else if (Role == "execution_spv_sipil") {
                    Discipline = 5;
                } else if (Role == "execution_spv_ei") {
                    DisciplineEI = 13;
                }
                var Total = _db.Project
                    .Where(p => p.status == 20 || p.status == 31)
                    .Where(p => p.sub_inisiasi_id == 5)
                    .Join(
                        _db.Users, 
                        pro => pro.user_id,
                        usr => usr.id,
                        (pro, usr) => new {
                            DisciplineId = usr.discipline_id
                        }
                    );
                    if(DisciplineEI == 13) {
                        Total = Total.Where(t => t.DisciplineId == 1 || t.DisciplineId == 3);
                    } else {
                        Total = Total.Where(t => t.DisciplineId == Discipline);
                    }
                return 100 * Total.Count() / project;
            }
        }

        public List<Project> GetNewProject() {
            var Role = User.Claims.FirstOrDefault(c => c.Type == "roles").Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId").Value;
            if(Role == "execution") {
                var Project = _db.Project.Where(p => p.status == 22 || p.status == 30)
                                .Where(p => p.user_id ==  int.Parse(UserId))
                                .Take(10).ToList();
                return Project;
            } else {
                List<Project> list = new List<Project>();
                var Discipline = 0;
                var DisciplineEI = 0;
                if(Role == "execution_spv_rotating") {
                    Discipline = 4;
                } else if (Role == "execution_spv_mekanik") {
                    Discipline = 2;
                } else if (Role == "execution_spv_sipil") {
                    Discipline = 5;
                } else if (Role == "execution_spv_ei") {
                    DisciplineEI = 13;
                }
                var Project = _db.Project
                    .Where(p => p.status == 22 || p.status == 30)
                    .Join(
                        _db.Users, 
                        pro => pro.user_id,
                        usr => usr.id,
                        (pro, usr) => new {
                            DisciplineId = usr.discipline_id,
                            start_date = pro.start_date,
                            description = pro.description
                        }
                    );
                    if(DisciplineEI == 13) {
                        Project = Project.Where(t => t.DisciplineId == 1 || t.DisciplineId == 3).Take(10);
                    } else {
                        Project = Project.Where(t => t.DisciplineId == Discipline).Take(10);
                    }
                // return Project.Select(p => new {p.start_date, p.description}).ToList();
                return Project.Select(p => new Project() {
                        start_date = p.start_date,
                        description = p.description
                    }).ToList();
            }
        }

        public List<Project> GetProgressTagihan() {
            var Role = User.Claims.FirstOrDefault(c => c.Type == "roles").Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId").Value;
            if(Role == "execution") {
                var Project = _db.Project
                .Where(p => p.status == 22 || p.status == 23 || p.status == 30 || p.status == 31)
                .Where(p => p.user_id ==  int.Parse(UserId))
                .Take(10).ToList();
                return Project;
            } else {
                List<Project> list = new List<Project>();
                var Discipline = 0;
                var DisciplineEI = 0;
                if(Role == "execution_spv_rotating") {
                    Discipline = 4;
                } else if (Role == "execution_spv_mekanik") {
                    Discipline = 2;
                } else if (Role == "execution_spv_sipil") {
                    Discipline = 5;
                } else if (Role == "execution_spv_ei") {
                    DisciplineEI = 13;
                }
                var Project = _db.Project
                    .Where(p => p.status == 22 || p.status == 23 || p.status == 30 || p.status == 31)
                    .Join(
                        _db.Users, 
                        pro => pro.user_id,
                        usr => usr.id,
                        (pro, usr) => new {
                            DisciplineId = usr.discipline_id,
                            start_date = pro.start_date,
                            description = pro.description
                        }
                    );
                    if(DisciplineEI == 13) {
                        Project = Project.Where(t => t.DisciplineId == 1 || t.DisciplineId == 3);
                    } else {
                        Project = Project.Where(t => t.DisciplineId == Discipline);
                    }
                return Project.Select(p => new Project() {
                        start_date = p.start_date,
                        description = p.description
                    }).Take(10).ToList();
            }    
        }



    }
}
