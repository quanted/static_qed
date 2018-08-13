var inputJSON = {};
var requiredInputs = ["spatialType", "spatialInput", "startDate", "endDate", "timestep", "runoffSource", "precipSource", "streamAlgorithm"];

var hucMap = null;

$(function () {
    pageLoadStart();

    // Workflow Inputs Tab events //
    var datepicker_options = {
        changeMonth: true,
        changeYear: true,
        autosize: true,
        yearRange: '1900:2100'
    };
    // Page load functions
    $("#start_datepicker").datepicker(datepicker_options);
    $("#end_datepicker").datepicker(datepicker_options);

    // Input window actions
    $("#spatial_input_button").click(toggleSpatialInputs);
    $("#temporal_input_button").click(toggleTemporalInputs);
    $("#runoff_algorithm_input_button").click(toggleRunoffInputs);
    $("#precip_source_input_button").click(togglePrecipInputs);
    $("#stream_algorithm_input_button").click(toggleStreamInputs);

    // Input Validation actions
    $("#huc_id").keyup(spatialInputValidation);
    $('#comid').keyup(spatialInputValidation);

});

function pageLoadStart() {
    $("#workflow_tabs").tabs({
        active: 0,
        disabled: [2, 3]
    });
    return false;
}

// Workflow Inputs Tab Functions //
function setErrorMessage(errorMsg, remove) {
    var errorMsgBlock = document.getElementById("notifications");
    if (remove) {
        errorMsgBlock.innerText = null;
    } else {
        errorMsgBlock.innerHTML = errorMsg;
    }
    return false;
}

function toggleOffAllInputs() {
    $(".workflow_input").removeClass("selected");
    $('.input_fields').fadeOut("faster");
    setErrorMessage("", true);
    return false;
}

function toggleInputField(button, inputBlock) {
    var active = false;
    if (button.hasClass("selected")) {
        active = true;
    }
    toggleOffAllInputs();
    if (!active) {
        button.addClass("selected");
        inputBlock.fadeIn("faster", "linear").css("display", "inline-block");
    }
    return false;
}

function spatialInputValidation() {
    var selectedType = $("#spatial_type").val();
    if (selectedType === "hucid") {
        var hucid = $("#huc_id").val();
        if (Number.isInteger(Number(hucid)) && (hucid.length === 12 || hucid.length === 8)) {
            $('#add_spatial_input').removeClass("blocked");
        }
        else {
            if ($('#add_spatial_input').hasClass("blocked")) {
            }
            else {
                $('#add_spatial_input').addClass("blocked");
            }
        }
        $("#huc_id").focus();
    }
    else if (selectedType === "comid") {
        var comid = $('#comid').val();
        if (Number.isInteger(Number(comid)) && comid.length === 10) {
            $('#add_spatial_input').removeClass("blocked");
        }
        else {
            if ($('#add_spatial_input').hasClass("blocked")) {
            }
            else {
                $('#add_spatial_input').addClass("blocked");
            }
        }
        $("#comid").focus();
    }
    else {
        if (!$('#add_spatial_input').hasClass("blocked")) {
            $('#add_spatial_input').addClass("blocked");
        }
    }
    return false;
}

function dateValidation(startDate, endDate) {
    startDate = startDate.getTime();
    endDate = endDate.getTime();
    if (startDate > endDate) {
        setErrorMessage("Opps! The start date must be a date before or the same as the end date.", false);
        return false;
    }
    return true;
}

function spatialTypeSelect() {
    $('#spatial_type_huc').hide();
    $('#spatial_type_comid').hide();
    var selection = $("#spatial_type").val();
    if (selection === "hucid") {
        $('#spatial_type_huc').show();
    }
    else if (selection === "comid") {
        $('#spatial_type_comid').show();
    }
    else {
        $('#spatial_type_huc').show();
    }
    return false;
}

function validateInput() {
    var valid = true;
    requiredInputs.map((input) => {
        if (!inputJSON.hasOwnProperty(input)) {
            valid = false;
        }
    });
    return valid;
}

function toggleSpatialInputs() {
    var spatialButton = $("#spatial_input_button");
    var spatialBlock = $("#spatial_input");
    toggleInputField(spatialButton, spatialBlock);
    return false;
}

function toggleTemporalInputs() {
    var temporalButton = $('#temporal_input_button');
    var temporalBlock = $('#temporal_input');
    toggleInputField(temporalButton, temporalBlock);
    return false;
}

