/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 86.16363636363636, "KoPercent": 13.836363636363636};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8616363636363636, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.94, 500, 1500, "/home/notice-77"], "isController": false}, {"data": [1.0, 500, 1500, "/home/mission_vision-69"], "isController": false}, {"data": [0.996, 500, 1500, "/moodle/lib/ajax/service.php?sesskey=WmvrJeeMTA&info=core_course_get_enrolled_courses_by_timeline_classification-11"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "/home/mission_vision-66"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/theme/image.php/classic/core/1731384351/t/collapsed-5"], "isController": false}, {"data": [1.0, 500, 1500, "Home-0"], "isController": false}, {"data": [1.0, 500, 1500, "Home-1"], "isController": false}, {"data": [0.952, 500, 1500, "/moodle/lib/ajax/getnavbranch.php-3"], "isController": false}, {"data": [0.964, 500, 1500, "/moodle/lib/ajax/getnavbranch.php-6"], "isController": false}, {"data": [0.98, 500, 1500, "Notice"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice-72"], "isController": false}, {"data": [0.996, 500, 1500, "/moodle/theme/image.php/classic/block_myoverview/1731384351/courses-14"], "isController": false}, {"data": [0.0, 500, 1500, "/moodle/course/index.php-2"], "isController": false}, {"data": [0.9533333333333334, 500, 1500, "Home"], "isController": false}, {"data": [1.0, 500, 1500, "/favicon.ico-76"], "isController": false}, {"data": [0.0, 500, 1500, "Moodle"], "isController": false}, {"data": [0.0, 500, 1500, "/moodle/my/courses.php-8"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "/home-22"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "/home/history-70"], "isController": false}, {"data": [0.988, 500, 1500, "/moodle/lib/ajax/service-nologin.php-9"], "isController": false}, {"data": [0.98, 500, 1500, "/home/aboutus-65"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "/home/news_detail/184-67"], "isController": false}, {"data": [0.992, 500, 1500, "/moodle/lib/ajax/service-nologin.php-10"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "/home/aboutus-71"], "isController": false}, {"data": [0.988, 500, 1500, "/moodle/lib/ajax/service-nologin.php-7"], "isController": false}, {"data": [0.988, 500, 1500, "/moodle/lib/ajax/service-nologin.php-13"], "isController": false}, {"data": [0.992, 500, 1500, "/moodle/lib/ajax/service-nologin.php-12"], "isController": false}, {"data": [0.996, 500, 1500, "/moodle/theme/yui_combo.php-4"], "isController": false}, {"data": [0.0, 500, 1500, "/home/download/1306-75"], "isController": false}, {"data": [0.996, 500, 1500, "/moodle/theme/image.php/classic/core/1731384351/i/loading_small-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5500, 761, 13.836363636363636, 17.827454545454533, 1, 765, 10.0, 39.0, 46.0, 144.0, 55.296388643127166, 798.8602503166975, 30.634415309810585], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/home/notice-77", 50, 3, 6.0, 23.619999999999997, 16, 116, 21.0, 24.0, 49.24999999999998, 116.0, 0.5160970675364623, 1.8058357353351018, 0.2580485337682311], "isController": false}, {"data": ["/home/mission_vision-69", 150, 0, 0.0, 9.033333333333339, 6, 25, 8.0, 11.0, 12.449999999999989, 24.49000000000001, 1.52519624191646, 4.508563500274535, 0.7745137165982023], "isController": false}, {"data": ["/moodle/lib/ajax/service.php?sesskey=WmvrJeeMTA&info=core_course_get_enrolled_courses_by_timeline_classification-11", 250, 1, 0.4, 9.520000000000003, 6, 33, 9.0, 12.0, 13.0, 25.470000000000027, 2.541089415854365, 1.7519620386652166, 2.111784270402407], "isController": false}, {"data": ["/home/mission_vision-66", 150, 2, 1.3333333333333333, 9.013333333333337, 6, 44, 8.0, 9.900000000000006, 10.0, 43.49000000000001, 1.5251497188640686, 4.5084259755874365, 0.7744900916106597], "isController": false}, {"data": ["/moodle/theme/image.php/classic/core/1731384351/t/collapsed-5", 250, 0, 0.0, 3.2440000000000007, 1, 27, 3.0, 4.0, 4.449999999999989, 13.430000000000064, 2.5407536891743567, 2.0941368297491767, 1.35721901169763], "isController": false}, {"data": ["Home-0", 150, 0, 0.0, 2.2266666666666666, 1, 24, 2.0, 3.0, 3.0, 14.820000000000164, 1.5286312635666024, 0.7434163762267266, 0.180629280167538], "isController": false}, {"data": ["Home-1", 150, 0, 0.0, 20.013333333333335, 15, 46, 19.0, 24.0, 27.0, 46.0, 1.5284443493412405, 82.19418455583407, 0.17911457218842664], "isController": false}, {"data": ["/moodle/lib/ajax/getnavbranch.php-3", 250, 12, 4.8, 19.800000000000015, 13, 53, 19.0, 23.0, 29.14999999999992, 43.88000000000011, 2.540030886775583, 3.4007640095403557, 1.6396097814049417], "isController": false}, {"data": ["/moodle/lib/ajax/getnavbranch.php-6", 250, 9, 3.6, 21.096, 15, 234, 19.0, 22.900000000000006, 24.0, 61.350000000000136, 2.540443866352329, 3.4013169343447687, 1.6795707983598893], "isController": false}, {"data": ["Notice", 150, 3, 2.0, 17.453333333333337, 11, 54, 17.0, 21.0, 22.0, 50.430000000000064, 1.5284910736121302, 35.01946199024823, 0.18956871713744192], "isController": false}, {"data": ["/home/notice-72", 50, 0, 0.0, 14.560000000000002, 10, 19, 15.0, 16.9, 17.89999999999999, 19.0, 0.5152302048555294, 1.802802562497424, 0.25761510242776475], "isController": false}, {"data": ["/moodle/theme/image.php/classic/block_myoverview/1731384351/courses-14", 250, 1, 0.4, 3.632, 2, 37, 3.0, 4.0, 5.0, 20.330000000000155, 2.542355645046474, 3.217668863261944, 1.3109021294770882], "isController": false}, {"data": ["/moodle/course/index.php-2", 250, 250, 100.0, 39.91200000000003, 31, 98, 38.0, 45.0, 50.0, 79.90000000000009, 2.5396696397732583, 20.145572276458278, 1.2871958428147667], "isController": false}, {"data": ["Home", 150, 7, 4.666666666666667, 22.573333333333323, 16, 50, 21.0, 27.900000000000006, 30.44999999999999, 48.98000000000002, 1.528350909368791, 82.93243972566101, 0.35969977456824087], "isController": false}, {"data": ["/favicon.ico-76", 50, 0, 0.0, 3.1399999999999997, 1, 11, 3.0, 4.899999999999999, 10.449999999999996, 11.0, 0.5161983027399806, 2.312306264324503, 0.23491055573909275], "isController": false}, {"data": ["Moodle", 150, 150, 100.0, 150.97333333333336, 127, 765, 141.0, 157.0, 168.89999999999998, 765.0, 1.5166988543867987, 125.92279671053296, 0.1821816006734143], "isController": false}, {"data": ["/moodle/my/courses.php-8", 250, 250, 100.0, 44.13600000000001, 36, 84, 43.0, 49.0, 51.0, 70.90000000000009, 2.538999025024374, 21.85784588783718, 1.32156882845507], "isController": false}, {"data": ["/home-22", 150, 1, 0.6666666666666666, 17.966666666666672, 12, 216, 16.0, 21.0, 23.0, 120.6300000000017, 1.5251497188640686, 11.164572551372126, 0.6732106180923427], "isController": false}, {"data": ["/home/history-70", 150, 1, 0.6666666666666666, 8.433333333333332, 6, 46, 8.0, 9.0, 11.0, 29.1700000000003, 1.5252737866447026, 4.878194971934962, 0.774553094780513], "isController": false}, {"data": ["/moodle/lib/ajax/service-nologin.php-9", 250, 3, 1.2, 13.124, 9, 51, 12.0, 18.0, 19.0, 35.90000000000009, 2.540237359778898, 33.02804707821899, 2.081307758646968], "isController": false}, {"data": ["/home/aboutus-65", 150, 3, 2.0, 10.266666666666671, 7, 46, 9.0, 11.0, 13.0, 43.960000000000036, 1.5251187050725448, 9.959442168769636, 0.7521337363883156], "isController": false}, {"data": ["/home/news_detail/184-67", 150, 2, 1.3333333333333333, 11.146666666666665, 7, 41, 10.0, 13.900000000000006, 14.0, 39.47000000000003, 1.525165226232842, 6.21087792323335, 0.7864133197763091], "isController": false}, {"data": ["/moodle/lib/ajax/service-nologin.php-10", 250, 2, 0.8, 7.483999999999996, 5, 33, 7.0, 10.0, 11.0, 28.450000000000045, 2.5408311566879758, 0.9478491229050847, 1.9800617803095748], "isController": false}, {"data": ["/home/aboutus-71", 150, 1, 0.6666666666666666, 8.933333333333332, 6, 35, 9.0, 10.0, 11.0, 25.310000000000173, 1.5253668507276, 9.961062627749474, 0.7641730414289637], "isController": false}, {"data": ["/moodle/lib/ajax/service-nologin.php-7", 250, 3, 1.2, 9.975999999999999, 7, 45, 9.0, 13.0, 14.0, 37.41000000000008, 2.540727867719544, 2.0717849311970893, 2.0866720085470085], "isController": false}, {"data": ["/moodle/lib/ajax/service-nologin.php-13", 250, 3, 1.2, 10.248000000000008, 7, 42, 9.0, 14.0, 15.0, 38.960000000000036, 2.541838664416292, 2.85708623314761, 2.0925488223661466], "isController": false}, {"data": ["/moodle/lib/ajax/service-nologin.php-12", 250, 2, 0.8, 11.036000000000003, 7, 208, 9.0, 14.0, 15.0, 32.450000000000045, 2.541451066901158, 2.1170485938151247, 2.0872659641248767], "isController": false}, {"data": ["/moodle/theme/yui_combo.php-4", 250, 1, 0.4, 3.483999999999999, 2, 31, 3.0, 4.0, 5.0, 15.490000000000009, 2.5406762263844147, 1.503564251161089, 1.1810174646083802], "isController": false}, {"data": ["/home/download/1306-75", 50, 50, 100.0, 55.2, 34, 204, 44.0, 73.8, 148.14999999999998, 204.0, 0.5151187348683871, 324.09822026477104, 0.26057764127131305], "isController": false}, {"data": ["/moodle/theme/image.php/classic/core/1731384351/i/loading_small-1", 250, 1, 0.4, 3.3879999999999995, 2, 40, 3.0, 4.0, 4.449999999999989, 21.960000000000036, 2.5404696820348147, 5.460521259920534, 1.36699101054803], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 43 milliseconds, but should not have lasted longer than 30 milliseconds.", 67, 8.804204993429698, 1.2181818181818183], "isController": false}, {"data": ["The operation lasted too long: It took 178 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 61 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 52 milliseconds, but should not have lasted longer than 30 milliseconds.", 7, 0.9198423127463863, 0.12727272727272726], "isController": false}, {"data": ["The operation lasted too long: It took 58 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.39421813403416556, 0.05454545454545454], "isController": false}, {"data": ["The operation lasted too long: It took 49 milliseconds, but should not have lasted longer than 30 milliseconds.", 8, 1.0512483574244416, 0.14545454545454545], "isController": false}, {"data": ["The operation lasted too long: It took 136 milliseconds, but should not have lasted longer than 30 milliseconds.", 9, 1.1826544021024967, 0.16363636363636364], "isController": false}, {"data": ["The operation lasted too long: It took 127 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 130 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 145 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.5256241787122208, 0.07272727272727272], "isController": false}, {"data": ["The operation lasted too long: It took 154 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.39421813403416556, 0.05454545454545454], "isController": false}, {"data": ["The operation lasted too long: It took 85 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 172 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 67 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 204 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 34 milliseconds, but should not have lasted longer than 30 milliseconds.", 12, 1.5768725361366622, 0.21818181818181817], "isController": false}, {"data": ["The operation lasted too long: It took 163 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 76 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 149 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 137 milliseconds, but should not have lasted longer than 30 milliseconds.", 10, 1.314060446780552, 0.18181818181818182], "isController": false}, {"data": ["The operation lasted too long: It took 131 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.39421813403416556, 0.05454545454545454], "isController": false}, {"data": ["The operation lasted too long: It took 161 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 66 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 60 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 54 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.657030223390276, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 35 milliseconds, but should not have lasted longer than 30 milliseconds.", 19, 2.4967148488830486, 0.34545454545454546], "isController": false}, {"data": ["The operation lasted too long: It took 143 milliseconds, but should not have lasted longer than 30 milliseconds.", 8, 1.0512483574244416, 0.14545454545454545], "isController": false}, {"data": ["The operation lasted too long: It took 84 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 208 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 72 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 47 milliseconds, but should not have lasted longer than 30 milliseconds.", 22, 2.890932982917214, 0.4], "isController": false}, {"data": ["The operation lasted too long: It took 42 milliseconds, but should not have lasted longer than 30 milliseconds.", 56, 7.35873850197109, 1.018181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 156 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 65 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 41 milliseconds, but should not have lasted longer than 30 milliseconds.", 43, 5.650459921156373, 0.7818181818181819], "isController": false}, {"data": ["The operation lasted too long: It took 132 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.5256241787122208, 0.07272727272727272], "isController": false}, {"data": ["The operation lasted too long: It took 765 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 144 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.39421813403416556, 0.05454545454545454], "isController": false}, {"data": ["The operation lasted too long: It took 53 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 48 milliseconds, but should not have lasted longer than 30 milliseconds.", 15, 1.971090670170828, 0.2727272727272727], "isController": false}, {"data": ["The operation lasted too long: It took 36 milliseconds, but should not have lasted longer than 30 milliseconds.", 27, 3.54796320630749, 0.4909090909090909], "isController": false}, {"data": ["The operation lasted too long: It took 138 milliseconds, but should not have lasted longer than 30 milliseconds.", 8, 1.0512483574244416, 0.14545454545454545], "isController": false}, {"data": ["The operation lasted too long: It took 168 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 37 milliseconds, but should not have lasted longer than 30 milliseconds.", 53, 6.964520367936925, 0.9636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 31 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.657030223390276, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 46 milliseconds, but should not have lasted longer than 30 milliseconds.", 16, 2.102496714848883, 0.2909090909090909], "isController": false}, {"data": ["The operation lasted too long: It took 40 milliseconds, but should not have lasted longer than 30 milliseconds.", 35, 4.599211563731932, 0.6363636363636364], "isController": false}, {"data": ["The operation lasted too long: It took 157 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 139 milliseconds, but should not have lasted longer than 30 milliseconds.", 6, 0.7884362680683311, 0.10909090909090909], "isController": false}, {"data": ["The operation lasted too long: It took 148 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.657030223390276, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 150 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.39421813403416556, 0.05454545454545454], "isController": false}, {"data": ["The operation lasted too long: It took 234 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 133 milliseconds, but should not have lasted longer than 30 milliseconds.", 6, 0.7884362680683311, 0.10909090909090909], "isController": false}, {"data": ["The operation lasted too long: It took 151 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 88 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 216 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 64 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 142 milliseconds, but should not have lasted longer than 30 milliseconds.", 11, 1.445466491458607, 0.2], "isController": false}, {"data": ["The operation lasted too long: It took 55 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.39421813403416556, 0.05454545454545454], "isController": false}, {"data": ["The operation lasted too long: It took 116 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 140 milliseconds, but should not have lasted longer than 30 milliseconds.", 7, 0.9198423127463863, 0.12727272727272726], "isController": false}, {"data": ["The operation lasted too long: It took 158 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 152 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 128 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 45 milliseconds, but should not have lasted longer than 30 milliseconds.", 24, 3.1537450722733245, 0.43636363636363634], "isController": false}, {"data": ["The operation lasted too long: It took 188 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 51 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.39421813403416556, 0.05454545454545454], "isController": false}, {"data": ["The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 30 milliseconds.", 7, 0.9198423127463863, 0.12727272727272726], "isController": false}, {"data": ["The operation lasted too long: It took 164 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 75 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 38 milliseconds, but should not have lasted longer than 30 milliseconds.", 62, 8.147174770039422, 1.1272727272727272], "isController": false}, {"data": ["The operation lasted too long: It took 146 milliseconds, but should not have lasted longer than 30 milliseconds.", 7, 0.9198423127463863, 0.12727272727272726], "isController": false}, {"data": ["The operation lasted too long: It took 134 milliseconds, but should not have lasted longer than 30 milliseconds.", 6, 0.7884362680683311, 0.10909090909090909], "isController": false}, {"data": ["The operation lasted too long: It took 74 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 141 milliseconds, but should not have lasted longer than 30 milliseconds.", 7, 0.9198423127463863, 0.12727272727272726], "isController": false}, {"data": ["The operation lasted too long: It took 56 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 98 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 135 milliseconds, but should not have lasted longer than 30 milliseconds.", 9, 1.1826544021024967, 0.16363636363636364], "isController": false}, {"data": ["The operation lasted too long: It took 62 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.39421813403416556, 0.05454545454545454], "isController": false}, {"data": ["The operation lasted too long: It took 32 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 129 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 44 milliseconds, but should not have lasted longer than 30 milliseconds.", 37, 4.862023653088042, 0.6727272727272727], "isController": false}, {"data": ["The operation lasted too long: It took 57 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 69 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2628120893561104, 0.03636363636363636], "isController": false}, {"data": ["The operation lasted too long: It took 170 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}, {"data": ["The operation lasted too long: It took 50 milliseconds, but should not have lasted longer than 30 milliseconds.", 11, 1.445466491458607, 0.2], "isController": false}, {"data": ["The operation lasted too long: It took 39 milliseconds, but should not have lasted longer than 30 milliseconds.", 38, 4.993429697766097, 0.6909090909090909], "isController": false}, {"data": ["The operation lasted too long: It took 147 milliseconds, but should not have lasted longer than 30 milliseconds.", 6, 0.7884362680683311, 0.10909090909090909], "isController": false}, {"data": ["The operation lasted too long: It took 189 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1314060446780552, 0.01818181818181818], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5500, 761, "The operation lasted too long: It took 43 milliseconds, but should not have lasted longer than 30 milliseconds.", 67, "The operation lasted too long: It took 38 milliseconds, but should not have lasted longer than 30 milliseconds.", 62, "The operation lasted too long: It took 42 milliseconds, but should not have lasted longer than 30 milliseconds.", 56, "The operation lasted too long: It took 37 milliseconds, but should not have lasted longer than 30 milliseconds.", 53, "The operation lasted too long: It took 41 milliseconds, but should not have lasted longer than 30 milliseconds.", 43], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/home/notice-77", 50, 3, "The operation lasted too long: It took 116 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 52 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 47 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/moodle/lib/ajax/service.php?sesskey=WmvrJeeMTA&info=core_course_get_enrolled_courses_by_timeline_classification-11", 250, 1, "The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/home/mission_vision-66", 150, 2, "The operation lasted too long: It took 43 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 44 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/moodle/lib/ajax/getnavbranch.php-3", 250, 12, "The operation lasted too long: It took 37 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, "The operation lasted too long: It took 35 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, "The operation lasted too long: It took 34 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, "The operation lasted too long: It took 53 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 36 milliseconds, but should not have lasted longer than 30 milliseconds.", 1], "isController": false}, {"data": ["/moodle/lib/ajax/getnavbranch.php-6", 250, 9, "The operation lasted too long: It took 234 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 41 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 52 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 48 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 69 milliseconds, but should not have lasted longer than 30 milliseconds.", 1], "isController": false}, {"data": ["Notice", 150, 3, "The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 54 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 47 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/moodle/theme/image.php/classic/block_myoverview/1731384351/courses-14", 250, 1, "The operation lasted too long: It took 37 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/moodle/course/index.php-2", 250, 250, "The operation lasted too long: It took 38 milliseconds, but should not have lasted longer than 30 milliseconds.", 49, "The operation lasted too long: It took 37 milliseconds, but should not have lasted longer than 30 milliseconds.", 42, "The operation lasted too long: It took 39 milliseconds, but should not have lasted longer than 30 milliseconds.", 34, "The operation lasted too long: It took 36 milliseconds, but should not have lasted longer than 30 milliseconds.", 23, "The operation lasted too long: It took 40 milliseconds, but should not have lasted longer than 30 milliseconds.", 17], "isController": false}, {"data": ["Home", 150, 7, "The operation lasted too long: It took 35 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, "The operation lasted too long: It took 31 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 48 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 50 milliseconds, but should not have lasted longer than 30 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["Moodle", 150, 150, "The operation lasted too long: It took 142 milliseconds, but should not have lasted longer than 30 milliseconds.", 11, "The operation lasted too long: It took 137 milliseconds, but should not have lasted longer than 30 milliseconds.", 10, "The operation lasted too long: It took 136 milliseconds, but should not have lasted longer than 30 milliseconds.", 9, "The operation lasted too long: It took 135 milliseconds, but should not have lasted longer than 30 milliseconds.", 9, "The operation lasted too long: It took 143 milliseconds, but should not have lasted longer than 30 milliseconds.", 8], "isController": false}, {"data": ["/moodle/my/courses.php-8", 250, 250, "The operation lasted too long: It took 43 milliseconds, but should not have lasted longer than 30 milliseconds.", 57, "The operation lasted too long: It took 42 milliseconds, but should not have lasted longer than 30 milliseconds.", 42, "The operation lasted too long: It took 41 milliseconds, but should not have lasted longer than 30 milliseconds.", 24, "The operation lasted too long: It took 44 milliseconds, but should not have lasted longer than 30 milliseconds.", 23, "The operation lasted too long: It took 45 milliseconds, but should not have lasted longer than 30 milliseconds.", 17], "isController": false}, {"data": ["/home-22", 150, 1, "The operation lasted too long: It took 216 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/home/history-70", 150, 1, "The operation lasted too long: It took 46 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/moodle/lib/ajax/service-nologin.php-9", 250, 3, "The operation lasted too long: It took 31 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 41 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 51 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": ["/home/aboutus-65", 150, 3, "The operation lasted too long: It took 46 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 42 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 34 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": ["/home/news_detail/184-67", 150, 2, "The operation lasted too long: It took 41 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 38 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/moodle/lib/ajax/service-nologin.php-10", 250, 2, "The operation lasted too long: It took 31 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/home/aboutus-71", 150, 1, "The operation lasted too long: It took 35 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/moodle/lib/ajax/service-nologin.php-7", 250, 3, "The operation lasted too long: It took 45 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 42 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": ["/moodle/lib/ajax/service-nologin.php-13", 250, 3, "The operation lasted too long: It took 37 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 41 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 42 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": ["/moodle/lib/ajax/service-nologin.php-12", 250, 2, "The operation lasted too long: It took 35 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 208 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/moodle/theme/yui_combo.php-4", 250, 1, "The operation lasted too long: It took 31 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/home/download/1306-75", 50, 50, "The operation lasted too long: It took 41 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, "The operation lasted too long: It took 44 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, "The operation lasted too long: It took 38 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, "The operation lasted too long: It took 39 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, "The operation lasted too long: It took 40 milliseconds, but should not have lasted longer than 30 milliseconds.", 2], "isController": false}, {"data": ["/moodle/theme/image.php/classic/core/1731384351/i/loading_small-1", 250, 1, "The operation lasted too long: It took 40 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
