$(document).ready(function () {

    // form initialization
    initializeInputForm();

    // form events
    $('#id_typical_ephemeride_values').change(toggleEphemerideOptions);
    $('#id_contaminant_type').change(toggleContainmentType);
    $('#input_form').click(setInputForm);
    $('#json_form').click(setJsonInput);
    $('#id_json_input').on("blur", formatJson);
    $('.wavelengthTable td').click(editTableCell);
    $('#wlTblEdit').on("blur", setTableCellValue);      // NOT Working

});

function formatJson() {
    try {
        JSON.parse($('#id_json_input').val());
        $('#error_p').html("");
    }
    catch (e) {
        $('#error_p').html("Error: Invalid json string." + e.message);
    }
}

function setInputForm() {
    $('#input_table tr').each(function (i, row) {
        if (!row.children[0].innerText.includes("Json Input")) {
            $(row).removeClass("hidden");
        }
        else {
            $(row).addClass("hidden");
        }
    });
    toggleEphemerideOptions();
    $('#inputOptions').attr('action', "/hms/water_quality/photolysis/output")
}

function setJsonInput() {
    $('#input_table tr').each(function (i, row) {
        // var name = row.children[0].innerText;
        if (!row.children[0].innerText.includes("Input")) {
            $(row).addClass("hidden");
        }
    });
    var json_input = $('.json_input_data');
    json_input.closest('tr').removeClass('hidden');
    $('#inputOptions').attr('action', "/hms/water_quality/photolysis/output/json")
}

function initializeInputForm() {
    $('.json_input_data').closest('tr').addClass("hidden");
    $('#id_latitude').closest('tr').addClass("hidden");
    $('#id_solar_declination_0').closest('tr').addClass("hidden");
    $('#id_right_ascension_0').closest('tr').addClass("hidden");
    $('#id_sidereal_time_0').closest('tr').addClass("hidden");
    setInitialWavelengthTable();
}

function toggleEphemerideOptions() {
    var state = $('#id_typical_ephemeride_values').val();
    hideEphemerideOptions(false);
    if (state === "yes") {
        $("input.ephemeride_0").map(function () {
            $(this).closest('tr').addClass("hidden");
        });
    }
    else {
        $("input.ephemeride_1").map(function () {
            $(this).closest('tr').addClass("hidden");
        });
    }
}

function hideEphemerideOptions(hide) {
    if (hide === false) {
        $("input.ephemeride_0").map(function () {
            $(this).closest('tr').removeClass("hidden");
        });
        $("input.ephemeride_1").map(function () {
            $(this).closest('tr').removeClass("hidden");
        });
    }
    else {
        $("input.ephemeride_0").map(function () {
            $(this).closest('tr').addClass("hidden");
        });
        $("input.ephemeride_1").map(function () {
            $(this).closest('tr').addClass("hidden");
        });
    }
}

function toggleContainmentType() {
    var type = $('#id_contaminant_type').val();
    if (type === "biological") {
        $('.wlCol3')[0].innerHTML = "Biological Weighting Function (hr^(-1)Watts^(-1)cm^2 nm)";
    }
    else {
        $('.wlCol3')[0].innerHTML = "Chemical Absorption Coefficients (L/(mole cm))";
    }
}

function setInitialWavelengthTable() {
    var initialTable = document.createElement("TABLE");
    $(initialTable).addClass("wavelengthTable");

    // Set initial values
    var wavelengthData = [
        ["297.50", "0.069000", "11.100000"],
        ["300.00", "0.061000", "4.670000"],
        ["302.50", "0.057000", "1.900000"],
        ["305.00", "0.053000", "1.100000"],
        ["307.50", "0.049000", "0.800000"],
        ["310.00", "0.045000", "0.530000"],
        ["312.50", "0.043000", "0.330000"],
        ["315.00", "0.041000", "0.270000"],
        ["317.50", "0.039000", "0.160000"],
        ["320.00", "0.037000", "0.100000"],
        ["323.10", "0.035000", "0.060000"],
        ["330.00", "0.029000", "0.020000"]];
    setTableRows(initialTable, wavelengthData);

    // Set table headers
    var header = initialTable.createTHead();
    var hRow = header.insertRow(0);
    var hWL = hRow.insertCell(0);
    hWL.innerHTML = "Wavelength (nm)";
    $(hWL).addClass("wlTableHeader wlCol1");
    var wAC = hRow.insertCell(1);
    wAC.innerHTML = "Water Attenuation Coefficients (m^-1)";
    $(wAC).addClass("wlTableHeader wlCol2");
    var aC = hRow.insertCell(2);
    aC.innerHTML = "Chemical Absorption Coefficients (hr^(-1)Watts^(-1)cm^2 nm)";
    $(aC).addClass("wlTableHeader wlCol3");

    var inputTable = $('#id_wavelength_table').closest("td")[0];
    inputTable.appendChild(initialTable);
}

function setTableRows(table, values) {
    values.map(function (iv, i) {
        var row = table.insertRow(i);
        iv.map(function (jv, j) {
            var cell = row.insertCell(j);
            cell.innerHTML = jv;
        })
    });
}

function editTableCell(){
    if (this.cellIndex !== 0 && this.childElementCount === 0){
        var value = this.innerHTML;
        this.innerHTML = '<input id="wlTblEdit" type="text" value="' + value + '">';
    }
}

function setTableCellValue(){
    var value = $('#wlTblEdit').val();
    if ($.isNumeric(value)){
        this.innerHTML = value;
        $('#error_p').html("");
    }
    else{
        $('#error_p').html("Error: Non-numeric value provided.");
    }
}