var statusURL = "rest/api/utilities/status/";

var statusData;

$(function(){
    setTimeout(getStatus, 100);
});

function getStatus() {
    $.ajax({
        type: "GET",
        url: statusURL,
        timeout: 0,
        success: function (data, textStatus, jqXHR) {
            statusData = data;
            console.log("Service status request success");
            setTimeout(setStatus, 100);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Service status request error...");
            console.log(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            console.log("Service status request complete");
        }
    });
    return false;
}

function setStatus(){
    $.each(statusData, function(k, v) {
        var s = $("#" + k + "_status");
        s.removeClass("pending");
        var new_status = "down";
        var status_title = k.toUpperCase() + " data source is currently offline.";
        if(v){
            new_status = "up";
            status_title = k.toUpperCase() + " data source is currently available.";
        }
        s.addClass(new_status);
        s.attr("title", status_title);
        $("#" + k + "_pulse").removeClass("pending_pulse");
    });
}