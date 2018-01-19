// Div list that all contain the quote class
var quoteDivs = document.getElementsByClassName('quote');
var quoteIndex = 0;
var acc = document.getElementsByClassName("accordion");
var acc_i;
var searchBox;
var locationValue = '{}';
var active_domain;
var hwbi_disc_data;
// var d3Data;

$(document).ready(function () {

    initializeTabs();

    // fix for Firefox UI
    $('#community-snapshot-tab-link').trigger("click");
    $('#about-tab-link').trigger("click");

    // Run cycleQuote after 500ms delay on page load.
    setTimeout(cycleQuote, 500);
    google.maps.event.addDomListener(window, 'load', initializeAutocomplete);
    setTimeout(loadPage, 600);

    // Snapshot body
    setAccordion();
    setRankSliders();
    setTimeout(getScoreData, 600);
    $('#community_pdf').on("click", notImplementedAlert);
    $('#rank_btn').on("click", toggleRank);
    $('#rank-exit').on("click", function () {
        $('#rank-window').hide();
    });
    $('.rank-slider').on("slidestop", calculateScore);

    // Customize body
    $('.domain-icon').on('click', selectDomain);

});

function setSearchBlock(selectedTab) {
    $(".selected-tab").map(function(){ $(this).removeClass('selected-tab');});
    $(selectedTab).closest("li").addClass('selected-tab');
    if (selectedTab.hash === "#about-tab") {
        $('#search_block').removeClass('search_block');
        $('#search_block').addClass('about_search');
        $('#report_pdf').hide();
    }
    else {
        $('#search_block').addClass('search_block');
        $('#search_block').removeClass('about_search');
        $('#report_pdf').show();
    }
}

function loadPage() {
    $('#disc-tabs').css("opacity", 100);
    $(window.location.hash + "-link").trigger("click");
}

function initializeTabs() {
    $('#disc-tabs').tabs({
        active: 0,
        beforeActivate: function (event, ui) {
            setSearchBlock(event.currentTarget);
        }
    });
}

