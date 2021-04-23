var table;
$(document).ready( function () {
    
    var qparams = window.location.search;
    var params = qparams.split('?id=')[1];
    var id = (params == undefined || params == "" ? undefined : JSON.parse(unescape(params)));

    table = $('#dt-basic-example').DataTable({
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
            "url" : "/workspace/gettasks?id="+id,
            "type" : "GET",
            "datatype" : "json"
        },
        createdRow: function(row, data, rowIndex) {
            $.each($('td', row), function(colIndex) {
                if(colIndex == 1) {
                    $(this).attr('data-name', 'uraian_pekerjaan');
                    $(this).attr('class', 'uraian_pekerjaan');
                    $(this).attr('data-type', 'textarea');
                    $(this).attr('data-pk', data.id);
                }
                if(colIndex == 2) {
                    $(this).attr('data-name', 'plan_start');
                    $(this).attr('class', 'plan_start');
                    $(this).attr('data-type', 'date');
                    $(this).attr('data-viewformat', 'dd/mm/yyyy');
                    $(this).attr('data-pk', data.id);
                }
                if(colIndex == 3) {
                    $(this).attr('data-name', 'plan_finish');
                    $(this).attr('class', 'plan_finish');
                    $(this).attr('data-type', 'date');
                    $(this).attr('data-viewformat', 'dd/mm/yyyy');
                    $(this).attr('data-pk', data.id);
                }
                if(colIndex == 5) {
                    $(this).attr('data-name', 'startdate');
                    $(this).attr('class', 'startdate');
                    $(this).attr('data-type', 'date');
                    $(this).attr('data-viewformat', 'dd/mm/yyyy');
                    $(this).attr('data-pk', data.id);
                    // $(this).attr('class', "color-fusion-50");
                }
                // if(colIndex == 6) {
                //     $(this).attr('class', "color-fusion-50");
                // }
            })
        },
        "columns" : [
            { data: 'id', searchable: false, orderable: false },
            { data: 'text', searchable: false, orderable: false },
            { data: function(data) {
                return moment(data.planned_start).format("DD/MM/YYYY");
            }},
            { data: function(data) {
                return moment(data.planned_end).format("DD/MM/YYYY");
            }},
            { data: function(data) {
                var start = new moment(data.planned_start);
                var end = new moment(data.planned_end);
                return moment.duration(end.diff(start)).asDays();
            }},
            { data: function(data) {
                var content = moment(data.startDate).format("DD/MM/YYYY");
                if(data.progress > 0) {
                    return content;
                } else {
                    return '<span class="color-fusion-50">'+content+'</span>';
                }
            }},            
            { data: function(data) {
                var content = moment(data.startDate).add(data.duration, 'days').format("DD/MM/YYYY");
                if(data.progress == 1) {
                    return content;
                } else {
                    return '<span class="color-fusion-50">'+content+'</span>';
                }
            }},
            { data: "duration", searchable: false, orderable: false },
            { data: function(data) {
                var content = (data.progress * 100);
                if(content == 100) {
                    return '<span class="color-success-400">'+content+' %</span>';
                } else {
                    return '<span class="color-info-400">'+content+' %</span>';
                }
            }}
        ],
        scrollX: true,
        order: [],
        // order: [[3, "desc"]],
        columnDefs: [
            // { orderable: false, targets: [0, 1, 5, 6, 7] },
            // { visible: false, targets: [3, 4, 5, 6, 7, 8, 14] },
            { targets: 0, searchable: false, orderable: false, data: null, render: function (data, type, full, meta) {
                return meta.settings._iDisplayStart + meta.row + 1;
            }}
        ],
        dom: "<'row mb-3'<'col-sm-12 col-md-6 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-6 d-flex align-items-center justify-content-end'B>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [{
            extend: 'colvis',
            text: 'Tampilkan Kolom',
            titleAttr: 'Tampilkan Kolom',
            className: 'btn-outline-default'
        }],
        initComplete: function() {
            $('<a href="javascript:void(0);" class="btn btn-outline-primary btn-icon ml-1"><i class="fal fa-question-circle"></i></a>'+
            '<div class="btn-group ml-1">'+
            '<button type="button" class="btn btn-primary button-tabel-gantt" data-value="table"><i class="fal fa-table"></i> Tabel</button>'+
            '<button type="button" class="btn btn-primary button-tabel-gantt" data-value="gantt"><i class="fal fa-chart-area"></i> Gantt</button>'+
            '</div>').appendTo('.justify-content-end');
            // $('<select class="form-control" id="example-select">'+
            // '<option>1</option>'+
            // '<option>2</option>'+
            // '</select>').prependTo('.justify-content-end');
            $('<div class="dt-buttons mr-1"><div class="btn-group"><button class="btn buttons-collection dropdown-toggle buttons-colvis btn-outline-default" tabindex="0" type="button" title="Expand/ Collapse" aria-haspopup="true" aria-expanded="false"><span>Expand/Collapse</span></button></div></div>').prependTo('.justify-content-end');
            // $('<button type="button" class="btn btn-primary waves-effect waves-themed float-right ml-1" data-toggle="modal" data-target="#modal-filter"><i class="fal fa-filter"></i> Filter</button>').appendTo('.justify-content-end');
        }
    }); 

    
    // $('#dt-basic-example').on( 'click', 'tbody td:not(:first-child)', function (e) {
    //     table.inline( this );
    //     // console.log(table)
    // } );
    // $.fn.editable.defaults.url = '/post'; 
    $('#dt-basic-example').editable({
		url:'/workspace/updatetask',
		container:'body',
		selector:'td.uraian_pekerjaan',
		title:'Uraian Pekerjaan',
		type:'POST',
		validate:function(value){
            console.log(value);
			if($.trim(value) == '')
			{
				return 'This field is required';
			}
		}
	});

    $('#dt-basic-example').editable({
		container:'body',
        format: 'yyyy-mm-dd',
        viewformat: 'dd/mm/yyyy',
		selector:'td.plan_start',
		url:'/workspace/updatetask',
		title:'Plan Start',
		type:'POST',
		validate:function(value){
			if($.trim(value) == '')
			{
				return 'This field is required';
			}
		},
        datepicker: {
            todayBtn: 'linked'
        },
        success: function(response, newValue) {
            var start = new moment(response.data.planned_start);
            var end = new moment(response.data.planned_end);
            var durasi = moment.duration(end.diff(start)).asDays();
            $(this).closest('td').next('td').next('td').html(durasi)
        }
        // display: function(value) {
        //     // console.log(value);
        //     // console.log($(this).closest('td').next('td').next('td').html(value))
        //     if(!value) {
        //         $(this).empty();
        //         return; 
        //     }
        //     // var html = '<b>' + $('<div>').text(value.city).html() + '</b>, ' + $('<div>').text(value.street).html() + ' st., bld. ' + $('<div>').text(value.building).html();
        //     // $(this).html(html); 
        // } 
	});

    $('#dt-basic-example').editable({
		container:'body',
        format: 'yyyy-mm-dd',
        viewformat: 'dd/mm/yyyy',
		selector:'td.plan_finish',
		url:'/workspace/updatetask',
		title:'Plan Finish',
		type:'POST',
		validate:function(value){
			if($.trim(value) == '')
			{
				return 'This field is required';
			}
		},
        datepicker: {
            todayBtn: 'linked'
        }, 
        success: function (response, newVal) {
            var start = new moment(response.data.planned_start);
            var end = new moment(response.data.planned_end);
            var durasi = moment.duration(end.diff(start)).asDays();
            $(this).closest('td').next('td').html(durasi)
        }
	});

    $('#dt-basic-example').editable({
		container:'body',
        format: 'yyyy-mm-dd',
        viewformat: 'dd/mm/yyyy',
		selector:'td.startdate',
		url:'/workspace/updatetask',
		title:'Actual Start',
		type:'POST',
		validate:function(value){
			if($.trim(value) == '')
			{
				return 'This field is required';
			}
		},
        datepicker: {
            todayBtn: 'linked'
        }, 
        success: function (response, newVal) {
            // var start = new moment(response.data.startDate);
            // var durasi = moment.duration(end.diff(start)).asDays();
            var content = moment(response.data.startDate).add(response.data.duration, 'days').format("DD/MM/YYYY");
            var html;
            if(response.data.progress == 1) {
                html = content;
            } else {
                html = '<span class="color-fusion-50">'+content+'</span>';
            }

            // var durasi = moment(response.data.startDate).add(response.data.duration, 'days').format("DD/MM/YYYY");
            $(this).closest('td').next('td').html(html)
        }
	});

    $(document).on('click', '.button-tabel-gantt', function() {
        // $(this).find('button').addClass('active');
        // $(this).find('button').addClass('active');
        // $(".button-tabel-gantt").each(function(index) {
            if($(this).data('value') == 'table') {
                $('*[data-value="table"]').addClass('active');
                $('*[data-value="gantt"]').removeClass('active');
                $('.partial-table').addClass('d-block').removeClass('d-none');
                $('.partial-gantt').addClass('d-none').removeClass('d-block');
            } else {
                $('*[data-value="gantt"]').addClass('active');
                $('*[data-value="table"]').removeClass('active');
                $('.partial-table').addClass('d-none').removeClass('d-block');
                $('.partial-gantt').addClass('d-block').removeClass('d-none');
            }
        // });
    })
});

var controls = {
    leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
    rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>'
}

// $(document).on('click', '.default-example-modal', function () {
//     $('#default-example-modal').modal('show');
// })
// $('#default-example-modal').on('shown.bs.modal', function(e) {
    // console.log('hello')
// $('.show-finish-date').datepicker({
//     todayHighlight: true,
//     templates: controls,
//     format: 'dd/mm/yyyy',
//     autoclose: true,
//     zIndex: 2048,
//     orientation: "bottom left",
//     todayBtn: "linked",
// });
// })

$(document).on('submit', '#dayoneform', function (e) {
    e.preventDefault();
    var id = $('[name=project_id]').val();
    var dayonedate = $('[name=day_one_date]').val();
    $('#datedayone').html(moment(dayonedate).format("DD/MM/YYYY"));
    $.ajax({
        type: 'POST',
        url: '/workspace/updatedayone',
        data: {id: id, dates : dayonedate},
        cache: false, 
        success: function (data) {
            $('#dt-basic-example').dataTable( ).api().ajax.reload();
            $('#default-example-modal').modal('toggle');
        }
    })
    // console.log(dayonedate);
})