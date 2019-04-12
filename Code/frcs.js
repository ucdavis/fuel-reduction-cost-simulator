var e, inputElements, cut_type, system, distance, slope, elevation, 
machine, load_cost, movein_cost, residue_cost, area, move_in_dist, CalcMoveIn, CalcResidues;
var outputText, outputText2, outputText3;
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
    Slope = Number(document.forms["input_form"]["slope"].value);
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
        CalcMoveIn = 1;
    } else {
        CalcMoveIn = 0;
    }
    //area treated and one-way move-in distance are needed when movein_cost is checked.
    area = document.forms["input_form"]["area"].value;
    move_in_dist = document.forms["input_form"]["move_in_dist"].value;

    //if include the costs of collecting and chipping residues
    inputElements = document.getElementsByClassName('residue_collect');
    if(inputElements[0].checked){
        CalcResidues = 1;
    } else {
        alert("CalcResidues not checked");
        CalcResidues = 0;
    }

    //get values of Green wood density, Residue Fraction and Hardwood Fraction
    //gwd: Green wood density; rf: Residue Fraction; hf: Hardwood Fraction.
    //sl: small log; ll: large log
    UserSpecWDCT = Number(document.forms["input_form"]["gwd_chip"].value);
    UserSpecWDSLT = Number(document.forms["input_form"]["gwd_sl"].value);
    UserSpecWDLLT = Number(document.forms["input_form"]["gwd_ll"].value);
    UserSpecRFCT = Number(document.forms["input_form"]["rf_chip"].value);
    UserSpecRFSLT = Number(document.forms["input_form"]["rf_sl"].value);
    UserSpecRFLLT = Number(document.forms["input_form"]["rf_ll"].value);
    UserSpecHFCT = Number(document.forms["input_form"]["hf_chip"].value);
    UserSpecHFSLT = Number(document.forms["input_form"]["hf_sl"].value);
    UserSpecHFLLT = Number(document.forms["input_form"]["hf_ll"].value);

    let RemovalsCT = Number(document.forms["input_form"]["rmct"].value);
    let RemovalsSLT = Number(document.forms["input_form"]["rmslt"].value)
    let RemovalsLLT = Number(document.forms["input_form"]["rmllt"].value)
    let TreeVolCT =  Number(document.forms["input_form"]["tvct"].value);
    let TreeVolSLT =  Number(document.forms["input_form"]["tvslt"].value);
    let TreeVolLLT =  Number(document.forms["input_form"]["tvllt"].value);

    let RemovalsST = RemovalsCT + RemovalsSLT;
    let RemovalsALT = RemovalsSLT + RemovalsLLT;
    let Removals = RemovalsCT + RemovalsSLT + RemovalsLLT;

    let VolPerAcreCT = RemovalsCT * TreeVolCT;
    let VolPerAcreSLT = RemovalsSLT * TreeVolSLT;
    let VolPerAcreLLT = RemovalsLLT * TreeVolLLT;
    let VolPerAcreST = VolPerAcreCT + VolPerAcreSLT;
    let TreeVolST = RemovalsST>0 ? VolPerAcreST/RemovalsST : 0;

    let VolPerAcreALT = VolPerAcreSLT + VolPerAcreLLT;
    let TreeVolALT = RemovalsALT>0 ? VolPerAcreALT/RemovalsALT : 0;

    let VolPerAcre = VolPerAcreCT + VolPerAcreSLT + VolPerAcreLLT;
    let TreeVol = Removals>0 ? VolPerAcre/Removals : 0;
//Other Assumptions
    let MaxManualTreeVol=150;
    let MaxMechTreeVol=80;
    let MoistureContentFraction=0.50;
    let LogLength=32;
    let LoadWeightLog=25;
    let LoadWeightChip=25;
    let CTLTrailSpacing=50;
    let HdwdCostPremium=0.20;
    let ResidueRecovFracWT=0.80;
    let ResidueRecovFracCTL=0.50;

