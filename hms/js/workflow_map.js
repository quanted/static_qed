// --- Page Variables --- //
// initialize the map
var map = L.map('map', {renderer: L.svg({padding: 100})}).setView([40.265306, -98.623725], 5);

// load basemap
L.esri.basemapLayer('Topographic').addTo(map);

// load huc watershed boundaries

var currentInputLayer;

var layerESRI = L.esri.basemapLayer('Imagery');
var layerLabels;

// -- Map functions -- //
function onEachFeatureClick(feature, layer) {
    layer.on('click', function (e) {
        if (this.currentHUC !== feature.properties.HUC8 || this.currentHUC === null) {
            this.currentHUC = feature.properties.HUC8;
            var hucs = [];
            hucs.push(feature.properties.HUC8);
            selectHUCs(hucs);
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
}

function binarySearch(left, right, value) {
    while (left <= right) {
        var mid = Math.floor((left + right) / 2);
        if (currentInputLayer.hasLayer(mid)) {
            var midValue = Number(currentInputLayer.getLayer(mid).feature.properties.HUC8);
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

        $('#geometry-title').removeClass("ui-state-disabled");
        currentInputLayer = L.geoJson(huc8s, {
            style: hucStyle,
            onEachFeature: onEachFeatureClick
        }).addTo(map);
        $('#geometry-title').trigger("click");
    }
    else if (layerSelected.localeCompare("streamNetwork") === 0) {
        $('#geometry-title').removeClass("ui-state-disabled");
        currentInputLayer = L.tileLayer.wms('https://watersgeo.epa.gov/arcgis/services/NHDPlus_NP21/NHDSnapshot_NP21/MapServer/WmsServer??', {
            layers: 4,
            format: 'image/png',
            minZoom: 0,
            maxZoom: 18,
            transparent: true
        }).addTo(map);
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
    $('#workflow-inputs').show();
}

function enableTab() {
    $(this).removeClass("ui-state-disabled");
}

function startLoader(){
    $('#loading-div').show();
    setTimeout(600, stopLoader);
}

function stopLoader(){
    $('#loading-div').hide();
}

$(function () {
    setAccordion();
});