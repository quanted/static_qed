$(document).ready(function () {

    initialize();

});

function initialize() {
    formatInputJson();
    setAccordions();
    generateGraphs();
}

function formatInputJson() {
    var input = document.getElementById('inputData_P');
    input.innerHTML = syntaxHighlight(JSON.stringify(JSON.parse(input.innerHTML), undefined, 4));
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function setAccordions() {
    $('#collapsing-div').accordion({
        collapsible: true,
        active: 1,
    });
}

function generateGraphs() {
    var margin = {
        top: 30,
        right: 20,
        bottom: 30,
        left: 50
    };
    var width = 600 - margin.left - margin.right;
    var height = 270 - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // var xAxis = d3.svg.axis().scale(x)
    //     .orient("bottom").ticks(24);
    // var xAxis = d3.select(".axis").call(d3.axisBottom(x).ticks(24));

    // var yAxis = d3.svg.axis().scale(y)
    //     .orient("left").ticks(8);
    // var yAxis = d3.select(".axis").call(d3.axisLeft(y).ticks(8));

    var valueline = d3.line()
        .x(function (d) {
            return x(d.hour);
        })
        .y(function (d) {
            return y(d.rate);
        });

    var data = [];
    $("#dayTable tr").each(function () {
        var rowData = $(this).find('td');
        var hour = parseFloat(rowData.eq(3).text());
        var rate = parseFloat(rowData.eq(4).text());
        var hlife = parseFloat(rowData.eq(5).text());
        if (isNaN(hour) && isNaN(rate)) {
        }
        else {
            var rowArray = {
                "hour": hour,
                "rate": rate,
                "halflife": hlife
            };
            data.push(rowArray);
        }
    });

    var svg = d3.select("#graphDiv")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function (d) {
        d.hour = +d.hour;
        d.rate = +d.rate;
        d.halflife = +d.halflife
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.hour;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.rate;
    })]);

    svg.append("path") // Add the valueline path.
        .attr("class", "line")
        .attr("d", valueline(data));

    svg.append("g") // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("text-anchor", "middle")
        .call(d3.axisBottom(x))
    ;
    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .text("Hours");

    svg.append("g") // Add the Y Axis
        .attr("class", "y axis")
        .call(d3.axisLeft(y).ticks(8).tickFormat(d3.format(".1e")))
    // .text("Photolysis Rate (s^-1)")
    ;
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 3)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("Photolysis Rate (s^-1)");

}

