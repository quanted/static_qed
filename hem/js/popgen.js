/**
 * Created by dlyons on 2/15/2017.
 */

/** $(function() {
    $('#toggle-event').change(function() {
        $('#console-event').html('Toggle: ' + $(this).prop('checked'))
    })
}) */

function CategoryId(care_id) {
    $.ajax({
        url: 'category_list/',
        data: {
            'care_id': care_id
            },
        dataType: 'json',
        success: function (data) {
            var x = document.getElementById('div_categories');
            if (data.care_id.length > 0) {
                if (x.style.visibility === 'hidden') {
                    x.style.visibility = 'visible';
                    }
                $('#sub_category').empty();
                $('#sub_category').append($('<option>').text(""));
                $.each(data.care_id, function(i, d) {
                    $('#sub_category').append('<option value="' + d.id + '">' + d.title + '</option>');
                });
            } else {
                if (x.style.visibility === 'visible') {
                    x.style.visibility = 'hidden';
                    }
            }
        }
    });
}


function productsync(value)  {
    document.getElementById("textProduct").innerHTML = 'Products: ' + value;
}

function categorysync(value)  {
    prodduct= document.getElementById('selectProductCats');
    document.getElementById("textProduct").innerHTML = 'Products: ' + prodduct.options[prodduct.selectedIndex].value + ' -> ' + value;
    document.getElementById("sub_category1").Value = value;
}

function gendersync(val)  {
    document.getElementById("textGender").innerHTML = 'Gender: ' + val.value;
}
function agesync(val)  {
      var text = "";
      if(val.value ==="age1")  text = "Age Selection Between: 0 - 5 years";
      else if(val.value ==="age2")  text = "Age Selection Between: 6 - 12 years";
      else if(val.value ==="age3")  text = "Age Selection Between: 13 - 15 years";
      else if(val.value ==="age4")  text = "Age Selection Between: 16 - 18 years";
      else if(val.value ==="age5")  text = "Age Selection Between: 19 - 49 years";
      else if(val.value ==="age6")  text = "Age Selection Between: 49+ years";
      else text = "Age Selection Between:";
    document.getElementById("textAge").innerHTML = text;
}

$(document).ready(function(){
  var endpoint = 'hem_jdata/';
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: endpoint,
        dataType: 'json',
        async: true,
        success: function (History) {
            var data = History.history;

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatPercent);

        var chart = d3.select(".chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          data.forEach(function(d) {
            d.population_size = +d.population_size;
          });

          x.domain(data.map(function(d) { return d.gender; }));
          y.domain([0, d3.max(data, function(d) { return d.population_size; })]);

          chart.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          chart.append("g")
              .attr("class", "axis axis--y")
              .call(yAxis)
              //.call(d3.axisLeft(y).ticks(10, "%"))
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".75em")
              .style("text-anchor", "end")
              .text("Population");

          chart.selectAll(".chart")
              .data(data)
            .enter().append("rect")
              .attr("class", "chart")
              .attr("x", function(d) { return x(d.gender); })
              .attr("width", x.rangeBand())
              //.attr("width", x.bandwidth())
              .attr("y", function(d) { return y(d.population_size); })
              .attr("height", function(d) { return height - y(d.population_size); });

        /////////////////////////////
      }  //<<< success function
   });
});