using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace SmartAdmin.WebUI.Models
{
    public class FileInputModel
    {
        public IFormFile FileToUpload { get; set; }
        public IFormFile FileToUploadPunchList { get; set; }
        public IFormFile FileToUploadBastpOne { get; set; }
        public IFormFile FileToUploadBastpTwo { get; set; }
        public IFormFile FileToUploadLaporan { get; set; }
        // public string FileId { get; set; }
        public int TerminId { get; set; }
        public int ProjectId { get; set; }
        // public DateTime FileDate { get; set; }
        // public long FileSize { get; set; }
        // public string FileSizeResult { get; set; }
        // public string FileName { get; set; }
        // public string FileUrl { get; set; }
        // public string FileType { get; set; }
        // public string TypeFile { get; set; }
        public IEnumerable<FileInputModel> FileList { get; set; }
    }
}
