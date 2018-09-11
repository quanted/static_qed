var jobData = null;
var jobID = null;
var catchmentData = null;
var catchmentInfo = null;
var catchmentMap = null;
var dyGraph = null;
var selectedRow = null;

function setOutputTitle() {
    if (jobID === null && testData) {
        jobID = "TEST TASK";
    }
    var title = "Data for Workflow job: " + jobID.toString();
    var output_title = $("#output_title");
    output_title.html("<h3>" + title + "</h3>");
}

function getCatchmentData() {
    var catchment_base_url = "https://watersgeo.epa.gov/arcgis/rest/services/NHDPlus_NP21/Catchments_NP21_Simplified/MapServer/0/query?where=";
    var catchment_url_options = "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=%7B%22wkt%22+%3A+%22GEOGCS%5B%5C%22GCS_WGS_1984%5C%22%2CDATUM%5B%5C%22D_WGS_1984%5C%22%2C+SPHEROID%5B%5C%22WGS_1984%5C%22%2C6378137%2C298.257223563%5D%5D%2CPRIMEM%5B%5C%22Greenwich%5C%22%2C0%5D%2C+UNIT%5B%5C%22Degree%5C%22%2C0.017453292519943295%5D%5D%22%7D&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson";
    var n = 1;
    var query = "";
    jobData.metadata.catchments.map(function (i) {
        if (n !== 0) {
            query = "FEATUREID=" + i.toString();
        }
        else {
            query = "+OR+FEATUREID=" + i.toString();
        }
        n = n + 1;
    });
    var query_url = catchment_base_url + query + catchment_url_options;
    $.ajax({
        type: "GET",
        url: query_url,
        success: function (data, textStatus, jqXHR) {
            catchmentData = JSON.parse(data);
            console.log("Catchment data loaded.");
            setOutputTitle();
            setOutputMap();
            setOutputComidList();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Failed to get catchment data.");
        },
        complete: function (jqXHR, textStatus) {
            console.log(query_url);
        }
    });
}

function setOutputMap() {
    if (catchmentMap === null) {
        catchmentMap = L.map("output_map");
        L.esri.basemapLayer('Topographic').addTo(catchmentMap);
    }

    var geoGroup = L.featureGroup();
    $.each(catchmentData.features, function (index, value) {
        var geo = L.geoJSON(value, {
            style: function (feature) {
                return {
                    color: '#964AFF',
                    weight: 2,
                    fill: '#5238E8'
                };
            }
        });
        geoGroup.addLayer(geo);
    });
    catchmentMap.addLayer(geoGroup);
    catchmentMap.fitBounds(geoGroup.getBounds());
    catchmentMap.setMaxBounds(geoGroup.getBounds());
}

function setOutputComidList() {
    var data = [];
    $.each(catchmentData.features, function (index, value) {
        var d = {
            id: value.properties.FEATUREID,
            region: value.properties.NHDPLUS_REGION,
            huc12: value.properties.WBD_HUC12,
            area: Number.parseFloat(value.properties.AREASQKM).toFixed(4)
        };
        data.push(d);
    });
    $('#output_comid_list').html();
    $('#output_comid_list').tabulator({
        layout: "fitColumns",
        selectable: true,
        rowClick: function (e, row) {
            var d = row.getData();
            if (selectedRow === null || selectedRow !== d.id) {
                showCatchmentDetails(true);
                selectedRow = d.id;
                selectComid(d.id);
            }
            else {
                showCatchmentDetails(false);
                selectedRow = null;
            }
            return false;
        },
        initialSort: [{column: 'id', dir: "asc"}],
        columns: [
            {title: "Catchment ID", field: "id", align: "left", sorter: "number"},
            {title: "Region", field: "region", align: "left", headerSort: false},
            {title: "HUC 12", field: "huc12", align: "left", headerSort: false},
            {title: "Area (km&#178)", field: "area", align: "left", headerSort: false},
        ],
        data: data
    });
}

