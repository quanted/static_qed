
// initialize the map
var map = L.map('map',{
    loadingControl: true
}).setView([39.609280, -92.100678], 8);

// read model output
var outputData = readOutputJSON();
var summaryHUC8Data = readSummaryHUC8JSON();
addHUC8Statistics();

// get feature output mode
var mode = getMode(outputData);

// specify field (placeholder)
var field = "chronic_em_inv";

// add out data
var info_box_title = null;
var info_box_id = null;
var outLayer = null;


displayOutput(field);

// load a tile layer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(map);


// -------------- BASE MAP code -------------- //

var layer = L.esri.basemapLayer('NationalGeographic').addTo(map);
//var currentHucLayer = huc_basemaps.HUC8;       // raster HUC
huc8Layer = L.geoJson(huc8s, {
    style: hucStyle//,
    //onEachFeature: onEachFeatureClick
}).addTo(map);
colorHUC8s($('#fieldselect').val(), $('#summaryselect').val());



addStreams();
// --------------- INFO WINDOW code -------------- //

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'stream_info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h5>' + info_box_title + '</h5>' +
        '<table id="stream_info_table" style="margin-bottom: 0px !important; background: none !important;"> ' +
        '<tr><td>Latitude:</td> <td id="latVal"></td></tr>' +
        '<tr><td>Longitude:</td><td id="lngVal"></td></tr>' +
        '<tr><td>' + info_box_id + '</td><td id="boxid"></td></tr>';
};

info.addTo(map);
