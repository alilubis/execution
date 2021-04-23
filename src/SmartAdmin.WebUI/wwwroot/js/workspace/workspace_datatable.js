var table;
$(document).ready( function () {
    table = $('#dt-basic-example').dataTable({
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
        createdRow: function(row, data, rowIndex) {
            $.each($('td', row), function(colIndex) {
                // if(colIndex == 2) {
                //     $(this).attr('data-search', data.username);
                // }
            })
        },
        "columns" : [
            { "data": function(data) {
                var task = data.task_duration.filter(function (val) {
                    if(val.parentId == 0 && val.type == 'project') {
                        return val.progress;
                    }
                });
                if(task.length > 0) {
                    var progress = task[0].progress * 100;
                    if(progress == 100) {
                        return '<span class="badge badge-dark">Selesai</span>';
                    } else {
                        return '<span class="badge badge-info">In Progress</span>';
                    }
                } else {
                    return '<span class="badge badge-success">New</span>';
                }
                
                // if(data.status == 22 || data.status == 30) {
                //     return '<span class="badge badge-success">New</span>';
                //     /* return '<span class="badge badge-info">In Progress</span>' */
                // } else if (data.status == 23) {
                //     return '';
                // } else {
                //     return '<span class="badge badge-info">In Progress</span>';
                // }
                
            }},
            { "data": function(data) {
                return limitWords(data.description, 4);
            }},
            { "data": "username"},
            { "data": "disciplinename"},
            { "data": function(data) {
                if(data.contract_type == 'lumpsum') {
                    return 'Lumpsum';
                } else {
                    return 'Unit Price';
                }
            }},
            { "data": function(data) {
                if(data.type == 'jasa') {
                    return 'Jasa/ All In';
                } else {
                    return 'Barang';
                }
            }},
            { "data": function(data) {
                var date = moment(data.due_date).unix();
                return (date > 0) ? moment(data.due_date).format("DD/MM/YYYY") : '-';
                // return moment(data.due_date).format("DD/MM/YYYY");
            }},
            { "data": "inisiasi" },
            { "data": function(data) {
                if(data.task_duration.length > 0) {
                    var task = data.task_duration;
                    var countTaskDuration = [];
                    var countParentDuration = [];
                    for(i = 0; i < task.length; i++) {
                        if(task[i].type == 'task') {
                            var start = new moment(task[i].planned_start);
                            var end = new moment(task[i].planned_end);
                            var baseline_duration = moment.duration(end.diff(start)).asDays();
                            if(task[i].duration <= baseline_duration) {
                                countTaskDuration.push(i);
                            }
                        }
                        if(task[i].type == 'project' && task[i].parentId == 0) {
                            var start = new moment(task[i].planned_start);
                            var end = new moment(task[i].planned_end);
                            var baseline_duration = moment.duration(end.diff(start)).asDays();
                            if(task[i].duration > baseline_duration) {
                                countParentDuration.push(i);
                            }
                        }
                    }
                    if(countParentDuration.length > 0) {
                        return '<span class="text-danger">Warning</span>';
                    } else {
                        if(data.count_task == countTaskDuration.length) {
                            return '<span class="text-success">On Time</span>';
                        } else {
                            return '<span class="text-warning">Alert</span>';
                        }
                    }
                } else {
                    return '-'
                }
            }},
            { "data": function(data) {
                var task = data.task_duration.filter(function (val) {
                    if(val.parentId == 0 && val.type == 'project') {
                        return val.progress;
                    }
                });
                if(task.length > 0) {
                    var progress = task[0].progress * 100;
                    return '<div class="progress">'+
                        '<div class="progress-bar" role="progressbar" style="width: '+progress+'%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">'+progress+'%</div>'+
                    '</div>';
                } else {
                    return '<div class="progress">'+
                    '<div class="progress-bar" role="progressbar" style="width: 100%;background-color: #f6f6f6;color:#000000;text-align:left;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div>';
                }
            }},
            { "data": function(data) {
                var date = moment(data.end_date).unix();
                return (date > 0) ? moment(data.end_date).format("DD/MM/YYYY") : '-';
            } },
            { "data": function(data) {
                if(data.po_number) {
                    return data.po_number;
                } else {
                    return '-';
                }
            } },
            { "data": function(data) {
                if(data.vendor) {
                    return data.vendor;
                } else {
                    return '-';
                }
            } },
            { "data": function(data) {
                return "<div class='dropdown d-inline-block dropleft'>"+
                "<a href='#' class='btn btn-outline-success btn-icon waves-effect waves-themed btn-sm' data-toggle='dropdown' aria-expanded='true' title='More options'>"+
                    "<i class='fal fa-ellipsis-h'></i>"+
                "</a>"+
                "<div class='dropdown-menu'>"+
                    "<a href='javascript:void(0)' class='dropdown-item' onclick=detail_project("+data.id+")>Lihat Project</a>"+
                "</div>"+
                "</div>";
            }}
            // return '<a href="javascript:void(0)" onclick=edit(\'/users/edit?id='+data.id+'\') class="btn btn-outline-success btn-sm">Edit</a> '+
            //     '<a href="javascript:void(0)" onclick=editPassword(\'/users/edit?id='+data.id+'\') class="btn btn-outline-info btn-sm">Edit Password</a> '+
            //     '<a href="javascript:void(0)" onclick=deleted(\'/users/delete?id='+data.id+'\') class="btn btn-outline-danger btn-sm">Hapus</a>';
            
        ],
        order: [[3, "desc"]],
        columnDefs: [
            { orderable: false, targets: [0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 13] },
            { visible: false, targets: [3, 4] }
            // { targets: 5, render: function(id, row, meta) {
            //     $.get("/workspace/timestatus?id="+id, function(result, status){
            //         if(result == 1) {
            //             return 'On Time';
            //         } else if(result == 2) {
            //             return 'Overdue';
            //         } else {
            //             return '-';
            //         } 
            //     });
            // }}
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
            var user = $('#dt-basic-example').data('user');
            $('<button type="button" class="btn btn-primary waves-effect waves-themed float-right ml-1" data-toggle="modal" data-target="#modal-filter"><i class="fal fa-filter"></i> Filter</button>').appendTo('.justify-content-end');
            $('<div class="custom-control custom-switch ml-1"><input type="checkbox" class="custom-control-input myproject" name="myproject" value="'+user+'" onchange="filtermyproject()" id="filtermyproject21"><label class="custom-control-label" for="filtermyproject21">Hanya Project Saya</label></div>').appendTo('.justify-content-start');
        }
    }); 
    // $("#filtermyproject21").trigger("click");
    // filtermyproject();

});

