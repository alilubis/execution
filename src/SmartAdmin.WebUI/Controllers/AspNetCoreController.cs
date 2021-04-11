using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
//sing RoleBasedAuthorization;

namespace SmartAdmin.WebUI.Controllers
{
    //[CustomAuthorize]
    public class AspNetCoreController : Controller
    {
        [Authorize]
        public ActionResult Welcome()
        {
            return View();
        }
        [Authorize(Roles = "Supervisor")] 
        public ActionResult Supervisor()
        {
            return View();
        }
        [Authorize(Roles = "Planner")]
        public ActionResult Planner()
        {
            return View();
        }
    }
}