function toggleRunoffInputs() {
    var runoffButton = $('#runoff_algorithm_input_button');
    var runoffBlock = $('#runoff_input');
    toggleInputField(runoffButton, runoffBlock);
    return false;
}

function togglePrecipInputs() {
    var precipButton = $('#precip_source_input_button');
    var precipBlock = $('#precip_input');
    if (precipButton.hasClass("blocked")) {
        return false;
    }
    toggleInputField(precipButton, precipBlock);
    return false;
}

function toggleStreamInputs() {
    var streamButton = $('#stream_algorithm_input_button');
    var streamBlock = $('#stream_input');
    toggleInputField(streamButton, streamBlock);
    return false;
}

function addToInputTable(row, key, value) {
    var inputKey = document.createElement("div");
    inputKey.setAttribute("class", "input_column_0");
    inputKey.innerHTML = key;
    var inputValue = document.createElement("div");
    inputValue.setAttribute("class", "input_column_1");
    inputValue.innerHTML = value;
    $(row).empty();
    row.appendChild(inputKey);
    row.appendChild(inputValue);
    if (validateInput()) {
        $('#submit_workflow').removeClass("blocked");
    }
    else {
        if (!$('#submit_workflow').hasClass("blocked")) {
            $('#submit_workflow').addClass("blocked");
        }
    }
    return false;
}

function addSpatialInput() {
    if ($('#add_spatial_input').hasClass("blocked")) {
        return false;
    }
    var selectedType = $("#spatial_type").val();
    var id = "";
    if (selectedType === "hucid") {
        id = $("#huc_id").val();
    }
    else {
        id = $("#comid").val();
    }
    inputJSON.spatialType = selectedType;
    inputJSON.spatialInput = id;
    var row = document.getElementById("selected_spatial_input");
    addToInputTable(row, selectedType, id);
    console.log(inputJSON);
    setErrorMessage("", true);
    $('#add_spatial_input').text("Update");
    $('#add_spatial_input').attr("title", "Update selected spatial input.");
    return false;
}

function addTemporalInput() {
    var startDate = $("#start_datepicker").val();
    var endDate = $("#end_datepicker").val();
    var timestep = $("#timestep option:selected").val();
    setErrorMessage("", true);
    if (!dateValidation(new Date(startDate), new Date(endDate))) {
        return false;
    }
    inputJSON.startDate = startDate;
    inputJSON.endDate = endDate;
    inputJSON.timestep = timestep;
    var row1 = document.getElementById("selected_startdate_input");
    var row2 = document.getElementById("selected_enddate_input");
    var row3 = document.getElementById("selected_timestep_input");
    addToInputTable(row1, "startDate", startDate);
    addToInputTable(row2, "endDate", endDate);
    addToInputTable(row3, "timestep", timestep);
    console.log(inputJSON);
    $('#add_temporal_input').text("Update");
    $('#add_temporal_input').attr("title", "Update selected date/time inputs.");
    return false;
}

function addRunoffInput() {
    var runoffSelected = $("#runoff_select").val();
    setErrorMessage("", true);
    inputJSON.runoffSource = runoffSelected;
    var row = document.getElementById("selected_runoff_input");
    addToInputTable(row, "runoffSource", runoffSelected);
    if (runoffSelected === "curvenumber") {
        $("#precip_source_input_button").removeClass("blocked");
    }
    else {
        inputJSON.precipSource = "NULL";
    }
    console.log(inputJSON);
    $("#add_runoff_input").text("Update");
    $('#add_runoff_input').attr("title", "Update selected runoff input.");
    return false;
}

function addPrecipInput() {
    var precipSelected = $("#precip_select").val();
    setErrorMessage("", true);
    inputJSON.precipSource = precipSelected;
    var row = document.getElementById("selected_precip_input");
    addToInputTable(row, "precipSource", precipSelected);
    console.log(inputJSON);
    $('#add_precip_input').text("Update");
    $('#add_precip_input').attr("title", "Update selected precipitation input.");
    return false;
}

function addStreamInput() {
    var streamSelected = $("#stream_algorithm_select").val();
    setErrorMessage("", true);
    inputJSON.streamAlgorithm = streamSelected;
    var row = document.getElementById("selected_stream_input");
    addToInputTable(row, "streamAlgorithm", streamSelected);
    console.log(inputJSON);
    $("#add_stream_input").text("Update");
    $('#add_stream_input').attr("title", "Update selected stream algorithm input.");
    return false;
}

