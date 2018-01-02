var searchBox;
var acc = document.getElementsByClassName("accordion");
var acc_i;
var hwbi_disc_data;

$(document).ready(function () {

    google.maps.event.addDomListener(window, 'load', initializeAutocomplete);

    setAccordion();
    setTimeout(getScoreData, 600);
});

function getScoreData(){
    var location_data = $('#location_value').val().toString();
    if(location_data === "{}"){
        // Check for existence of hwbi-disc cookie containing data
        return null;
    }
    var location = JSON.parse(location_data);
    var data_url = "/hwbi/disc/rest/scores?state=" + location['state'] + "&county=" + location['county'];
    $.ajax({
        url: data_url,
        type: "GET",
        success: function (data, status, xhr){
            console.log("getScoreData success: " + status);
            hwbi_disc_data = data;
            setScoreData(data);
            // Create or overwrite hwbi-disc cookie data
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("getScoreData error: " + errorThrown);
        },
        complete: function(jqXHR, textStatus){
            console.log("getScoreData complete: " + textStatus);
            return false;
        }
    });
}

function setScoreData(data){
    data = JSON.parse(data);
    document.getElementById('score_indicator_span').style.transform = "rotate(0deg) skew(45deg, -45deg)";
    // Set location info
    $('#location').html("Snapshot results for:<br>" + data["inputs"][1]["value"] + " County");
    $('#wellbeing-score-location').html("Nation: US, State: " + data["inputs"][0]["value"]);

    // Set location score
    var score = Math.round(data["outputs"]["hwbi"]);
    $('#wellbeing-score').html(score);
    document.getElementById('score_indicator_span').style.transform = "rotate(" + Math.round(score * 90/50) + "deg) skew(45deg, -45deg)";

    var location = "[Nation: US, State: " + data["inputs"][0]["value"] + "]";

    // Set Domain scores
    // Nature
    var nature_score = data["outputs"]["domains"][0]["score"].toFixed(1);
    $('#nature_score').html(nature_score);
    $('#nature_score_bar').attr('data-percent', nature_score + "%");
    $('#nature_location').html(location);
    // Culture
    var cultural_score = data["outputs"]["domains"][1]["score"].toFixed(1);
    $('#cultural_score').html(cultural_score);
    $('#cultural_score_bar').attr('data-percent', cultural_score + "%");
    $('#cultural_location').html(location);
    // Education
    var education_score = data["outputs"]["domains"][2]["score"].toFixed(1);
    $('#education_score').html(education_score);
    $('#education_score_bar').attr('data-percent', education_score + "%");
    $('#education_location').html(location);
    // Leisure Time
    var leisure_score = data["outputs"]["domains"][3]["score"].toFixed(1);
    $('#leisure_score').html(leisure_score);
    $('#leisure_score_bar').attr('data-percent', leisure_score + "%");
    $('#leisure_location').html(location);
    // Living Standards
    var living_score = data["outputs"]["domains"][4]["score"].toFixed(1);
    $('#living-std_score').html(living_score);
    $('#living-std_score_bar').attr('data-percent', living_score + "%");
    $('#living-std_location').html(location);
    // Safety and Security
    var safety_score = data["outputs"]["domains"][5]["score"].toFixed(1);
    $('#safety_score').html(safety_score);
    $('#safety_score_bar').attr('data-percent', safety_score + "%");
    $('#safety_location').html(location);
    // Social Cohesion
    var cohesion_score = data["outputs"]["domains"][6]["score"].toFixed(1);
    $('#cohesion_score').html(cohesion_score);
    $('#cohesion_score_bar').attr('data-percent', cohesion_score + "%");
    $('#cohesion_location').html(location);

    setTimeout(loadSkillbar, 600);
}

// initializeAutocomplete: Initializes google maps search places function with a restriction to only us locations.
function initializeAutocomplete() {
    var input = document.getElementById('community_search_field');
    searchBox = new google.maps.places.Autocomplete(input);
    searchBox.setComponentRestrictions({'country': ['us']});
    searchBox.addListener('place_changed', setLocationValue);
}

function setLocationValue() {
    var place = searchBox.getPlace();
    var county = place.address_components[1]['long_name'].replace(" County", "");
    var state = place.address_components[2]['long_name'];
    var json_value = {};
    json_value["county"] = county;
    json_value["state"] = state;
    $('#location_value').val(JSON.stringify(json_value));
}

function setAccordion() {
    for (acc_i = 0; acc_i < acc.length; acc_i++) {
        acc[acc_i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = $(this.parentNode).find('.domain-description')[0];
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}

function loadSkillbar(){
	$('.domain-score-bar').each(function(){
		$(this).find('.score-bar').animate({
			width:jQuery(this).attr('data-percent')
		},2000);
	});
}
