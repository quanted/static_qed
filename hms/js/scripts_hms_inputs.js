$(document).ready(function () {
    // $('#id_boom_height').closest('tr').hide();
    // $('#id_orchard_type').closest('tr').hide();
    // $('#id_drop_size').closest('tr').hide();

    //$("#id_ecosystem_type option[value='Terrestrial Assessment']").prop('disabled',true);
    //$("#id_calculation_input option[value='Fraction']").prop('disabled',true);
    //$("#id_calculation_input option[value*='Initial Average']").prop('disabled',true);
    //$("#id_orchard_type option[value='Normal']").prop('disabled',true);
    //$("#id_orchard_type option[value='Dense']").prop('disabled',true);
    //$("#id_orchard_type option[value='Sparse']").prop('disabled',true);

        $('#id_source').change(function () {

            if ($(this).val() == "NLDAS" && $('#submodel') == "soilmoisture") {
                $('#id_layers').clean();
                $('#id_layers').append($("<option>").val(0).html("0-10cm"));
                $('#id_layers').append($("<option>").val(1).html("10-40cm"));
                $('#id_layers').append($("<option>").val(2).html("40-100cm"));
                $('#id_layers').append($("<option>").val(3).html("100-200cm"));
                $('#id_layers').append($("<option>").val(4).html("0-100cm"));
                $('#id_layers').append($("<option>").val(5).html("0-200cm"));
            }
            else if($(this).val() == "GLDAS" && $('#submodel') == "soilmoisture"){
                $('#id_layers').clean();
                $('#id_layers').append($("<option>").val(0).html("0-10cm"));
                $('#id_layers').append($("<option>").val(1).html("10-40cm"));
                $('#id_layers').append($("<option>").val(2).html("40-100cm"));
                $('#id_layers').append($("<option>").val(3).html("0-100cm"));
            }
        });
    //        $('#id_boom_height').closest('tr').show();
    //        $('#id_orchard_type').closest('tr').hide();
            //$('#id_drop_size').closest('tr').show();
            //$('#id_drop_size').find('option:eq(3)').detach();
            // $('#id_drop_size').find('option:eq(4)').hide();
    //    }
    //      else if ($(this).val() == "Tier I Aerial") {
    //        $('#id_boom_height').closest('tr').hide();
    //        $('#id_orchard_type').closest('tr').hide();
            // $('#id_drop_size').closest('tr').show();
    //    }
    //    else if ($(this).val() == "Tier I Orchard/Airblast") {
    //        $('#id_boom_height').closest('tr').hide();
            // $('#id_drop_size').closest('tr').hide();
    //        $('#id_orchard_type').closest('tr').show();
    //        }
    
    //});

    //$(window).bind('beforeunload', function () {
    //    $(":reset").click();
    //});
});