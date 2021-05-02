var tableTagihan;
var qparams = window.location.search;
var params = qparams.split('?id=')[1];
var id = (params == undefined || params == "" ? undefined : JSON.parse(unescape(params)));
var TerminID = 0;
$(document).ready( function () {
    

    tableTagihan = $('#dt-basic-tagihan').DataTable({
        "lengthChange": false,
        "searching": true,
        "zeroRecords":    "No matching records found",
        "paginate": {
            "first":      "First",
            "last":       "Last",
            "next":       "Next",
            "previous":   "Previous"
        },
        "ajax" : {
            "url" : "/workspace/gettagihan?id="+id,
            "type" : "GET",
            "datatype" : "json"
        },
        createdRow: function(row, data, rowIndex) {
            $.each($('td', row), function(colIndex) {
                if(colIndex == 1) {
                    $(this).attr('data-name', 'termin_title');
                    $(this).attr('class', 'termin_title');
                    $(this).attr('data-type', 'text');
                    $(this).attr('data-pk', data.id);
                }
                if(colIndex == 2) {
                    $(this).attr('data-name', 'tanggal_penagihan');
                    $(this).attr('class', 'tanggal_penagihan');
                    $(this).attr('data-type', 'date');
                    $(this).attr('data-viewformat', 'dd/mm/yyyy');
                    $(this).attr('data-pk', data.id);
                }
                if(colIndex == 3) {
                    $(this).attr('data-name', 'sa_number');
                    $(this).attr('class', 'sa_number');
                    $(this).attr('data-type', 'number');
                    $(this).attr('data-pk', data.id);
                }
                if(colIndex == 4) {
                    $(this).attr('data-name', 'value');
                    $(this).attr('class', 'value');
                    $(this).attr('data-type', 'number');
                    $(this).attr('data-pk', data.id);
                }
                if(colIndex == 5) {
                    $(this).attr('data-name', 'percentage');
                    $(this).attr('class', 'percentage');
                    $(this).attr('data-type', 'number');
                    $(this).attr('data-pk', data.id);
                }
            })
        },
        "columns" : [
            { data: function(data) {
                if(data.status_document == 1) {
                    return '<span class="badge badge-success">Complete</span>';
                } else {
                    return '<span class="badge badge-warning text-white">In Progress</span>';
                }
            }},
            { data: 'title', searchable: false, orderable: false },
            { data: function(data) {
                return moment(data.billing_date).format("DD/MM/YYYY");
            }},
            { data: 'sa_number', searchable: false, orderable: false },
            { data: function(data) {
                return 'Rp '+formatNumber(data.value);
            }},
            { data: function(data) {
                return data.percentage + ' %';
            }},
            { data: function(data) {
                return '<a href="javascript:void(0)" class="btn btn-primary termin-document btn-xs waves-effect waves-themed" data-title="'+data.title+'" data-termin="'+data.id+'"><i class="fal fa-file-alt"></i> Dokumen</a> '+
                '<a href="javascript:void(0)" onclick=deleted(\'/workspace/deletetermin?id='+data.id+'&project='+id+'\') class="btn btn-danger btn-xs waves-effect waves-themed"><i class="fal fa-trash"></i> Hapus</a>';
                // '<a href="" class="btn btn-danger btn-xs waves-effect waves-themed"><i class="fal fa-trash"></i> Hapus</a>';
            }}
        ],
        scrollX: true,
        order: [],
        // order: [[3, "desc"]],
        columnDefs: [
            { orderable: false, targets: [0, 2, 5, 6] },
            // { visible: false, targets: [3, 4, 5, 6, 7, 8, 14] },
            // { targets: 0, searchable: false, orderable: false, data: null, render: function (data, type, full, meta) {
            //     return meta.settings._iDisplayStart + meta.row + 1;
            // }}
        ],
    }); 
});


// $(".btn-submit-termin").on("click",function(e){
//     e.preventDefault();
//     var project_id = $("[name=project_id]").val();
//     var title = $("[name=title]").val();
//     var billing_date = $("[name=billing_date]").val();
//     var sa_number = $("[name=sa_number]").val();
//     var value = $("[name=value]").val();
//     var percentage = $("[name=percentage]").val();
//     let error = false