function submitWorkflowJob() {
    // submit ajax call to hms job
    if (!$('#submit_workflow').hasClass("blocked")) {
        alert("Would now submit the workflow job. Not yet implemented!");
    }
    return false;
}

// Leaflet map variables //
var layerESRI = L.esri.basemapLayer('Imagery');
var layerLabels;
var currentSelectedGeometry = null;
var mapSelectionInfo = L.control();
var addPopup = null;

// Leaflet map functions //
function openHucMap() {
    $('#huc_map_block').fadeIn("faster");
    if (hucMap === null) {
        hucMap = L.map('huc_map_div', {renderer: L.svg({padding: 100})}).setView([40.265306, -98.623725], 4);
        L.esri.basemapLayer('Topographic').addTo(hucMap);
        for (var huc in huc_basemaps) {
            if (huc_basemaps.hasOwnProperty(huc)) {
                huc_basemaps[huc].setOpacity(0.4);
                huc_basemaps[huc].setZIndex(10);
                hucMap.addLayer(huc_basemaps[huc]);
            }
        }
        hucMap.on("click", function (e) {
            // Check if click originated from mapSelectionInfo window
            if (e.originalEvent.path[0].id === "huc_map_div" || e.originalEvent.path[0].localName === "path"){
                clickGetStreamComid(e);
            }
        });
        hucMap.on("zoomend", function(){
            var currentLevel = getHucFromZoom();
            var hucNum = currentLevel.slice(4, currentLevel.length);
            $('#current_huc_level').html(" - Currently viewing HUC " + hucNum + " boundaries")
        });
        mapSelectionInfo.onAdd = function (){
            this._div = L.DomUtil.create('div', 'selection_info');
            this.update();
            return this._div;
        };
        mapSelectionInfo.update = function(){
            this._div.innerHTML = '<h4>HUC Selection Options</h4>' +
                '<div id="selection_huc_options">' +
                '<label class="selection_huc_button">HUC 8<input type="radio" checked value="HUC_8" name="selected_huc_type"></label>' +
                '<label class="selection_huc_button">HUC 12<input type="radio" value="HUC_12" name="selected_huc_type"></label>' +
                '</div>' +
                '<h4>HUC Selection Info</h4>' +
                '<div id="selection_info_div">' +
                '<div id="selection_id_div">ID: <span id="selection_id"></span></div>' +
                '<div id="selection_name_div">Name: <span id="selection_name"></span></div>' +
                '<div id="selection_area_div">Area: <span id="selection_area"></span>km<sup>2</sup></div>' +
                '<div id="selection_state_div">State(s): <span id="selection_state"></span></div>' +
                '</div>'
        };
        mapSelectionInfo.addTo(hucMap);
    }
    let currentHucInput = $('#huc_id').val();
    if ( currentHucInput !== undefined){
        getHucDataById(currentHucInput);
    }
    return false;
}

function toggleHucMap() {
    $('#huc_map_block').fadeOut("faster");
    return false;
}

function setBasemap(basemap) {
    if (layerESRI) {
        hucMap.removeLayer(layerESRI);
    }
    layerESRI = L.esri.basemapLayer(basemap);
    hucMap.addLayer(layerESRI);
    if (layerLabels) {
        hucMap.removeLayer(layerLabels);
    }
    if (basemap === 'ShadedRelief' || basemap === 'Imagery' || basemap === 'Terrain') {
        layerLabels = L.esri.basemapLayer(basemap + 'Labels');
        hucMap.addLayer(layerLabels);
    }
}

function changeBasemap(basemaps) {
    var basemap = basemaps.value;
    setBasemap(basemap);
}

