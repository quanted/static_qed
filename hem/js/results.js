/**
 * Created by dlyons on 5/30/2017.
 */
$(function () {
    var myChart = Highcharts.chart('my_chart', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Population Distribution of Mean Annual Dose by Chemical '
        },
        xAxis: {
            categories: ['.01', '1', '29'],
            title: {
                text: 'Dose'
            }
        },
        yAxis: {
            title: {
                text: '% of Population'
            }
        },
        series: [{
            name: '50-50-1',
            data: [1, 0, 4]
        }]
    });
});