//     if(_.isEmpty(title) || _.isUndefined(title)){
//         error = true;
//         $(".error-title").html("Termin harus diisi !")
//     }
//     if(_.isEmpty(billing_date) || _.isUndefined(billing_date)){
//         error = true;
//         $(".error-billing").html("Tanggal harus diisi..!")
//     }
//     if(_.isEmpty(sa_number) || _.isUndefined(sa_number)){
//         error = true;
//         $(".error-number").html("Nomor SA harus diisi..!")
//     }
//     if(_.isEmpty(value) || _.isUndefined(value)){
//         error = true;
//         $(".error-value").html("Nilai harus diisi..!")
//     }
//     if(_.isEmpty(percentage) || _.isUndefined(percentage)){
//         error = true;
//         $(".error-percentage").html("Persentase harus diisi..!")
//     }
    
//     if(!error){
//         var parameter = {
//             id : project_id,
//             title : title,
//             billing_date : billing_date,
//             sa_number : sa_number,
//             value : value,
//             percentage : percentage
//         }
//         $(".btn-submit-termin").attr("disabled",true);
//         $(".btn-submit-termin").text("");
//         $(".btn-submit-termin").append('<i class="fal fa-sync-alt fa-spinfal fa-spinner"></i> Loading to save...');
//         // $(".btn-submit-termin").append('<i class="fal fa-spinner"></i> Loading to save...');
//         $.ajax({
//             type : "POST",
//             url : "/workspace/addtermin",
//             dataType : "JSON",
//             data : parameter,
//             success : function(response){
//                 $(".btn-submit-termin").attr("disabled",false);
//                 if(response.success){
//                     $("#terminform")[0].reset();
//                     tableTagihan.ajax.reload();
//                     toastr.success(response.message);
//                     $('#termin-modal').modal('toggle');
//                     $('.nilai-tagihan').html(currencyFormat(response.data));
//                     $('.js-easy-pie-chart').data('easyPieChart').update(response.percentage);
//                     $('.js-percent').html(response.percentage);
//                     console.log(response.percentage);
//                     $(".error-title").html("");
//                     $(".error-billing").html("");
//                     $(".error-number").html("");
//                     $(".error-value").html("");
//                     $(".error-percentage").html("");

//                 }else{
//                     toastr.error(response.message);
//                 }
//                 $(".btn-submit-termin").html('Submit');
//             }, error : function(err){
//                 $(".btn-submit-termin").attr("disabled",false);
//                 toastr.error("Internal Server Error !")
//             }
//         })
//     }
// });

$('#dt-basic-tagihan').editable({
    url:'/workspace/updatetermin',
    container:'body',
    selector:'td.termin_title',
    type:'POST',
    validate:function(value){
        if($.trim(value) == '')
        {
            return 'This field is required';
        }
    }
});
$('#dt-basic-tagihan').editable({
    url:'/workspace/updatetermin',
    container:'body',
    selector:'td.tanggal_penagihan',
    type:'POST',
    validate:function(value){
        if($.trim(value) == '')
        {
            return 'This field is required';
        }
    }
});
$('#dt-basic-tagihan').editable({
    url:'/workspace/updatetermin',
    container:'body',
    selector:'td.sa_number',
    type:'POST',
    validate:function(value){
        if($.trim(value) == '')
        {
            return 'This field is required';
        }
    }
});
$('#dt-basic-tagihan').editable({
    url:'/workspace/updatetermin',
    container:'body',
    selector:'td.value',
    type:'POST',
    validate:function(value){
        if($.trim(value) == '')
        {
            return 'This field is required';
        }
    },
    success: function(response, newValue) {
        $('.nilai-tagihan').html(currencyFormat(response.data));
        $('.js-easy-pie-chart').data('easyPieChart').update(response.percentage);
        $('.js-percent').html(response.percentage);
        tableTagihan.ajax.reload();
    }
});
$('#dt-basic-tagihan').editable({
    url:'/workspace/updatetermin',
    container:'body',
    selector:'td.percentage',
    type:'POST',
    validate:function(value){
        if($.trim(value) == '')
        {
            return 'This field is required';
        }
    },
    success: function(response, newValue) {
        $('.nilai-tagihan').html(currencyFormat(response.data));
        $('.js-easy-pie-chart').data('easyPieChart').update(response.percentage);
        $('.js-percent').html(response.percentage);
        tableTagihan.ajax.reload();
    }
});