function clickGetStreamComid(e) {
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;

    // Specify which huc to get based on the zoom level and which huc is currently visible.
    // Put radio button check for comid or huc on the map.
    // var zoomedHuc = getHucFromZoom();
    var zoomedHuc = $('#selection_huc_options input:checked').val();
    getHucData(zoomedHuc, lat, lng);

    // COMID Request
    // var url = "https://ofmpub.epa.gov/waters10/PointIndexing.Service";
    // var ptIndexParams = {
    //     'pGeometry': 'POINT(' + lng + ' ' + lat + ')'
    //     , 'pGeometryMod': 'WKT,SRSNAME=urn:ogc:def:crs:OGC::CRS84'
    //     , 'pPointIndexingMethod': 'DISTANCE'
    //     , 'pPointIndexingMaxDist': 25
    //     , 'pOutputPathFlag': 'TRUE'
    //     , 'pReturnFlowlineGeomFlag': 'TRUE'
    //     , 'optOutCS': 'SRSNAME=urn:ogc:def:crs:OGC::CRS84'
    //     , 'optOutPrettyPrint': 0
    // };
    // $.ajax({
    //     type: "GET",
    //     url: requestUrl,
    //     jsonp: true,
    //     // data: ptIndexParams,
    //     async: false,
    //     success: function (data, status, jqXHR) {
    //         if (currentSelectedGeometry !== null){
    //             hucMap.removeLayer(currentSelectedGeometry);
    //         }
    //         var hucData = JSON.parse(data);
    //         currentSelectedGeometry = L.geoJSON(hucData);
    //         currentSelectedGeometry.addTo(hucMap);
    //         hucMap.fitBounds(currentSelectedGeometry.getBounds());
    //
    //         // comid = streamData.output.ary_flowlines[0].comid;
    //     },
    //     error: function (jqXHR, status) {
    //         console.log("Error retrieving stream segment data.");
    //     }
    // });
}

function getHucFromZoom() {
    let zoomLevel = hucMap.getZoom();
    if (zoomLevel < 5) {
        return "HUC_2";
    }
    else if (zoomLevel === 5) {
        return "HUC_4";
    }
    else if (zoomLevel === 6) {
        return "HUC_6";
    }
    else if (zoomLevel === 7 || zoomLevel === 8) {
        return "HUC_8";
    }
    else if (zoomLevel === 9) {
        return "HUC_10";
    }
    else if (zoomLevel > 9) {
        return "HUC_12";
    }
    else {
        return "HUC_12";
    }
}

function getHucData(hucType, lat, lng) {
    var baseUrl = "";
    var point = "&geometry={\"x\":" + lng + ",\"y\":" + lat + ",\"spatialReference\":{\"wkid\":4326}}";
    var outFields = "";
    var params = "&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&returnGeometry=true&returnTrueCurves=false&geometryPrecision=&outSR=%7B%22wkid%22+%3A+4326%7D&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson";

    if (hucType === "HUC_12") {
        baseUrl = "https://watersgeo.epa.gov/arcgis/rest/services/NHDPlus_NP21/WBD_NP21_Simplified/MapServer/0/query?where=&text=&time=";
        outFields = "&outFields=OBJECTID%2C+Shape%2C+GAZ_ID%2C+AREA_ACRES%2C+AREA_SQKM%2C+STATES%2C+LOADDATE%2C+HUC_2%2C+HU_2_NAME%2C+HUC_4%2C+HU_4_NAME%2C+HUC_6%2C+HU_6_NAME%2C+HUC_8%2C+HU_8_NAME%2C+HUC_10%2C+HU_10_NAME%2C+HUC_12%2C+HU_12_NAME%2C+HU_12_TYPE%2C+HU_12_MOD%2C+NCONTRB_ACRES%2C+NCONTRB_SQKM%2C+HU_10_TYPE%2C+HU_10_MOD%2C+Shape_Length%2C+Shape_Area";
    }
    // else if (hucType === "HUC_10"){
    //     baseUrl = "https://watersgeo.epa.gov/arcgis/rest/services/NHDPlus_NP21/WBD_NP21_Simplified/MapServer/1/query?where=&text=&time=";
    //     outFields = "&outFields=OBJECTID%2C+Shape%2C+GAZ_ID%2C+AREA_ACRES%2C+AREA_SQKM%2C+STATES%2C+LOADDATE%2C+HUC_2%2C+HU_2_NAME%2C+HUC_4%2C+HU_4_NAME%2C+HUC_6%2C+HU_6_NAME%2C+HUC_8%2C+HU_8_NAME%2C+HUC_10%2C+HU_10_NAME%2C+NCONTRB_ACRES%2C+NCONTRB_SQKM%2C+HU_10_TYPE%2C+HU_10_MOD%2C+Shape_Length%2C+Shape_Area";
    // }
    else {
        hucType = "HUC_8";
        baseUrl = "https://watersgeo.epa.gov/arcgis/rest/services/NHDPlus_NP21/WBD_NP21_Simplified/MapServer/2/query?where=&text=&time=";
        outFields = "&outFields=OBJECTID%2C+Shape%2C+GAZ_ID%2C+AREA_ACRES%2C+AREA_SQKM%2C+STATES%2C+LOADDATE%2C+HUC_2%2C+HU_2_NAME%2C+HUC_4%2C+HU_4_NAME%2C+HUC_6%2C+HU_6_NAME%2C+HUC_8%2C+HU_8_NAME%2C+Shape_Length%2C+Shape_Area";
    }
    var queryString = point + outFields + params;
    getEPAWatersData(baseUrl, queryString, hucType)
}

