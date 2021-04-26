var tableTagihan;
var qparams = window.location.search;
var params = qparams.split('?id=')[1];
var id = (params == undefined || params == "" ? undefined : JSON.parse(unescape(params)));

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
                return '<span class="badge badge-success">Complete</span>';
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
                return '<a href="" class="btn btn-primary btn-xs waves-effect waves-themed"><i class="fal fa-file-alt"></i> Dokumen</a> '+
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