$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
    $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
} );
function addtermin() {
    var parameter = {
        id : id
    }
    $.ajax({
        type : "POST",
        url : "/workspace/addtermin",
        dataType : "JSON",
        data : parameter,
        success : function(response){
            if(response.success){
                tableTagihan.ajax.reload();
                toastr.success(response.message);
                $('.nilai-tagihan').html(currencyFormat(response.data));
                $('.js-easy-pie-chart').data('easyPieChart').update(response.percentage);
                $('.js-percent').html(response.percentage);
            }else{
                toastr.error(response.message);
            }
        }, error : function(err){
            toastr.error("Internal Server Error !")
        }
    })
}


$(".btn-submit-jumlah-termin").on("click",function(e){
    e.preventDefault();
    var project_id = $("[name=project_id]").val();
    var jumlah = $("[name=jumlah]").val();
    let error = false

    if(_.isEmpty(jumlah) || _.isUndefined(jumlah)){
        error = true;
        $(".error-jumlah-termin").html("Jumlah termin harus diisi..!")
    }
    
    if(!error){
        var parameter = {
            id : project_id,
            jumlah : jumlah
        }
        $(".btn-submit-jumlah-termin").attr("disabled",true);
        $(".btn-submit-jumlah-termin").text("");
        $(".btn-submit-jumlah-termin").append('<i class="fal fa-sync-alt fa-spinfal fa-spinner"></i> Loading to save...');
        $.ajax({
            type : "POST",
            url : "/workspace/jumlahtermin",
            dataType : "JSON",
            data : parameter,
            success : function(response){
                $(".btn-submit-jumlah-termin").attr("disabled",false);
                if(response.success){
                    $("#jumlahterminform")[0].reset();
                    toastr.success(response.message);
                    $('#jumlah-termin-modal').modal('toggle');
                    $('.jumlah-termin').html(jumlah);
                    $(".error-jumlah-termin").html("");
                    
                }else{
                    toastr.error(response.message);
                }
                $(".btn-submit-jumlah-termin").html('Submit');
            }, error : function(err){
                $(".btn-submit-jumlah-termin").attr("disabled",false);
                toastr.error("Internal Server Error !")
            }
        })
    }
});

