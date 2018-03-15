$(document).ready(function() {
    // Call function to setup tabbed nav

    listen_varroapop_events();
    //initialize_varroapop();
    uberNavTabs(
        ["Colony", "Mites", "Pesticide"],
        {   "isSubTabs":false   }
    );

});


function initialize_varroapop(){

    $('#id_RQEnableReQueen').trigger("change");
    $('#id_enable_mites').trigger("change");
    //ecosystem type conditionally triggers aquatic_body or
    // terrestrial_field type in listen_agdrift_events()
    $('#id_enable_pesticides').trigger("change");


};

function listen_varroapop_events() {

    $('#id_RQEnableReQueen').change(function () {

        if ($(this).val() == "false") {
            $('#id_RQScheduled').attr('disabled', 'disabled');

        }
        else if ($(this).val() == "true") {
            $('#id_RQScheduled').removeAttr('disabled');

        }
    }).trigger('change');

    $('#id_RQScheduled').change(function () {

        if ($(this).val() == "false") {
            $('#id_RQReQueenDate_month').attr('disabled', 'disabled');
            $('#id_RQReQueenDate_day').attr('disabled', 'disabled');
            $('#id_RQReQueenDate_year').attr('disabled', 'disabled');
            $('#id_RQonce').attr('disabled', 'disabled');


        }
        else if ($(this).val() == "true") {
            $('#id_RQReQueenDate_month').removeAttr('disabled');
            $('#id_RQReQueenDate_day').removeAttr('disabled');
            $('#id_RQReQueenDate_year').removeAttr('disabled');
            $('#id_RQonce').removeAttr('disabled');
        }
    }).trigger('change');

    $('#id_enable_mites').change(function () {

        if ($(this).val() == "false") {
            $('#id_ImmEnabled').attr('disabled', 'disabled');
            $('#id_ImmType').attr('disabled', 'disabled');
            $('#id_ImmStart_day').attr('disabled', 'disabled');
            $('#id_ImmStart_month').attr('disabled', 'disabled');
            $('#id_ImmStart_year').attr('disabled', 'disabled');
            $('#id_ImmEnd_day').attr('disabled', 'disabled');
            $('#id_ImmEnd_month').attr('disabled', 'disabled');
            $('#id_ImmEnd_year').attr('disabled', 'disabled');
            $('#id_TotalImmMites').attr('disabled', 'disabled');
            $('#id_PctImmMitesResistant').attr('disabled', 'disabled');
            $('#id_ICWorkerAdultInfest').attr('disabled', 'disabled');

        }
        else if ($(this).val() == "true") {
            $('#id_ImmEnabled').removeAttr('disabled');
            $('#id_ImmType').removeAttr('disabled');
            $('#id_ImmStart_day').removeAttr('disabled');
            $('#id_ImmStart_month').removeAttr('disabled');
            $('#id_ImmStart_year').removeAttr('disabled');
            $('#id_ImmEnd_day').removeAttr('disabled');
            $('#id_ImmEnd_month').removeAttr('disabled');
            $('#id_ImmEnd_year').removeAttr('disabled');
            $('#id_TotalImmMites').removeAttr('disabled');
            $('#id_PctImmMitesResistant').removeAttr('disabled');
            $('#id_ICWorkerAdultInfest').removeAttr('disabled');
        }
    }).trigger('change');

    $('#id_enable_pesticides').change(function () {

        if ($(this).val() == "false") {
            $('#id_chemical_name').attr('disabled', 'disabled');

        }
        else if ($(this).val() == "true") {
            $('#id_chemical_name').removeAttr('disabled');
        }
    }).trigger('change');

    $(window).bind('beforeunload', function () {
        $(":reset").click();
    });

    //$('#my_form').submit(function(){
    //    $("#my_form :disabled").removeAttr('disabled');
    //});
};