//DBH
    let DBHCT = Math.sqrt((TreeVolCT+3.675)/0.216);
    let DBHSLT = Math.sqrt((TreeVolSLT+3.675)/0.216);
    let DBHLLT = Math.sqrt((TreeVolLLT+3.675)/0.216);

    let DBHST = TreeVolST>0 ? Math.sqrt((RemovalsCT*DBHCT^2+RemovalsSLT*DBHSLT^2)/RemovalsST) : 0;
    let DBHALT = TreeVolALT>0 ? Math.sqrt((RemovalsSLT*DBHSLT^2+RemovalsLLT*DBHLLT^2)/RemovalsALT) : 0;
    let DBH= Math.sqrt((RemovalsCT*DBHCT^2+RemovalsALT*DBHALT^2)/Removals);

//Tree Height
    let HeightCT=TreeVolCT>0?-20+24*Math.sqrt(DBHCT):0;
    let HeightSLT=TreeVolSLT>0?-20+24*Math.sqrt(DBHSLT):0;
    let HeightLLT=TreeVolLLT>0?-20+24*Math.sqrt(DBHLLT):0;

    let HeightST = TreeVolST>0?(RemovalsCT*HeightCT+RemovalsSLT*HeightSLT)/RemovalsST:0;
    let HeightALT = TreeVolALT>0?(RemovalsSLT*HeightSLT+RemovalsLLT*HeightLLT)/RemovalsALT:0;
    let Height = TreeVol>0?(RemovalsCT*HeightCT+RemovalsALT*HeightALT)/Removals:0;

//Wood Density
    let WoodDensityCT =UserSpecWDCT>0?UserSpecWDCT:50;
    let WoodDensitySLT =UserSpecWDSLT>0?UserSpecWDSLT:50;
    let WoodDensityLLT =UserSpecWDLLT>0?UserSpecWDLLT:50;
    let WoodDensityST =VolPerAcreST>0?(WoodDensityCT*VolPerAcreCT+WoodDensitySLT*VolPerAcreSLT)/VolPerAcreST:0;
    let WoodDensityALT =VolPerAcreALT>0?(WoodDensitySLT*VolPerAcreSLT+WoodDensityLLT*VolPerAcreLLT)/VolPerAcreALT:0;
    let WoodDensity =(WoodDensityCT*VolPerAcreCT+WoodDensityALT*VolPerAcreALT)/VolPerAcre;
//Hardwood Fraction
    let HdwdFractionCT  = !isNaN(UserSpecHFCT) ? UserSpecHFCT:0;
    let HdwdFractionSLT = !isNaN(UserSpecHFSLT) ? UserSpecHFSLT:0;
    let HdwdFractionLLT = !isNaN(UserSpecHFLLT) ? UserSpecHFLLT:0;
    let HdwdFractionST = VolPerAcreST>0?(HdwdFractionCT*VolPerAcreCT+HdwdFractionSLT*VolPerAcreSLT)/VolPerAcreST:0;
    let HdwdFractionALT =VolPerAcreALT>0?(HdwdFractionSLT*VolPerAcreSLT+HdwdFractionLLT*VolPerAcreLLT)/VolPerAcreALT:0;
    let HdwdFraction =(HdwdFractionCT*VolPerAcreCT+HdwdFractionALT*VolPerAcreALT)/VolPerAcre;
//Logs Per Tree
    let LogsPerTreeCT = 1;
    let LogsPerTreeSLT= (-0.43+0.678*Math.sqrt(DBHSLT));
    let LogsPerTreeLLT= (-0.43+0.678*Math.sqrt(DBHLLT));
    let LogsPerTreeST =(LogsPerTreeCT*RemovalsCT+LogsPerTreeSLT*RemovalsSLT)/RemovalsST;
    let LogsPerTreeALT =RemovalsALT==0?0:((LogsPerTreeSLT*RemovalsSLT+LogsPerTreeLLT*RemovalsLLT)/RemovalsALT);
    let LogsPerTree =(LogsPerTreeCT*RemovalsCT+LogsPerTreeALT*RemovalsALT)/Removals;