$(document).on('click', '.termin-document', function () {
    var title = $(this).data('title');
    $('.termin-title').html(title);
    TerminID = $(this).data('termin');
    $.get('workspace/gettermindocument?id='+TerminID, function (obj) {
        var punchList = (obj.data != null ? obj.data.punchlist : null);
        var bastpOne = (obj.data != null ? obj.data.bastp_one : null);
        var bastpTwo = (obj.data != null ? obj.data.bastp_two : null);
        var jobReport = (obj.data != null ? obj.data.job_progress_report : null);
console.log(obj);
        if(punchList != null) {
            $('.punchListInput').addClass('d-none').removeClass('d-block');
            $('.punchListFile').addClass('d-block').removeClass('d-none');
            $('.punchListFile small').html(punchList);
            $('.punchListFile a.view').attr('onclick', 'FilePreview(\''+punchList+'\', \''+fileType(punchList)+'\', \'punchlist\')');
            $('.punchListFile a.download').attr('onclick', 'FileDownload(\''+punchList+'\', \''+fileType(punchList)+'\', \'punchlist\', \''+title+'\')');
            $('.punchListFile a.delete').attr('onclick', 'deleteFile('+TerminID+',\'punchlist\', \''+punchList+'\')');
        } else {
            $('.punchListInput').addClass('d-block').removeClass('d-none');
            $('.punchListFile').addClass('d-none').removeClass('d-block');
        }
        if(bastpOne != null) {
            $('.bastpOneInput').addClass('d-none').removeClass('d-block');
            $('.bastpOneFile').addClass('d-block').removeClass('d-none');
            $('.bastpOneFile small').html(bastpOne);
            $('.bastpOneFile a.view').attr('onclick', 'FilePreview(\''+bastpOne+'\', \''+fileType(bastpOne)+'\', \'bastpone\')');
            $('.bastpOneFile a.download').attr('onclick', 'FileDownload(\''+bastpOne+'\', \''+fileType(bastpOne)+'\', \'bastpone\', \''+title+'\')');
            $('.bastpOneFile a.delete').attr('onclick', 'deleteFile('+TerminID+',\'bastpone\', \''+bastpOne+'\')');
        } else {
            $('.bastpOneInput').addClass('d-block').removeClass('d-none');
            $('.bastpOneFile').addClass('d-none').removeClass('d-block');
        }
        if(bastpTwo != null) {
            $('.bastpTwoInput').addClass('d-none').removeClass('d-block');
            $('.bastpTwoFile').addClass('d-block').removeClass('d-none');
            $('.bastpTwoFile small').html(bastpTwo);
            $('.bastpTwoFile a.view').attr('onclick', 'FilePreview(\''+bastpTwo+'\', \''+fileType(bastpTwo)+'\', \'bastptwo\')');
            $('.bastpTwoFile a.download').attr('onclick', 'FileDownload(\''+bastpTwo+'\', \''+fileType(bastpTwo)+'\', \'bastptwo\', \''+title+'\')');
            $('.bastpTwoFile a.delete').attr('onclick', 'deleteFile('+TerminID+',\'bastptwo\', \''+bastpTwo+'\')');
        } else {
            $('.bastpTwoInput').addClass('d-block').removeClass('d-none');
            $('.bastpTwoFile').addClass('d-none').removeClass('d-block');
        }
        if(jobReport != null) {
            $('.jobReportInput').addClass('d-none').removeClass('d-block');
            $('.jobReportFile').addClass('d-block').removeClass('d-none');
            $('.jobReportFile small').html(jobReport);
            $('.jobReportFile a.view').attr('onclick', 'FilePreview(\''+jobReport+'\', \''+fileType(jobReport)+'\', \'jobreport\')');
            $('.jobReportFile a.download').attr('onclick', 'FileDownload(\''+jobReport+'\', \''+fileType(jobReport)+'\', \'jobreport\', \''+title+'\')');
            $('.jobReportFile a.delete').attr('onclick', 'deleteFile('+TerminID+',\'jobreport\', \''+jobReport+'\')');
        } else {
            $('.bastpTwoInput').addClass('d-block').removeClass('d-none');
            $('.bastpTwoFile').addClass('d-none').removeClass('d-block');
        }
    });
    $('.document-modal').modal('show');
});

function fileType(filename) {
    if (filename.endsWith(".pdf")) {
        return "application/pdf";
    } else if (filename.endsWith(".doc")) {
        return "application/msword";
    } else if (filename.endsWith(".docx")) {
        return "application/msword";
    } else if (filename.endsWith(".xls")) {
        return "application/vnd.ms-excel";
    } else if (filename.endsWith(".xlsx")) {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
}

function subtitle(name) {
    if(name == 'punchlist') {
        return 'DOKUMEN PUNCHLIST';
    } else if(name == 'bastp_one') {
        return 'BASTP 1';
    } else if(name == 'bastp_two') {
        return 'BASTP 2';
    } else if(name == 'job_progress_report') {
        return 'LAPORAN KEMAJUAN PEKERJAAN';
    }
}
function viewFile(termin, column) {
    console.log('view : '+termin+', column : '+column);
}

const { degrees, PDFDocument, rgb, Grayscale, StandardFonts } = PDFLib
const base_url = window.location.origin;
const pngUrl = base_url + '/img/rahasia.png';
const pathArray = window.location.pathname.split('/');
const pathControl = pathArray[1];
const loading = '<div class="col-lg-12 mt-5"><div class="spinner-border text-success load-file" style="width: 5rem; height: 5rem; margin:auto;" role="status"><span class="sr-only">Loading...</span></div></div>' +
    '<div class="col-lg-12 text-center mt-3"><span class="text-muted">Harap menunggu, berkas sedang di proses....</span></div>';


async function FileDownload(FileName, TypeFile, ColumnName, TerminTitle) {
    const downloded = new Date();
    const date = moment(downloded.toString()).format("DD-MM-YYYY");
    const time = moment(downloded.toString()).format("hhmm");
    if (TypeFile == "application/pdf") {
        const existingPdfBytes = await fetch(base_url + '/' + pathControl + '/ViewFile?filename=' + FileName).then(res => res.arrayBuffer());
        const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        console.log(existingPdfBytes);
        const pngImage = await pdfDoc.embedPng(pngImageBytes);
        const pngDims = pngImage.scale(0.75);

        const pages = pdfDoc.getPages()
        pages.map((x) => {
            x.drawImage(pngImage, {
                x: x.getWidth() / 2 - 200,
                y: x.getHeight() / 2 - 100,
                width: pngDims.width,
                height: pngDims.height
            });
        });
        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, `${TerminTitle}_${subtitle(ColumnName)}.pdf`, "application/pdf");
    } else {
        const downloadFile = `${TerminTitle}_${subtitle(ColumnName)}`;
        const blobFile = await fetch(base_url + '/' + pathControl + '/ViewFile?filename=' + FileName).then(res => res.blob());
        let reader = new FileReader();
        reader.readAsDataURL(blobFile);
        reader.onload = function() {
            const a = document.createElement("a");
            a.style.display = "none";
            document.body.appendChild(a);
            a.href = reader.result;

            if (TypeFile == "application/msword") {
                a.setAttribute("download", downloadFile + ".doc");
            } else if (TypeFile == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                a.setAttribute("download", downloadFile + ".docx");
            } else if (TypeFile == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                a.setAttribute("download", downloadFile + ".xlsx");
            } else if (TypeFile == "application/vnd.ms-excel") {
                a.setAttribute("download", downloadFile + ".xls");
            } else {
                toastr.error("Proses pengunduhan gagal disebabkan tipe file tidak disupport !")
            }
            a.click();
            window.URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
        }
    }
}