function getScoreData() {
    var location_data = locationValue.toString();
    if (location_data === "{}") {
        var locationCookie = getCookie("EPAHWBIDISC");
        if (locationCookie !== "") {
            location_data = locationCookie;
        }
        else {
            return "";
        }
    }
    $('#community-snapshot-tab-link').trigger("click");
    var location = JSON.parse(location_data);
    var data_url = "/hwbi/disc/rest/scores?state=" + location['state'] + "&county=" + location['county'];
    $.ajax({
        url: data_url,
        type: "GET",
        success: function (data, status, xhr) {
            console.log("getScoreData success: " + status);
            setScoreData(data);
            $('#customize_location').html(location['county'] + " County, " + location['state']);
            hwbi_disc_data = JSON.parse(data);
            // setD3Data();
            // setAsterPlot();
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

// cycleQuote: continuously cycles through the divs on the page which have the quote class.
function cycleQuote() {
    var currentQuote = $(quoteDivs).eq(quoteIndex);
    $(currentQuote).fadeIn(1200);
    currentQuote.delay(4000);
    $(currentQuote).fadeOut(1200, cycleQuote);
    currentQuote.delay(1200);
    quoteIndex = ++quoteIndex % quoteDivs.length;
}

// initializeAutocomplete: Initializes google maps search places function with a restriction to only us locations.
function initializeAutocomplete() {
    var input = document.getElementById('search_field');
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
    locationValue = JSON.stringify(json_value);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
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

function setScoreData(data) {
    data = JSON.parse(data);
    document.getElementById('score_indicator_span').style.transform = "rotate(0deg) skew(45deg, -45deg)";
    // Set location info
    $('#location').html("Snapshot results for:<br>" + data["inputs"][1]["value"] + " County, " + data["inputs"][0]["value"]);
    $('#wellbeing-score-location').html("Nation: " + data["outputs"]["nationhwbi"].toFixed(1) + ", State: " +
        data["outputs"]["statehwbi"].toFixed(1));

    // Set location score
    var score = Math.round(data["outputs"]["hwbi"]);
    $('#wellbeing-score').html(score);
    document.getElementById('score_indicator_span').style.transform = "rotate(" + Math.round(score * 90 / 50) + "deg) skew(45deg, -45deg)";

    // Set Domain scores
    // Nature
    var nature_score = data["outputs"]["domains"][0]["score"].toFixed(1);
    $('#nature_score').html(nature_score);
    $('#nature_score_bar').attr('data-percent', nature_score + "%");
    $('#nature_location').html("[Nation: " + data["outputs"]["domains"][0]["stateScore"].toFixed(1) +
        ", State: " + data["outputs"]["domains"][0]["stateScore"].toFixed(1) + "]");
    // Culture
    var cultural_score = data["outputs"]["domains"][1]["score"].toFixed(1);
    $('#cultural_score').html(cultural_score);
    $('#cultural_score_bar').attr('data-percent', cultural_score + "%");
    $('#cultural_location').html("[Nation: " + data["outputs"]["domains"][1]["stateScore"].toFixed(1) +
        ", State: " + data["outputs"]["domains"][1]["stateScore"].toFixed(1) + "]");
    // Education
    var education_score = data["outputs"]["domains"][2]["score"].toFixed(1);
    $('#education_score').html(education_score);
    $('#education_score_bar').attr('data-percent', education_score + "%");
    $('#education_location').html("[Nation: " + data["outputs"]["domains"][2]["stateScore"].toFixed(1) +
        ", State: " + data["outputs"]["domains"][2]["stateScore"].toFixed(1) + "]");
    // Education
    var health_score = data["outputs"]["domains"][3]["score"].toFixed(1);
    $('#health_score').html(health_score);
    $('#health_score_bar').attr('data-percent', health_score + "%");
    $('#health_location').html("[Nation: " + data["outputs"]["domains"][3]["stateScore"].toFixed(1) +
        ", State: " + data["outputs"]["domains"][3]["stateScore"].toFixed(1) + "]");
    // Leisure Time
    var leisure_score = data["outputs"]["domains"][4]["score"].toFixed(1);
    $('#leisure_score').html(leisure_score);
    $('#leisure_score_bar').attr('data-percent', leisure_score + "%");
    $('#leisure_location').html("[Nation: " + data["outputs"]["domains"][4]["stateScore"].toFixed(1) +
        ", State: " + data["outputs"]["domains"][4]["stateScore"].toFixed(1) + "]");
    // Living Standards
    var living_score = data["outputs"]["domains"][5]["score"].toFixed(1);
    $('#living-std_score').html(living_score);
    $('#living-std_score_bar').attr('data-percent', living_score + "%");
    $('#living-std_location').html("[Nation: " + data["outputs"]["domains"][5]["stateScore"].toFixed(1) +
        ", State: " + data["outputs"]["domains"][5]["stateScore"].toFixed(1) + "]");
    // Safety and Security
    var safety_score = data["outputs"]["domains"][6]["score"].toFixed(1);
    $('#safety_score').html(safety_score);
    $('#safety_score_bar').attr('data-percent', safety_score + "%");
    $('#safety_location').html("[Nation: " + data["outputs"]["domains"][6]["stateScore"].toFixed(1) +
        ", State: " + data["outputs"]["domains"][6]["stateScore"].toFixed(1) + "]");
    // Social Cohesion
    var cohesion_score = data["outputs"]["domains"][7]["score"].toFixed(1);
    $('#cohesion_score').html(cohesion_score);
    $('#cohesion_score_bar').attr('data-percent', cohesion_score + "%");
    $('#cohesion_location').html("[Nation: " + data["outputs"]["domains"][7]["stateScore"].toFixed(1) +
        ", State: " + data["outputs"]["domains"][7]["stateScore"].toFixed(1) + "]");

    setTimeout(loadSkillbar, 600);
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

function loadSkillbar() {
    $('.domain-score-bar').each(function () {
        $(this).find('.score-bar').animate({
            width: jQuery(this).attr('data-percent')
        }, 2000);
    });
}

function setRankSliders() {
    var sliderOptions = {
        animate: "fast",
        max: 5,
        min: 1,
        orientation: "horizontal",
        step: .1
    };
    $('#nature-slider-bar').slider(sliderOptions);
    $('#cultural-slider-bar').slider(sliderOptions);
    $('#education-slider-bar').slider(sliderOptions);
    $('#health-slider-bar').slider(sliderOptions);
    $('#leisure-slider-bar').slider(sliderOptions);
    $('#living-std-slider-bar').slider(sliderOptions);
    $('#safety-slider-bar').slider(sliderOptions);
    $('#cohesion-slider-bar').slider(sliderOptions);

}

function toggleRank() {
    var rWindow = $('#rank-window');
    if (rWindow.is(':visible')) {
        rWindow.hide();
    }
    else {
        rWindow.show();
    }
}

function calculateScore() {
    var weights = document.getElementsByClassName('rank-slider');
    var totalWeightArray = $(weights).map(function () {
        return $(this).slider("value");
    });
    var totalWeight = totalWeightArray.toArray().reduce(sumArray);

    var natureScore = hwbi_disc_data["outputs"]["domains"][0]["score"];
    var natureWeight = $('#nature-slider-bar').slider("value");
    var adjustedNatureScore = natureScore * natureWeight;
    var culturalScore = hwbi_disc_data["outputs"]["domains"][1]["score"];
    var culturalWeight = $('#cultural-slider-bar').slider("value");
    var adjustedCulturalScore = culturalScore * culturalWeight;
    var educationScore = hwbi_disc_data["outputs"]["domains"][2]["score"];
    var educationWeight = $('#education-slider-bar').slider("value");
    var adjustedEducationScore = educationScore * educationWeight;
    var healthScore = hwbi_disc_data["outputs"]["domains"][3]["score"];
    var healthWeight = $('#health-slider-bar').slider("value");
    var adjustedHealthScore = healthScore * healthWeight;
    var leisureScore = hwbi_disc_data["outputs"]["domains"][4]["score"];
    var leisureWeight = $('#leisure-slider-bar').slider("value");
    var adjustedLeisureScore = leisureScore * leisureWeight;
    var livingStdScore = hwbi_disc_data["outputs"]["domains"][5]["score"];
    var livingStdWeight = $('#living-std-slider-bar').slider("value");
    var adjustedLivingStdScore = livingStdScore * livingStdWeight;
    var safetyScore = hwbi_disc_data["outputs"]["domains"][6]["score"];
    var safetyWeight = $('#safety-slider-bar').slider("value");
    var adjustedSafetyScore = safetyScore * safetyWeight;
    var cohesionScore = hwbi_disc_data["outputs"]["domains"][7]["score"];
    var cohesionWeight = $('#cohesion-slider-bar').slider("value");
    var adjustedCohesionScore = cohesionScore * cohesionWeight;
    var totalScore = adjustedNatureScore + adjustedCulturalScore + adjustedEducationScore + adjustedHealthScore +
        adjustedLeisureScore + adjustedLivingStdScore + adjustedSafetyScore + adjustedCohesionScore;

    var newScore = totalScore / totalWeight;
    $('#wellbeing-score').html(Math.round(newScore));
    document.getElementById('score_indicator_span').style.transform = "rotate(" + Math.round(newScore * 90 / 50) + "deg) skew(45deg, -45deg)";
}

function sumArray(total, num) {
    return total + num;
}

function notImplementedAlert() {
    alert("This feature has not yet been implemented.");
}

function selectDomain() {
    if (hwbi_disc_data === undefined) {
        return false;
    }
    $('#customize_domain_arrow').show();
    $('#customize_domain_bar').show();
    var domains = $('.domain-icon');
    $(domains).map(function () {
        $(this).removeClass("domain-selected");
    });
    $(this).addClass("domain-selected");
    var domainID = $(this).attr('id');
    active_domain = domainID;
    var domainScore = $(hwbi_disc_data['outputs']['domains']).map(function () {
        if (this['domainID'] === domainID) {
            return this['score'];
        }
    });
    var domainScoreRounded = Math.round(domainScore[0]);
    $('#arrow_initial').css("left", domainScoreRounded + "%");
    $('#score_initial').html(domainScore[0].toFixed(1));
    $('#score_initial').css("left", domainScoreRounded + "%");
    $('#arrow_adjusted').css("left", domainScoreRounded + "%");
    $('#score_adjusted').html(domainScore[0].toFixed(1));
    $('#score_adjusted').css("left", domainScoreRounded + "%");

    $('#customize_domain_details').html(getDomainDescription(domainID) +
        "Move slider left or right to change the indicator score to describe your community better.");
    showDomainIndicators(domainID);
    // Load domain details
    // Load domain services
    // TODO: Create json of domain:indicator service combinations with associated default weights
    // Load indicators and weights into sliders for updated calculations

}

function getDomainDescription(domainID) {
    if (domainID === "Connection") {
        return "Indicators for the Connection to Nature domain<br>Info from Smith, et al. 2012<br>"
    }
    else if (domainID === "Culture") {
        return "Indicators for the Cultural Fulfillment domain<br>Info from Smith, et al. 2012<br>"
    }
    else if (domainID === "Education") {
        return "Indicators for the Education domain<br>Info from Smith, et al. 2012<br>"
    }
    else if (domainID === "Health") {
        return "Indicators for the Health domain<br>Info from Smith, et al. 2012<br>"
    }
    else if (domainID === "Leisure") {
        return "Indicators for the Leisure Time domain<br>Info from Smith, et al. 2012<br>"
    }
    else if (domainID === "Living") {
        return "Indicators for the Living Standards domain<br>Info from Smith, et al. 2012<br>"
    }
    else if (domainID === "Safety") {
        return "Indicators for the Safety and Security domain<br>Info from Smith, et al. 2012<br>"
    }
    else if (domainID === "Social") {
        return "Indicators for the Social Cohesion domain<br>Info from Smith, et al. 2012<br>"
    }
    else {
        return "Ah Oh! Unable to find domain."
    }
}

function showDomainIndicators(domainID) {
    $('.indicators').map(function () {
        this.hide();
    });
    $('.' + domainID).map(function () {
        this.show();
    });
}

// //Aster Plot functions
// function setD3Data() {
//     var domainData = hwbi_disc_data.outputs.domains;
//     var domainColors = ["#82AC45", "#998FE4", "#D59B2D", "#5598C3", "#DC4B60", "#269683", "#606060", "#E5632E"];
//     var domainHighlight = ["#779E3F", "#877EC9", "#B28226", "#4983A8", "#C74457", "#228574", "#545454", "#C75628"];
//     var index = 0;
//     d3Data = domainData.map(function (value) {
//         index += 1;
//         return {
//             "id": value.domainID,
//             "order": index,
//             "score": value.score.toFixed(1),
//             "weight": value.weight,
//             "color": domainColors[index - 1],
//             "label": value.description,
//             "hcolor": domainHighlight[index - 1]
//         }
//     });
// }

// function setAsterPlot() {
//     var width = 250,
//         height = 250,
//         radius = Math.min(width, height) / 2,
//         innerRadius = 0.3 * radius;
//
//     var pie = d3.layout.pie().sort(null).value(function (d) {
//         return d.weight;
//     });
//     var tip = d3.tip().attr('class', 'd3-tip').offset([50, 0]).html(function (d) {
//             // return d.data.label + ": <span style='color:orangered'>" + Math.round(d.data.score) + "</span>";
//         return d.data.label + ": <span style='color:" + d.data.hcolor + "'>" + d.data.score + "</span>";
//     });
//     var arc = d3.svg.arc()
//         .innerRadius(innerRadius)
//         .outerRadius(function (d) {
//           return (radius - innerRadius) * (d.data.score/100) + innerRadius;
//         });
//     var outlineArc = d3.svg.arc().innerRadius(innerRadius).outerRadius(radius);
//     var svg = d3.select("#disc-aster").append("svg").attr("width", width).attr("height", height).append("g")
//         .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//     svg.call(tip);
//
//     // var data = $(d3Data).map(function (d) {
//     //     d.id = d.id;
//     //     d.order = +d.order;
//     //     d.color = d.color;
//     //     d.weight = +d.weight;
//     //     d.score = +d.score;
//     //     d.width = +d.weight;
//     //     d.label = d.label;
//     //     d.hcolor = d.hcolor;
//     // });
//     var data = d3Data;
//
//     var path = svg.selectAll(".solidArc").data(pie(data)).enter().append("path")
//         .attr("fill", function (d) {
//             return d.data.color;
//         })
//         .attr("class", "solidArc")
//         .attr("stroke", "gray")
//         .attr("d", arc)
//         .on('mouseover', tip.show).on('mouseout', tip.hide);
//
//     var outerPath = svg.selectAll(".outlineArc").data(pie(data))
//         .enter().append("path")
//         .attr("fill", "none")
//         .attr("stroke", "gray")
//         .attr("class", "outlineArc")
//         .attr("d", outlineArc);
//       // calculate the weighted mean score
//   var score = data.reduce(function(a, b) {
//       return a + (b.score * b.weight);
//     }, 0) / data.reduce(function(a, b) {
//       return a + b.weight;
//     }, 0);
//
//   svg.append("svg:text")
//     .attr("class", "aster-score")
//     .attr("dy", ".35em")
//     .attr("text-anchor", "middle") // text-align: right
//     .text(Math.round(score));
// }