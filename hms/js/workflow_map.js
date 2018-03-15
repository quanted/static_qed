// --- Page Variables --- //
// initialize the map
var map = L.map('map', {renderer: L.svg({padding: 100})}).setView([40.265306, -98.623725], 5);

// load basemap
L.esri.basemapLayer('Topographic').addTo(map);

// load huc watershed boundaries

var currentInputLayer;

var layerESRI = L.esri.basemapLayer('Imagery');
var layerLabels;

var huc8;
var workflowData;

// -- Map functions -- //
function onEachFeatureClick(feature, layer) {
    layer.on('click', function (e) {
        if (this.currentHUC !== feature.properties.HUC_8 || this.currentHUC === null) {
            this.currentHUC = feature.properties.HUC_8;
            var hucs = [];
            hucs.push(feature.properties.HUC_8);
            selectHUCs(hucs);
            huc8 = feature.properties.HUC_8;
            $('#hucID').html("<a href='https://cfpub.epa.gov/surf/huc.cfm?huc_code=" + feature.properties.HUC_8 + "' target='_blank'>" +
                feature.properties.HUC_8 + " HUC 8 ID </a>");
        }
        else {
            resetHUCLayer();
            this.currentHUC = null;
        }
    });
}

function setBasemap(basemap) {
    if (layerESRI) {
        map.removeLayer(layerESRI);
    }
    layerESRI = L.esri.basemapLayer(basemap);
    map.addLayer(layerESRI);
    if (layerLabels) {
        map.removeLayer(layerLabels);
    }
    if (basemap === 'ShadedRelief' || basemap === 'Imagery' || basemap === 'Terrain') {
        layerLabels = L.esri.basemapLayer(basemap + 'Labels');
        map.addLayer(layerLabels);
    }
}

function changeBasemap(basemaps) {
    var basemap = basemaps.value;
    setBasemap(basemap);
    updateInputLayer();
}

//style HUC 8 polygon
function getColor(d) {
    return '#93D4BC'
}

//style HUC 8 polygon cont.
function hucStyle(feature) {
    return {
        fillColor: getColor(feature.properties.NumbSpc),
        weight: .3,
        opacity: 0.9,
        color: 'black',
        fillOpacity: 0.3
    };
}

function resetHUCLayer() {
    currentInputLayer.eachLayer(function (layer) {
        currentInputLayer.resetStyle(layer);
    });
}

//style selected HUC 8 polygon
function selectHUCs(hucs) {
    resetHUCLayer();
    var layerGroup = [];
    var hucObject = currentInputLayer.getLayers();
    var l = 46; // layers start at layerID = 46
    var r = hucObject.length + l;
    $.each(hucs, function (index, value) {
        var resultIdx = binarySearch(l, r, value);
        if (resultIdx !== -1) {
            currentInputLayer.getLayer(resultIdx).setStyle({
                color: 'black',
                weight: 0.7,
                fillColor: '#0979D9',
                fillOpacity: 0.4
            });
            layerGroup.push(currentInputLayer.getLayer(resultIdx));
        }
    });
    map.fitBounds(L.featureGroup(layerGroup).getBounds());
    enableTab($('#date-title'));
}

function binarySearch(left, right, value) {
    while (left <= right) {
        var mid = Math.floor((left + right) / 2);
        if (currentInputLayer.hasLayer(mid)) {
            var midValue = Number(currentInputLayer.getLayer(mid).feature.properties.HUC_8);
            if (Number(midValue) === Number(value)) {
                return mid;
            }
            else if (Number(midValue) > Number(value)) {
                right = mid - 1;
            }
            else {
                left = mid + 1;
            }
        }
        else {
            return -1;
        }
    }
    return -1;
}

