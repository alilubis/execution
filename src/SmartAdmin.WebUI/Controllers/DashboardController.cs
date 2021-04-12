using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SmartAdmin.WebUI.Models;
using System.Linq;

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
            var AllProject = _db.Project.Count();

            ViewBag.Active = _db.Project.Where(p => p.status == 22 || p.status == 30).Count();
            ViewBag.Finish = _db.Project.Where(p => p.status == 23).Count();
            ViewBag.FinishTagihan = _db.Project.Where(p => p.status == 31).Count();

            ViewBag.NewProject = _db.Project
                .Where(p => p.status == 22 || p.status == 30)
                .Take(10).ToList();
            ViewBag.ProgressTagihan = _db.Project
                .Where(p => p.status == 22 || p.status == 23 || p.status == 30 || p.status == 31).Take(10)
                .ToList();

            var TotalRKU = _db.Project.Where(p => p.status == 20 || p.status == 31)
                            .Where(p => p.sub_inisiasi_id == 1).Count();
            var TotalRKAP = _db.Project.Where(p => p.status == 20 || p.status == 31)
                            .Where(p => p.sub_inisiasi_id == 2).Count();
            var TotalMOC = _db.Project.Where(p => p.status == 20 || p.status == 31)
                        .Where(p => p.sub_inisiasi_id == 3).Count();
            var TotalSU = _db.Project.Where(p => p.status == 20 || p.status == 31)
                        .Where(p => p.sub_inisiasi_id == 4).Count();
            var TotalNonRKAP = _db.Project.Where(p => p.status == 20 || p.status == 31)
                        .Where(p => p.sub_inisiasi_id == 5).Count();
                        
            ViewBag.RKU = 100 * TotalRKU / AllProject;
            ViewBag.RKAP = 100 * TotalRKAP / AllProject;
            ViewBag.MOC = 100 * TotalMOC / AllProject;
            ViewBag.SU = 100 * TotalSU / AllProject;
            ViewBag.NonRKAP = 100 * TotalNonRKAP / AllProject;

            return View();
        }
    }
}