function setInfoDiv(comid) {
    if (catchmentInfo === null && !testData) {
        var catchment_data_url = "SOME/URL/TO/CATCHMENT/DATA?comid=" + jobData.metadata.catchments.join();
        $.ajax({
            type: "GET",
            url: catchment_data_url,
            accepts: "application/json",
            timeout: 0,
            contentType: "application/json",
            success: function (data, textStatus, jqXHR) {
                console.log("Catchment data loaded.");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Failed to get catchment data.");
            },
            complete: function (jqXHR, textStatus) {
                console.log(catchment_data_url);
            }
        });
    }
    else if (testData) {
        var d = {};
        d[comid] = {
            FROMCOMID: 111111,
            TOCOMID: 2222222,
            SLOPE: 5,
            LengthKM: 0.5,
            StreamLeve: 1,
            StreamOrde: 1,
            DIRECTION: 0,
            ReachCode: 123456789
        };
        catchmentInfo = d;
    }
    var data = [catchmentInfo[comid]];
    $('#output_info_')
    $('#output_info_div').tabulator({
        layout: "fitColumns",
        selectable: false,
        columns: [
            {title: "From ComID", field: "FROMCOMID", align: "left", headerSort: false},
            {title: "To ComID", field: "TOCOMID", align: "left", headerSort: false},
            {title: "Slope", field: "SLOPE", align: "left", headerSort: false},
            {title: "Length (km)", field: "LengthKM", align: "left", headerSort: false},
            {title: "Stream Level", field: "StreamLeve", align: "left", headerSort: false},
            {title: "Stream Order", field: "StreamOrde", align: "left", headerSort: false},
            {title: "Direction", field: "DIRECTION", align: "left", headerSort: false},
            {title: "Reach Code", field: "ReachCode", align: "left", headerSort: false},
        ],
        data: data
    });
}

function setOutputGraph(comid) {
    var dataTitle = "Catchment: " + comid + " Data";
    var labels = ["Date", "Precipitation", "Surface Runoff", "Subsurface Flow", "Stream Flow"];
    var dataCSV = [];
    var dataDict = [];
    var graphOptions = {
        labels: labels,
        // title: dataTitle,
        // legend: 'always',
        // showRangeSelector: true,
        rollPeriod: 12,
        showRoller: true
    };
    var cData = jobData.data[comid];
    $.each(cData.Precipitation.data, function (index, row) {
        var rowD = [];
        var dt = index.split(' ');
        var d = dt[0].split('-');
        var date;
        if (dt.length === 2) {
            var hr = dt[1].split(':');
            if (hr.length === 2) {
                date = new Date(d[0], d[1] - 1, d[2], hr[0], hr[1], 0, 0);
            }
            else {
                date = new Date(d[0], d[1] - 1, d[2], dt[1], 0, 0, 0);
            }
        }
        else {
            date = new Date(d[0], d[1] - 1, d[2], 0, 0, 0);
        }

        rowD.push(date);

        var p = Number.parseFloat(row);
        var sr = Number.parseFloat(cData.Surfacerunoff.data[index]);
        var sbf = Number.parseFloat(cData.Subsurfaceflow.data[index]);
        var sf = Number.parseFloat(cData.Streamflow.data[index]);

        rowD.push(p);
        rowD.push(sr);
        rowD.push(sbf);
        rowD.push(sf);

        dataDict.push({
            date: date,
            precip: p,
            runoff: sr,
            subsurfaceflow: sbf,
            streamflow: sf
        });
        dataCSV.push(rowD);
    });
    var graphEle = document.getElementById('output_graph');
    dyGraph = new Dygraph(graphEle, dataCSV, graphOptions);
    setOutputTable(dataDict);
}

function setOutputTable(data) {
    $('#output_table').html();
    $('#output_table').tabulator({
        layout: "fitColumns",
        height: "250px",
        columns: [
            {title: "Date", field: "date", align: "left", headerSort: false},
            {title: "Precipitation", field: "precip", align: "left", headerSort: false},
            {title: "Surface Runoff", field: "runoff", align: "left", headerSort: false},
            {title: "Subsurface Flow", field: "subsurfaceflow", align: "left", headerSort: false},
            {title: "Stream Flow", field: "streamflow", align: "left", headerSort: false}
        ],
        data: data
    });
}

function setOutputPage() {
    getCatchmentData();
}

function selectComid(comid) {
    setInfoDiv(comid);
    setOutputGraph(comid);
    return false;
}

function showCatchmentDetails(hide) {
    if (hide) {
        $("#output_info").show();
        $("#output_center_bottom").show();
    }
    else {
        $("#output_info").hide();
        $("#output_center_bottom").hide();
    }
    return false;
}

$(function () {

});