function updateInputLayer() {
    // startLoader();
    $("#inputSearchBlock").hide();
    setAccordion();
    if (currentInputLayer == null) {
    }
    else {
        map.removeLayer(currentInputLayer);
    }
    var selection = document.getElementById("inputLayer");
    var layerSelected = selection.options[selection.selectedIndex].value;
    if (layerSelected.localeCompare("none") === 0) {
    }
    else if (layerSelected.localeCompare("huc8") === 0) {
        $("#inputSearchType").html("HUC 8 ID");
        $('#geometry-title').removeClass("ui-state-disabled");
        currentInputLayer = L.geoJson(huc8s, {
            style: hucStyle,
            onEachFeature: onEachFeatureClick
        }).addTo(map);
        $("#inputSearchBlock").show();
        $('#geometry-title').trigger("click");
    }
    else if (layerSelected.localeCompare("streamNetwork") === 0) {
        $("#inputSearchType").html("Stream segment ID");
        $('#geometry-title').removeClass("ui-state-disabled");
        currentInputLayer = L.tileLayer.wms('https://watersgeo.epa.gov/arcgis/services/NHDPlus_NP21/NHDSnapshot_NP21/MapServer/WmsServer??', {
            layers: 4,
            format: 'image/png',
            minZoom: 0,
            maxZoom: 18,
            transparent: true
        }).addTo(map);
        $("#inputSearchBlock").show();
        $('#geometry-title').trigger("click");
    }
    else {
        // do something else
    }
    // stopLoader();
    return false;
}

function setAccordion() {
    // Also functions as disableTab
    $('#workflow-inputs').accordion({header: "h3", collapsible: true, active: false});
    $('#geometry-title').addClass("ui-state-disabled");
    $('#date-title').addClass("ui-state-disabled");
    $('#dataset-title').addClass("ui-state-disabled");
    $('#source-title').addClass("ui-state-disabled");
    $('#options-title').addClass("ui-state-disabled");
    $('#data-request').hide();
    $('#inputSearch').val("");
    $('#workflow-inputs').show();
}

function enableTab(tab) {
    $(tab).removeClass("ui-state-disabled");
    $(tab).trigger('click');
}

function startLoader() {
    $('#loading-div').show();
    // setTimeout(600, stopLoader);
}

function stopLoader() {
    $('#loading-div').hide();
}

function setDatePickers() {
    var options = {autoSize: true};
    $('#startDate').datepicker(options);
    $('#endDate').datepicker(options);
}

function validateDates() {
    $('#date-input-error').html("");
    var startDate = new Date($('#startDate').val());
    var endDate = new Date($('#endDate').val());
    if (!isNaN(startDate.getDate()) && !isNaN(endDate.getDate())) {
        if ((endDate > startDate)) {
            enableTab($('#dataset-title'));
        }
        else {
            $('#date-input-error').html("Invalid date range, start date must be before end date.");
        }
    }
}

function validateDataset() {
    var dataset = $('#dataset-input').val();
    if (dataset !== "") {
        enableTab($("#source-title"));
    }
}

function validateSource() {
    var source = $('#source-input').val();
    if (source !== "") {
        enableTab($("#options-title"));
        enableSubmission();
    }
}

function enableSubmission() {
    $('#data-request').show();
}

function getData() {
    $('#data-request-error').html("");
    $('#data-request-success').html("");
    startLoader();
    var dataset = $('#dataset-input').val();
    var baseUrl = "http://127.0.0.1:8000/hms/rest/api/hydrology/" + dataset;
    // var baseUrl = "https://qedinternal.epa.gov/hms/rest/api/hydrology/" + dataset;
    var startDate = new Date($('#startDate').val()).getDate();
    var endDate = new Date($('#endDate').val()).getDate();
    var source = $('#source-input').val();
    var requestData = {
        "geometryType": "huc",
        "geometryInput": huc8,
        "source": source,
        "dateTimeSpan": {
            "startDate": startDate,
            "endDate": endDate
        },
        "timeLocalized": false
    };
    $.ajax({
        url: baseUrl,
        data: requestData,
        success: function (data, textStatus, jqXHR) {
            workflowData = data;
            $("#data-request-success").html("Successfully downloaded workflow data.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#data-request-error').html("Error downloading workflow data. " + errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            stopLoader();
        }
    });
}

function searchMap(){
    var type = $('#inputLayer').val();
    var searchValue = $('#inputSearch').val();
    if(type === "huc8"){
        if(searchValue.length === 8 && !isNaN(searchValue)){
            selectHUCs([searchValue]);
        }
    }
}

$(function () {
    setAccordion();
    setDatePickers();

    $('.date-input').on("change", validateDates);
    $('#dataset-input').on("change", validateDataset);
    $('#source-input').on("change", validateSource);
    $('#inputSearch').on("keyup", searchMap);
});