//Log Volume
    let LogVolST =TreeVolST/LogsPerTreeST;
    let LogVolALT = RemovalsALT==0?0:TreeVolALT/LogsPerTreeALT;
    let LogVol =TreeVol/LogsPerTree;
//CTL Logs Per Tree
    let CTLLogsPerTreeCT= Math.max(1,2*(-0.43+0.678*Math.sqrt(DBHCT)));
    let CTLLogsPerTree=Math.max(1,2*(-0.43+0.678*Math.sqrt(DBHST)));
// CTL Log Volume
    let CTLLogVolCT=TreeVolCT/CTLLogsPerTreeCT;
    let CTLLogVol=TreeVolST/CTLLogsPerTree;
//BFperCF=5
    let BFperCF=5;
//Bole Weight
    let BoleWtCT =WoodDensityCT*VolPerAcreCT/2000;
    let BoleWtSLT =WoodDensitySLT*VolPerAcreSLT/2000;
    let BoleWtLLT =WoodDensityLLT*VolPerAcreLLT/2000;
    let BoleWtST =BoleWtCT+BoleWtSLT;
    let BoleWtALT =BoleWtSLT+BoleWtLLT;
    let BoleWt =BoleWtCT+BoleWtALT;
//Residue Weight
    let ResidueCT =UserSpecRFCT*BoleWtCT;
    let ResidueSLT =UserSpecRFSLT*BoleWtSLT;
    let ResidueLLT =UserSpecRFLLT*BoleWtLLT;
    let ResidueST =ResidueCT+ResidueSLT;
    let ResidueALT =ResidueSLT+ResidueLLT;
    let Residue =ResidueCT+ResidueALT;
// Manual Machine Size
    let ManualMachineSizeALT=Math.min(1,TreeVolALT/MaxManualTreeVol);
    let ManualMachineSize=Math.min(1,TreeVol/MaxManualTreeVol);
//Mechanized Machine Size 
    let MechMachineSize=Math.min(1,TreeVolST/MaxMechTreeVol);
//Chipper Size
    let ChipperSize=Math.min(1,TreeVolCT/MaxMechTreeVol);
//NonSelfLevelCabDummy
    let NonSelfLevelCabDummy=Slope<15?1:(Slope<35?1.75-0.05*Slope:0);
//CSlopeFB&Harv (Mellgren 90)
    let CSlopeFB_Harv =0.00015*Slope^2+0.00359*NonSelfLevelCabDummy*Slope;
//CRemovalsFB&Harv (Mellgren 90)
    let CRemovalsFB_Harv =Math.max(0,0.66-0.001193*RemovalsST*2.47+5.357*Math.pow(10,-7)*Math.pow(RemovalsST*2.47,2));
//CSlopeSkidForwLoadSize (Mellgren 90)
    let CSlopeSkidForwLoadSize =1-0.000127*Math.pow(Slope,2);
//Chardwood
    let CHardwoodCT =1+HdwdCostPremium*HdwdFractionCT;
    let CHardwoodSLT =1+HdwdCostPremium*HdwdFractionSLT;
    let CHardwoodLLT =1+HdwdCostPremium*HdwdFractionLLT;
    let CHardwoodST =1+HdwdCostPremium*HdwdFractionST;
    let CHardwoodALT =1+HdwdCostPremium*HdwdFractionALT;
    let CHardwood =1+HdwdCostPremium*HdwdFraction;

//------------------------------------------ output --------------------------------------------------------------------
// ----System Product Summary--------------
// Amounts Recovered Per Acre
    let BoleVolCCF=VolPerAcre/100;
    let ResidueRecoveredPrimary=ResidueRecovFracWT*ResidueCT;
    let PrimaryProduct=BoleWt+ ResidueRecoveredPrimary;
    let ResidueRecoveredOptional = CalcResidues==1?(ResidueRecovFracWT*ResidueSLT)+(ResidueRecovFracWT*ResidueLLT):0;
    let TotalPrimaryAndOptional=PrimaryProduct + ResidueRecoveredOptional;
    let TotalPrimaryProductsAndOptionalResidues=PrimaryProduct+ResidueRecoveredOptional;
