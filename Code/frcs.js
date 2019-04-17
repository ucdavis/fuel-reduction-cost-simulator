//Input variables
let e, inputElements, cut_type, system, Slope, elevation, machine, load_cost, area, move_in_dist,
    CalcMoveIn, CalcResidues;
//Input variables
let UserSpecWDCT, UserSpecWDSLT, UserSpecWDLLT,
    UserSpecRFCT, UserSpecRFSLT, UserSpecRFLLT,
    UserSpecHFCT, UserSpecHFSLT, UserSpecHFLLT;
//Intermediate variables except the first line that is consisted of all input variables
let RemovalsCT, RemovalsSLT, RemovalsLLT, TreeVolCT, TreeVolSLT, TreeVolLLT,
    RemovalsST, RemovalsALT, Removals, TreeVolST, TreeVolALT, TreeVol,
    VolPerAcreCT, VolPerAcreSLT, VolPerAcreLLT, VolPerAcreST, VolPerAcreALT, VolPerAcre,
    DBHCT, DBHSLT, DBHLLT, DBHST, DBHALT, DBH, HeightCT, HeightSLT, HeightLLT, HeightST, HeightALT, Height,
    WoodDensityCT, WoodDensitySLT, WoodDensityLLT, WoodDensityST, WoodDensityALT, WoodDensity,
    HdwdFractionCT, HdwdFractionSLT, HdwdFractionLLT, HdwdFractionST, HdwdFractionALT, HdwdFraction,
    LogsPerTreeCT, LogsPerTreeSLT, LogsPerTreeLLT, LogsPerTreeST, LogsPerTreeALT, LogsPerTree,
    LogVolST, LogVolALT, LogVol, CTLLogsPerTreeCT, CTLLogsPerTree, CTLLogVolCT, CTLLogVol,
    BoleWtCT, BoleWtSLT, BoleWtLLT, BoleWtST, BoleWtALT, BoleWt,
    ResidueCT, ResidueSLT, ResidueLLT, ResidueST, ResidueALT, Residue,
    ManualMachineSizeALT, ManualMachineSize, MechMachineSize, ChipperSize, NonSelfLevelCabDummy,
    CSlopeFB_Harv, CRemovalsFB_Harv, CSlopeSkidForwLoadSize,
    CHardwoodCT, CHardwoodSLT, CHardwoodLLT, CHardwoodST, CHardwoodALT, CHardwood;
//Output variables
let BoleVolCCF, ResidueRecoveredPrimary, PrimaryProduct, ResidueRecoveredOptional,
    TotalPrimaryAndOptional, TotalPrimaryProductsAndOptionalResidues,
    GroundFuel, PiledFuel, ResidueUncutTrees, TotalResidues, Movein4PrimaryProduct, OntoTruck4ResiduesWoMovein,
    ChipLooseResiduesFromLogTreesLess80cf, FellAndBunchTreesLess80cf, ManualFellLimbBuckTreesLarger80cf,
    SkidBunchedAllTrees, ProcessLogTreesLess80cf, LoadLogTrees, ChipWholeTrees, Stump2Truck4PrimaryProductWithoutMovein,
    TotalPerAcre, TotalPerBoleCCF, TotalPerGT;
//IA Fell&Bunch
let DistBetweenTrees,TimePerTreeIA,VolPerPMHIA,CostPerPMHIA,CostPerCCFIA,RelevanceIA;
//IB Chainsaw Heads
let TimePerTreeIB,VolPerPMHIB,CostPerPMHIB,CostPerCCFIB,RelevanceIB;
//IC Intermittent Circular Sawheads
let TimePerTreeIC,VolPerPMHIC,CostPerPMHIC,CostPerCCFIC,RelevanceIC;
//ID Hydro-Ax 211 (Hartsough, 01)
let TreesPerAccumID, TimePerAccumID, TreesPerPMHID, VolPerPMHID, CostPerPMHID, CostPerCCFID, RelevanceID;
//Assumption variables
// var MaxManualTreeVol, MaxMechTreeVol, MoistureContentFraction, LogLength, LoadWeightLog, LoadWeightChip,
//     CTLTrailSpacing, HdwdCostPremium, ResidueRecovFracWT, ResidueRecovFracCTL;
//test purpose
// var outputText, outputText2, outputText3;
// var DieselPrice = 3.327;

