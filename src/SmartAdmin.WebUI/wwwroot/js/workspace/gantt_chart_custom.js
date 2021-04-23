$('.dropdown-radio').find('input').change(function() {
    var dropdown = $(this).closest('.dropdown');
    var radioname = $(this).attr('name');
    var checked = 'input[name=' + radioname + ']:checked';
    
    //update the text
    var checkedtext = $(checked).closest('.dropdown-radio').text();
    dropdown.find('button').text( checkedtext );
  
  });

    var cachedSettings = {};
    var textEditor = {type: "text", map_to: "text"};
    var dateEditor = {type: "date", map_to: "start_date", min: new Date(2020, 0, 1), max: new Date(2022, 0, 1)};
    var durationEditor = {type: "number", map_to: "duration", min:0, max: 100};

    function toggleMode(toggle) {
        gantt.$zoomToFit = !gantt.$zoomToFit;
        if (gantt.$zoomToFit) {
            toggle.innerHTML = "Set default Scale";
            //Saving previous scale state for future restore
            saveConfig();
            zoomToFit();
        } else {

            toggle.innerHTML = "Zoom to Fit";
            //Restore previous scale state
            restoreConfig();
            gantt.render();
        }
    }
    function saveConfig() {
        var config = gantt.config;
        cachedSettings = {};
        cachedSettings.scales = config.scales;
        cachedSettings.start_date = config.start_date;
        cachedSettings.end_date = config.end_date;
        cachedSettings.scroll_position = gantt.getScrollState();
    }
    function restoreConfig() {
        applyConfig(cachedSettings);
    }
    function applyConfig(config, dates) {
        gantt.config.scales = config.scales;
        var lowest_scale = config.scales.reverse()[0];
        if (dates && dates.start_date && dates.end_date) {
            gantt.config.start_date = gantt.date.add(dates.start_date, -1, lowest_scale.unit);
            gantt.config.end_date = gantt.date.add(gantt.date[lowest_scale.unit + "_start"](dates.end_date), 2, lowest_scale.unit);
        } else {
            gantt.config.start_date = gantt.config.end_date = null;
        }
        // restore the previous scroll position
        if (config.scroll_position) {
            setTimeout(function () {
                gantt.scrollTo(config.scroll_position.x, config.scroll_position.y)
            }, 4)
        }
    }
    function zoomToFit() {
        var project = gantt.getSubtaskDates(),
            areaWidth = gantt.$task.offsetWidth,
            scaleConfigs = zoomConfig.levels;

        for (var i = 0; i < scaleConfigs.length; i++) {
            var columnCount = getUnitsBetween(project.start_date, project.end_date, scaleConfigs[i].scales[scaleConfigs[i].scales.length - 1].unit, scaleConfigs[i].scales[0].step);
            if ((columnCount + 2) * gantt.config.min_column_width <= areaWidth) {
                break;
            }
        }
        if (i == scaleConfigs.length) {
            i--;
        }
        gantt.ext.zoom.setLevel(scaleConfigs[i].name);
        applyConfig(scaleConfigs[i], project);
    }
    // get number of columns in timeline
    function getUnitsBetween(from, to, unit, step) {
        var start = new Date(from),
            end = new Date(to);
        var units = 0;
        while (start.valueOf() < end.valueOf()) {
            units++;
            start = gantt.date.add(start, step, unit);
        }
        return units;
    }
    function zoom_in() {
        gantt.ext.zoom.zoomIn();
        gantt.$zoomToFit = false;
        document.querySelector(".zoom_toggle").innerHTML = "Zoom to Fit";
    }
    function zoom_out() {
        gantt.ext.zoom.zoomOut();
        gantt.$zoomToFit = false;
        document.querySelector(".zoom_toggle").innerHTML = "Zoom to Fit";
    }
    var zoomConfig = {
        levels: [
            // hours
            {
                name: "hour",
                scale_height: 27,
                scales: [
                    { unit: "day", step: 1, format: "%d %M" },
                    { unit: "hour", step: 1, format: "%H:%i" },
                ]
            },
            // days
            {
                name: "day",
                scale_height: 27,
                scales: [
                    { unit: "day", step: 1, format: "%d %M" }
                ]
            },
            // weeks
            {
                name: "week",
                scale_height: 50,
                scales: [
                    {
                        unit: "week", step: 1, format: function (date) {
                            var dateToStr = gantt.date.date_to_str("%d %M");
                            var endDate = gantt.date.add(date, -6, "day");
                            var weekNum = gantt.date.date_to_str("%W")(date);
                            return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
                        }
                    },
                    { unit: "day", step: 1, format: "%j %D" }
                ]
            },
            // months
            {
                name: "month",
                scale_height: 50,
                scales: [
                    { unit: "month", step: 1, format: "%F, %Y" },
                    {
                        unit: "week", step: 1, format: function (date) {
                            var dateToStr = gantt.date.date_to_str("%d %M");
                            var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                    }
                ]
            },
            // quarters
            {
                name: "quarter",
                height: 50,
                scales: [
                    {
                        unit: "quarter", step: 3, format: function (date) {
                            var dateToStr = gantt.date.date_to_str("%M %y");
                            var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                    },
                    { unit: "month", step: 1, format: "%M" },
                ]
            },
            // years
            {
                name: "year",
                scale_height: 50,
                scales: [
                    {
                        unit: "year", step: 5, format: function (date) {
                            var dateToStr = gantt.date.date_to_str("%Y");
                            var endDate = gantt.date.add(gantt.date.add(date, 5, "year"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                    }
                ]
            },
            // decades
            {
                name: "year",
                scale_height: 50,
                scales: [
                    {
                        unit: "year", step: 100, format: function (date) {
                            var dateToStr = gantt.date.date_to_str("%Y");
                            var endDate = gantt.date.add(gantt.date.add(date, 100, "year"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                    },
                    {
                        unit: "year", step: 10, format: function (date) {
                            var dateToStr = gantt.date.date_to_str("%Y");
                            var endDate = gantt.date.add(gantt.date.add(date, 10, "year"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                    },
                ]
            },
        ],
        element: function () {
            return gantt.$root.querySelector(".gantt_task");
        }
    };
    gantt.ext.zoom.init(zoomConfig);
    gantt.ext.zoom.setLevel("day");
    gantt.$zoomToFit = false;
    //gantt.message({ text: "Atur zoom in/out agar sesuai dengan tampilan layar (klik disini untuk menutup pop-up ini)", type: "error", expire: -1 });

    gantt.plugins({
        tooltip: true,
        marker: true,
        overlay: true,
        multiselect: true,
        undo: true,
        critical_path: true
    });

  function updateCriticalPath(toggle) {
    toggle.enabled = !toggle.enabled;
    if (toggle.enabled) {
        toggle.innerHTML = "Hide Critical Path";
        gantt.config.highlight_critical_path = true;
    } else {
        toggle.innerHTML = "Show Critical Path";
        gantt.config.highlight_critical_path = false;
    }
    gantt.render();
}

  var overlayControl = gantt.ext.overlay;
  function toggleOverlay() {
      if (overlayControl.isOverlayVisible(lineOverlay)) {
          gantt.config.readonly = false;
          overlayControl.hideOverlay(lineOverlay);
          gantt.$root.classList.remove("overlay_visible");
      } else {
          gantt.config.readonly = true;
          overlayControl.showOverlay(lineOverlay);
          gantt.$root.classList.add("overlay_visible");
      }
  }
function getChartScaleRange() {
    var tasksRange = gantt.getSubtaskDates();
    var cells = [];
    var scale = gantt.getScale();
    if (!tasksRange.start_date) {
        return scale.trace_x;
    }

    scale.trace_x.forEach(function (date) {
        if (date >= tasksRange.start_date && date <= tasksRange.end_date) {
            cells.push(date);
        }
    });
    return cells;
}
function getBaselineDate() {
    var PlannedStartDate, PlannedEndDate;
    var StartDateList = [];
    var EndDateList = [];

    gantt.eachTask(function (task) {
        StartDateList.push(task.planned_start);
        EndDateList.push(task.planned_end);
    });
    PlannedStartDate = StartDateList.reduce(function (pre, cur) {
        return Date.parse(pre) > Date.parse(cur) ? cur : pre;
    });
    PlannedEndDate = EndDateList.reduce(function (pre, cur) {
        return Date.parse(pre) < Date.parse(cur) ? cur : pre;
    });

    return {start : PlannedStartDate, end : PlannedEndDate}
}

function getChartScaleRangeBaseline() {
    var tasksRange = gantt.getSubtaskDates();
    var cells = [];
    var scale = gantt.getScale();
    var values = getBaselineDate();
    
    // var PlannedStartDate, PlannedEndDate;
    // var StartDateList = [];
    // var EndDateList = [];

    // gantt.eachTask(function (task) {
    //     StartDateList.push(task.planned_start);
    //     EndDateList.push(task.planned_end);
    // });
    // PlannedStartDate = StartDateList.reduce(function (pre, cur) {
    //     return Date.parse(pre) > Date.parse(cur) ? cur : pre;
    // });
    // PlannedEndDate = EndDateList.reduce(function (pre, cur) {
    //     return Date.parse(pre) < Date.parse(cur) ? cur : pre;
    // });

    if (!values.start) {
        return scale.trace_x;
    }

    scale.trace_x.forEach(function (date) {
        if (date >= values.start && date <= values.end) {
            cells.push(date);
        }
    });
    return cells;
}
  // Begin of GetProgressLinePlanned 
    function getNewScale() {
        var chartScale = getChartScaleRange();
        var chartScaleBaseline = getChartScaleRangeBaseline();

        var CombineDate = chartScale.concat(chartScaleBaseline);
        var newChartScale = [];
        $.each(CombineDate, function(i, el){
            if($.inArray(el, newChartScale) === -1) newChartScale.push(el);
        });
        return newChartScale;
    }
  // End of GetProgressLinePlanned
  function getProgressLine() {
    var tasks = gantt.getTaskByTime();
    var scale = gantt.getScale();
    var step = scale.unit;
    var totalValue = 0;

    var timegrid = {};
    var timegridBaseline = {};

    var totalDuration = 0;

    gantt.eachTask(function (task) {
        totalValue += task.value;
    })

    gantt.eachTask(function (task) {

        // var task = gantt.getTask(task.id);
        // task.percentage = 10;
        // gantt.updateTask(task.id);
        if (!gantt.isSummaryTask(task)) {
            var task = gantt.getTask(task.id);
            task.percentage = (task.value/totalValue);
            gantt.updateTask(task.id);
            // var tasktwo = gantt.getTask(task.id);

        }

        if (gantt.isSummaryTask(task)) {
            return;
        }
        if (!task.duration) {
            return;
        }

        // Start of Baseline
        var baselineDate = gantt.date[scale.unit + "_start"](new Date(task.planned_start));
        while (baselineDate < task.planned_end) {
            var date = baselineDate;
            baselineDate = gantt.date.add(baselineDate, 1, step);

            if (!gantt.isWorkTime({ date: date, task: task, unit: step })) {
                continue;
            }

            var timestamp = baselineDate.valueOf();
            if (!timegridBaseline[timestamp]) {
                timegridBaseline[timestamp] = {
                    baseline: 0
                };
            }
            baselineDuration = gantt.calculateDuration(task.planned_start, task.planned_end);
            // timegridBaseline[timestamp].baseline += 1;
            timegridBaseline[timestamp].baseline += (task.percentage/baselineDuration);
            // timegridBaseline[timestamp].baseline += (task.percentage/task.duration);
            // if (date <= today) {
            //     timegrid[timestamp].real += (task.percentage/task.duration) * (task.progress || 0);
            // }
        }
        // End of Baseline

        var currDate = gantt.date[scale.unit + "_start"](new Date(task.start_date));
        while (currDate < task.end_date) {
            var date = currDate;
            currDate = gantt.date.add(currDate, 1, step);

            if (!gantt.isWorkTime({ date: date, task: task, unit: step })) {
                continue;
            }

            var timestamp = currDate.valueOf();
            if (!timegrid[timestamp]) {
                timegrid[timestamp] = {
                    planned: 0,
                    real: 0,
                    // baseline: 0
                };
            }

            // timegrid[timestamp].planned += 1;
            timegrid[timestamp].planned += (task.percentage/task.duration);
            // timegrid[timestamp].baseline += (task.percentage/task.duration);
            // if (date <= today) {
                timegrid[timestamp].real += (task.percentage/task.duration) * (task.progress || 0);
                // timegrid[timestamp].real += 1 * (task.progress || 0);
            // }
            totalDuration += 1;

        }
    });

    var cumulativePlannedDurations = [];
    var cumulativeRealDurations = [];
    var cumulativePredictedDurations = []
    var cumulativeBaselineDurations = []
    var totalPlanned = 0;
    var totalReal = 0;
    var totalBaseline = 0;

    var chartScale = getChartScaleRange();
    var chartScaleBaseline = getChartScaleRangeBaseline();
    var dailyRealProgress = -1;
    var totalPredictedProgress = 0;

    var CombineDate = chartScale.concat(chartScaleBaseline);
    var newChartScale = [];
    $.each(CombineDate, function(i, el){
        if($.inArray(el, newChartScale) === -1) newChartScale.push(el);
    });
    newChartScale.sort(function(newChartScale,b){
        return new Date(newChartScale) - new Date(b)
    })
    var chartS = newChartScale;
    
    // for (var i = 0; i < chartS.length; i++) {
    for (var i = 0; i < chartS.length; i++) {
        // start = new Date(chartS[i]);
        start = new Date(chartS[i]);
        end = gantt.date.add(start, 1, step);
        var cell = timegrid[start.valueOf()] || { planned: 0, real: 0 };
        totalPlanned = cell.planned + totalPlanned;

        cumulativePlannedDurations.push(totalPlanned);
        // if (start <= today) {
            totalReal = (cell.real || 0) + totalReal;
            cumulativeRealDurations.push(totalReal);
            cumulativePredictedDurations.push(null);
        // } else {
        //     if (dailyRealProgress < 0) {
        //         dailyRealProgress = totalReal / cumulativeRealDurations.length;
        //         totalPredictedProgress = totalReal;
        //         cumulativePredictedDurations.pop();
        //         cumulativePredictedDurations.push(totalPredictedProgress);
        //     }
            // totalPredictedProgress += dailyRealProgress;
            // cumulativePredictedDurations.push(totalPredictedProgress);
        // }
    }
    
    // Start of Baseline
    // var chart = ((chartScale.length > chartScaleBaseline.length) ? chartScale : chartScaleBaseline);
    for (var i = 0; i < chartS.length; i++) {
    // for (var i = 0; i < chartScale.length; i++) {
        // for (var i = 0; i < chartScaleBaseline.length; i++) {
        start = new Date(chartS[i]);
        // start = new Date(chartScale[i]);
        // start = new Date(chartScaleBaseline[i]);
        end = gantt.date.add(start, 1, step);
        var cell = timegridBaseline[start.valueOf()] || { baseline: 0 };
        totalBaseline = cell.baseline + totalBaseline;
        cumulativeBaselineDurations.push(totalBaseline);
    }
    // End of Baseline

    for (var i = 0; i < cumulativePlannedDurations.length; i++) {
        
        cumulativePlannedDurations[i] = Math.round(cumulativePlannedDurations[i] / totalPlanned * 100);
        if (cumulativeRealDurations[i] !== undefined) {
            cumulativeRealDurations[i] = Math.round(cumulativeRealDurations[i] / totalPlanned * 100);

        }

        if (cumulativePredictedDurations[i] !== null) {
            cumulativePredictedDurations[i] = Math.round(cumulativePredictedDurations[i] / totalPlanned * 100);
        }
    }

    for (var i = 0; i < cumulativeBaselineDurations.length; i++) {
        
        cumulativeBaselineDurations[i] = Math.round(cumulativeBaselineDurations[i] / totalBaseline * 100);

    }


    return { planned: cumulativePlannedDurations, real: cumulativeRealDurations, predicted: cumulativePredictedDurations, baseline: cumulativeBaselineDurations};
}

var dateToStr = gantt.date.date_to_str("%F %j, %Y");
var today = new Date();
// var today = new Date(2021, 3, 17);
gantt.addMarker({
    start_date: today,
    css: "today",
    text: "Today",
    title: "Today: " + dateToStr(today)
});
var projectEnd = new Date(2019, 3, 19);
gantt.addMarker({
    start_date: projectEnd,
    text: "Project end",
    title: "Project end: " + dateToStr(today)
});
gantt.config.open_tree_initially = true;
gantt.config.fit_tasks = true;
gantt.config.drag_project = true;

//gantt.config.auto_types = true;

gantt.init("gantt_here");
function getScalePaddings() {
    var scale = gantt.getScale();
    var dataRange = gantt.getSubtaskDates();
    var dataRangeBaseline = getBaselineDate();
    var chartScale = getChartScaleRange();
    var newWidth = scale.col_width;
    var padding = {
        left: 0,
        right: 0
    };
    var start = (new Date(dataRange.start_date) < new Date(dataRangeBaseline.start)) ? dataRange.start_date : dataRangeBaseline.start;
    var end = (new Date(dataRange.end_date) > new Date(dataRangeBaseline.end)) ? dataRange.end_date : dataRangeBaseline.end;

    if (start) {
    // if (dataRange.start_date) {
        var yScaleLabelsWidth = 48;
        // fine tune values in order to align chart with the scale range
        // padding.left = gantt.posFromDate(dataRange.planned_end) - yScaleLabelsWidth;
        padding.left = gantt.posFromDate(start) - yScaleLabelsWidth;
        // padding.left = gantt.posFromDate(start) - yScaleLabelsWidth;
        // padding.right = scale.full_width - gantt.posFromDate(dataRangeBaseline.end) - yScaleLabelsWidth;
        // padding.right = scale.full_width - gantt.posFromDate(dataRange.end_date) - yScaleLabelsWidth;
        padding.right = scale.full_width - gantt.posFromDate(end) - yScaleLabelsWidth;
        padding.top = gantt.config.row_height - 12;
        padding.bottom = gantt.config.row_height - 12;
    }
    return padding;
}

  var myChart;
  var lineOverlay = overlayControl.addOverlay(function (container) {

      var scaleLabels = [];

      var chartScale = getNewScale();
    //   var chartScale = getChartScaleRange();

      chartScale.forEach(function (date) {
          scaleLabels.push(dateToStr(date));
      });

      var values = getProgressLine();
      var canvas = document.createElement("canvas");
      container.appendChild(canvas);
      canvas.style.height = container.offsetHeight + "px";
      canvas.style.width = container.offsetWidth + "px";

      var ctx = canvas.getContext("2d");
      if (myChart) {
          myChart.destroy();
      }
    
      myChart = new Chart(ctx, {
          type: "line",
          data: {
              datasets: [
                  {
                      label: "Planned progress",
                      backgroundColor: "#001eff",
                      borderColor: "#001eff",
                    //   data: [0, 10, 22, 34, 71, 98, 100],
                    //   data: [0,20,43,52,78,97,100],
                      data: values.planned,
                      fill: false,
                      cubicInterpolationMode: 'monotone'
                  },
                  {
                      label: "Real progress",
                      backgroundColor: "#ff5454",
                      borderColor: "#ff5454",
                      data: values.real,
                      fill: false,
                      cubicInterpolationMode: 'monotone'
                  },
                  {
                      label: "Baseline progress",
                      backgroundColor: "#ffd180",
                      borderColor: "#ffd180",
                      data: values.baseline,
                      fill: false,
                      cubicInterpolationMode: 'monotone'
                  }
                //   ,
                //   {
                //       label: "Real progress (predicted)",
                //       backgroundColor: "#ff5454",
                //       borderColor: "#ff5454",
                //       data: values.predicted,
                //       borderDash: [5, 10],
                //       fill: false,
                //       cubicInterpolationMode: 'monotone'
                //   }
              ]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                  padding: getScalePaddings()
              },
              onResize: function (chart, newSize) {
                  var dataRange = gantt.getSubtaskDates();
                  if (dataRange.start_date) {
                      // align chart with the scale range
                      chart.options.layout.padding = getScalePaddings();
                  }
              },
              legend: {
                  display: false
              },
              tooltips: {
                  mode: "index",
                  intersect: false,
                  callbacks: {
                      label: function (tooltipItem, data) {
                          var dataset = data.datasets[tooltipItem.datasetIndex];
                          return dataset.label + ": " + dataset.data[tooltipItem.index] + "%";
                      }
                  }
              },
              hover: {
                  mode: "nearest",
                  intersect: true
              },
              scales: {
                  xAxes: [{
                      labels: scaleLabels,
                      gridLines: {
                          display: false
                      },
                      ticks: {
                          display: false
                      }
                  },
                  {
                      position: "top",
                      labels: scaleLabels,
                      gridLines: {
                          display: false
                      },
                      ticks: {
                          display: false
                      }
                  }
                  ],
                  yAxes: [{
                      display: true,
                      gridLines: {
                          display: false
                      },
                      ticks: {
                          display: true,
                          min: 0,
                          max: 100,
                          stepSize: 10,
                          callback: function (current) {
                              if (current > 100) { return ""; }
                              return current + "%";
                          }
                      }
                  },
                  {
                      display: true,
                      position: "right",
                      gridLines: {
                          display: false
                      },
                      ticks: {
                          display: true,
                          min: 0,
                          max: 100,
                          stepSize: 10,
                          callback: function (current) {
                              if (current > 100) { return ""; }
                              return current + "%";
                          }
                      }
                  }
                  ]
              }
          }
      });
      return canvas;
  });
  
gantt.config.work_time = false;
gantt.config.details_on_create = false;
gantt.config.duration_unit = "day";
gantt.config.row_height = 30;
gantt.config.min_column_width = 70;


gantt.config.columns = [
    {name: "text", tree: true, width: 200, resize: true, editor: textEditor},
    {name: "start_date", label: "Start Date Actual", align: "center", width: 90, resize: true, editor: dateEditor},
    {name: "end_date", label: "End Date Actual", align: "center", width: 90, resize: true, hide: true},
    {name: "duration", label: "Actual Duration", align: "center", width: 90, resize: true, editor: durationEditor},
    {name: "planned_start", label: "Start Date Plan", align: "center", width: 90, resize: true, hide: true},
    {name: "planned_end", label: "End Date Plan", align: "center", width: 90, resize: true, hide: true},
    {name: "duration_plan", label: "Plan Duration", align: "center", width: 90, resize: true, editor: durationEditor, hide: true},
    {name: "add", width: 44}
];


// baseline
gantt.config.date_format = "%Y-%m-%d %H:%i:%s";
gantt.config.task_height = 16;
gantt.config.row_height = 40;
gantt.locale.labels.baseline_enable_button = 'Set';
gantt.locale.labels.baseline_disable_button = 'Remove';
gantt.config.lightbox.sections = [
    { name: "description", height: 70, map_to: "text", type: "textarea", focus: true, editor: textEditor },
    {name: "type", type: "typeselect", map_to: "type"},
    { name: "time", map_to: "auto", type: "duration"},
    {
        name: "baseline",
        map_to: { start_date: "planned_start", end_date: "planned_end" },
        button: true,
        type: "duration_optional"
    }
];
gantt.locale.labels.section_baseline = "Planned";
// adding baseline display
gantt.addTaskLayer({
    renderer: {
        render: function draw_planned(task) {
            if (task.planned_start && task.planned_end) {
                var sizes = gantt.getTaskPosition(task, task.planned_start, task.planned_end);
                var el = document.createElement('div');
                el.className = 'baseline';
                el.style.left = sizes.left + 'px';
                el.style.width = sizes.width + 'px';
                el.style.top = sizes.top + gantt.config.task_height + 13 + 'px';
                return el;
            }
            return false;
        },
        // define getRectangle in order to hook layer with the smart rendering
        getRectangle: function (task, view) {
            if (task.planned_start && task.planned_end) {
                return gantt.getTaskPosition(task, task.planned_start, task.planned_end);
            }
            return null;
        }
    }
});
gantt.templates.scale_cell_class = function (date) {
    if (date.getDay() == 0 || date.getDay() == 6) {
        return "weekend";
    }
};
gantt.templates.timeline_cell_class = function (item, date) {
    if (date.getDay() == 0 || date.getDay() == 6) {
        return "weekend"
    }
};
gantt.templates.task_class = function (start, end, task) {
    if (task.planned_end) {
        var classes = ['has-baseline'];
        if (end.getTime() > task.planned_end.getTime()) {
            classes.push('overdue');
        }
        return classes.join(' ');
    }
};
gantt.templates.rightside_text = function (start, end, task) {
    if (task.planned_end) {
        if (end.getTime() > task.planned_end.getTime()) {
            var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
            var text = "<b>Overdue: " + overdue + " days</b>";
            return text;
        }
    }
};
gantt.attachEvent("onTaskLoading", function (task) {
    task.planned_start = gantt.date.parseDate(task.planned_start, "xml_date");
    task.planned_end = gantt.date.parseDate(task.planned_end, "xml_date");
    return true;
});
// export pdf & png
// gantt.config.project_start = new Date(2021, 03, 06);
gantt.config.grid_width = 400;
gantt.templates.task_text = function (s, e, task) {
    if(task.type == 'project') {
        return task.text;
    } else {
        return ''
    }
}

gantt.config.columns[0].template = function (obj) {
    var progress = Math.round(obj.progress * 100);
    return obj.text + " - <b>" + progress + "%</b>";
}
gantt.config.columns[2].template = function (obj) {
    return gantt.calculateEndDate(obj.start_date, obj.duration);
}
gantt.config.columns[6].template = function (obj) {
    return gantt.calculateDuration(obj.planned_start, obj.planned_end);
}
gantt.templates.progress_text = function (start, end, task) {
    return "<span style='text-align:left;'>" + Math.round(task.progress * 100) + "% </span>";
};
gantt.templates.task_class = function (start, end, task) {
    if (task.type == gantt.config.types.project)
        return "hide_project_progress_drag";
};

function exportGantt(type) {
    var tgl = new Date();
    var projectName = document.getElementById("project-title").value.replace(/\s+/g, '_').toLowerCase();
    if (type == 'pdf') {
        gantt.exportToPDF({
            name: tgl.getFullYear()+"_"+tgl.getMonth()+"_"+tgl.getDate()+"_"+projectName+".pdf",
            header: "<style>.baseline{position: absolute;border-radius: 2px;opacity: 0.6;margin-top: -7px;height: 12px;background: #ffd180;border: 1px solid rgb(255, 153, 0);}</style>",
            raw: true
            //header: "<style>.baseline{-webkit-border-radius: 2px;  -moz-border-radius: 2px;  border-radius: 2px;  position: absolute;  -moz-box-sizing: border-box;  box-sizing: border-box;  background-color: #ffd180;  border: 1px solid rgb(255, 153, 0);  -webkit-user-select: none;  -moz-user-select: none;  -moz-user-select: -moz-none;}</style>",
            //raw: true
            // header:"<h4>"+document.getElementById("project-title").value+"</h4>",
            // locale:"en",
            // start:"01-04-2013",
            // end:"11-04-2013",
            // skin:'terrace',
            // data:{ },
            // server:"https://myapp.com/myexport/gantt",
        });
    } else {
        gantt.exportToPNG({
            name: tgl.getFullYear()+"_"+tgl.getMonth()+"_"+tgl.getDate()+"_"+projectName+".png",
            header: "<style>.baseline{position: absolute;border-radius: 2px;opacity: 0.6;margin-top: -7px;height: 12px;background: #ffd180;border: 1px solid rgb(255, 153, 0);}</style>",
            raw: true
            // header:"<h4>"+document.getElementById("project-title").value+"</h4>",
            // locale:"en",
            // start:"01-04-2013",
            // end:"11-04-2013",
            // skin:'terrace',
            // data:{ },
            // server:"https://myapp.com/myexport/gantt",
        });
    }
}
// gantt.exportToPDF({
//     name: "mygantt.pdf"
// });
// gantt.templates.task_text=function(start, end, task){
//     return task.text + "%";
// };


var radios = document.getElementsByName("scale");
for (var i = 0; i < radios.length; i++) {
    radios[i].onclick = function (event) {
        gantt.ext.zoom.setLevel(event.target.value);
    };
}


// scale
(function () {
    function shiftTask(task_id, direction) {
        var task = gantt.getTask(task_id);
        task.start_date = gantt.date.add(task.start_date, direction, "day");
        task.end_date = gantt.calculateEndDate(task.start_date, task.duration);
        gantt.updateTask(task.id);
    }
    var actions = {
        undo: function () {
            gantt.ext.undo.undo();
        },
        redo: function () {
            gantt.ext.undo.undo();
        },
        indent: function indent(task_id) {
            var prev_id = gantt.getPrevSibling(task_id);
            while (gantt.isSelectedTask(prev_id)) {
                var prev = gantt.getPrevSibling(prev_id);
                if (!prev) break;
                prev_id = prev;
            }
            if (prev_id) {
                var new_parent = gantt.getTask(prev_id);
                gantt.moveTask(task_id, gantt.getChildren(new_parent.id).length, new_parent.id);
                new_parent.type = gantt.config.types.project;
                new_parent.$open = true;
                gantt.updateTask(task_id);
                gantt.updateTask(new_parent.id);
                return task_id;
            }
            return null;
        },
        outdent: function outdent(task_id, initialIndexes, initialSiblings) {
            var cur_task = gantt.getTask(task_id);
            var old_parent = cur_task.parent;
            if (gantt.isTaskExists(old_parent) && old_parent != gantt.config.root_id) {
                var index = gantt.getTaskIndex(old_parent) + 1;
                var prevSibling = initialSiblings[task_id].first;

                if (gantt.isSelectedTask(prevSibling)) {
                    index += (initialIndexes[task_id] - initialIndexes[prevSibling]);
                }
                gantt.moveTask(task_id, index, gantt.getParent(cur_task.parent));
                if (!gantt.hasChild(old_parent))
                    gantt.getTask(old_parent).type = gantt.config.types.task;
                gantt.updateTask(task_id);
                gantt.updateTask(old_parent);
                return task_id;
            }
            return null;
        },
        del: function (task_id) {
            if (gantt.isTaskExists(task_id)) gantt.deleteTask(task_id);
            return task_id;
        },
        moveForward: function (task_id) {
            shiftTask(task_id, 1);
        },
        moveBackward: function (task_id) {
            shiftTask(task_id, -1);
        }
    };
    var cascadeAction = {
        indent: true,
        outdent: true,
        del: true
    };

    var singularAction = {
        undo: true,
        redo: true
    };

    gantt.performAction = function (actionName) {
        var action = actions[actionName];
        if (!action)
            return;

        if (singularAction[actionName]) {
            action();
            return;
        }

        gantt.batchUpdate(function () {

            // need to preserve order of items on indent/outdent,
            // remember order before changing anything:
            var indexes = {};
            var siblings = {};
            gantt.eachSelectedTask(function (task_id) {
                gantt.ext.undo.saveState(task_id, "task");
                indexes[task_id] = gantt.getTaskIndex(task_id);
                siblings[task_id] = {
                    first: null
                };

                var currentId = task_id;
                while (gantt.isTaskExists(gantt.getPrevSibling(currentId)) && gantt.isSelectedTask(gantt.getPrevSibling(currentId))) {
                    currentId = gantt.getPrevSibling(currentId);
                }
                siblings[task_id].first = currentId;
            });

            var updated = {};
            gantt.eachSelectedTask(function (task_id) {

                if (cascadeAction[actionName]) {
                    if (!updated[gantt.getParent(task_id)]) {
                        var updated_id = action(task_id, indexes, siblings);

                        updated[updated_id] = true;
                    } else {
                        updated[task_id] = true;
                    }
                } else {
                    action(task_id, indexes);
                }
            });
        });
    };


})();

// recalculate progress of summary tasks when the progress of subtasks changes
(function dynamicProgress() {

    function calculateSummaryProgress(task) {
        if (task.type != gantt.config.types.project)
            return task.progress;
        var totalToDo = 0;
        var totalDone = 0;
        gantt.eachTask(function (child) {
            if (child.type != gantt.config.types.project) {
                totalToDo += child.duration;
                totalDone += (child.progress || 0) * child.duration;
            }
        }, task.id);
        if (!totalToDo) return 0;
        else return totalDone / totalToDo;
    }

    function refreshSummaryProgress(id, submit) {
        if (!gantt.isTaskExists(id))
            return;

        var task = gantt.getTask(id);
        task.progress = calculateSummaryProgress(task);
        if (!submit) {
            gantt.refreshTask(id);
        } else {
            gantt.updateTask(id);
        }

        if (!submit && gantt.getParent(id) !== gantt.config.root_id) {
            refreshSummaryProgress(gantt.getParent(id), submit);
        }
    }


    gantt.attachEvent("onParse", function () {
        gantt.eachTask(function (task) {
            task.progress = calculateSummaryProgress(task);
        });
    });

    //gantt.attachEvent("onAfterTaskUpdate", function (id) {
    //    refreshSummaryProgress(gantt.getParent(id), true);
    //});
    gantt.attachEvent("onAfterTaskUpdate", function (id, task) {
        gantt.batchUpdate(function () {
            gantt.eachParent(function (parent) {
                if (parent.type == "project") {

                    if (task.planned_start < parent.planned_start) {
                        parent.planned_start = task.planned_start;
                    }

                    if (task.planned_end > parent.planned_end) {
                        parent.planned_end = task.planned_end;
                    }
                    gantt.updateTask(parent.id);
                }
            }, id)
        })
    });

    gantt.attachEvent("onTaskDrag", function (id) {
        refreshSummaryProgress(gantt.getParent(id), false);
    });
    
    gantt.attachEvent("onAfterTaskAdd", function (id) {
        refreshSummaryProgress(gantt.getParent(id), true);
    });


    (function () {
        var idParentBeforeDeleteTask = 0;
        gantt.attachEvent("onBeforeTaskDelete", function (id) {
            idParentBeforeDeleteTask = gantt.getParent(id);
        });
        gantt.attachEvent("onAfterTaskDelete", function () {
            refreshSummaryProgress(idParentBeforeDeleteTask, true);
        });
    })();
})();



var els = document.getElementsByClassName("action");
for (var i = 0; i < els.length; i++) {
    els[i].onclick = function () {
        gantt.performAction(this.name)
    }
}
// hide column

(function addContentMenu() {
    var menu = new dhtmlXMenuObject();
    menu.setIconsPath("../common/sample_images/");
    menu.renderAsContextMenu();
    menu.setSkin("dhx_terrace");

    gantt.attachEvent("onContextMenu", function (taskId, linkId, event) {
        var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;

        var target = (event.target || event.srcElement);
        var column_id = target.getAttribute("column_id");
        menu.clearAll();

        addColumnsConfig();
        if (column_id) {
            addColumnToggle(column_id);
        }

        menu.showContextMenu(x, y);
        return false;
    });

    menu.attachEvent("onClick", function (id, zoneId, cas) {
        var parts = (id + "").split("#");
        var is_toggle = parts[0] == "toggle",
            column_id = parts[1] || id;

        var column = gantt.getGridColumn(column_id);

        if (column) {
            var visible = !is_toggle ? menu.getCheckboxState(id) : false;
            column.hide = !visible;
            gantt.render();
        }
        return true;
    });

    function addColumnToggle(column_name) {
        var column = gantt.getGridColumn(column_name);
        var label = getColumnLabel(column);

        //add prefix to distinguish from the same item in 'show columns' menu
        var item_id = "toggle#" + column_name
        menu.addNewChild(null, -1, item_id, "Hide '" + label + "'", false);
        menu.addNewSeparator(item_id);
    }

    function addColumnsConfig() {
        menu.addNewChild(null, -1, "show_columns", "Show columns:", false);
        var columns = gantt.config.columns;

        for (var i = 0; i < columns.length; i++) {
            var checked = (!columns[i].hide),
                itemLabel = getColumnLabel(columns[i]);
            menu.addCheckbox("child", "show_columns", i, columns[i].name, itemLabel, checked);
        }
    }

    function getColumnLabel(column) {
        if (column == null)
            return '';

        var locale = gantt.locale.labels;
        var text = column.label !== undefined ? column.label : locale["column_" + column.name];

        text = text || column.name;
        return text;
    }
})();

  /* 
  
  //If IE8 support is required, add this inside your own IE8 conditional:
  //See: http://www.paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/
  
      //Prevent ie8 from closing the dropdown before clicking the checkbox
      $('.dropdown-radio').click( function( event ) {
          event.stopImmediatePropagation(); 
      })
      $(document).on('change', '.dropdown-radio input', function(){
          dropdownRadio();  //all the same functions as above
          $('.dropdown-menu').dropdown('toggle'); 
      })
      
      */
  
  