// Amounts Unrecovered and Left within the Stand Per Acre
    let GroundFuel =ResidueLLT+ResidueST*(1-ResidueRecovFracWT);

// Amounts Unrecovered and Left at the Landing
    let PiledFuel=CalcResidues==1?0:ResidueSLT*ResidueRecovFracWT;
// TotalResidues
    let ResidueUncutTrees=0;
    let TotalResidues
    =ResidueRecoveredPrimary+ResidueRecoveredOptional+ResidueUncutTrees+GroundFuel+PiledFuel;
// System Cost Elements-------
// For Primary Products (boles & WT residues), $/CCF of material treated by the activity

// For Optional Residues, $/GT of additional residue recovered
// Chip Loose Residues: from log trees <=80 cf
// =CostChipLooseRes*CollectOption*InLimits1
// Residue Move-In Costs, $/GT = =0*CalcMoveIn*CalcResidues*InLimits1

// For All Products, $/ac--

/*---------hardcoded-----------*/
    let CostFellBunch=12.70; 
    let CostManFLBLLT=12.78;
    let CostSkidBun=35.42;
    let CostProcess=8.18;
    let CostLoad=7.78;
    let CostChipWT=7.76;
    let MoveInCosts1G39=79.06;
    let CostChipLooseRes=7.37;
    let InLimits1=1; 
/*---------hardcoded-----------*/

    let ChipLooseResiduesFromLogTreesLess80cf=CostChipLooseRes*CalcResidues*ResidueRecoveredOptional*InLimits1;
    let FellAndBunchTreesLess80cf=CostFellBunch*VolPerAcreST/100*InLimits1;
    let ManualFellLimbBuckTreesLarger80cf=CostManFLBLLT*VolPerAcreLLT/100*InLimits1;
    let SkidBunchedAllTrees=CostSkidBun*VolPerAcre/100*InLimits1;
    let ProcessLogTreesLess80cf=CostProcess*VolPerAcreSLT/100*InLimits1;
    let LoadLogTrees=CostLoad*VolPerAcreALT/100*InLimits1;
    let ChipWholeTrees=CostChipWT*VolPerAcreCT/100*InLimits1;
    let Stump2Truck4PrimaryProductWithoutMovein=FellAndBunchTreesLess80cf+ManualFellLimbBuckTreesLarger80cf+SkidBunchedAllTrees+ProcessLogTreesLess80cf+LoadLogTrees+ChipWholeTrees;
    
    let Movein4PrimaryProduct=MoveInCosts1G39*CalcMoveIn*BoleVolCCF*InLimits1;
    let OntoTruck4ResiduesWoMovein=ChipLooseResiduesFromLogTreesLess80cf; //for Mech WT sys;
    let Movein4Residues=0*CalcMoveIn*CalcResidues*ResidueRecoveredOptional*InLimits1;

//Results 
    let TotalPerAcre=Stump2Truck4PrimaryProductWithoutMovein+Movein4PrimaryProduct+OntoTruck4ResiduesWoMovein+Movein4Residues;
    let TotalPerBoleCCF=TotalPerAcre/BoleVolCCF;
    let TotalPerGT=TotalPerAcre/TotalPrimaryProductsAndOptionalResidues;

    document.getElementById("CCF").innerHTML = Math.round(TotalPerBoleCCF);
    document.getElementById("Ton").innerHTML = Math.round(TotalPerGT);
    document.getElementById("Acre").innerHTML = Math.round(TotalPerAcre);



    let output = document.getElementsByClassName("output");
    output[0].style.background="yellow";
    for (var i = 0; i < output.length; i++) {
        output[i].style.background = "yellow";
    }

//test
    // outputText= TotalPerAcre;
    // document.getElementById("output_text").innerHTML = outputText;
    // outputText2=TotalPerBoleCCF;
    // document.getElementById("output_text2").innerHTML = outputText2;
    // outputText3=TotalPerGT;
    // document.getElementById("output_text3").innerHTML = outputText3;
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