function getHucDataById(hucID){
    var baseUrl = "";
    var whereCondition = "";
    var outFields = "";
    var params = "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson";
    var queryString = "";
    if(hucID.length === 8){
        baseUrl = "https://watersgeo.epa.gov/arcgis/rest/services/NHDPlus_NP21/WBD_NP21_Simplified/MapServer/2/query?";
        whereCondition = "where=HUC_8+LIKE+%28%27" + hucID + "%27%29";
        outFields = "&outFields=OBJECTID%2C+Shape%2C+GAZ_ID%2C+AREA_ACRES%2C+AREA_SQKM%2C+STATES%2C+LOADDATE%2C+HUC_2%2C+HU_2_NAME%2C+HUC_4%2C+HU_4_NAME%2C+HUC_6%2C+HU_6_NAME%2C+HUC_8%2C+HU_8_NAME%2C+Shape_Length%2C+Shape_Area";
        queryString = whereCondition + outFields + params;
        getEPAWatersData(baseUrl, queryString, "HUC_8");
    }
    else if(hucID.length === 12){
        baseUrl = "https://watersgeo.epa.gov/arcgis/rest/services/NHDPlus_NP21/WBD_NP21_Simplified/MapServer/0/query?";
        whereCondition = "where=HUC_12+LIKE+%28%27" + hucID + "%27%29";
        outFields = "&outFields=OBJECTID%2C+Shape%2C+GAZ_ID%2C+AREA_ACRES%2C+AREA_SQKM%2C+STATES%2C+LOADDATE%2C+HUC_2%2C+HU_2_NAME%2C+HUC_4%2C+HU_4_NAME%2C+HUC_6%2C+HU_6_NAME%2C+HUC_8%2C+HU_8_NAME%2C+HUC_10%2C+HU_10_NAME%2C+HUC_12%2C+HU_12_NAME%2C+HU_12_TYPE%2C+HU_12_MOD%2C+NCONTRB_ACRES%2C+NCONTRB_SQKM%2C+HU_10_TYPE%2C+HU_10_MOD%2C+Shape_Length%2C+Shape_Area";
        queryString = whereCondition + outFields + params;
        getEPAWatersData(baseUrl, queryString, "HUC_12");
    }
}

function addHucToMap(data, hucType) {
    if (currentSelectedGeometry !== null) {
        hucMap.removeLayer(currentSelectedGeometry);
    }
    var hucData = JSON.parse(data);
    var hucNum = hucType.slice(4, hucType.length);
    var hucID = hucData.features[0].properties[hucType];
    currentSelectedGeometry = L.geoJSON(hucData);
    currentSelectedGeometry.addTo(hucMap);
    $('#selection_id').html(hucID);
    $('#selection_name').html(hucData.features[0].properties["HU_" + hucNum + "_NAME"]);
    $('#selection_area').html(Number(hucData.features[0].properties.AREA_SQKM).toFixed(4));
    $('#selection_state').html(hucData.features[0].properties.STATES);
    hucMap.fitBounds(currentSelectedGeometry.getBounds());
    $('#huc_id').val(hucID);
    $('#add_spatial_input').removeClass("blocked");
    setTimeout(function() {
        if (addPopup !== null) {
            hucMap.removeLayer(addPopup);
        }
        addPopup = L.popup({
            keepInView: true,
        }).setLatLng(hucMap.getCenter())
            .setContent('<button id="huc_map_button_add" type="button" onclick="addSpatialInput(); toggleHucMap(); return false;">Add HUC: ' + hucID + '</button>')
            .openOn(hucMap);
    },600);
}

function getEPAWatersData(url, params, hucType) {
    $.ajax({
        type: "GET",
        url: url + params,
        jsonp: true,
        async: false,
        success: function (data, status, jqXHR) {
            addHucToMap(data, hucType);
        },
        error: function (jqXHR, status) {
            console.log("Error retrieving stream segment data.");
        }
    });
}