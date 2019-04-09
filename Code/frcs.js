var e, inputElements, cut_type, system, distance, slope, elevation, machine, load_cost, movein_cost, residue_cost, area, move_in_dist;
var outputText, outputText2;
var DieselPrice = 3.327;

function calculate(){

    // get the harvesting system
    e = document.getElementById("system");
    system = e.options[e.selectedIndex].text;

    //if clear_cut, cut_type = 0; otherwise 1. 
    if (document.getElementById("cut_type").value == "clear_cut"){
        cut_type = 0; 
    } else {
        cut_type = 1;    
    };
    //get yarding distance, percent_slope; and elevation for helicopter systems
    deliver_dist = document.forms["input_form"]["deliver_dist"].value;
    slope = document.forms["input_form"]["slope"].value;
    elevation = document.forms["input_form"]["elevation"].value;

    // get the harvesting system
    e = document.getElementById("machine");
    machine = e.options[e.selectedIndex].text;

    //if include loading costs, load_cost=1; otherwise 0.
    inputElements = document.getElementsByClassName('load_cost');
    if(inputElements[0].checked){
        load_cost = 1;
    } else {
        load_cost = 0;
    }

    //if include move-in costs
    inputElements = document.getElementsByClassName('move_in');
    if(inputElements[0].checked){
        movein_cost = 1;
    } else {
        movein_cost = 0;
    }
    //area treated and one-way move-in distance are needed when movein_cost is checked.
    area = document.forms["input_form"]["area"].value;
    move_in_dist = document.forms["input_form"]["move_in_dist"].value;

    //if include the costs of collecting and chipping residues
    inputElements = document.getElementsByClassName('residue_collect');
    if(inputElements[0].checked){
        residue_cost = 1;
    } else {
        residue_cost = 0;
    }

    //get values of Green wood density, Residue Fraction and Hardwood Fraction
    //gwd: Green wood density; rf: Residue Fraction; hf: Hardwood Fraction.
    //sl: small log; ll: large log
    gwd_chip = document.forms["input_form"]["gwd_chip"].value;
    gwd_sl = document.forms["input_form"]["gwd_sl"].value;
    gwd_ll = document.forms["input_form"]["gwd_ll"].value;
    rf_chip = document.forms["input_form"]["rf_chip"].value;
    rf_sl = document.forms["input_form"]["rf_sl"].value;
    rf_ll = document.forms["input_form"]["rf_ll"].value;
    hf_chip = document.forms["input_form"]["hf_chip"].value;
    hf_sl = document.forms["input_form"]["hf_sl"].value;
    hf_ll = document.forms["input_form"]["hf_ll"].value;

    outputText=rf_sl;
    document.getElementById("output_text").innerHTML = outputText;
    outputText2=hf_chip;
    document.getElementById("output_text2").innerHTML = outputText2;
}


// function validate() {

//     // get the input
//     a = document.forms["input_form"]["aterm"].value;
//     b = document.forms["input_form"]["bterm"].value;
//     c = document.forms["input_form"]["cterm"].value;
    
//     // validate a, b and c
//     if (a == 0) {
//         outputText = "<em>a</em> cannot equal zero!";
//     } else if (isNaN(a)) {
//         outputText = "<em>a</em> must be a number!";
//     } else if (isNaN(b)) {
//         outputText = "<em>b</em> must be a number!";
//     } else if (isNaN(c)) {
//         outputText = "<em>c</em> must be a number!";
//     } else {
//         // calculate the result using x = (-b +- sqrt(b^2 - 4ac)) / 2a
//         var x1 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
//         var x2 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
//         outputText = "For the equation <strong>" + (a == 1 ? "" : a) + "x\u00B2 + " + (b == 1 ? "" : b) + "x + " + c + " = 0</strong>, x can equal <strong>" + x1 + "</strong> or <strong>" + x2 + "</strong>";
//     }
    
//     // output the result (or errors)
//     document.getElementById("output_text").innerHTML = outputText;
// }