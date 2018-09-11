// var baseUrl = "/hms/rest/api/workflow/compare/";
var baseUrl = "/hms/rest/api/v3/workflow/compare/";

$(function () {
});

function setOutputUI(){
    setMetadata();
    setDataGraph2();
    return false;
}

function getParameters() {
    // Dataset specific request object
    var requestJson = {
        "dataset": "Precipitation",
        "source": "compare",
        "dateTimeSpan": {
            "startDate": $("#id_startDate").val(),
            "endDate": $('#id_endDate').val(),
        },
        "geometry": {
            "geometryMetadata": {
                "stationID": $("#id_stationID").val()
            }
        },
    };
    return requestJson;
}