async function FilePreview(FileName, TypeFile, ColumnName) {
    const fileUrl = base_url + '/' + pathControl + '/ViewFile?filename=' + FileName;
    if (TypeFile == "application/pdf") {
        $("#modal-preview").modal("show");
        $("#filename").html(subtitle(ColumnName));
        $("#preview-files").html(loading);
        const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
        const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pngImage = await pdfDoc.embedPng(pngImageBytes);
        const pngDims = pngImage.scale(0.75);

        const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);
        const downloded = new Date();
        const date = moment(downloded.toString()).format("DD-MM-YYYY");
        const time = moment(downloded.toString()).format("hh:mm");
        const fontSize = 8;

        const pages = pdfDoc.getPages();
        pages.map((x) => {
            const { width, height } = x.getSize();
            x.drawImage(pngImage, {
                x: x.getWidth() / 2 - 200,
                y: x.getHeight() / 2 - 100,
                width: pngDims.width,
                height: pngDims.height
            });
            // x.drawText(`Didownload oleh - ${user} tanggal ${date} jam ${time}`, {
            //     x: 35,
            //     y: height - 765,
            //     font: courierFont,
            //     size: fontSize,
            //     color: rgb(1, 0, 0)
            // });
        });
        const pdfBytes = await pdfDoc.saveAsBase64();
        var element = "<div class='embed-responsive embed-responsive-16by9'>" +
            "<iframe id='iframe-pdf' src='data:application/pdf;base64," + pdfBytes + "' class='embed-responsive-item' frameborder='0' height='300' allowfullscreen='true'></iframe>" +
            "</div>";
        $("#preview-files").html(element);
    } else {
        toastr.warning("Tipe berkas tidak disupport untuk ditinjau, silahkan unduh berkas...!");
    }
}

// async function downloadFile(FileName, FileType, user, TypeFile) {
// function downloadFile(termin, column, file) {
    
// }

function deleteFile(termin, column, file) {
    let data = {
        terminId : termin, 
        columnName : column, 
        fileName : file
    }
    $.ajax({
        type: "POST",
        url: "/Workspace/DeleteFile",
        data: data,
        dataType: "json",
        success: function(response) {
            // console.log(response)
            if (response.success) {
                // $(".document-modal").modal("hide");
                toastr.success(response.message);
                $('.punchListInput').removeClass('d-none').addClass('d-block');
                $('.punchListFile').removeClass('d-block').addClass('d-none');

                $('.bastpOneInput').removeClass('d-none').addClass('d-block');
                $('.bastpOneFile').removeClass('d-block').addClass('d-none');

                $('.bastpTwoInput').removeClass('d-none').addClass('d-block');
                $('.bastpTwoFile').removeClass('d-block').addClass('d-none');
                
                $('.jobReportInput').removeClass('d-none').addClass('d-block');
                $('.jobReportFile').removeClass('d-block').addClass('d-none');

                $(".document-modal").modal("hide");
                // $(".btn-submit-document").html("Unggah").attr("disabled", false);
            } else {
                toastr.error(response.message);
                // $(".error-message-bastpone").html(response.message);
            }
        },
        error: function(err) {
            $(".btn-submit-document").html("Unggah").attr("disabled", false);
            toastr.error("Gagal mengunggah berkas...<br/>Silahkan periksa koneksi internet anda.. !");
            // $(".error-message-bastpone").addClass("text-danger").html("Gagal menggunggah berkas.. !");
        }
    })
}

