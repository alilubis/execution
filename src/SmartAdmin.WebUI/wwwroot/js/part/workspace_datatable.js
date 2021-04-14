$(document).ready( function () {
    $('#dt-basic-example').DataTable({
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
            "url" : "/workspace/data",
            "type" : "GET",
            "datatype" : "json"
        },
        "columns" : [
            { "data": function(data) {
                if(data.status == 22 || data.status == 30) {
                    return '<span class="badge badge-success">New</span>';
                    /* return '<span class="badge badge-info">In Progress</span>' */
                } else if (data.status == 23) {
                    return '<span class="badge badge-dark">Aktif</span>';
                } else {
                    return '<span class="badge badge-info">In Progress</span>';
                }
            }},
            { "data": function(data) {
                return limitWords(data.description, 4);
            }},
            { "data": function(data) {
                if(data.type == 'jasa') {
                    return 'Jasa/ All In';
                } else {
                    return 'Barang';
                }
            }},
            { "data": function(data) {
                return moment(data.due_date).format("DD/MM/YYYY");
            }},
            { "data": "inisiasi" },
            { "data": function(data) {
                return '-';
            } },
            { "data": function(data) {
                return '-';
            } },
            { "data": function(data) {
                return "<div class='dropdown d-inline-block dropleft'>"+
                "<a href='#' class='btn btn-outline-success btn-icon waves-effect waves-themed btn-sm' data-toggle='dropdown' aria-expanded='true' title='More options'>"+
                    "<i class='fal fa-ellipsis-h'></i>"+
                "</a>"+
                "<div class='dropdown-menu'>"+
                    "<a class='dropdown-item' href=''>Lihat Project</a>"+
                "</div>"+
                "</div>";
            }}
            // return '<a href="javascript:void(0)" onclick=edit(\'/users/edit?id='+data.id+'\') class="btn btn-outline-success btn-sm">Edit</a> '+
            //     '<a href="javascript:void(0)" onclick=editPassword(\'/users/edit?id='+data.id+'\') class="btn btn-outline-info btn-sm">Edit Password</a> '+
            //     '<a href="javascript:void(0)" onclick=deleted(\'/users/delete?id='+data.id+'\') class="btn btn-outline-danger btn-sm">Hapus</a>';
            
        ],
        order: [[3, "desc"]],
        columnDefs: [
            { orderable: false, targets: [0, 1, 6, 7] },
            // { visible: false, targets: [3, 4, 5, 6, 7, 8, 14] }
        ],
        dom: "<'row mb-3'<'col-sm-12 col-md-8 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-4 d-flex align-items-center justify-content-end'B>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [{
            extend: 'colvis',
            text: 'Tampilkan Kolom',
            titleAttr: 'Tampilkan Kolom',
            className: 'btn-outline-default'
        }],
        initComplete: function() {
            $('<button type="button" class="btn btn-primary waves-effect waves-themed float-right ml-1" data-toggle="modal" data-target="#modal-filter"><i class="fal fa-filter"></i> Filter</button>').appendTo('.justify-content-end');
        }
    }); 
});
function truncate(str, no_words) {
    return str.split(" ").splice(0,no_words).join(" ");
}

function limitWords(textToLimit, wordLimit) {
    var finalText = "";
    var text2 = textToLimit.replace(/\s+/g, ' ');
    var text3 = text2.split(' ');
    var numberOfWords = text3.length;
    var i=0;

    if(numberOfWords > wordLimit){
        for(i=0; i< wordLimit; i++)
        finalText = finalText+" "+ text3[i]+" ";

        return finalText+"...";
    } else return textToLimit;
}