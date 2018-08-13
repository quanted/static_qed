// General js for hms model/submodel pages //
var componentData;
var resultMetaTable;
var resultDataTable;

google.charts.load('current', {'packages': ['table', 'corechart']});

$(function () {
    $("#component_tabs").tabs({
        disabled: [2]
    });

    var datepicker_options = {
        changeMonth: true,
        changeYear: true,
        autosize: true,
        yearRange: '1900:2100'
    };
    // Page load functions
    $("#id_startDate").datepicker(datepicker_options);
    $("#id_endDate").datepicker(datepicker_options);

    $('#submit_data_request').on('click', getData);
});

function getData() {
    toggleLoader();
    var params = getParameters();
    $.ajax({
        type: "POST",
        url: baseUrl,
        accepts: "application/json",
        data: JSON.stringify(params),
        processData: false,
        timeout: 0,
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            console.log("Data request success");
            componentData = data;
            setOutputUI();
            // setMetadata();
            // setDataGraph();
            $('#component_tabs').tabs("enable", 2);
            $('#component_tabs').tabs("option", "active", 2);
            toggleLoader();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Data request error...");
            console.log(errorThrown);
            toggleLoader();
        },
        complete: function (jqXHR, textStatus) {
            console.log("Data request complete");
        }
    });
    return false;
}

function setMetadata() {
    var metaDataTile = componentData.dataset;
    var sourceTitle = componentData.dataSource;
    $('#output_metadata_title').html(metaDataTile + ": " + sourceTitle + " Metadata");
    resultMetaTable = new google.visualization.DataTable();
    resultMetaTable.addColumn('string', 'Metadata');
    resultMetaTable.addColumn('string', 'Value');
    $.map(componentData.metadata, function (key, value) {
        resultMetaTable.addRow([value, key]);
    });
    var metaTable = new google.visualization.Table(document.getElementById('output_metadata'));
    var tableOptions = {
        pageSize: 10,
        width: '100%'
    };
    metaTable.draw(resultMetaTable, tableOptions);
    return false;
}

function setDataGraph() {
    var dataTile = componentData.dataset;
    var sourceTitle = componentData.dataSource;
    $('#output_data_title').html(dataTile + ": " + sourceTitle + " Data");
    var chartOption = {
        title: componentData.dataset,
        curveType: 'none',
        legend: {position: 'right'},
        width: 800,
        height: 600
    };

    resultDataTable = new google.visualization.DataTable();
    resultDataTable.addColumn({type: 'datetime', label: 'Date', pattern: 'MM-DD-YYYY HH'});
    var j = 2;
    $.each(componentData.metadata, function (k, v) {
        var testKey = "column_" + j.toString();
        if (k === testKey) {
            resultDataTable.addColumn({type: 'number', label: v});
            j++;
        }
    });
    var colNum = componentData.data[Object.keys(componentData.data)[0]].length;
    if ((j-1) < colNum){
        var i;
        for(i = colNum; i < j-1; i++){
            resultDataTable.addColumn({type: 'number', label: 'Data Column ' + i.toString()});
        }
    }

    $.each(componentData['data'], function (index, row) {
        var r = [];
        var dt = index.split(' ');
        var d = dt[0].split('-');
        r.push(new Date(d[0], d[1] - 1, d[2], dt[1], 0, 0, 0));

        $.each(row, function (key, value) {
            r.push(parseFloat(value));
        });
        if (r.length < j - 1){
            var k;
            for (k = r.length; k < j - 1; k++){
                r.push(0.0);
            }
        }
        console.log(r);
        resultDataTable.addRow(r);
    });
    var chart = new google.visualization.LineChart(document.getElementById("output_data"));
    chart.draw(resultDataTable, chartOption);
    return false;
}

function toggleLoader() {
    $('#submit_data_request_loader').toggleClass("loading_icon");
    $('#submit_data_request').toggleClass("hidden");
}

function exportDataToJSON() {
    var fileName = componentData.dataset + "_" + componentData.dataSource + ".json";
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(componentData)));
    pom.setAttribute('download', fileName);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function exportDataToCSV() {
    var fileName = componentData.dataset + "_" + componentData.dataSource;
    var csvMetadata = google.visualization.dataTableToCsv(resultMetaTable);
    var csvData = google.visualization.dataTableToCsv(resultDataTable);
    var csvFinal = csvMetadata + "\n\n" + csvData;
    var dataStr = 'data:data:text/csv;charset=utf-8,' + encodeURIComponent(csvFinal);
    var pom = document.createElement('a');
    pom.setAttribute('href', dataStr);
    pom.setAttribute('download', fileName + '.csv');
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