$(".document-modal").on("hidden.bs.modal", function(e) {
    $("#InputPunchList").val("");
    $("#InputBastpOne").val("");
    $("#InputJobReport").val("");
    $("#InputBastpTwo").val("");

    uploaded.FileToUploadPunchList=null;
    uploaded.FileToUploadBastpOne=null;
    uploaded.FileToUploadBastpTwo=null;
    uploaded.FileToUploadLaporan=null;

    $(".custom-file-label").html("Choose file");
    
    $(".error-message-punchlist").removeClass("text-danger").html("<b>Catatan : </b> Berkas hanya bertipe (.pdf, .doc, .docx, .xls, .xlsx)");
    $(".error-message-bastpone").removeClass("text-danger").html("<b>Catatan : </b> Berkas hanya bertipe (.pdf, .doc, .docx, .xls, .xlsx)");
    $(".error-message-bastptwo").removeClass("text-danger").html("<b>Catatan : </b> Berkas hanya bertipe (.pdf, .doc, .docx, .xls, .xlsx)");
    $(".error-message-report").removeClass("text-danger").html("<b>Catatan : </b> Berkas hanya bertipe (.pdf, .doc, .docx, .xls, .xlsx)");
});

let uploaded = {
    ProjectId: id,
    TerminId: 0,
    FileToUploadPunchList: null,
    FileToUploadBastpOne: null,
    FileToUploadBastpTwo: null,
    FileToUploadLaporan: null,
};

$("#InputPunchList").on("change", function(e) {
    // console.log(uploaded)
    let files = e.target.files[0];
    // console.log(files);
    if (files) {
        $(".error-message-punchlist").removeClass("text-danger").html("<b>Catatan : </b> Berkas hanya bertipe (.pdf, .doc, .docx, .xls, .xlsx)");
        if (
            files.type == "application/pdf" ||
            files.type == "application/msword" ||
            files.type == "application/vnd.ms-excel" ||
            files.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            files.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            $(".btn-submit-document").attr("disabled", false);
            uploaded.TerminId = TerminID;
            uploaded.FileToUploadPunchList = files;
        } else {
            $(".error-message-punchlist").addClass("text-danger").html("Harap perhatikan tipe berkas yang anda upload..!");
        }
    } else {
        $(".btn-submit-document").attr("disabled", true);
    }
});

 //BastpOne
$("#InputBastpOne").on("change", function(e) {
    let files = e.target.files[0];
    // console.log(files);
    if (files) {
        $(".error-message-bastpone").removeClass("text-danger").html("<b>Catatan : </b> Berkas hanya bertipe (.pdf, .jpg, .png, .doc, .docx, .xls, .xlsx, .ppt, .pptx)");
        if (
            files.type == "application/pdf" ||
            files.type == "application/msword" ||
            files.type == "application/vnd.ms-excel" ||
            files.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            files.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            $(".btn-submit-document").attr("disabled", false);
            uploaded.TerminId = TerminID;
            uploaded.FileToUploadBastpOne = files;
        } else {
            $(".error-message-bastpone").addClass("text-danger").html("Harap perhatikan tipe berkas yang anda upload..!");
        }
    } else {
        $(".btn-submit-document").attr("disabled", true);
    }
});
// BastpOne


