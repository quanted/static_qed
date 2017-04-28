$(document).ready(function () {
// $(document).onload(function () {
   
    $('#id_boom_height').closest('tr').hide();
    $('#id_airblast_type').closest('tr').hide();
    $('#id_drop_size_ground').closest('tr').hide();
//    $('#id_drop_size_aerial').closest('tr').hide();
//    $('#id_aquatic_body_type').closest('tr').hide();
    $('#id_terrestrial_field_type').closest('tr').hide();
//    $('#id_epa_pond_width').closest('tr').hide();
//    $('#id_epa_pond_depth').closest('tr').hide();
    $('#id_epa_wetland_width').closest('tr').hide();
    $('#id_epa_wetland_depth').closest('tr').hide();
    $('#id_user_pond_width').closest('tr').hide();
    $('#id_user_pond_depth').closest('tr').hide();
    $('#id_user_wetland_width').closest('tr').hide();
    $('#id_user_wetland_depth').closest('tr').hide();
    $('#id_user_terrestrial_width').closest('tr').hide();
//    $('#id_downwind_distance').closest('tr').hide();
    $('#id_user_frac_applied').closest('tr').hide();
    $('#id_user_avg_dep_gha').closest('tr').hide();
    $('#id_user_avg_dep_mgcm2').closest('tr').hide();
    $('#id_user_avg_dep_lbac').closest('tr').hide();
    $('#id_user_avg_conc_ngl').closest('tr').hide();

    // $("#id_assessment_type option[value='Terrestrial Assessment']").prop('disabled',true);
    // $("#id_calculation_input option[value='Fraction']").prop('disabled',true);
    // $("#id_calculation_input option[value*='Initial Average']").prop('disabled',true);
    // $("#id_airblast_type option[value='Normal']").prop('disabled',true);
    // $("#id_airblast_type option[value='Dense']").prop('disabled',true);
    // $("#id_airblast_type option[value='Sparse']").prop('disabled',true);

    $('#id_application_method').change(function () {

        if ($(this).val() == "Tier I Ground") {
            $('#id_drop_size_aerial').closest('tr').hide();
            $('#id_drop_size_ground').closest('tr').show();
            $('#id_boom_height').closest('tr').show();
            $('#id_airblast_type').closest('tr').hide(); //orchard_type
        }
        else if ($(this).val() == "Tier I Aerial") {
            $('#id_boom_height').closest('tr').hide();
            $('#id_drop_size_ground').closest('tr').hide();
            $('#id_airblast_type').closest('tr').hide();
            $('#id_drop_size_aerial').closest('tr').show();
        }
        else if ($(this).val() == "Tier I Orchard/Airblast") {
            $('#id_drop_size_aerial').closest('tr').hide();
            $('#id_drop_size_ground').closest('tr').hide();
            $('#id_boom_height').closest('tr').hide();
            $('#id_airblast_type').closest('tr').show();
        }
    });
    $('#id_assessment_type').change(function () {

        if ($(this).val() == "Aquatic Assessment") {
            $('#id_aquatic_body_type').closest('tr').show();
            $('#id_epa_pond_width').closest('tr').show();
            $('#id_epa_pond_depth').closest('tr').show();
            $('#id_epa_wetland_width').closest('tr').hide();
            $('#id_epa_wetland_depth').closest('tr').hide();
            $('#id_user_pond_width').closest('tr').hide();
            $('#id_user_pond_depth').closest('tr').hide();
            $('#id_user_wetland_width').closest('tr').hide();
            $('#id_user_wetland_depth').closest('tr').hide();
            $('#id_terrestrial_field_type').closest('tr').hide();
            $('#id_user_terrestrial_width').closest('tr').hide();
        }
        else if ($(this).val() == "Terrestrial Assessment") {
            $('#id_aquatic_body_type').closest('tr').hide();
            $('#id_terrestrial_field_type').closest('tr').show();
            $('#id_epa_pond_width').closest('tr').hide();
            $('#id_epa_pond_depth').closest('tr').hide();
            $('#id_epa_wetland_width').closest('tr').hide();
            $('#id_epa_wetland_depth').closest('tr').hide();
            $('#id_user_pond_width').closest('tr').hide();
            $('#id_user_pond_depth').closest('tr').hide();
            $('#id_user_wetland_width').closest('tr').hide();
            $('#id_user_wetland_depth').closest('tr').hide();
            $('#id_user_terrestrial_width').closest('tr').hide();
        }
    });
    $('#id_aquatic_body_type').change(function () {

        if ($(this).val() == "EPA Defined Pond") {
            $('#id_epa_pond_width').closest('tr').show();
            $('#id_epa_pond_depth').closest('tr').show();
            $('#id_epa_wetland_width').closest('tr').hide();
            $('#id_epa_wetland_depth').closest('tr').hide();
            $('#id_user_pond_width').closest('tr').hide();
            $('#id_user_pond_depth').closest('tr').hide();
            $('#id_user_wetland_width').closest('tr').hide();
            $('#id_user_wetland_depth').closest('tr').hide();
            $('#id_user_terrestrial_width').closest('tr').hide();
        }
        else if ($(this).val() == "EPA Defined Wetland") {
            $('#id_epa_pond_width').closest('tr').hide();
            $('#id_epa_pond_depth').closest('tr').hide();
            $('#id_epa_wetland_width').closest('tr').show();
            $('#id_epa_wetland_depth').closest('tr').show();
            $('#id_user_pond_width').closest('tr').hide();
            $('#id_user_pond_depth').closest('tr').hide();
            $('#id_user_wetland_width').closest('tr').hide();
            $('#id_user_wetland_depth').closest('tr').hide();
            $('#id_user_terrestrial_width').closest('tr').hide();
        }
        else if ($(this).val() == "User Defined Pond") {
            $('#id_epa_pond_width').closest('tr').hide();
            $('#id_epa_pond_depth').closest('tr').hide();
            $('#id_epa_wetland_width').closest('tr').hide();
            $('#id_epa_wetland_depth').closest('tr').hide();
            $('#id_user_pond_width').closest('tr').show();
            $('#id_user_pond_depth').closest('tr').show();
            $('#id_user_wetland_width').closest('tr').hide();
            $('#id_user_wetland_depth').closest('tr').hide();
            $('#id_user_terrestrial_width').closest('tr').hide();
        }
        else if ($(this).val() == "User Defined Wetland") {
            $('#id_epa_pond_width').closest('tr').hide();
            $('#id_epa_pond_depth').closest('tr').hide();
            $('#id_epa_wetland_width').closest('tr').hide();
            $('#id_epa_wetland_depth').closest('tr').hide();
            $('#id_user_pond_width').closest('tr').hide();
            $('#id_user_pond_depth').closest('tr').hide();
            $('#id_user_wetland_width').closest('tr').show();
            $('#id_user_wetland_depth').closest('tr').show();
            $('#id_user_terrestrial_width').closest('tr').hide();
        }
    });
    $('#id_terrestrial_field_type').change(function () {

        if ($(this).val() == "Point Deposition") {
            $('#id_user_terrestrial_width').closest('tr').hide();
            $('#id_epa_pond_width').closest('tr').hide();
            $('#id_epa_pond_depth').closest('tr').hide();
            $('#id_epa_wetland_width').closest('tr').hide();
            $('#id_epa_wetland_depth').closest('tr').hide();
            $('#id_user_pond_width').closest('tr').hide();
            $('#id_user_pond_depth').closest('tr').hide();
            $('#id_user_wetland_width').closest('tr').hide();
            $('#id_user_wetland_depth').closest('tr').hide();
            $('#id_user_terrestrial_width').closest('tr').hide();
        }
        else if ($(this).val() == "User Defined Terrestrial Area") {
            $('#id_user_terrestrial_width').closest('tr').show();
            $('#id_epa_pond_width').closest('tr').hide();
            $('#id_epa_pond_depth').closest('tr').hide();
            $('#id_epa_wetland_width').closest('tr').hide();
            $('#id_epa_wetland_depth').closest('tr').hide();
            $('#id_user_pond_width').closest('tr').hide();
            $('#id_user_pond_depth').closest('tr').hide();
            $('#id_user_wetland_width').closest('tr').hide();
            $('#id_user_wetland_depth').closest('tr').hide();
        }
    });
    $('#id_calculation_input').change(function () {

        if ($(this).val() == "Distance") {
            $('#id_downwind_distance').closest('tr').show();
            $('#id_user_frac_applied').closest('tr').hide();
            $('#id_user_avg_dep_gha').closest('tr').hide();
            $('#id_user_avg_dep_mgcm2').closest('tr').hide();
            $('#id_user_avg_dep_lbac').closest('tr').hide();
            $('#id_user_avg_conc_ngl').closest('tr').hide();
        }
        else if ($(this).val() == "Fraction") {
            $('#id_downwind_distance').closest('tr').hide();
            $('#id_user_frac_applied').closest('tr').show();
            $('#id_user_avg_dep_gha').closest('tr').hide();
            $('#id_user_avg_dep_mgcm2').closest('tr').hide();
            $('#id_user_avg_dep_lbac').closest('tr').hide();
            $('#id_user_avg_conc_ngl').closest('tr').hide();
        }
        else if ($(this).val() == "Initial Average Deposition (g/ha)") {
            $('#id_downwind_distance').closest('tr').hide();
            $('#id_user_frac_applied').closest('tr').hide();
            $('#id_user_avg_dep_gha').closest('tr').show();
            $('#id_user_avg_dep_mgcm2').closest('tr').hide();
            $('#id_user_avg_dep_lbac').closest('tr').hide();
            $('#id_user_avg_conc_ngl').closest('tr').hide();
        }
        else if ($(this).val() == "Initial Average Deposition (lb/ac)") {
            $('#id_downwind_distance').closest('tr').hide();
            $('#id_user_frac_applied').closest('tr').hide();
            $('#id_user_avg_dep_gha').closest('tr').hide();
            $('#id_user_avg_dep_mgcm2').closest('tr').hide();
            $('#id_user_avg_dep_lbac').closest('tr').show();
            $('#id_user_avg_conc_ngl').closest('tr').hide();
        }
        else if ($(this).val() == "Initial Average Concentration (ng/L)") {
            $('#id_downwind_distance').closest('tr').hide();
            $('#id_user_frac_applied').closest('tr').hide();
            $('#id_user_avg_dep_gha').closest('tr').hide();
            $('#id_user_avg_dep_mgcm2').closest('tr').hide();
            $('#id_user_avg_dep_lbac').closest('tr').hide();
            $('#id_user_avg_conc_ngl').closest('tr').show();
        }
        else if ($(this).val() == "Initial Average Deposition (mg/cm2)") {
            $('#id_downwind_distance').closest('tr').hide();
            $('#id_user_frac_applied').closest('tr').hide();
            $('#id_user_avg_dep_gha').closest('tr').hide();
            $('#id_user_avg_dep_mgcm2').closest('tr').show();
            $('#id_user_avg_dep_lbac').closest('tr').hide();
            $('#id_user_avg_conc_ngl').closest('tr').hide();
        }
    });
    $(window).bind('beforeunload', function () {
        $(":reset").click();
    });

});