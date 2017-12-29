
var searchBox;

$(document).ready(function(){

    google.maps.event.addDomListener(window, 'load', initializeAutocomplete);

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
    document.getElementById('location_value').value = "{'county':'" + county + "', 'state':'" + state + "'}";
}