function calculate(){
    // get the harvesting system
    e = document.getElementById("system");
    system = e.options[e.selectedIndex].text;

    //if clear_cut, cut_type = 0; otherwise 1. 
    if (document.getElementById("cut_type").value === "clear_cut"){
        cut_type = 0; 
    } else {
        cut_type = 1;    
    }
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

    //Other Assumptions --hardcoded--
    let MaxManualTreeVol = 150;
    let MaxMechTreeVol=80;
    let MoistureContentFraction=0.50;
    let LogLength=32;
    let LoadWeightLog=25;
    let LoadWeightChip=25;
    let CTLTrailSpacing=50;
    let HdwdCostPremium=0.20;
    let ResidueRecovFracWT=0.80;
    let ResidueRecovFracCTL=0.50;

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

    RemovalsCT = Number(document.forms["input_form"]["rmct"].value);
    RemovalsSLT = Number(document.forms["input_form"]["rmslt"].value);
    RemovalsLLT = Number(document.forms["input_form"]["rmllt"].value);
    TreeVolCT =  Number(document.forms["input_form"]["tvct"].value);
    TreeVolSLT =  Number(document.forms["input_form"]["tvslt"].value);
    TreeVolLLT =  Number(document.forms["input_form"]["tvllt"].value);
//funtions
    RemovalsST = RemovalsCT + RemovalsSLT;
    RemovalsALT = RemovalsSLT + RemovalsLLT;
    Removals = RemovalsCT + RemovalsSLT + RemovalsLLT;

    VolPerAcreCT = RemovalsCT * TreeVolCT;
    VolPerAcreSLT = RemovalsSLT * TreeVolSLT;
    VolPerAcreLLT = RemovalsLLT * TreeVolLLT;
    VolPerAcreST = VolPerAcreCT + VolPerAcreSLT;
    VolPerAcreALT = VolPerAcreSLT + VolPerAcreLLT;
    VolPerAcre = VolPerAcreCT + VolPerAcreSLT + VolPerAcreLLT;

    TreeVolST = RemovalsST>0 ? VolPerAcreST/RemovalsST : 0;
    TreeVolALT = RemovalsALT>0 ? VolPerAcreALT/RemovalsALT : 0;
    TreeVol = Removals>0 ? VolPerAcre/Removals : 0;

//DBH
    DBHCT = Math.sqrt((TreeVolCT+3.675)/0.216);
    DBHSLT = Math.sqrt((TreeVolSLT+3.675)/0.216);
    DBHLLT = Math.sqrt((TreeVolLLT+3.675)/0.216);
    DBHST = TreeVolST>0 ? Math.sqrt((RemovalsCT*Math.pow(DBHCT,2)+RemovalsSLT*Math.pow(DBHSLT,2))/RemovalsST) : 0;
    DBHALT = TreeVolALT>0 ? Math.sqrt((RemovalsSLT*Math.pow(DBHSLT,2)+RemovalsLLT*Math.pow(DBHLLT,2))/RemovalsALT) : 0;
    DBH= Math.sqrt((RemovalsCT*Math.pow(DBHCT,2)+RemovalsALT*Math.pow(DBHALT,2))/Removals);
//Tree Height
    HeightCT=TreeVolCT>0?-20+24*Math.sqrt(DBHCT):0;
    HeightSLT=TreeVolSLT>0?-20+24*Math.sqrt(DBHSLT):0;
    HeightLLT=TreeVolLLT>0?-20+24*Math.sqrt(DBHLLT):0;
    HeightST = TreeVolST>0?(RemovalsCT*HeightCT+RemovalsSLT*HeightSLT)/RemovalsST:0;
    HeightALT = TreeVolALT>0?(RemovalsSLT*HeightSLT+RemovalsLLT*HeightLLT)/RemovalsALT:0;
    Height = TreeVol>0?(RemovalsCT*HeightCT+RemovalsALT*HeightALT)/Removals:0;
//Wood Density
    WoodDensityCT =UserSpecWDCT>0?UserSpecWDCT:50;
    WoodDensitySLT =UserSpecWDSLT>0?UserSpecWDSLT:50;
    WoodDensityLLT =UserSpecWDLLT>0?UserSpecWDLLT:50;
    WoodDensityST =VolPerAcreST>0?(WoodDensityCT*VolPerAcreCT+WoodDensitySLT*VolPerAcreSLT)/VolPerAcreST:0;
    WoodDensityALT =VolPerAcreALT>0?(WoodDensitySLT*VolPerAcreSLT+WoodDensityLLT*VolPerAcreLLT)/VolPerAcreALT:0;
    WoodDensity =(WoodDensityCT*VolPerAcreCT+WoodDensityALT*VolPerAcreALT)/VolPerAcre;
//Hardwood Fraction
    HdwdFractionCT  = !isNaN(UserSpecHFCT) ? UserSpecHFCT:0;
    HdwdFractionSLT = !isNaN(UserSpecHFSLT) ? UserSpecHFSLT:0;
    HdwdFractionLLT = !isNaN(UserSpecHFLLT) ? UserSpecHFLLT:0;
    HdwdFractionST = VolPerAcreST>0?(HdwdFractionCT*VolPerAcreCT+HdwdFractionSLT*VolPerAcreSLT)/VolPerAcreST:0;
    HdwdFractionALT =VolPerAcreALT>0?(HdwdFractionSLT*VolPerAcreSLT+HdwdFractionLLT*VolPerAcreLLT)/VolPerAcreALT:0;
    HdwdFraction =(HdwdFractionCT*VolPerAcreCT+HdwdFractionALT*VolPerAcreALT)/VolPerAcre;
//Logs Per Tree
    LogsPerTreeCT = 1;
    LogsPerTreeSLT= (-0.43+0.678*Math.sqrt(DBHSLT));
    LogsPerTreeLLT= (-0.43+0.678*Math.sqrt(DBHLLT));
    LogsPerTreeST =(LogsPerTreeCT*RemovalsCT+LogsPerTreeSLT*RemovalsSLT)/RemovalsST;
    LogsPerTreeALT =RemovalsALT===0?0:((LogsPerTreeSLT*RemovalsSLT+LogsPerTreeLLT*RemovalsLLT)/RemovalsALT);
    LogsPerTree =(LogsPerTreeCT*RemovalsCT+LogsPerTreeALT*RemovalsALT)/Removals;
//Log Volume
    LogVolST =TreeVolST/LogsPerTreeST;
    LogVolALT = RemovalsALT===0?0:TreeVolALT/LogsPerTreeALT;
    LogVol =TreeVol/LogsPerTree;
//CTL Logs Per Tree
    CTLLogsPerTreeCT= Math.max(1,2*(-0.43+0.678*Math.sqrt(DBHCT)));
    CTLLogsPerTree=Math.max(1,2*(-0.43+0.678*Math.sqrt(DBHST)));
// CTL Log Volume
    CTLLogVolCT=TreeVolCT/CTLLogsPerTreeCT;
    CTLLogVol=TreeVolST/CTLLogsPerTree;
//BFperCF=5
    let BFperCF=5;
//Bole Weight
    BoleWtCT =WoodDensityCT*VolPerAcreCT/2000;
    BoleWtSLT =WoodDensitySLT*VolPerAcreSLT/2000;
    BoleWtLLT =WoodDensityLLT*VolPerAcreLLT/2000;
    BoleWtST =BoleWtCT+BoleWtSLT;
    BoleWtALT =BoleWtSLT+BoleWtLLT;
    BoleWt =BoleWtCT+BoleWtALT;
//Residue Weight
    ResidueCT =UserSpecRFCT*BoleWtCT;
    ResidueSLT =UserSpecRFSLT*BoleWtSLT;
    ResidueLLT =UserSpecRFLLT*BoleWtLLT;
    ResidueST =ResidueCT+ResidueSLT;
    ResidueALT =ResidueSLT+ResidueLLT;
    Residue =ResidueCT+ResidueALT;
// Manual Machine Size
    ManualMachineSizeALT=Math.min(1,TreeVolALT/MaxManualTreeVol);
    ManualMachineSize=Math.min(1,TreeVol/MaxManualTreeVol);
//Mechanized Machine Size 
    MechMachineSize=Math.min(1,TreeVolST/MaxMechTreeVol);
//Chipper Size
    ChipperSize=Math.min(1,TreeVolCT/MaxMechTreeVol);
//NonSelfLevelCabDummy
    NonSelfLevelCabDummy=Slope<15?1:(Slope<35?1.75-0.05*Slope:0);
//CSlopeFB&Harv (Mellgren 90)
    CSlopeFB_Harv =0.00015*Math.pow(Slope,2)+0.00359*NonSelfLevelCabDummy*Slope;
//CRemovalsFB&Harv (Mellgren 90)
    CRemovalsFB_Harv =Math.max(0,0.66-0.001193*RemovalsST*2.47+5.357*Math.pow(10,-7)*Math.pow(RemovalsST*2.47,2));
//CSlopeSkidForwLoadSize (Mellgren 90)
    CSlopeSkidForwLoadSize =1-0.000127*Math.pow(Slope,2);
//Chardwood
    CHardwoodCT =1+HdwdCostPremium*HdwdFractionCT;
    CHardwoodSLT =1+HdwdCostPremium*HdwdFractionSLT;
    CHardwoodLLT =1+HdwdCostPremium*HdwdFractionLLT;
    CHardwoodST =1+HdwdCostPremium*HdwdFractionST;
    CHardwoodALT =1+HdwdCostPremium*HdwdFractionALT;
    CHardwood =1+HdwdCostPremium*HdwdFraction;

//------------------------------------------ output --------------------------------------------------------------------
// ----System Product Summary--------------
// Amounts Recovered Per Acre
    BoleVolCCF=VolPerAcre/100;
    ResidueRecoveredPrimary=ResidueRecovFracWT*ResidueCT;
    PrimaryProduct=BoleWt+ ResidueRecoveredPrimary;
    ResidueRecoveredOptional = CalcResidues===1?(ResidueRecovFracWT*ResidueSLT)+(ResidueRecovFracWT*ResidueLLT):0;
    TotalPrimaryAndOptional=PrimaryProduct + ResidueRecoveredOptional;
    TotalPrimaryProductsAndOptionalResidues=PrimaryProduct+ResidueRecoveredOptional;
// Amounts Unrecovered and Left within the Stand Per Acre
    GroundFuel=ResidueLLT+ResidueST*(1-ResidueRecovFracWT);
// Amounts Unrecovered and Left at the Landing
    PiledFuel=CalcResidues===1?0:ResidueSLT*ResidueRecovFracWT;
// TotalResidues
    ResidueUncutTrees=0;
    TotalResidues=ResidueRecoveredPrimary+ResidueRecoveredOptional+ResidueUncutTrees+GroundFuel+PiledFuel;
// System Cost Elements-------
// For Primary Products (boles & WT residues), $/CCF of material treated by the activity

// For Optional Residues, $/GT of additional residue recovered
// Chip Loose Residues: from log trees <=80 cf
// =CostChipLooseRes*CollectOption*InLimits1
// Residue Move-In Costs, $/GT = =0*CalcMoveIn*CalcResidues*InLimits1

// For All Products, $/ac--

/*---------hardcoded-----------*/ //Todo: Find the equations for var below
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
/*--------------Fell&Bunch START---------------------------*/
    // IA: Melroe Bobcat (Johnson, 79)
    let PMH_DriveToTree=181.30; //Todo: (hardcoded)
    DistBetweenTrees=Math.sqrt(43560/Math.max(RemovalsST,1));
    // I. Drive-To-Tree
    // A) Melroe Bobcat (Johnson, 79)
    TimePerTreeIA =0.204+0.00822*DistBetweenTrees+0.02002*DBHST+0.00244*Slope;
    VolPerPMHIA = TreeVolST/(TimePerTreeIA/60);
    CostPerPMHIA =PMH_DriveToTree;
    CostPerCCFIA =100*CostPerPMHIA/VolPerPMHIA;
    RelevanceIA =(DBHST<10?1:(DBHST<15?3-DBHST/5:0))*(Slope<10?1:(Slope<20?2-Slope/10:0));
    // IB: Chainsaw Heads START
    let CutsIB=1.1;
    TimePerTreeIB =(-0.0368+0.02914*DBHST+0.00289*DistBetweenTrees+0.2134*CutsIB)*(1+CSlopeFB_Harv);
    VolPerPMHIB =TreeVolST/(TimePerTreeIB/60);
    CostPerPMHIB=PMH_DriveToTree;
    CostPerCCFIB =100*CostPerPMHIB/VolPerPMHIB;
    RelevanceIB =(DBHST<15?1:(DBHST<20?4-DBHST/5:0))*(Slope<10?1:(Slope<20?2-Slope/10:0));
    // IC: Intermittent Circular Sawheads (Greene&McNeel, 91)
    let CutsIC=1.01;
    TimePerTreeIC =(-0.4197+0.01345*DBHST+0.001245*DistBetweenTrees+0.7271*CutsIC)*(1+CSlopeFB_Harv);
    VolPerPMHIC =TreeVolST/(TimePerTreeIC/60);
    CostPerPMHIC=PMH_DriveToTree;
    CostPerCCFIC =100*CostPerPMHIC/VolPerPMHIC;
    RelevanceIC =(DBHST<15?1:(DBHST<20?4-DBHST/5:0))*(Slope<10?1:(Slope<20?2-Slope/10:0));
    // ID: Hydro-Ax 211 (Hartsough, 01)
    TreesPerAccumID =Math.max(1,14.2-2.18*DBHST+0.0799*Math.pow(DBHST,2));
    TimePerAccumID =0.114+0.266+0.073*TreesPerAccumID+0.00999*TreesPerAccumID*DBHST;
    TreesPerPMHID =60*TreesPerAccumID/TimePerAccumID;
    VolPerPMHID =TreeVolST*TreesPerPMHID;
    CostPerPMHID=PMH_DriveToTree;
    CostPerCCFID =100*CostPerPMHID/VolPerPMHID;
    RelevanceID=(DBHST<10?1:(DBHST<15?3-DBHST/5:0))*(Slope<10?1:(Slope<20?2-Slope/10:0));

    /*------------Fell&Bunch END---------------------------*/

    ChipLooseResiduesFromLogTreesLess80cf=CostChipLooseRes*CalcResidues*ResidueRecoveredOptional*InLimits1;
    FellAndBunchTreesLess80cf=CostFellBunch*VolPerAcreST/100*InLimits1;
    ManualFellLimbBuckTreesLarger80cf=CostManFLBLLT*VolPerAcreLLT/100*InLimits1;
    SkidBunchedAllTrees=CostSkidBun*VolPerAcre/100*InLimits1;
    ProcessLogTreesLess80cf=CostProcess*VolPerAcreSLT/100*InLimits1;
    LoadLogTrees=CostLoad*VolPerAcreALT/100*InLimits1;
    ChipWholeTrees=CostChipWT*VolPerAcreCT/100*InLimits1;
    Stump2Truck4PrimaryProductWithoutMovein=FellAndBunchTreesLess80cf+ManualFellLimbBuckTreesLarger80cf+SkidBunchedAllTrees+ProcessLogTreesLess80cf+LoadLogTrees+ChipWholeTrees;
    Movein4PrimaryProduct=MoveInCosts1G39*CalcMoveIn*BoleVolCCF*InLimits1;
    OntoTruck4ResiduesWoMovein=ChipLooseResiduesFromLogTreesLess80cf; //for Mech WT sys;
    let Movein4Residues=0; // Movein4Residues=0*CalcMoveIn*CalcResidues*ResidueRecoveredOptional*InLimits1;

//Results 
    TotalPerAcre=Stump2Truck4PrimaryProductWithoutMovein+Movein4PrimaryProduct+OntoTruck4ResiduesWoMovein+Movein4Residues;
    TotalPerBoleCCF=TotalPerAcre/BoleVolCCF;
    TotalPerGT=TotalPerAcre/TotalPrimaryProductsAndOptionalResidues;

    document.getElementById("CCF").innerHTML = Math.round(TotalPerBoleCCF).toString();
    document.getElementById("Ton").innerHTML = Math.round(TotalPerGT).toString();
    document.getElementById("Acre").innerHTML = Math.round(TotalPerAcre).toString();

    let output = document.getElementsByClassName("output");
    output[0].style.background="yellow";
    for (let i = 0; i < output.length; i++) {
        output[i].style.background = "yellow";
    }
// test
    // var a=Math.sqrt((RemovalsCT*Math.pow(DBHCT,2)+RemovalsSLT*Math.pow(DBHSLT,2))/RemovalsST);

    let outputText= VolPerPMHID; //2.0
    document.getElementById("output_text").innerHTML = outputText;
    let outputText2= CostPerCCFID;
    document.getElementById("output_text2").innerHTML = outputText2;
    let outputText3=CSlopeFB_Harv;
    document.getElementById("output_text3").innerHTML = outputText3;
    let outputText4=NonSelfLevelCabDummy;
    document.getElementById("output_text4").innerHTML = outputText4;
    let outputText5=DBHSLT;
    document.getElementById("output_text5").innerHTML = outputText5;
    let outputText6=a;
    document.getElementById("output_text6").innerHTML = outputText6;
}