// filtermyproject();

function filtermyproject() {
    $('.myproject').val($('#dt-basic-example').data('user'));

    //build a regex filter string with an or(|) condition
    var types = $('input:checkbox[name="myproject"]:checked').map(function() {
        // console.log(this.value);
        return '^' + this.value + '\$';
    }).get().join('|');
    // console.log(types)
    //filter in column 0, with an regex, no smart filtering, no inputbox,not case sensitive
    table.fnFilter(types, 2, true, false, false, false);
}
function filterOnStatus(q) {
    var status = $('input:checkbox[name="status"]:checked').map(function() {
        // if (this.value == "Aktif") {
        //     return '^Aktif$|^Unverified$|^Verified$';
        // } else if (this.value == "Verified") {
        //     return '^Aktif$|^Verified$|^Aktif - Proc$|^Aktif - Exe$|^Aktif - Exe Done$|^Eksekusi$|^Addendum Aktif$';
        // } else {
            return '^' + this.value + '\$';
        // }
    }).get().join('|');
    table.fnFilter(status, 0, true, false, false, false);
}

function filterOnType() {
    var types = $('input:checkbox[name="contract_type"]:checked').map(function() {
        return '^' + this.value + '\$';
    }).get().join('|');

    table.fnFilter(types, 4, true, false, false, false);
}
function filterinisiasi() {
    var types = $('input:checkbox[name="inisiasi"]:checked').map(function() {
        return '^' + this.value + '\$';
    }).get().join('|');
    table.fnFilter(types, 7, true, false, false, false);
}

function filterdiscipline() {
    var types = $('input:checkbox[name="discipline"]:checked').map(function(index, val) {
        return '^' + this.value + '\$';
    }).get().join('|');
    table.fnFilter(types, 3, true, false, false, false);

    // if (role != "planner" || role != "admin") {
    //     var DisiplinArr = new Array();
    //     $('input[name="discipline"]:checked').each(function() {
    //         DisiplinArr.push(this.value);
    //     });
    //     if (arraysEqual(DisiplinArr, $('.supervisor-discipline').val().split("|"))) {
    //         $('.supervisor-discipline').prop('checked', true);
    //     } else {
    //         $('.supervisor-discipline').prop('checked', false);
    //     }
    // }
}


function filtertime(status) {
    // if (_.isEmpty(status) == false || _.isUndefined(status) == false) {
    //     switch (status) {
    //         case "ontime":
    //             var types = '^On Time$';
    //             $('.status-ontime').prop('checked', true);
    //             break;
    //         case "alert":
    //             var types = '^Alert$';
    //             $('.status-alert').prop('checked', true);
    //             break;
    //         case "overdue":
    //             var types = '^Overdue$';
    //             $('.status-overdue').prop('checked', true);
    //             break;
    //     }
    // } else {
        var types = $('input:checkbox[name="time_status"]:checked').map(function() {
            return '^' + this.value + '\$';
        }).get().join('|');
    // }
    table.fnFilter(types, 12, true, false, false, false);
}

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

function detail_project(id) {
    window.open("/workspace/detail?id="+id);
}

$('#dt-basic-example tbody').on( 'click', 'td:not(:last-child)', function () {
    var ID = table.api().row(this).data().id
    // console.log(table.api().row(this).data().id);
    window.open("/workspace/detail?id="+ID);
} );

$('#dt-basic-example tbody tr').css('cursor', 'pointer');