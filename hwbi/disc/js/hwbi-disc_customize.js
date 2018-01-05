
var searchBox;
var hwbi_disc_data;


$(document).ready(function(){

    google.maps.event.addDomListener(window, 'load', initializeAutocomplete);
    setTimeout(getScoreData, 600);

    // Events
    $('.domain-icon').on('click', selectDomain);

});

// initializeAutocomplete: Initializes google maps search places function with a restriction to only us locations.
function initializeAutocomplete(){
    var input = document.getElementById('community_search_field');
    searchBox = new google.maps.places.Autocomplete(input);
    searchBox.setComponentRestrictions({'country': ['us']});
    searchBox.addListener('place_changed', setLocationValue);
}

function setLocationValue(){
    var place = searchBox.getPlace();
    var county = place.address_components[1]['long_name'].replace(" County", "");
    var state = place.address_components[2]['long_name'];
    var json_value = {};
    json_value["county"] = county;
    json_value["state"] = state;
    $('#location_value').val(JSON.stringify(json_value));
}

function submitSearchForm(){
    document.forms["community_search_form"].submit();
}

function getScoreData() {
    var location_data = $('#location_value').val().toString();
    if (location_data === "{}") {
        var locationCookie = getCookie("EPAHWBIDISC");
        if(locationCookie !== ""){
            location_data = locationCookie;
        }
        else{
            return "";
        }
    }
    var location = JSON.parse(location_data);
    var data_url = "/hwbi/disc/rest/scores?state=" + location['state'] + "&county=" + location['county'];
    $.ajax({
        url: data_url,
        type: "GET",
        success: function (data, status, xhr) {
            console.log("getScoreData success: " + status);
            $('#customize_location').html(location['county'] + " County, " + location['state']);
            hwbi_disc_data = JSON.parse(data);
            setCookie('EPAHWBIDISC', location_data, 1);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("getScoreData error: " + errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            console.log("getScoreData complete: " + textStatus);
            return false;
        }
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function selectDomain(){
    if(hwbi_disc_data === undefined){
        return false;
    }
    var domains = $('.domain-icon');
    $(domains).map(function(){
       $(this).removeClass("domain-selected");
    });
    $(this).addClass("domain-selected");
    var domainID = $(this).attr('id');
    // From hwbi_disc_data load the Domain value for domainID
    // Load domain details
    // Load domain services
    // TODO: Create json of domain:indicator service combinations with associated default weights
    // Load indicators and weights into sliders for updated calculations

}
