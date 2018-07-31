var inputJSON = {};
var requiredInputs = ["spatialType", "spatialInput", "startDate", "endDate", "timestep", "runoffSource", "precipSource", "streamAlgorithm"];

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

    // Map actions

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
        if (Number.isInteger(Number(hucid)) && (hucid.length === 12 || hucid.length === 8)){
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
        id = Number($("#huc_id").val());
    }
    else {
        id = Number($("#comid").val());
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
var hucMap = null;
var layerESRI = L.esri.basemapLayer('Imagery');
var layerLabels;

// Leaflet map functions //
function openHucMap() {
    $('#huc_map_block').fadeIn("faster");
    if (hucMap === null) {
        hucMap = L.map('huc_map_div', {renderer: L.svg({padding: 100})}).setView([40.265306, -98.623725], 4);
        L.esri.basemapLayer('Topographic').addTo(hucMap);
        for (var huc in huc_basemaps) {
            if (huc_basemaps.hasOwnProperty(huc)) {
                huc_basemaps[huc].addTo(hucMap);
            }
        }
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