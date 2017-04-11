$(document).ready(function() {


    $('#id_source').change(function(){
        if(document.input_table.layers) {
            var element = document.getElementById("id_source");
            if(element.options[element.selectedIndex].value === 'NLDAS'){
                 document.input_table.layers.options.length = 0;
                 document.input_table.layers.options[0] = new Option("0-10cm", 0);
                 document.input_table.layers.options[1] = new Option("10-40cm", 1);
                 document.input_table.layers.options[2] = new Option("40-100cm", 2);
                 document.input_table.layers.options[3] = new Option("100-200cm", 3);
                 document.input_table.layers.options[4] = new Option("0-100cm", 4);
                 document.input_table.layers.options[5] = new Option("0-200cm", 5);
             }
             else if (element.options[element.selectedIndex].value === 'GLDAS') {
                document.input_table.layers.options.length = 0;
                document.input_table.layers.options[0] = new Option("0-10cm", 0);
                document.input_table.layers.options[1] = new Option("10-40cm", 1);
                document.input_table.layers.options[2] = new Option("40-100cm", 2);
                document.input_table.layers.options[3] = new Option("0-100cm", 3);
             }
        }
    });

    $(window).bind('beforeunload', function () {
        $(":reset").click();
    });
});