

/*
$(document).ready(function(){
    jobid = window.location.pathname.split("/").pop()
    window.location.href = 'nta/output/'+jobid
});*/


var jobid = window.location.pathname.split("/").pop();
var timeout = 5000; // Timeout length in milliseconds (1000 = 1 second)
var attemptCount = 0;

$(document).ready(function () {
    setTimeout(checkJobStatus, 1000)
});


function checkJobStatus(){
    var statusUrl = "/nta/status/" + jobid;
    attemptCount += 1;
    //console.log("Process check # :" + attemptCount);
    $.ajax({
        url: statusUrl,
        type: "GET",
        cache: false,
        success: function(data, status, jqXHR) {
            if('status' in data) {
                if (data['status'] === "Completed") {
                    console.log("Task was completed! Redirecting...");
                    var outputUrl = "/nta/output/" + jobid;
                    //window.location.href = outputUrl;
                    $(location).attr('href', outputUrl);
                }
                else if(data['status'] === "Not found"){
                    $('#status').html("Error: NTA task not found!");
                    $('#wait_gif').html("");

                }
                else {
                    console.log("Status: " + data['status']);
                    setTimeout(checkJobStatus, 5000);
                }
            }
            else{
                console.log("Error: No status in response!");
            }
        },
        error: function(jqXHR, status){
            console.log("Error contacting status server");
        },
        complete: function(jqXHR, status) {
            return false;
        }
    })
}