// BastpTwo
$("#InputBastpTwo").on("change", function(e) {
    let files = e.target.files[0];
    // console.log(files);
    if (files) {
        $(".error-message-bastptwo").removeClass("text-danger").html("<b>Catatan : </b> Berkas hanya bertipe (.pdf, .jpg, .png, .doc, .docx, .xls, .xlsx, .ppt, .pptx)");
        if (
            files.type == "application/pdf" ||
            files.type == "application/msword" ||
            files.type == "application/vnd.ms-excel" ||
            files.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            files.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            $(".btn-submit-document").attr("disabled", false);
            uploaded.TerminId = TerminID;
            uploaded.FileToUploadBastpTwo = files;
        } else {
            $(".error-message-bastptwo").addClass("text-danger").html("Harap perhatikan tipe berkas yang anda upload..!");
        }
    } else {
        $(".btn-submit-document").attr("disabled", true);
    }
});
// BastpTwo

// Laporan
$("#InputJobReport").on("change", function(e) {
    let files = e.target.files[0];
    // console.log(files);
    if (files) {
        $(".error-message-report").removeClass("text-danger").html("<b>Catatan : </b> Berkas hanya bertipe (.pdf, .jpg, .png, .doc, .docx, .xls, .xlsx, .ppt, .pptx)");
        if (
            files.type == "application/pdf" ||
            files.type == "application/msword" ||
            files.type == "application/vnd.ms-excel" ||
            files.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            files.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            $(".btn-submit-document").attr("disabled", false);
            uploaded.TerminId = TerminID;
            uploaded.FileToUploadLaporan = files;
        } else {
            $(".error-message-report").addClass("text-danger").html("Harap perhatikan tipe berkas yang anda upload..!");
        }
    } else {
        $(".btn-submit-document").attr("disabled", true);
    }
});
// Laporan

$("#formUpload").submit(function(e) {
    e.preventDefault();
    var formData = new FormData();
    formData.append("ProjectId", uploaded.ProjectId);
    formData.append("TerminId", uploaded.TerminId);
    formData.append("FileToUploadPunchList", uploaded.FileToUploadPunchList);
    formData.append("FileToUploadBastpOne", uploaded.FileToUploadBastpOne);
    formData.append("FileToUploadBastpTwo", uploaded.FileToUploadBastpTwo);
    formData.append("FileToUploadLaporan", uploaded.FileToUploadLaporan);
    $.ajax({
        type: "POST",
        url: "/Workspace/UploadFile",
        data: formData,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function(response) {
            // console.log(response)
            if (response.success) {
                uploaded.FileToUploadPunchList=null;
                uploaded.FileToUploadBastpOne=null;
                uploaded.FileToUploadBastpTwo=null;
                uploaded.FileToUploadLaporan=null;
                $(".document-modal").modal("hide");
                toastr.success(response.message);
                $(".btn-submit-document").html("Submit").attr("disabled", false);
                tableTagihan.ajax.reload();
            } else {
                toastr.error(response.message);
            }
        },
        error: function(err) {
            $(".btn-submit-document").html("Unggah").attr("disabled", false);
            toastr.error("Gagal mengunggah berkas...<br/>Silahkan periksa koneksi internet anda.. !");
            // $(".error-message-bastpone").addClass("text-danger").html("Gagal menggunggah berkas.. !");
        }
    })
});

$(".btn-submit-document").on("click", function() {
    $(this).html("");
    $(this).attr("disabled", true);
    $(this).append("<div class='spinner-border spinner-border-sm' role='status'></div> Loading...");
    $("#formUpload").trigger("submit");
});

function deleted(url){
    Swal.fire({
        title : "Yakin akan dihapus..?",
        text : "Jika dihapus, data tidak dapat dikembalikan..!",
        icon : "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        buttons : true,
        dangerMode : true
    }).then((result) => {
        if(result.value){
            $.ajax({
                type : "DELETE",
                url : url,
                success : function(response){
                    if(response.success){
                        tableTagihan.ajax.reload();
                        toastr.success(response.message);
                        console.log(response.data)
                        $('.nilai-tagihan').html(currencyFormat(response.data));
                        $('.js-easy-pie-chart').data('easyPieChart').update(response.percentage);
                    // $('.js-easy-pie-chart').data('percent', response.percentage);
                    }else{
                        toastr.error(response.message);
                    }
                },
                error : function(err){
                    toastr.error("Internal Server Error !")
                }
            })
        }
    })
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
function currencyFormat(num) {
    return 'Rp' + num.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }