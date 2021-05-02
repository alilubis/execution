using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartAdmin.WebUI.Models;

namespace SmartAdmin.WebUI.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
        private readonly ExecutionContext _context;
        public AccountController(ExecutionContext context)
        {
            _context = context;
        }
        public ActionResult Validate(Users user)
        {
            // return Json(new { status = true, message = "Welcome" });
            var _user = _context.Users
            .Where(s => s.email == user.email)
            .Where(s => s.role == "execution" || s.role == "execution_spv_rotating" || s.role == "execution_spv_mekanik" || s.role == "execution_spv_sipil" || s.role == "execution_spv_ei")
            .SingleOrDefault();
            if (_user != null)
            {
                if (_user.password == user.password)
                {
                    var userClaims = new List<Claim>()
                    {
                        new Claim("UserName", _user.name),
                        new Claim(ClaimTypes.Name, _user.name),
                        new Claim(ClaimTypes.Email, _user.email),
                        new Claim("ma", Convert.ToString(_user.maintenance_area_id)),
                        // new Claim("ma", Convert.ToString(_user.maintenance_area_id)),
                        new Claim("roles", _user.role),
                        new Claim("UserId", Convert.ToString(_user.id)),
                        new Claim(ClaimTypes.Role, _user.role)
                    };
                    var userIdentity = new ClaimsIdentity(userClaims, "User Identity");
                    var userPrincipal = new ClaimsPrincipal(new[] { userIdentity });
                    HttpContext.SignInAsync(userPrincipal);
                    return Json(new { status = true, message = "Login Sukses !" });
                }
                else
                {
                    return Json(new { status = false, message = "Password Tidak Sesuai!" });
                }
            }
            else
            {
                return Json(new { status = false, message = "Email Tidak Sesuai!" });
            }
        }
        public ActionResult AccessDenied()
        {
            return View();
        }
        public ActionResult Logout()
        {
            HttpContext.SignOutAsync();
            return RedirectToAction("Login", "Account");
        }
    }
}
