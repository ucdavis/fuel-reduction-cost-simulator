'use strict'
//Input variables
let e, inputElements, cut_type, system, Slope, elevation, machine, load_cost, Area, MoveInDist,
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
    ButtDiamSLT,ButtDiamST,ButtDiam,
    LogsPerTreeCT, LogsPerTreeSLT, LogsPerTreeLLT, LogsPerTreeST, LogsPerTreeALT, LogsPerTree,
    LogVolST, LogVolALT, LogVol, CTLLogsPerTreeCT, CTLLogsPerTree, CTLLogVolCT, CTLLogVol,
    BoleWtCT, BoleWtSLT, BoleWtLLT, BoleWtST, BoleWtALT, BoleWt,
    ResidueCT, ResidueSLT, ResidueLLT, ResidueST, ResidueALT, Residue,
    ManualMachineSizeALT, ManualMachineSize, MechMachineSize, ChipperSize, NonSelfLevelCabDummy,
    CSlopeFB_Harv, CRemovalsFB_Harv, CSlopeSkidForwLoadSize,
    CHardwoodCT, CHardwoodSLT, CHardwoodLLT, CHardwoodST, CHardwoodALT, CHardwood;
    let TreesPerCycleIIB;
//Output variables
let BoleVolCCF, ResidueRecoveredPrimary, PrimaryProduct, ResidueRecoveredOptional,
    TotalPrimaryAndOptional, TotalPrimaryProductsAndOptionalResidues,
    GroundFuel, PiledFuel, ResidueUncutTrees, TotalResidues, Movein4PrimaryProduct, OntoTruck4ResiduesWoMovein,
    ChipLooseResiduesFromLogTreesLess80cf, FellAndBunchTreesLess80cf, ManualFellLimbBuckTreesLarger80cf,
    SkidBunchedAllTrees, ProcessLogTreesLess80cf, LoadLogTrees, ChipWholeTrees, Stump2Truck4PrimaryProductWithoutMovein,
    TotalPerAcre, TotalPerBoleCCF, TotalPerGT;
//Assumption variables
// var MaxManualTreeVol, MaxMechTreeVol, MoistureContent, LogLength, LoadWeightLog, LoadWeightChip,
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
    deliver_dist = Number(document.getElementById("deliver_dist").value);
    Slope = Number(document.getElementById("slope").value);
    elevation = Number(document.getElementById("elevation").value);

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
    Area = document.getElementById("area").value;
    MoveInDist = document.getElementById("move_in_dist").value;

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
    let MoistureContent=0.50;
    let LogLength=32;
    let LoadWeightLog=25;
    let LoadWeightChip=25;
    let CTLTrailSpacing=50;
    let HdwdCostPremium=0.20;
    let ResidueRecovFracWT=0.80;
    let ResidueRecovFracCTL=0.50;

    //get values of Green wood density, Residue Fraction and Hardwood Fraction
    //ct: chip trees; slt: small log trees; llt: large log trees; rm: removals; tv: tree volume;
    //gwd: green wood density; rf: residue fraction; hf: hardwood fraction
    UserSpecWDCT = Number(document.getElementById("gwd_ct").value); // green wood density of chip trees
    UserSpecWDSLT = Number(document.getElementById("gwd_slt").value); 
    UserSpecWDLLT = Number(document.getElementById("gwd_llt").value);
    UserSpecRFCT = Number(document.getElementById("rf_ct").value); 
    UserSpecRFSLT = Number(document.getElementById("rf_slt").value); // residue fraction of small log trees
    UserSpecRFLLT = Number(document.getElementById("rf_llt").value);
    UserSpecHFCT = Number(document.getElementById("hf_ct").value); 
    UserSpecHFSLT = Number(document.getElementById("hf_slt").value);
    UserSpecHFLLT = Number(document.getElementById("hf_llt").value); // hardwood fraction of large log trees

    RemovalsCT = Number(document.getElementById("rmct").value); // removals of chip trees
    RemovalsSLT = Number(document.getElementById("rmslt").value); 
    RemovalsLLT = Number(document.getElementById("rmllt").value); 
    TreeVolCT =  Number(document.getElementById("tvct").value); 
    TreeVolSLT =  Number(document.getElementById("tvslt").value); // tree volume of small log trees
    TreeVolLLT =  Number(document.getElementById("tvllt").value);
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
//ButtDiam
    ButtDiamSLT=DBHSLT+3;
    ButtDiamST=DBHST+3;
    ButtDiam=DBH+3;
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
// Limits
    let InLimits1=InLimits(TreeVolCT,TreeVolSLT,TreeVolLLT,TreeVolALT,TreeVol,Slope);
// Machine costs
    let CostMachine=MachineCosts();
    
// System Cost Elements-------
    let CostFellBunch=FellBunch(Slope,RemovalsST,TreeVolST,DBHST,NonSelfLevelCabDummy,CSlopeFB_Harv,CRemovalsFB_Harv,CHardwoodST);
    let CostManFLBLLT=FellLargeLogTrees(Slope,RemovalsLLT,TreeVolLLT,cut_type,DBHLLT,LogsPerTreeLLT);
    let CostSkidBun=Skidding(Slope,deliver_dist,Removals,TreeVol,WoodDensity,LogLength,cut_type,CSlopeSkidForwLoadSize,LogsPerTree,LogVol,ManualMachineSize,BFperCF,ButtDiam);
    let CostProcess=Processing(TreeVolSLT,DBHSLT,ButtDiamSLT,LogsPerTreeSLT,MechMachineSize);
    let CostLoad=Loading(LoadWeightLog,WoodDensityALT,WoodDensitySLT,CTLLogVol,LogVolALT,DBHALT,DBHSLT,ManualMachineSizeALT);
    let ChippingResults=Chipping(TreeVolCT,WoodDensityCT,LoadWeightChip,MoistureContent,CHardwoodCT);
    let CostChipWT=ChippingResults.CostChipWT;
    let MoveInCosts1G39=MoveInCosts(Area,MoveInDist,TreeVol,Removals,VolPerAcreCT);
    let CostChipLooseRes=ChippingResults.CostChipLooseRes;

    // C. For All Products, $/ac
    FellAndBunchTreesLess80cf=CostFellBunch*VolPerAcreST/100*InLimits1;
    ManualFellLimbBuckTreesLarger80cf=CostManFLBLLT*VolPerAcreLLT/100*InLimits1;
    SkidBunchedAllTrees=CostSkidBun*VolPerAcre/100*InLimits1;
    ProcessLogTreesLess80cf=CostProcess*VolPerAcreSLT/100*InLimits1;
    LoadLogTrees=CostLoad*VolPerAcreALT/100*InLimits1;
    ChipWholeTrees=CostChipWT*VolPerAcreCT/100*InLimits1;
    Stump2Truck4PrimaryProductWithoutMovein=FellAndBunchTreesLess80cf+ManualFellLimbBuckTreesLarger80cf+SkidBunchedAllTrees+ProcessLogTreesLess80cf+LoadLogTrees+ChipWholeTrees;
    Movein4PrimaryProduct=MoveInCosts1G39*CalcMoveIn*BoleVolCCF*InLimits1;

    ChipLooseResiduesFromLogTreesLess80cf=CostChipLooseRes*CalcResidues*ResidueRecoveredOptional*InLimits1;
    OntoTruck4ResiduesWoMovein=ChipLooseResiduesFromLogTreesLess80cf; //for Mech WT sys;
    let Movein4Residues=0*CalcMoveIn*CalcResidues*ResidueRecoveredOptional*InLimits1;

// III. System Cost Summaries
    TotalPerAcre=Stump2Truck4PrimaryProductWithoutMovein+Movein4PrimaryProduct+OntoTruck4ResiduesWoMovein+Movein4Residues;
    TotalPerBoleCCF=TotalPerAcre/BoleVolCCF;
    TotalPerGT=TotalPerAcre/TotalPrimaryProductsAndOptionalResidues;

    document.getElementById("CCF").textContent = Math.round(TotalPerBoleCCF).toString();
    document.getElementById("Ton").textContent = Math.round(TotalPerGT).toString();
    document.getElementById("Acre").textContent = Math.round(TotalPerAcre).toString();
}

/**
 * @return {number}
 */
function FellBunch(Slope,RemovalsST,TreeVolST,DBHST,NonSelfLevelCabDummy,CSlopeFB_Harv,CRemovalsFB_Harv,CHardwoodST){
    //IA Melroe Bobcat (Johnson, 79) //FellBunch(Slope,RemovalsST,TreeVolST,cut_type,DBHST,NonSelfLevelCabDummy,CSlopeFB_Harv,CRemovalsFB_Harv,CHardwoodST);
    let DistBetweenTrees,TimePerTreeIA,VolPerPMHIA,CostPerPMHIA,CostPerCCFIA,RelevanceIA;
    //IB Chainsaw Heads
    let TimePerTreeIB,VolPerPMHIB,CostPerPMHIB,CostPerCCFIB,RelevanceIB;
    //IC Intermittent Circular Sawheads
    let TimePerTreeIC,VolPerPMHIC,CostPerPMHIC,CostPerCCFIC,RelevanceIC;
    //ID Hydro-Ax 211 (Hartsough, 01)
    let TreesPerAccumID, TimePerAccumID, TreesPerPMHID, VolPerPMHID, CostPerPMHID, CostPerCCFID, RelevanceID;
    // IIA: Drott (Johnson, 79) not used at present
    let TimePerTreeIIA, VolPerPMHIIA, CostPerPMHIIA, CostPerCCFIIA, RelevanceIIA;
    // IIB: Timbco 2520&Cat 227 (Johnson, 88)
    let TreeInReachIIB,TimePerCycleIIB,TimePerTreeIIB,VolPerPMHIIB,CostPerPMHIIB,CostPerCCFIIB,RelevanceIIB;
    // IIC: JD 693B&TJ Timbco 2518 (Gingras, 88)
    let UnmerchPerMerchIIC, TreesInReachIIC,ObsTreesPerCycleIIC, TreesPerCycleIIC,TreesPerPMHIIC,VolPerPMHIIC,
        CostPerPMHIIC,CostPerCCFIIC,RelevanceIIC;
    // IID: Timbco (Gonsier&Mandzak, 87)
    let TimePerTreeIID,VolPerPMHIID,CostPerPMHIID,CostPerCCFIID,RelevanceIID;
    // IIE: FERIC Generic (Gingras, J.F., 96.  The cost of product sorting during harvesting.  FERIC Technical Note TN-245)
    let VolPerPMHIIE,CostPerPMHIIE,CostPerCCFIIE,RelevanceIIE;
    // IIF: (Plamondon, J. 1998.  Trials of mechanized tree-length harvesting in eastern Canada. FERIC Technical Note TN-273)
    let VolPerPMHIIF,CostPerPMHIIF,CostPerCCFIIF,RelevanceIIF;
    // IIG: Timbco 420 (Hartsough, B., E. Drews, J. McNeel, T. Durston and B. Stokes. 97.
    //      Comparison of mechanized systems for thinning ponderosa pine and mixed conifer stands.  Forest Products Journal 47(11/12):59-68)
    let TreesInReachIIG,TreesPerAccumIIG,MoveFracIIG,MoveIIG,FellIIG,TimePerAccumIIG,TimePerTreeIIG,VolPerPMHIIG,
        CostPerPMHIIG,CostPerCCFIIG,RelevanceIIG;

    /*--------------Fell&Bunch START---------------------------*/
    let PMH_DriveToTree=181.30; //Todo: (hardcoded)
    DistBetweenTrees=Math.sqrt(43560/Math.max(RemovalsST,1));
// I. Drive-To-Tree
    // IA: Melroe Bobcat (Johnson, 79)
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
// II. Swing Boom
    // IIA: Drott (Johnson, 79) not used at present
    let PMH_SwingBoom=233.26; //Todo: (hardcoded)
    TimePerTreeIIA =0.388+0.0137*DistBetweenTrees+0.0398*Slope;
    VolPerPMHIIA =TreeVolST/(TimePerTreeIIA/60);
    CostPerPMHIIA =PMH_SwingBoom;
    CostPerCCFIIA =100*CostPerPMHIIA/VolPerPMHIIA;
    RelevanceIIA=0; //hardcoded

    // IIB: Timbco 2520&Cat 227 (Johnson, 88)
    let PMH_SelfLevel=238;//Todo: (hardcoded)
    let BoomReachIIB=24; //
    TreeInReachIIB =RemovalsST*Math.PI*Math.pow(BoomReachIIB,2)/43560;
    TreesPerCycleIIB =Math.max(1,TreeInReachIIB);
    TimePerCycleIIB =(0.242+0.1295*TreesPerCycleIIB+0.0295*DBHST*TreesPerCycleIIB)*(1+CSlopeFB_Harv);
    TimePerTreeIIB =TimePerCycleIIB/TreesPerCycleIIB;
    VolPerPMHIIB =TreeVolST/(TimePerTreeIIB/60);
    CostPerPMHIIB =PMH_SwingBoom*NonSelfLevelCabDummy+PMH_SelfLevel*(1-NonSelfLevelCabDummy);
    CostPerCCFIIB =100*CostPerPMHIIB/VolPerPMHIIB;
    RelevanceIIB =(DBHST<15?1:(DBHST<20?4-DBHST/5:0))*(Slope<5?0:(Slope<20?-1/3+Slope/15:1));
    // IIC: JD 693B&TJ Timbco 2518 (Gingras, 88)
    let UnmerchTreesPerHaIIC=285;
    UnmerchPerMerchIIC =Math.min(1.5,285/(2.47*RemovalsST));
    let BoomReachIIC=24;
    TreesInReachIIC =RemovalsST*Math.PI*Math.pow(BoomReachIIC,2)/43560;
    ObsTreesPerCycleIIC =(4.36+9-(0.12+0.34)*DBHST+0.00084*2.47*RemovalsST)/2;
    TreesPerCycleIIC =Math.max(1,Math.min(TreesInReachIIC,ObsTreesPerCycleIIC));
    TreesPerPMHIIC =(127.8+21.2*TreesPerCycleIIC-63.1*UnmerchPerMerchIIC+0.033*UnmerchTreesPerHaIIC)/(1+CSlopeFB_Harv);
    VolPerPMHIIC =TreeVolST*TreesPerPMHIIC;
    CostPerPMHIIC =PMH_SwingBoom*NonSelfLevelCabDummy+PMH_SelfLevel*(1-NonSelfLevelCabDummy);
    CostPerCCFIIC =100*CostPerPMHIIC/VolPerPMHIIC;
    RelevanceIIC =(DBHST<12?1:(DBHST<18?3-DBHST/6:0))*(Slope<5?0:(Slope<20?-1/3+Slope/15:1));
    // IID: Timbco (Gonsier&Mandzak, 87)
    TimePerTreeIID =(0.324+0.00138*Math.pow(DBHST,2))*(1+CSlopeFB_Harv+CRemovalsFB_Harv);
    VolPerPMHIID =TreeVolST/(TimePerTreeIID/60);
    CostPerPMHIID =PMH_SelfLevel;
    CostPerCCFIID =100*CostPerPMHIID/VolPerPMHIID;
    RelevanceIID =(DBHST<15?1:(DBHST<20?4-DBHST/5:0))*(Slope<15?0:(Slope<35?-3/4+Slope/20:1));
    // IIE: FERIC Generic (Gingras, J.F., 96.  The cost of product sorting during harvesting.  FERIC Technical Note TN-245)
    VolPerPMHIIE =(50.338/0.028317*Math.pow((TreeVolST*0.028317),0.3011))/(1+CSlopeFB_Harv+CRemovalsFB_Harv);
    CostPerPMHIIE =PMH_SwingBoom*NonSelfLevelCabDummy+PMH_SelfLevel*(1-NonSelfLevelCabDummy);
    CostPerCCFIIE =100*CostPerPMHIIE/VolPerPMHIIE;
    RelevanceIIE =(Slope<5?0:(Slope<20?-1/3+Slope/15:1));
    // IIF: (Plamondon, J. 1998.  Trials of mechanized tree-length harvesting in eastern Canada. FERIC Technical Note TN-273)
    VolPerPMHIIF =(5/0.028317+57.7*TreeVolST)/(1+CSlopeFB_Harv+CRemovalsFB_Harv);
    CostPerPMHIIF =PMH_SwingBoom*NonSelfLevelCabDummy+PMH_SelfLevel*(1-NonSelfLevelCabDummy);
    CostPerCCFIIF =100*CostPerPMHIIF/VolPerPMHIIF;
    RelevanceIIF =(TreeVolST<20?1:(TreeVolST<50?5/3-TreeVolST/30:0))*(Slope<5?0:(Slope<20?-1/3+Slope/15:1));
    // IIG: Timbco 420 (Hartsough, B., E. Drews, J. McNeel, T. Durston and B. Stokes. 97.
    //      Comparison of mechanized systems for thinning ponderosa pine and mixed conifer stands.  Forest Products Journal 47(11/12):59-68)
    let HybridIIG=0;
    let DeadIIG=0;
    let DelayFracIIG =0.0963;
    let BoomReachIIG=24;
    TreesInReachIIG =RemovalsST*Math.PI*Math.pow(BoomReachIIG,2)/43560;
    TreesPerAccumIIG =Math.max(1,1.81-0.0664*DBHST+3.64/DBHST-0.0058*20-0.27*0-0.1*0);
    MoveFracIIG =0.5/(Math.trunc(TreesInReachIIG/TreesPerAccumIIG)+1);
    MoveIIG =0.192+0.00779*(BoomReachIIG+DistBetweenTrees)+0.35*HybridIIG;
    FellIIG =0.285+0.126*TreesPerAccumIIG+0.0176*DBHST*TreesPerAccumIIG-0.0394*DeadIIG;
    TimePerAccumIIG =MoveFracIIG*MoveIIG+FellIIG;
    TimePerTreeIIG =(TimePerAccumIIG*(1+DelayFracIIG)/TreesPerAccumIIG)*(1+CSlopeFB_Harv);
    VolPerPMHIIG =TreeVolST/TimePerTreeIIG*60;
    CostPerPMHIIG =PMH_SwingBoom*NonSelfLevelCabDummy+PMH_SelfLevel*(1-NonSelfLevelCabDummy);
    CostPerCCFIIG =100*CostPerPMHIIG/VolPerPMHIIG;
    RelevanceIIG =(DBHST<15?1:(DBHST<20?4-DBHST/5:0))*(Slope<5?0:(Slope<20?-1/3+Slope/15:1));

// III. User-Defined
    let UserDefinedVolPerPMH=0.001;
    let UserDefinedCostPerPMH=null;
    let UserDefinedCostPerCCF =100*UserDefinedCostPerPMH/UserDefinedVolPerPMH;
    let UserDefinedRelevance=0;

// Summary
    let WeightedAverage =(TreeVolST>0?CHardwoodST*100*(CostPerPMHIA*RelevanceIA+CostPerPMHIB*RelevanceIB+CostPerPMHIC*RelevanceIC
        +CostPerPMHID*RelevanceID+CostPerPMHIIA*RelevanceIIA+CostPerPMHIIB*RelevanceIIB+CostPerPMHIIC*RelevanceIIC
        +CostPerPMHIID*RelevanceIID+CostPerPMHIIE*RelevanceIIE+CostPerPMHIIF*RelevanceIIF+CostPerPMHIIG*RelevanceIIG
        +UserDefinedCostPerPMH*UserDefinedRelevance)/(VolPerPMHIA*RelevanceIA+VolPerPMHIB*RelevanceIB
        +VolPerPMHIC*RelevanceIC+VolPerPMHID*RelevanceID+VolPerPMHIIA*RelevanceIIA+VolPerPMHIIB*RelevanceIIB
        +VolPerPMHIIC*RelevanceIIC+VolPerPMHIID*RelevanceIID+VolPerPMHIIE*RelevanceIIE+VolPerPMHIIF*RelevanceIIF
        +VolPerPMHIIG*RelevanceIIG+UserDefinedVolPerPMH*UserDefinedRelevance):0);
    /*------------Fell&Bunch END---------------------------*/
    return WeightedAverage;
}

function FellLargeLogTrees(Slope,RemovalsLLT,TreeVolLLT,PartialCut,DBHLLT,LogsPerTreeLLT){
    let WalkDistLLT = Math.sqrt(43560/Math.max(RemovalsLLT,1));
// I. Felling Only
    // IA (McNeel, 94)
    let SelectionTimePerTreelltA,ClearcutTimePerTreelltA,TimePerTreelltA,VolPerPMHlltA,CostPerCCFlltA,RelevancelltA;
    // IB (Peterson, 87)
    let TimePerTreelltB,VolPerPMHlltB,CostPerCCFlltB,RelevancelltB;
    // IC (Keatley, 2000)
    let TimePerTreelltC,VolPerPMHlltC,CostPerCCFlltC,RelevancelltC;
    // ID (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    let TimePerTreelltD,VolPerPMHlltD,CostPerCCFlltD,RelevancelltD;
    // IE User-Defined Felling Only
    let VolPerPMHlltE,CostPerCCFlltE,RelevancelltE;
    // Summary
    let CostManFellLLT;
// II. Felling, Limbing & Bucking
    // IIA (Kellogg&Olsen, 86)
    let EastsideAdjustment,ClearcutAdjustment,TimePerTreelltIIA,VolPerPMHlltIIA,CostPerCCFlltIIA,RelevancelltIIA;
    // IIB (Kellogg, L., M. Miller and E. Olsen, 1999)  Skyline thinning production and costs: experience from the Willamette Young Stand Project.  
    // Research Contribtion 21.  Forest Research Laboratory, Oregon State University, Corvallis.
    let LimbslltIIB,LogslltIIB,WedgelltIIB,CorridorlltIIB,NotBetweenOpeningslltIIB,OpeningslltIIB,HeavyThinlltIIB,
        DelayFraclltIIB,TimePerTreelltIIB,VolPerPMHlltIIB,CostPerCCFlltIIB,RelevancelltIIB;
    // IIC (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    let DelayFraclltIIC,TimePerTreelltIIC,VolPerPMHlltIIC,CostPerCCFlltIIC,RelevancelltIIC;
    // IID User-Defined Felling, Limbing & Bucking
    let VolPerPMHlltIID,CostPerCCFlltIID,RelevancelltIID;
    // Summary
    let CostManFLBLLT;

    let PMH_Chainsaw=95.64657955; // hardcoded
// I. Felling Only
    // IA (McNeel, 94)
    SelectionTimePerTreelltA=0.568+0.0193*0.305*WalkDistLLT+0.0294*2.54*DBHLLT;
    ClearcutTimePerTreelltA=0.163+0.0444*0.305*WalkDistLLT+0.0323*2.54*DBHLLT;
    TimePerTreelltA=(PartialCut==1?SelectionTimePerTreelltA:Math.min(SelectionTimePerTreelltA,ClearcutTimePerTreelltA));
    VolPerPMHlltA=TreeVolLLT/(TimePerTreelltA/60);
    CostPerCCFlltA=100*PMH_Chainsaw/VolPerPMHlltA;
    RelevancelltA=1;
    // IB (Peterson, 87)
    TimePerTreelltB=(DBHLLT<10?0.33+0.012*DBHLLT:0.1+0.0111*Math.pow(DBHLLT,1.496));
    VolPerPMHlltB=TreeVolLLT/(TimePerTreelltB/60);
    CostPerCCFlltB=100*PMH_Chainsaw/VolPerPMHlltB;
    RelevancelltB=1;
    // IC (Keatley, 2000)
    TimePerTreelltC=Math.sqrt(4.58+0.07*WalkDistLLT+0.16*DBHLLT);
    VolPerPMHlltC=TreeVolLLT/(TimePerTreelltC/60);
    CostPerCCFlltC=100*PMH_Chainsaw/VolPerPMHlltC;
    RelevancelltC=1;
    // ID (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    TimePerTreelltD=1.082+0.01505*TreeVolLLT-0.634/TreeVolLLT;
    VolPerPMHlltD=TreeVolLLT/(TimePerTreelltD/60);
    CostPerCCFlltD=100*PMH_Chainsaw/VolPerPMHlltD;
    RelevancelltD=(TreeVolLLT<5?0:(TreeVolLLT<15?-0.5+TreeVolLLT/10:(TreeVolLLT<90?1:(TreeVolLLT<180?2-TreeVolLLT/90:0))));
    // IE User-Defined Felling Only
    VolPerPMHlltE=0.001;
    CostPerCCFlltE=100*PMH_Chainsaw/VolPerPMHlltE;
    RelevancelltE=0;
    // Summary
    CostManFellLLT=(TreeVolLLT>0?
        CHardwoodLLT*100*(PMH_Chainsaw*RelevancelltA+PMH_Chainsaw*RelevancelltB+PMH_Chainsaw*RelevancelltC+PMH_Chainsaw*RelevancelltD+PMH_Chainsaw*RelevancelltE)
        /(RelevancelltA*VolPerPMHlltA+RelevancelltB*VolPerPMHlltB+RelevancelltC*VolPerPMHlltC+RelevancelltD*VolPerPMHlltD+RelevancelltE*VolPerPMHlltE):0);

// II. Felling, Limbing & Bucking
    // IIA (Kellogg&Olsen, 86)
    EastsideAdjustment=1.2;
    ClearcutAdjustment=0.9;
    TimePerTreelltIIA=EastsideAdjustment*(PartialCut==1?1:(PartialCut==0?ClearcutAdjustment:null))*(1.33+0.0187*WalkDistLLT+0.0143*Slope+0.0987*TreeVolLLT+0.14);
    VolPerPMHlltIIA=TreeVolLLT/(TimePerTreelltIIA/60);
    CostPerCCFlltIIA=100*PMH_Chainsaw/VolPerPMHlltIIA;
    RelevancelltIIA=1;
    // IIB (Kellogg, L., M. Miller and E. Olsen, 1999)  Skyline thinning production and costs: experience from the Willamette Young Stand Project.  
    // Research Contribtion 21.  Forest Research Laboratory, Oregon State University, Corvallis.
    LimbslltIIB=31.5;
    LogslltIIB=LogsPerTreeLLT;
    WedgelltIIB=0.02;
    CorridorlltIIB=0.21;
    NotBetweenOpeningslltIIB=1;
    OpeningslltIIB=0;
    HeavyThinlltIIB=(PartialCut?0:1);
    DelayFraclltIIB=0.25;
    TimePerTreelltIIB=(-0.465+0.102*DBHLLT+0.016*LimbslltIIB+0.562*LogslltIIB+0.009*Slope+0.734*WedgelltIIB+0.137*CorridorlltIIB
        +0.449*NotBetweenOpeningslltIIB+0.437*OpeningslltIIB+0.426*HeavyThinlltIIB)*(1+DelayFraclltIIB);
    VolPerPMHlltIIB=TreeVolLLT/(TimePerTreelltIIB/60);
    CostPerCCFlltIIB=100*PMH_Chainsaw/VolPerPMHlltIIB;
    // RelevancelltIIB=(TreeVolLLT<1?0:(TreeVolLLT<2?-1+TreeVolLLT/1:(TreeVolLLT<70?1:1.2-TreeVolLLT/350)));
    RelevancelltIIB=TreeVol<1?0:(TreeVol<2?-1+TreeVol/1:(TreeVol<70?1:1.2-TreeVol/350)); // ='Felling (all trees)'!E40
    // IIC (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    DelayFraclltIIC=0.197;
    TimePerTreelltIIC=(1.772+0.02877*TreeVolLLT-2.6486/TreeVolLLT)*(1+DelayFraclltIIC);
    VolPerPMHlltIIC=TreeVolLLT/(TimePerTreelltIIC/60);
    CostPerCCFlltIIC=100*PMH_Chainsaw/VolPerPMHlltIIC;
    RelevancelltIIC=(TreeVolLLT<5?0:(TreeVolLLT<15?-0.5+TreeVolLLT/10:1));
    // IID User-Defined Felling, Limbing & Bucking
    VolPerPMHlltIID=0.001;
    CostPerCCFlltIID=100*PMH_Chainsaw/VolPerPMHlltIID;
    RelevancelltIID=0;
    // Summary
    CostManFLBLLT=(TreeVolLLT>0?CHardwoodLLT*100*
        (PMH_Chainsaw*RelevancelltIIA+PMH_Chainsaw*RelevancelltIIB+PMH_Chainsaw*RelevancelltIIC+PMH_Chainsaw*RelevancelltIID)
        /(RelevancelltIIA*VolPerPMHlltIIA+RelevancelltIIB*VolPerPMHlltIIB+RelevancelltIIC*VolPerPMHlltIIC+RelevancelltIID*VolPerPMHlltIID):0);
    
    return CostManFLBLLT;
}

function Skidding(Slope,YardDist,Removals,TreeVol,WoodDensity,LogLength,PartialCut,
    CSlopeSkidForwLoadSize,LogsPerTree,LogVol,ManualMachineSize,BFperCF,ButtDiam){
// Skidding Calculated Values
    let TurnVol,LogsPerTurnS,TreesPerTurnS,PMH_SkidderB,PMH_SkidderS,SkidderHourlyCost;
// I Choker, Unbunched
    let MaxLogs,ChokerLogs,ChokerTurnVol;
    // IA CC (Johnson&Lee, 88)
    let WinchDistSkidIA,TurnTimeSkidIA,VolPerPMHskidIA,CostPerCCFSkidIA,RelevanceSkidIA;
    // IB CC (Gibson&Egging, 73)
    let TurnTimeSkidIB,VolPerPMHskidIB,CostPerCCFskidIB,RelevanceSkidIB;
    // IC CC (Schillings, 69) not used at present
    let TurnTimeSkidIC,VolPerPMHskidIC,CostPerCCFskidIC,RelevanceSkidIC;
    // ID CC (Gardner, 79)
    let TurnTimeSkidID,VolPerPMHskidID,CostPerCCFskidID,RelevanceSkidID;
    // IE Cat 518 or Cat D4H, cable (Andersson, B. and G. Young  1998.  
    // Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    let TurnTimeSkidIE,VolPerPMHskidIE,CostPerCCFskidIE,RelevanceSkidIE;
// II Grapple, Unbunched
    let IntMoveDistS;
    // IIA Cat 518 (Johnson, 88)
    let TurnTimeSkidIIA,VolPerPMHskidIIA,CostPerCCFskidIIA,RelevanceSkidIIA;
    // IIB JD 648 (Gebhardt, 77)
    let GroundRatingSkidIIB,TypeOfCutSkidIIB,TurnTimeSkidIIB,VolPerPMHskidIIB,CostPerCCFskidIIB,RelevanceSkidIIB;
// III User-Defined Skidding Unbunched
    let VolPerPMHskidIII,CostPerCCFskidIII,RelevanceSkidIII;
// IV Grapple, Bunched
    // IVA Grapple Skidders (Johnson, 88)
    let DeckHeightSkidIVA,TravEmptySkidIVA,LoadSkidIVA,TravLoadedSkidIVA,DeckSkidIVA,
        TurnTImeSkidIVA,VolPerPMHskidIVA,CostPerCCFskidIVA,RelevanceSkidIVA;
    // IVB Grapple Skidders (Tufts et al, 88)
    let EastsideAdjustmentSkidIVB,BunchSizeSkidIVB,BunchVolSkidIVB,TurnWtSkidIVB,BunchesPerTurnSkidIVB,SkidderHpSkidIVB,
        TravEmptySkidIVB,GrappleSkidIVB,TravLoadedSkidIVB,UngrappleSkidIVB,CycletimeSkidIVB,VolPerPMHskidIVB,CostPerCCFskidIVB,RelevanceSkidIVB;
    // IVC John Deere 748E (Kosicki, K. 00. Productivities and costs of two harvesting trials in a western Alberta riparian zone.  FERIC Advantage 1(19))
    let LoadingStopsSkidIVC,TurnTimeSkidIVC,VolPerPMHskidIVC,CostPerCCFskidIVC,RelevanceSkidIVC;
    // IVD Cat D5H TSK Custom Track (Henderson, B. 01. Roadside harvesting with low ground-presssure skidders in northwestern British Columbia. FERIC Advantage 2(54))
    let TurnTimeSkidIVD,VolPerPMHskidIVD,CostPerCCFskidIVD,RelevanceSkidIVD;
    // IVE JD 748_G-II & TJ 560 (Kosicki, K. 02. Productivity and cost of summer harvesting in a central Alberta mixedwood stand. FERIC Advantage 3(6))
    let BunchesPerTurnSkidIVE,TurnTimeSkidIVE,VolPerPMHskidIVE,CostPerCCFskidIVE,RelevanceSkidIVE;
    // IVF Tigercat 635 (Boswell, B. 98. Vancouver Island mechanized thinning trials. FERIC Technical Note TN-271)
    let TurnTimeSkidIVF,VolPerPMHskidIVF,CostPerCCFskidIVF,RelevanceSkidIVF;
    // IVG Tigercat 635 (Kosicki, K. 02. Evaluation of Trans-Gesco TG88C and Tigercat 635 grapple skidders working in central Alberta. FERIC Advantage 3(37))
    let TreesPerTurnSkidIVG,TurnTimeSkidIVG,VolPerPMHskidIVG,CostPerCCFskidIVG,RelevanceSkidIVG;
    // IVH User-Defined Skidding Bunched
    let VolPerPMHskidIVH,CostPerCCFskidIVH,RelevanceSkidIVH;
// Skidding Summary
    let CostSkidUB,CostSkidBun;

// Skidding Calculated Values
    TurnVol=(PartialCut==0?44.87:(PartialCut==1?31.62:null))*Math.pow(TreeVol,0.282)*CSlopeSkidForwLoadSize;
    LogsPerTurnS=TurnVol/LogVol;
    TreesPerTurnS=TurnVol/TreeVol;
    PMH_SkidderB=189.6113334; // hardcoded
    PMH_SkidderS=133.9201221; //hardcoded
    SkidderHourlyCost=PMH_SkidderS*(1-ManualMachineSize)+PMH_SkidderB*ManualMachineSize;

// I Choker, Unbunched
    MaxLogs=10;
    ChokerLogs=Math.min(MaxLogs,LogsPerTurnS);
    ChokerTurnVol=ChokerLogs*LogVol;
    // IA CC (Johnson&Lee, 88)
    WinchDistSkidIA=25;
    TurnTimeSkidIA=-15.58+0.345*ChokerLogs+0.037*ChokerTurnVol+4.05*Math.log(YardDist+WinchDistSkidIA);
    VolPerPMHskidIA=ChokerTurnVol/(TurnTimeSkidIA/60);
    CostPerCCFSkidIA=100*SkidderHourlyCost/VolPerPMHskidIA;
    RelevanceSkidIA=(ChokerTurnVol<90?1:(ChokerTurnVol<180?2-ChokerTurnVol/90:0));
    // IB CC (Gibson&Egging, 73)
    TurnTimeSkidIB=2.74+0.726*ChokerLogs+0.00363*ChokerTurnVol*BFperCF+0.0002*ChokerTurnVol*WoodDensity+0.00777*YardDist+0.00313*Math.pow(Slope,2);
    VolPerPMHskidIB=ChokerTurnVol/(TurnTimeSkidIB/60);
    CostPerCCFskidIB=100*SkidderHourlyCost/VolPerPMHskidIB;
    RelevanceSkidIB=1;
    // IC CC (Schillings, 69) not used at present
    TurnTimeSkidIC=60*((0.122+0.089)+(0.000229+0.000704)*YardDist+(-0.00076+0.00127)*Slope+(0.0191+0.0118)*ChokerLogs)/2;
    VolPerPMHskidIC=ChokerTurnVol/(TurnTimeSkidIC/60);
    CostPerCCFskidIC=100*SkidderHourlyCost/VolPerPMHskidIC;
    RelevanceSkidIC=0;
    // ID CC (Gardner, 79)
    TurnTimeSkidID=2.57+0.823*ChokerLogs+0.0054*ChokerTurnVol*BFperCF+0.0078*2*YardDist;
    VolPerPMHskidID=ChokerTurnVol/(TurnTimeSkidID/60);
    CostPerCCFskidID=100*SkidderHourlyCost/VolPerPMHskidID;
    RelevanceSkidID=1;
    // IE Cat 518 or Cat D4H, cable (Andersson, B. and G. Young  1998.  
    // Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    TurnTimeSkidIE=(7.36+0.0053*YardDist);
    VolPerPMHskidIE=ChokerTurnVol/(TurnTimeSkidIE/60);
    CostPerCCFskidIE=100*SkidderHourlyCost/VolPerPMHskidIE;
    RelevanceSkidIE=(TreeVol<5?0:(TreeVol<15?-0.5+TreeVol/10:(TreeVol<75?1:(TreeVol<150?2-TreeVol/75:0))));

// II Grapple, Unbunched
    IntMoveDistS=17.0;
    // IIA Cat 518 (Johnson, 88)
    TurnTimeSkidIIA=0.518+0.0107*YardDist+0.0011*Math.pow(Slope,3)+1.62*Math.log(LogsPerTurnS);
    VolPerPMHskidIIA=TurnVol/(TurnTimeSkidIIA/60);
    CostPerCCFskidIIA=100*SkidderHourlyCost/VolPerPMHskidIIA;
    RelevanceSkidIIA=(ButtDiam<20?1:(ButtDiam<25?5-ButtDiam/5:0));
    // IIB JD 648 (Gebhardt, 77)
    GroundRatingSkidIIB=1.1;
    TypeOfCutSkidIIB=1.5*PartialCut;
    TurnTimeSkidIIB=1.072+0.00314*YardDist+0.0192*Slope+0.315*TypeOfCutSkidIIB+0.489*LogsPerTurnS-0.819*GroundRatingSkidIIB+0.00469*IntMoveDistS+0.00139*TurnVol*BFperCF;
    VolPerPMHskidIIB=TurnVol/(TurnTimeSkidIIB/60);
    CostPerCCFskidIIB=100*SkidderHourlyCost/VolPerPMHskidIIB;
    RelevanceSkidIIB=1;
    
// III User-Defined Skidding Unbunched
    VolPerPMHskidIII=0.001;
    CostPerCCFskidIII=100*SkidderHourlyCost/VolPerPMHskidIII;
    RelevanceSkidIII=0;

// IV Grapple, Bunched
    // IVA Grapple Skidders (Johnson, 88)
    DeckHeightSkidIVA=3;
    TravEmptySkidIVA=-2.179+0.0362*Slope+0.711*Math.log(YardDist);
    LoadSkidIVA=Math.max(0,0.882+0.0042*Math.pow(Slope,2)-0.000048*Math.pow(TreesPerTurnS,3));
    TravLoadedSkidIVA=-0.919+0.00081*YardDist+0.000062*Math.pow(Slope,3)+0.353*Math.log(YardDist);
    DeckSkidIVA=0.063+0.55*Math.log(DeckHeightSkidIVA)+0.0076*(DeckHeightSkidIVA)*(TreesPerTurnS);
    TurnTImeSkidIVA=TravEmptySkidIVA+LoadSkidIVA+TravLoadedSkidIVA+DeckSkidIVA;
    VolPerPMHskidIVA=TurnVol/(TurnTImeSkidIVA/60);
    CostPerCCFskidIVA=100*SkidderHourlyCost/VolPerPMHskidIVA;
    RelevanceSkidIVA=(ButtDiam<15?1:(ButtDiam<20?4-ButtDiam/5:0));
    // IVB Grapple Skidders (Tufts et al, 88)
    EastsideAdjustmentSkidIVB=1.3;
    BunchSizeSkidIVB=TreesPerCycleIIB;
    BunchVolSkidIVB=TreeVol*BunchSizeSkidIVB;
    TurnWtSkidIVB=TurnVol*WoodDensity;
    BunchesPerTurnSkidIVB=Math.max(1,TurnVol/BunchVolSkidIVB);
    SkidderHpSkidIVB=50.5+5.74*Math.sqrt(TreeVol);
    TravEmptySkidIVB=(0.1905*YardDist+0.3557*SkidderHpSkidIVB-0.0003336*YardDist*SkidderHpSkidIVB)/100;
    GrappleSkidIVB=Math.min(5,(-38.36+161.6*BunchesPerTurnSkidIVB-0.5599*BunchesPerTurnSkidIVB*SkidderHpSkidIVB+1.398*BunchesPerTurnSkidIVB*BunchSizeSkidIVB)/100);
    TravLoadedSkidIVB=(-34.52+0.2634*YardDist+0.7634*SkidderHpSkidIVB-0.00122*YardDist*SkidderHpSkidIVB+0.03782*YardDist*BunchesPerTurnSkidIVB)/100;
    UngrappleSkidIVB=Math.max(0,(5.177*BunchesPerTurnSkidIVB+0.002508*TurnWtSkidIVB-0.00007944*TurnWtSkidIVB*BunchesPerTurnSkidIVB*BunchSizeSkidIVB*BunchesPerTurnSkidIVB)/100);
    CycletimeSkidIVB=EastsideAdjustmentSkidIVB*(TravEmptySkidIVB+GrappleSkidIVB+TravLoadedSkidIVB+UngrappleSkidIVB);
    VolPerPMHskidIVB=TurnVol/(CycletimeSkidIVB/60);
    CostPerCCFskidIVB=100*SkidderHourlyCost/VolPerPMHskidIVB;
    RelevanceSkidIVB=0.50;
    // IVC John Deere 748E (Kosicki, K. 00. Productivities and costs of two harvesting trials in a western Alberta riparian zone.  FERIC Advantage 1(19))
    LoadingStopsSkidIVC=2.1;
    TurnTimeSkidIVC=0.65+0.0054*YardDist+0.244*LoadingStopsSkidIVC;
    VolPerPMHskidIVC=TurnVol/(TurnTimeSkidIVC/60);
    CostPerCCFskidIVC=100*SkidderHourlyCost/VolPerPMHskidIVC;
    RelevanceSkidIVC=(TreeVol<5?0:(TreeVol<10?-1+TreeVol/5:(TreeVol<50?1:(TreeVol<100?2-TreeVol/50:0))));
    // IVD Cat D5H TSK Custom Track (Henderson, B. 01. Roadside harvesting with low ground-presssure skidders in northwestern British Columbia. FERIC Advantage 2(54))
    TurnTimeSkidIVD=2.818+0.0109*YardDist;
    VolPerPMHskidIVD=TurnVol/(TurnTimeSkidIVD/60);
    CostPerCCFskidIVD=100*SkidderHourlyCost/VolPerPMHskidIVD;
    RelevanceSkidIVD=(TreeVol<5?0:(TreeVol<10?-1+TreeVol/5:(TreeVol<50?1:(TreeVol<100?2-TreeVol/50:0))));
    // IVE JD 748_G-II & TJ 560 (Kosicki, K. 02. Productivity and cost of summer harvesting in a central Alberta mixedwood stand. FERIC Advantage 3(6))
    BunchesPerTurnSkidIVE=BunchesPerTurnSkidIVB;
    TurnTimeSkidIVE=0.649+0.0058*YardDist+0.581*BunchesPerTurnSkidIVE;
    VolPerPMHskidIVE=TurnVol/(TurnTimeSkidIVE/60);
    CostPerCCFskidIVE=100*SkidderHourlyCost/VolPerPMHskidIVE;
    RelevanceSkidIVE=(TreeVol<30?1:(TreeVol<60?2-TreeVol/30:0));
    // IVF Tigercat 635 (Boswell, B. 98. Vancouver Island mechanized thinning trials. FERIC Technical Note TN-271)
    TurnTimeSkidIVF=5.77+0.007*YardDist;
    VolPerPMHskidIVF=TurnVol/(TurnTimeSkidIVF/60);
    CostPerCCFskidIVF=100*SkidderHourlyCost/VolPerPMHskidIVF;
    RelevanceSkidIVF=(TreeVol<5?0:(TreeVol<10?-1+TreeVol/5:(TreeVol<100?1:(TreeVol<150?3-TreeVol/50:0))));
    // IVG Tigercat 635 (Kosicki, K. 02. Evaluation of Trans-Gesco TG88C and Tigercat 635 grapple skidders working in central Alberta. FERIC Advantage 3(37))
    TreesPerTurnSkidIVG=TreesPerTurnS;
    TurnTimeSkidIVG=2.98+0.006*YardDist+0.27*TreesPerTurnSkidIVG;
    VolPerPMHskidIVG=TurnVol/(TurnTimeSkidIVG/60);
    CostPerCCFskidIVG=100*SkidderHourlyCost/VolPerPMHskidIVG;
    RelevanceSkidIVG=(TreeVol<40?1:(TreeVol<80?2-TreeVol/40:0));
    // IVH User-Defined Skidding Bunched
    VolPerPMHskidIVH=0.001;
    CostPerCCFskidIVH=100*SkidderHourlyCost/VolPerPMHskidIVH;
    RelevanceSkidIVH=0;
// Skidding Summary
    CostSkidUB=CHardwood*100*(SkidderHourlyCost*RelevanceSkidIA+SkidderHourlyCost*RelevanceSkidIB+SkidderHourlyCost*RelevanceSkidIC+SkidderHourlyCost*RelevanceSkidID
        +SkidderHourlyCost*RelevanceSkidIE+SkidderHourlyCost*RelevanceSkidIIA+SkidderHourlyCost*RelevanceSkidIIB+SkidderHourlyCost*RelevanceSkidIII)
        /(RelevanceSkidIA*VolPerPMHskidIA+RelevanceSkidIB*VolPerPMHskidIB+RelevanceSkidIC*VolPerPMHskidIC+RelevanceSkidID*VolPerPMHskidID
            +RelevanceSkidIE*VolPerPMHskidIE+RelevanceSkidIIA*VolPerPMHskidIIA+RelevanceSkidIIB*VolPerPMHskidIIB+RelevanceSkidIII*VolPerPMHskidIII);
    CostSkidBun=CHardwood*100*(SkidderHourlyCost*RelevanceSkidIVA+SkidderHourlyCost*RelevanceSkidIVB+SkidderHourlyCost*RelevanceSkidIVC+SkidderHourlyCost*RelevanceSkidIVD
        +SkidderHourlyCost*RelevanceSkidIVE+SkidderHourlyCost*RelevanceSkidIVF+SkidderHourlyCost*RelevanceSkidIVG+SkidderHourlyCost*RelevanceSkidIVH)
        /(RelevanceSkidIVA*VolPerPMHskidIVA+RelevanceSkidIVB*VolPerPMHskidIVB+RelevanceSkidIVC*VolPerPMHskidIVC+RelevanceSkidIVD*VolPerPMHskidIVD
            +RelevanceSkidIVE*VolPerPMHskidIVE+RelevanceSkidIVF*VolPerPMHskidIVF+RelevanceSkidIVG*VolPerPMHskidIVG+RelevanceSkidIVH*VolPerPMHskidIVH);

    return CostSkidBun;
}

function Processing(TreeVolSLT,DBHSLT,ButtDiamSLT,LogsPerTreeSLT,MechMachineSize){
    let PMH_ProcessorS=209.6417668 // hardcoded
    let PMH_ProcessorB=265.4554487 // hardcoded

    // Processing Calculated Values
    let ProcessorHourlyCost;
    // A) Hahn Stroke Processor (Gonsier&Mandzak, 87)
    let TimePerTreeProcessA,VolPerPMHProcessA,CostPerCCFprocessA,RelevanceProcessA;
    // B) Stroke Processor (MacDonald, 90)
    let TimePerTreeProcessB,VolPerPMHprocessB,CostPerCCFprocessB,RelevanceProcessB;
    // C) Roger Stroke Processor (Johnson, 88)
    let TimePerTreeProcessC,VolPerPMHprocessC,CostPerCCFprocessC,RelevanceProcessC;
    // D) Harricana Stroke Processor (Johnson, 88)
    let TimePerTreeProcessD,VolPerPMHprocessD,CostPerCCFprocessD,RelevanceProcessD;
    // E) Hitachi EX150/Keto 500 (Schroder&Johnson, 97)
    let TimePerTreeProcessE,VolPerPMHprocessE,CostPerCCFprocessE,RelevanceProcessE;
    // F) FERIC Generic (Gingras, J.F. 96. The cost of product sorting during harvesting. FERIC Technical Note TN-245)
    let VolPerPMHprocessF,CostPerCCFprocessF,RelevanceProcessF;
    // G) Valmet 546 Woodstar Processor (Holtzscher, M. and B. Lanford 1997 Tree diameter effects on costs and productivity of cut-to-length systems. For. Prod. J. 47(3):25-30)
    let TimePerTreeProcessG,VolPerPMHprocessG,CostPerCCFprocessG,RelevanceProcessG;
    // H) User-Defined
    let VolPerPMHprocessH,CostPerCCFprocessH,RelevanceProcessH;
    // Processing Summary
    let CostProcess;

    // Processing Calculated Values
    ProcessorHourlyCost=PMH_ProcessorS*(1-MechMachineSize)+PMH_ProcessorB*MechMachineSize;
    // A) Hahn Stroke Processor (Gonsier&Mandzak, 87)
    TimePerTreeProcessA=1.26*(0.232+0.0494*DBHSLT);
    VolPerPMHProcessA=TreeVolSLT/(TimePerTreeProcessA/60);
    CostPerCCFprocessA=100*ProcessorHourlyCost/VolPerPMHProcessA;
    RelevanceProcessA=(DBHSLT<15?1:(DBHSLT<20?4-DBHSLT/5:0));
    // B) Stroke Processor (MacDonald, 90)
    TimePerTreeProcessB=0.153+0.0145*ButtDiamSLT;
    VolPerPMHprocessB=TreeVolSLT/(TimePerTreeProcessB/60);
    CostPerCCFprocessB=100*ProcessorHourlyCost/VolPerPMHprocessB;
    RelevanceProcessB=(ButtDiamSLT<20?1:(ButtDiamSLT<30?3-ButtDiamSLT/10:0));
    // C) Roger Stroke Processor (Johnson, 88)
    TimePerTreeProcessC=-0.05+0.6844*LogsPerTreeSLT+5*Math.pow(10,-8)*Math.pow(TreeVolSLT,2);
    VolPerPMHprocessC=TreeVolSLT/(TimePerTreeProcessC/60);
    CostPerCCFprocessC=100*ProcessorHourlyCost/VolPerPMHprocessC;
    RelevanceProcessC=1;
    // D) Harricana Stroke Processor (Johnson, 88)
    TimePerTreeProcessD=-0.13+0.001*Math.pow(ButtDiamSLT,2)+0.5942*LogsPerTreeSLT;
    VolPerPMHprocessD=TreeVolSLT/(TimePerTreeProcessD/60);
    CostPerCCFprocessD=100*ProcessorHourlyCost/VolPerPMHprocessD;
    RelevanceProcessD=1;
    // E) Hitachi EX150/Keto 500 (Schroder&Johnson, 97)
    TimePerTreeProcessE=Math.pow(0.67+0.0116*TreeVolSLT,2);
    VolPerPMHprocessE=TreeVolSLT/(TimePerTreeProcessE/60);
    CostPerCCFprocessE=100*ProcessorHourlyCost/VolPerPMHprocessE;
    RelevanceProcessE=(TreeVolSLT<50?1:(TreeVolSLT<100?2-TreeVolSLT/50:0));
    // F) FERIC Generic (Gingras, J.F. 96. The cost of product sorting during harvesting. FERIC Technical Note TN-245)
    VolPerPMHprocessF=(41.16/0.02832)*Math.pow(TreeVolSLT/35.31,0.4902);
    CostPerCCFprocessF=100*ProcessorHourlyCost/VolPerPMHprocessF;
    RelevanceProcessF=1;
    // G) Valmet 546 Woodstar Processor (Holtzscher, M. and B. Lanford 1997 Tree diameter effects on costs and productivity of cut-to-length systems. For. Prod. J. 47(3):25-30)
    TimePerTreeProcessG=-0.341+0.1243*DBHSLT;
    VolPerPMHprocessG=TreeVolSLT/(TimePerTreeProcessG/60);
    CostPerCCFprocessG=100*ProcessorHourlyCost/VolPerPMHprocessG;
    RelevanceProcessG=(TreeVolSLT<20?1:(TreeVolSLT<40?2-TreeVolSLT/20:0));
    // H) User-Defined
    VolPerPMHprocessH=0.001;
    CostPerCCFprocessH=100*ProcessorHourlyCost/VolPerPMHprocessH;
    RelevanceProcessH=0;
    // Processing Summary
    CostProcess=(TreeVolSLT>0?CHardwoodSLT*100*(ProcessorHourlyCost*RelevanceProcessA+ProcessorHourlyCost*RelevanceProcessB+ProcessorHourlyCost*RelevanceProcessC
        +ProcessorHourlyCost*RelevanceProcessD+ProcessorHourlyCost*RelevanceProcessE+ProcessorHourlyCost*RelevanceProcessF+ProcessorHourlyCost*RelevanceProcessG+ProcessorHourlyCost*RelevanceProcessH)
        /(RelevanceProcessA*VolPerPMHProcessA+RelevanceProcessB*VolPerPMHprocessB+RelevanceProcessC*VolPerPMHprocessC+RelevanceProcessD*VolPerPMHprocessD
            +RelevanceProcessE*VolPerPMHprocessE+RelevanceProcessF*VolPerPMHprocessF+RelevanceProcessG*VolPerPMHprocessG+RelevanceProcessH*VolPerPMHprocessH):0);

    return CostProcess;
}

function Loading(LoadWeightLog,WoodDensityALT,WoodDensitySLT,CTLLogVol,LogVolALT,DBHALT,DBHSLT,ManualMachineSizeALT){
    let ExchangeTrucks,PMH_LoaderS,PMH_LoaderB;
    // Loading Calculated Values
    let LoadVolALT,LoadVolSLT,LoaderHourlyCost;
    // I. Loading Full-Length Logs
    // A) Front-End Loader (Vaughan, 89)
    let TimePerLoadIA,VolPerPMHloadingIA,CostPerCCFloadingIA,RelevanceLoadingIA;
    // B) Knuckleboom Loader, Small Logs (Brown&Kellogg, 96)
    let CCFperPmin,TimePerLoadIB,VolPerPMHloadingIB,CostPerCCFloadingIB,RelevanceLoadingIB;
    // C) Loaders (Hartsough et al, 98)
    let TimePerCCFloadingIC,TimePerLoadIC,VolPerPMHloadingIC,CostPerCCFloadingIC,RelevanceLoadingIC;
    // D) Loaders (Jackson et al, 84)
    let VolPerPMHloadingID,CostPerCCFloadingID,RelevanceLoadingID;
    // E) User-Defined Load Full-Length Logs
    let VolPerPMHloadingIE,CostPerCCFloadingIE,RelevanceLoadingIE;
    // II. Loading CTL Logs
    // A) Knuckleboom Loader, CTL Logs (Brown&Kellogg, 96)
    let CCFperPminLoadingIIA,TimePerLoadIIA,VolPerPMHloadingIIA,CostPerCCFloadingIIA,RelevanceLoadingIIA;    
    // B) Loaders (Jackson et al, 84)
    let VolPerPMHloadingIIB,CostPerCCFloadingIIB,RelevanceLoadingIIB;
    // C) User-Defined Load CTL Logs
    let VolPerPMHloadingIIC,CostPerCCFloadingIIC,RelevanceLoadingIIC;
    // Loading Summary
    // I. Loading Full-Length Logs
    let CostLoad;
    // II. Loading CTL Logs
    let CostLoadCTL;

    ExchangeTrucks=5;
    PMH_LoaderS=146.7425596; // hardcoded
    PMH_LoaderB=180.1779855; // hardcoded
    // Loading Calculated Values
    LoadVolALT=LoadWeightLog*2000/(WoodDensityALT*100);
    LoadVolSLT=LoadWeightLog*2000/(WoodDensitySLT*100);
    LoaderHourlyCost=PMH_LoaderS*(1-ManualMachineSizeALT)+PMH_LoaderB*ManualMachineSizeALT;

    // I. Loading Full-Length Logs
    // A) Front-End Loader (Vaughan, 89)
    TimePerLoadIA=22-0.129*LogVolALT+ExchangeTrucks;
    VolPerPMHloadingIA=100*LoadVolALT/(TimePerLoadIA/60);
    CostPerCCFloadingIA=100*LoaderHourlyCost/VolPerPMHloadingIA;
    RelevanceLoadingIA=LogVolALT<10?0:(LogVolALT<40?-1/3+LogVolALT/30:1);
    // B) Knuckleboom Loader, Small Logs (Brown&Kellogg, 96)
    CCFperPmin=0.1+0.019*LogVolALT;
    TimePerLoadIB=LoadVolALT/CCFperPmin+ExchangeTrucks;
    VolPerPMHloadingIB=100*LoadVolALT/(TimePerLoadIB/60);
    CostPerCCFloadingIB=100*LoaderHourlyCost/VolPerPMHloadingIB;
    RelevanceLoadingIB=LogVolALT<10?1:(LogVolALT<20?2-LogVolALT/10:0);
    // C) Loaders (Hartsough et al, 98)
    TimePerCCFloadingIC=0.66+46.2/DBHALT;
    TimePerLoadIC=TimePerCCFloadingIC*LoadVolALT;
    VolPerPMHloadingIC=6000/TimePerCCFloadingIC;
    CostPerCCFloadingIC=100*LoaderHourlyCost/VolPerPMHloadingIC;
    RelevanceLoadingIC=0.8; // hardcoded
    // D) Loaders (Jackson et al, 84)
    VolPerPMHloadingID=100*(11.04+0.522*LogVolALT-0.00173*Math.pow(LogVolALT,2));
    CostPerCCFloadingID=100*LoaderHourlyCost/VolPerPMHloadingID;
    RelevanceLoadingID=LogVolALT<75?1:(LogVolALT<100?4-LogVolALT/25:0);
    // E) User-Defined Load Full-Length Logs
    VolPerPMHloadingIE=0.001;
    CostPerCCFloadingIE=100*LoaderHourlyCost/VolPerPMHloadingIE;
    RelevanceLoadingIE=0;

    // II. Loading CTL Logs
    // A) Knuckleboom Loader, CTL Logs (Brown&Kellogg, 96)
    CCFperPminLoadingIIA=0.1+0.019*CTLLogVol;
    TimePerLoadIIA=LoadVolSLT/CCFperPminLoadingIIA+ExchangeTrucks;
    VolPerPMHloadingIIA=100*LoadVolSLT/(TimePerLoadIIA/60);
    CostPerCCFloadingIIA=100*LoaderHourlyCost/VolPerPMHloadingIIA;
    RelevanceLoadingIIA=CTLLogVol<10?1:(CTLLogVol<20?2-CTLLogVol/10:0);
    // B) Loaders (Jackson et al, 84)
    VolPerPMHloadingIIB=100*(11.04+0.522*CTLLogVol-0.00173*Math.pow(CTLLogVol,2));
    CostPerCCFloadingIIB=100*LoaderHourlyCost/VolPerPMHloadingIIB;
    RelevanceLoadingIIB=0.5;
    // C) User-Defined Load CTL Logs
    VolPerPMHloadingIIC=0.001;
    CostPerCCFloadingIIC=100*LoaderHourlyCost/VolPerPMHloadingIIC;
    RelevanceLoadingIIC=0;

    // Loading Summary
    // I. Loading Full-Length Logs
    CostLoad=load_cost==true?
    (TreeVolALT>0?CHardwoodALT*100*(LoaderHourlyCost*RelevanceLoadingIA+LoaderHourlyCost*RelevanceLoadingIB+LoaderHourlyCost*RelevanceLoadingIC+LoaderHourlyCost*RelevanceLoadingID+LoaderHourlyCost*RelevanceLoadingIE)
    /(RelevanceLoadingIA*VolPerPMHloadingIA+RelevanceLoadingIB*VolPerPMHloadingIB+RelevanceLoadingIC*VolPerPMHloadingIC+RelevanceLoadingID*VolPerPMHloadingID+RelevanceLoadingIE*VolPerPMHloadingIE):0):0;
    // II. Loading CTL Logs
    CostLoadCTL=load_cost==true?
    (TreeVolSLT>0?CHardwoodSLT*100*(LoaderHourlyCost*RelevanceLoadingIIA+LoaderHourlyCost*RelevanceLoadingIIB+LoaderHourlyCost*RelevanceLoadingIIC)
    /(RelevanceLoadingIIA*VolPerPMHloadingIIA+RelevanceLoadingIIB*VolPerPMHloadingIIB+RelevanceLoadingIIC*VolPerPMHloadingIIC):0):0;

    return CostLoad;
}

function Chipping(TreeVolCT,WoodDensityCT,LoadWeightChip,MoistureContent,CHardwoodCT){
    let ExchangeVans=5.3;
    // Chipping Calculated Values
    let PMH_LoaderS,PMH_ChipperS,PMH_ChipperB,LoadWeightDry,TreeWeightDry,CTLLogWeight,CTLLogWeightDry,ChipperHourlyCost;
    // I. Chip Whole Trees
    // A) (Johnson, 89)
    let ChipperHP1A,GTperPMHchippingIA,VolPerPMHchippingIA,CostPerCCFchippingIA,RelevanceChippingIA;
    // B) Morbark 22 (Hartsough, unpublished)
    let VolPerPMHchippingIB,CostPerCCFchippingIB,RelevanceChippingIB;
    // C) Morbark 60/36 (Hartsough et al, 97)
    let ProbDelayFractionIC,LogsPerSwingIC,ChipTimePerSwingIC,SlashIC,TimePerVanIC,VolPerPMHchippingIC,CostPerCCFchippingIC,RelevanceChippingIC;
    // D) User-Defined Chip Whole Trees
    let VolPerPMHchippingID,CostPerCCFchippingID,RelevanceChippingID;
    // II. Chain Flail DDC Whole Trees
    // A) adjusted from Chip Whole Trees
    let FlailProdAdjustmentIIA,FlailHrlyCostAdjustmentIIA,CostPerPMHchippingIIA,CostPerCCFchippingIIA,VolPerPMHchippingIIA,RelevanceChippingIIA;
    // B) User-Defined Chain Flail DDC WT
    let VolPerPMHchippingIIB,CostPerCCFchippingIIB,RelevanceChippingIIB;
    // III. Chip CTL Logs
    // A) Morbark 27 (Drews et al, 98)
    let ProbDelayFractionIIIA,TimePerGTchippingIIIA,TimePerVanIIIA,VolPerPMHchippingIIIA,CostPerCCFchippingIIIA,RelevanceChippingIIIA;
    // B) Morbark 60/36 (Hartsough et al, 97)
    let ProdDelayFractionIIIB,LogsPerSwingIIIB,ChipTimePerSwingIIIB,SlashIIIB,TimePerVanIIIB,VolPerPMHchippingIIIB,CostPerCCFchippingIIIB,RelevanceChippingIIIB;
    // C) User-Defined Chip CTL Logs
    let VolPerPMHchippingIIIC,CostPerCCFchippingIIIC,RelevanceChippingIIIC;
    // IV. Chip Piled Loose Residues at Landing
    // A) Drum chippers (Desrochers, L., D. Puttock and M. Ryans. 95. Recovery of roadside residues using drum chippers. FERIC Technical Report TR-111)
    let BDTperPMHchippingIVA,BDTperPMHchippingIVA2,BDTperPMHchippingIVAavg,GTperPMHchippingIVA,CostPerPMHchippingIVA,CostPerGTchippingIVA,RelevanceChippingIVA;
    // B) User-Defined Chip Piled Loose Residues at Landing
    let GTperPMHchippingIVB,CostPerGTchippingIVB,RelevanceChippingIVB;
    // V. Chip Bundles of Residue at Landing
    // A) Assume 50% faster than chipping loose residues
    let GTperPMHchippingVA,CostPerGTchippingVA,RelevanceChippingVA;
    // B) User-Defined Chip Bundles of Residue at Landing
    let GTperPMHchippingVB,CostPerGTchippingVB,RelevanceChippingVB;
    // Chipping Summary
    // I. Chip Whole Trees
    let CostChipWT;
    // II. Chain Flail DDC WT
    let CostDDChipWT;
    // III. Chip CTL Logs
    let CostChipCTL;
    // IV. Chip Piled Loose Residues at Landing
    let CostChipLooseRes;
    // V. Chip Bundles of Residue at Landing
    let CostChipBundledRes;

    // Chipping Calculated Values
    PMH_LoaderS=146.7425596; //hardcoded
    PMH_ChipperS=166.5332661; //hardcoded
    PMH_ChipperB=244.6444891; //hardcoded
    LoadWeightDry=LoadWeightChip*(1-MoistureContent);
    TreeWeightDry=TreeVolCT*WoodDensityCT*(1-MoistureContent);
    CTLLogWeight=CTLLogVolCT*WoodDensityCT;
    CTLLogWeightDry=CTLLogWeight*(1-MoistureContent);
    ChipperHourlyCost=PMH_ChipperS*(1-ChipperSize)+PMH_ChipperB*ChipperSize;

    // I. Chip Whole Trees
    // A) (Johnson, 89)
    ChipperHP1A=Math.min(700,Math.max(200,100+100*Math.sqrt(TreeVolCT)));
    GTperPMHchippingIA=-17+ChipperHP1A/6;
    VolPerPMHchippingIA=GTperPMHchippingIA*2000/WoodDensityCT;
    CostPerCCFchippingIA=100*ChipperHourlyCost/VolPerPMHchippingIA;
    RelevanceChippingIA=1;
    // B) Morbark 22 (Hartsough, unpublished)
    VolPerPMHchippingIB=Math.min(4000,463*Math.pow(TreeVolCT,0.668));
    CostPerCCFchippingIB=100*ChipperHourlyCost/VolPerPMHchippingIB;
    RelevanceChippingIB=1;
    // C) Morbark 60/36 (Hartsough et al, 97)
    ProbDelayFractionIC=0.038;
    LogsPerSwingIC=1.2+338/TreeWeightDry;
    ChipTimePerSwingIC=0.25+0.0264*LogsPerSwingIC+0.000498*TreeWeightDry;
    SlashIC=0.93;
    TimePerVanIC=ChipTimePerSwingIC*(1+ProbDelayFractionIC)/(TreeWeightDry*LogsPerSwingIC)*2000*LoadWeightDry+(SlashIC+ExchangeVans);
    VolPerPMHchippingIC=LoadWeightChip/(WoodDensityCT/2000)/(TimePerVanIC/60);
    CostPerCCFchippingIC=100*ChipperHourlyCost/VolPerPMHchippingIC;
    RelevanceChippingIC=TreeWeightDry<400?1:(TreeWeightDry<800?2-TreeWeightDry/400:0);
    // D) User-Defined Chip Whole Trees
    VolPerPMHchippingID=0.001;
    CostPerCCFchippingID=100*ChipperHourlyCost/VolPerPMHchippingID;
    RelevanceChippingID=0;

    // II. Chain Flail DDC Whole Trees

    // B) User-Defined Chain Flail DDC WT
    VolPerPMHchippingIIB=0.001;
    CostPerCCFchippingIIB=100*ChipperHourlyCost/VolPerPMHchippingIIB;
    RelevanceChippingIIB=0;
    
    // III. Chip CTL Logs
    // A) Morbark 27 (Drews et al, 98)
    ProbDelayFractionIIIA=0.111;
    TimePerGTchippingIIIA=Math.max(0.8,(2.05-0.00541*CTLLogWeight)*(1+ProbDelayFractionIIIA));
    TimePerVanIIIA=TimePerGTchippingIIIA*LoadWeightChip+ExchangeVans;
    VolPerPMHchippingIIIA=LoadWeightChip/(WoodDensityCT/2000)/(TimePerVanIIIA/60);
    CostPerCCFchippingIIIA=100*ChipperHourlyCost/VolPerPMHchippingIIIA;
    RelevanceChippingIIIA=Math.max(0.1,CTLLogWeight<100?1:(CTLLogWeight<200?2-CTLLogWeight/100:0));
    // B) Morbark 60/36 (Hartsough et al, 97)
    ProdDelayFractionIIIB=0.038;
    LogsPerSwingIIIB=1.2+338/CTLLogWeightDry;
    ChipTimePerSwingIIIB=0.25+0.0264*LogsPerSwingIIIB+0.000498*CTLLogWeightDry;
    SlashIIIB=0.93;
    TimePerVanIIIB=ChipTimePerSwingIIIB*(1+ProdDelayFractionIIIB)/(CTLLogWeightDry*LogsPerSwingIIIB)*2000*LoadWeightDry+(SlashIIIB+ExchangeVans);
    VolPerPMHchippingIIIB=LoadWeightChip/(WoodDensityCT/2000)/(TimePerVanIIIB/60);
    CostPerCCFchippingIIIB=100*ChipperHourlyCost/VolPerPMHchippingIIIB;
    RelevanceChippingIIIB=CTLLogWeightDry<400?1:(CTLLogWeightDry<800?2-CTLLogWeightDry/400:0);
    // C) User-Defined Chip CTL Logs
    VolPerPMHchippingIIIC=0.001;
    CostPerCCFchippingIIIC=100*ChipperHourlyCost/VolPerPMHchippingIIIC;
    RelevanceChippingIIIC=0;
    
    // IV. Chip Piled Loose Residues at Landing
    // A) Drum chippers (Desrochers, L., D. Puttock and M. Ryans. 95. Recovery of roadside residues using drum chippers. FERIC Technical Report TR-111)
    BDTperPMHchippingIVA=13.5;
    BDTperPMHchippingIVA2=31;
    BDTperPMHchippingIVAavg=(BDTperPMHchippingIVA+BDTperPMHchippingIVA2)/2;
    GTperPMHchippingIVA=BDTperPMHchippingIVAavg/MoistureContent;
    CostPerPMHchippingIVA=ChipperHourlyCost+PMH_LoaderS;
    CostPerGTchippingIVA=CostPerPMHchippingIVA/GTperPMHchippingIVA;
    RelevanceChippingIVA=1;
    // B) User-Defined Chip Piled Loose Residues at Landing
    GTperPMHchippingIVB=0.001;
    CostPerGTchippingIVB=CostPerPMHchippingIVA/GTperPMHchippingIVB;
    RelevanceChippingIVB=0;

    // V. Chip Bundles of Residue at Landing
    // A) Assume 50% faster than chipping loose residues
    GTperPMHchippingVA=1.5*GTperPMHchippingIVA;
    CostPerGTchippingVA=CostPerPMHchippingIVA/GTperPMHchippingVA;
    RelevanceChippingVA=1;
    // B) User-Defined Chip Bundles of Residue at Landing
    GTperPMHchippingVB=0.0001;
    CostPerGTchippingVB=CostPerPMHchippingIVA/GTperPMHchippingVB;
    RelevanceChippingVB=0;

    // Chipping Summary
    // I. Chip Whole Trees
    CostChipWT=TreeVolCT>0?CHardwoodCT*100*(ChipperHourlyCost*RelevanceChippingIA+ChipperHourlyCost*RelevanceChippingIB+ChipperHourlyCost*RelevanceChippingIC+ChipperHourlyCost*RelevanceChippingID)
    /(RelevanceChippingIA*VolPerPMHchippingIA+RelevanceChippingIB*VolPerPMHchippingIB+RelevanceChippingIC*VolPerPMHchippingIC+RelevanceChippingID*VolPerPMHchippingID):0;
    // II. Chain Flail DDC WT
    // A) adjusted from Chip Whole Trees
    FlailProdAdjustmentIIA=0.9;
    FlailHrlyCostAdjustmentIIA=1.1;
    CostPerPMHchippingIIA=FlailHrlyCostAdjustmentIIA*ChipperHourlyCost;
    // need CostChipWT to calculate CostPerCCFchippingIIA
    CostPerCCFchippingIIA=(FlailHrlyCostAdjustmentIIA/FlailProdAdjustmentIIA)*CostChipWT;
    VolPerPMHchippingIIA=100*CostPerPMHchippingIIA/CostPerCCFchippingIIA;
    RelevanceChippingIIA=Math.max(RelevanceChippingIA,RelevanceChippingIB,RelevanceChippingIC);
    //result
    CostDDChipWT=TreeVolCT>0?CHardwoodCT*100*(CostPerPMHchippingIIA*RelevanceChippingIIA+ChipperHourlyCost*RelevanceChippingIIB)
    /(RelevanceChippingIIA*VolPerPMHchippingIIA+RelevanceChippingIIB*VolPerPMHchippingIIB):0;
    // III. Chip CTL Logs
    CostChipCTL=TreeVolCT>0?CHardwoodCT*100*(ChipperHourlyCost*RelevanceChippingIIIA+ChipperHourlyCost*RelevanceChippingIIIB+ChipperHourlyCost*RelevanceChippingIIIC)
    /(RelevanceChippingIIIA*VolPerPMHchippingIIIA+RelevanceChippingIIIB*VolPerPMHchippingIIIB+RelevanceChippingIIIC*VolPerPMHchippingIIIC):0;
    // IV. Chip Piled Loose Residues at Landing
    CostChipLooseRes=(CostPerPMHchippingIVA*RelevanceChippingIVA+CostPerPMHchippingIVA*RelevanceChippingIVB)
    /(RelevanceChippingIVA*GTperPMHchippingIVA+RelevanceChippingIVB*GTperPMHchippingIVB);
    // V. Chip Bundles of Residue at Landing
    CostChipBundledRes=(CostPerPMHchippingIVA*RelevanceChippingVA+CostPerPMHchippingIVA*RelevanceChippingVB)
    /(RelevanceChippingVA*GTperPMHchippingVA+RelevanceChippingVB*GTperPMHchippingVB);

    let results={'CostChipWT':CostChipWT,'CostDDChipWT':CostDDChipWT,'CostChipCTL':CostChipCTL,'CostChipLooseRes':CostChipLooseRes,'CostChipBundledRes':CostChipBundledRes};
    // console.log(results);
    return results;
}


function MoveInCosts(Area,MoveInDist,TreeVol,Removals,VolPerAcreCT){
    // Move-In Assumptions
    let SpeedLoaded,SpeedBack,MoveInLabor,LoadHrs,LoadHrsYarder,TruckMoveInCosts,TruckDriverMoveInCosts;
    // Move-In Calculated Values
    let TravLoadedHrs,BackhaulHrs,LowboyCost;
    // System Costs
    // Mech WT
    let LowboyLoadsMechWT;
    // Fixed
    let fellerbuncherFixedMechWT,skidderFixedMechWT,processorFixedMechWT,loaderFixedMechWT,chipperFixedMechWT,totalFixedMechWT;
    // Variable
    let fellerbuncherVariableMechWT,skidderVariableMechWT,processorVariableMechWT,loaderVariableMechWT,chipperVariableMechWT,BackhaulVariableMechWT,totalVariableMechWT;
    // Total
    let totalMechWT,CostPerCCFmechWT;    
    
    // Move-In Assumptions
    SpeedLoaded=25;
    SpeedBack=40;
    MoveInLabor=0;
    LoadHrs=2;
    LoadHrsYarder=4;
    TruckMoveInCosts=35;
    TruckDriverMoveInCosts=18;
    // Move-In Calculated Values
    TravLoadedHrs=MoveInDist/SpeedLoaded;
    BackhaulHrs=MoveInDist/SpeedBack;
    LowboyCost=TruckMoveInCosts+TruckDriverMoveInCosts;
    // System Costs
    // Mech WT
    LowboyLoadsMechWT=4+(VolPerAcreCT>0?1:0);
    let FB_OwnCost=89.53504467; // hardcoded
    let Skidder_OwnCost=55.31143828; // hardcoded
    let Processor_OwnCost=103.8505096; // hardcoded
    let Loader_OwnCost=61.78935447; // hardcoded
    let Chipper_OwnCost=64.28841072; // hardcoded
    // Fixed
    fellerbuncherFixedMechWT=(LowboyCost+FB_OwnCost+MoveInLabor)*LoadHrs;
    skidderFixedMechWT=(LowboyCost+Skidder_OwnCost+MoveInLabor)*LoadHrs;
    processorFixedMechWT=(LowboyCost+Processor_OwnCost+MoveInLabor)*LoadHrs;
    loaderFixedMechWT=(LowboyCost+Loader_OwnCost+MoveInLabor)*LoadHrs;
    chipperFixedMechWT=VolPerAcreCT>0?(LowboyCost+Chipper_OwnCost+MoveInLabor)*LoadHrs:0;
    totalFixedMechWT=fellerbuncherFixedMechWT+skidderFixedMechWT+processorFixedMechWT+loaderFixedMechWT+chipperFixedMechWT;
    // Variable
    fellerbuncherVariableMechWT=(LowboyCost+FB_OwnCost)/SpeedLoaded;
    skidderVariableMechWT=(LowboyCost+Skidder_OwnCost)/SpeedLoaded;
    processorVariableMechWT=(LowboyCost+Processor_OwnCost)/SpeedLoaded;
    loaderVariableMechWT=(LowboyCost+Loader_OwnCost)/SpeedLoaded;
    chipperVariableMechWT=VolPerAcreCT>0?(LowboyCost+Chipper_OwnCost)/SpeedLoaded:0;
    BackhaulVariableMechWT=LowboyCost*LowboyLoadsMechWT/SpeedBack;
    totalVariableMechWT=fellerbuncherVariableMechWT+skidderVariableMechWT+processorVariableMechWT+loaderVariableMechWT+chipperVariableMechWT+BackhaulVariableMechWT;
    // Total
    totalMechWT=totalFixedMechWT+totalVariableMechWT*MoveInDist;
    CostPerCCFmechWT=totalMechWT*100/(Area*TreeVol*Removals);

    return CostPerCCFmechWT;
}

function InLimits(TreeVolCT,TreeVolSLT,TreeVolLLT,TreeVolALT,TreeVol,Slope) {
    // Mech WT
    let MaxLLTperAcre,MaxLLTasPercentALT,ExceededMaxLLT,AvgTreeSizeLimit4Chipping,AvgTreeSizeLimit4Processing,AvgTreeSizeLimit4ManualFellLimbBuck,AvgTreeSizeLimit4loading,AvgTreeSize4GrappleSkidding,
    ExceededMaxTreeVol,SkiddingLimit,ExceededMaxSkidLimit,YardingDistLimit,ExceededMaxYardingDist,InLimits1;

    // Mech WT
    MaxLLTperAcre=null;
    MaxLLTasPercentALT=null;
    ExceededMaxLLT=0;
    AvgTreeSizeLimit4Chipping=80;
    AvgTreeSizeLimit4Processing=80;
    AvgTreeSizeLimit4ManualFellLimbBuck=250;
    AvgTreeSizeLimit4loading=250;
    AvgTreeSize4GrappleSkidding=250;
    ExceededMaxTreeVol
    =(TreeVolCT>AvgTreeSizeLimit4Chipping || TreeVolSLT>AvgTreeSizeLimit4Processing || TreeVolLLT>AvgTreeSizeLimit4ManualFellLimbBuck || TreeVolALT>AvgTreeSizeLimit4loading || TreeVol>AvgTreeSize4GrappleSkidding)?1:0;
    // Slope, %
    SkiddingLimit=40; // Slope
    ExceededMaxSkidLimit=Slope>SkiddingLimit?1:0;
    // Yarding distance, ft
    YardingDistLimit=0;
    ExceededMaxYardingDist=0;
    InLimits1=(ExceededMaxLLT==1 || ExceededMaxTreeVol==1 || ExceededMaxSkidLimit==1 || ExceededMaxYardingDist==1) ? null:1;

    return InLimits1;
}

function MachineCosts() {
    // global var
    let WageAndBenRateF,WageAndBenRate,interest,insuranceAtax,Diesel_fuel_price,smh;
    // Chainsaw
    let PurchasePriceChainsaw,HorsepowerChainsaw,LifeChainsaw,svChainsaw,utChainsaw,rmChainsaw,fcrChainsaw,loChainsaw,personsChainsaw,wbChainsaw;
    // Harvester
    //global 
    let LifeHarvester,svHarvester,utHarvester,rmHarvester,fcrHarvester,loHarvester,personsHarvester,wbHarvester;
    // Small
    let PurchasePriceHarvesterS,HorsepowerHarvesterS;
    // Big
    let PurchasePriceHarvesterB,HorsepowerHarvesterB;
    // Skidder
    let svSkidder,utSkidder,rmSkidder,fcrSkidder,loSkidder,personsSkidder,wbSkidder;
    // Small
    let PurchasePriceSkidderS,HorsepowerSkidderS,LifeSkidderS;
    // Big
    let PurchasePriceSkidderB,HorsepowerSkidderB,LifeSkidderB;
    // Yard small
    let PurchasePriceYarderS,HorsepowerYarderS,LifeYarder,svYarder,utYarder,rmYarder,fcrYarder,loYarder,personsYarder,wbYarder;
    // Yarder intermediate    
    let PurchasePriceYarderI,HorsepowerYarderI;
    // Processor
    let LifeProcessor,svProcessor,utProcessor,rmProcessor,fcrProcessor,loProcessor,personsProcessor,wbProcessor;
    // Small
    let PurchasePriceProcessorS,HorsepowerProcessorS;
    // Big
    let PurchasePriceProcessorB,HorsepowerProcessorB;
    // Loader
    let LifeLoader,svLoader,utLoader,rmLoader,fcrLoader,loLoader,personsLoader,wbLoader;
    // Small
    let PurchasePriceLoaderS,HorsepowerLoaderS;
    // Big
    let PurchasePriceLoaderB,HorsepowerLoaderB;
    // Chipper
    let LifeChipper,svChipper,utChipper,rmChipper,fcrChipper,loChipper,personsChipper,wbChipper;
    // Small
    let PurchasePriceChipperS,HorsepowerChipperS;
    // Big
    let PurchasePriceChipperB,HorsepowerChipperB;
    // Bundler
    let PurchasePriceBundler,HorsepowerBundler,fcrBundler;
    
    WageAndBenRateF=44.44814821; // =FallBuckWage // hardcoded
    WageAndBenRate=35.25197962; // =OtherWage // hardcoded
    interest=0.08;
    insuranceAtax=0.07;
    Diesel_fuel_price=3.327;
    smh=1600;

    // Chainsaw
    PurchasePriceChainsaw=824.4620612; //hardcoded
    HorsepowerChainsaw=0;
    LifeChainsaw=1;
    svChainsaw=0.2;
    utChainsaw=0.5;
    rmChainsaw=7;
    fcrChainsaw=0;
    loChainsaw=0;
    personsChainsaw=0;
    wbChainsaw= WageAndBenRateF;
    let Chainsaw=CostCalc(PurchasePriceChainsaw,HorsepowerChainsaw,LifeChainsaw,svChainsaw,utChainsaw,rmChainsaw,fcrChainsaw,loChainsaw,personsChainsaw,wbChainsaw);
    let PMH_Chainsaw=Chainsaw[1];

    // FBuncher
    let fcrFBuncher,loFBuncher,personsFBuncher,wbFBuncher;
    // FBuncher global
    fcrFBuncher=0.026;
    loFBuncher=0.37;
    personsFBuncher=1;
    wbFBuncher=personsFBuncher*WageAndBenRate;
    // DriveToTree
    let PurchasePriceFBuncherDTT,HorsepowerFBuncherDTT,LifeFBuncherDTT,svFBuncherDTT,utFBuncherDTT,rmFBuncherDTT;

    PurchasePriceFBuncherDTT=176670.4417; // hardcoded
    HorsepowerFBuncherDTT=150;
    LifeFBuncherDTT=3;
    svFBuncherDTT=0.2;
    utFBuncherDTT=0.65;
    rmFBuncherDTT=1;
    let DriveToTree=CostCalc(PurchasePriceFBuncherDTT,HorsepowerFBuncherDTT,LifeFBuncherDTT,svFBuncherDTT,utFBuncherDTT,rmFBuncherDTT,fcrFBuncher,loFBuncher,personsFBuncher,wbFBuncher);
    let PMH_DriveToTree=DriveToTree[1];
    //SwingBoom
    let PurchasePriceFBuncherSB,HorsepowerFBuncherSB,LifeFBuncherSB,svFBuncherSB,utFBuncherSB,rmFBuncherSB;

    PurchasePriceFBuncherSB=365118.9128; // hardcoded
    HorsepowerFBuncherSB=200;
    LifeFBuncherSB=5;
    svFBuncherSB=0.15;
    utFBuncherSB=0.6;
    rmFBuncherSB=0.75;
    let SwingBoom=CostCalc(PurchasePriceFBuncherSB,HorsepowerFBuncherSB,LifeFBuncherSB,svFBuncherSB,utFBuncherSB,rmFBuncherSB,fcrFBuncher,loFBuncher,personsFBuncher,wbFBuncher);
    let PMH_SwingBoom=SwingBoom[1];
    // SelfLeveling
    let HorsepowerFBuncherSL;
    HorsepowerFBuncherSL=240;
    let SelfLeveling=CostCalc(PurchasePriceFBuncherSB,HorsepowerFBuncherSL,LifeFBuncherSB,svFBuncherSB,utFBuncherSB,rmFBuncherSB,fcrFBuncher,loFBuncher,personsFBuncher,wbFBuncher);
    let PMH_SelfLevel=SelfLeveling[1];

    let FB_OwnCost=(DriveToTree[0]+SwingBoom[0]+SelfLeveling[0])/3;
    
    // Harvester
    LifeHarvester=4;
    svHarvester=0.2;
    utHarvester=0.65;
    rmHarvester=1.1;
    fcrHarvester=0.029;
    loHarvester=0.37;
    personsHarvester=1;
    wbHarvester=personsHarvester*WageAndBenRate;
    // Small
    PurchasePriceHarvesterS=412231.0306; // hardcoded
    HorsepowerHarvesterS=120;
    let HarvesterS=CostCalc(PurchasePriceHarvesterS,HorsepowerHarvesterS,LifeHarvester,svHarvester,utHarvester,rmHarvester,fcrHarvester,loHarvester,personsHarvester,wbHarvester);
    let PMH_HarvS=HarvesterS[1];
    // Big
    PurchasePriceHarvesterB=530011.325; // hardcoded
    HorsepowerHarvesterB=200;
    let HarvesterB=CostCalc(PurchasePriceHarvesterB,HorsepowerHarvesterB,LifeHarvester,svHarvester,utHarvester,rmHarvester,fcrHarvester,loHarvester,personsHarvester,wbHarvester);
    let PMH_HarvB=HarvesterB[1];

    let Harvester_OwnCost=(HarvesterS[0]+HarvesterB[0])/2;


    // Skidder global
    svSkidder=0.2;
    utSkidder=0.65;
    rmSkidder=0.9;
    fcrSkidder=0.028;
    loSkidder=0.37;
    personsSkidder=1;
    wbSkidder =personsSkidder*WageAndBenRate;
    // Small
    PurchasePriceSkidderS=164892.4122; //hardcoded
    HorsepowerSkidderS=120;
    LifeSkidderS=5;
    let SkidderS=CostCalc(PurchasePriceSkidderS,HorsepowerSkidderS,LifeSkidderS,svSkidder,utSkidder,rmSkidder,fcrSkidder,loSkidder,personsSkidder,wbSkidder);
    let PMH_SkidderS=SkidderS[1];
    // Big
    PurchasePriceSkidderB=235560.5889; // hardcoded
    HorsepowerSkidderB=200;
    LifeSkidderB=4;
    let SkidderB=CostCalc(PurchasePriceSkidderB,HorsepowerSkidderB,LifeSkidderB,svSkidder,utSkidder,rmSkidder,fcrSkidder,loSkidder,personsSkidder,wbSkidder);
    let PMH_SkidderB=SkidderB[1];
    let Skidder_OwnCost=(SkidderS[0]+SkidderB[0])/2;
    
    // Yarder small
    PurchasePriceYarderS=188448.4711; //hardcoded
    HorsepowerYarderS=100;
    LifeYarder=10;
    svYarder=0.1;
    utYarder=0.75;
    rmYarder=1;
    fcrYarder=0.04;
    loYarder=0.1;
    personsYarder=5;
    let YarderS=CostCalc(PurchasePriceYarderS,HorsepowerYarderS,LifeYarder,svYarder,utYarder,rmYarder,fcrYarder,loYarder,personsYarder,wbYarder);
    let PMH_YarderS=YarderS[1];
    wbYarder=personsYarder*WageAndBenRate
    // Yarder intermediate    
    PurchasePriceYarderI=388674.9717; // hardcoded
    HorsepowerYarderI=200;
    let YarderI=CostCalc(PurchasePriceYarderI,HorsepowerYarderI,LifeYarder,svYarder,utYarder,rmYarder,fcrYarder,loYarder,personsYarder,wbYarder);
    let PMH_YarderI=YarderI[1];
    let Yarder_OwnCost=(YarderS[0]+YarderI[0])/2;

    // Processor
    LifeProcessor=5;
    svProcessor=0.2;
    utProcessor=0.65;
    rmProcessor=1;
    fcrProcessor=0.022;
    loProcessor=0.37;
    personsProcessor=1;
    wbProcessor=personsProcessor*WageAndBenRate;
    // Small
    PurchasePriceProcessorS=353340.8834;
    HorsepowerProcessorS=120;
    let ProcessorS=CostCalc(PurchasePriceProcessorS,HorsepowerProcessorS,LifeProcessor,svProcessor,utProcessor,rmProcessor,fcrProcessor,loProcessor,personsProcessor,wbProcessor);
    let PMH_ProcessorS=ProcessorS[1];
    // Big
    PurchasePriceProcessorB=471121.1778;
    HorsepowerProcessorB=200;
    let ProcessorB=CostCalc(PurchasePriceProcessorB,HorsepowerProcessorB,LifeProcessor,svProcessor,utProcessor,rmProcessor,fcrProcessor,loProcessor,personsProcessor,wbProcessor);
    let PMH_ProcessorB=ProcessorB[1];
    let Processor_OwnCost=(ProcessorS[0]+ProcessorB[0])/2;

    // Loader
    LifeLoader=5;
    svLoader=0.3;
    utLoader=0.65;
    rmLoader=0.9;
    fcrLoader=0.022;
    loLoader=0.37;
    personsLoader=1;
    wbLoader=personsLoader*WageAndBenRate;
    // Small
    PurchasePriceLoaderS=223782.5595;
    HorsepowerLoaderS=120;
    let LoaderS=CostCalc(PurchasePriceLoaderS,HorsepowerLoaderS,LifeLoader,svLoader,utLoader,rmLoader,fcrLoader,loLoader,personsLoader,wbLoader);
    let PMH_LoaderS=LoaderS[1];
    // Big
    PurchasePriceLoaderB=294450.7361;
    HorsepowerLoaderB=200;
    let LoaderB=CostCalc(PurchasePriceLoaderB,HorsepowerLoaderB,LifeLoader,svLoader,utLoader,rmLoader,fcrLoader,loLoader,personsLoader,wbLoader);
    let PMH_LoaderB=LoaderB[1];
    let Loader_OwnCost=(LoaderS[0]+LoaderB[0])/2;
    
    // Chipper
    LifeChipper=5;
    svChipper=0.2;
    utChipper=0.75;
    rmChipper=1;
    fcrChipper=0.023;
    loChipper=0.37;
    personsChipper=1;
    wbChipper=personsChipper*WageAndBenRate;
    // Small
    PurchasePriceChipperS=235560.5889;
    HorsepowerChipperS=350;
    let ChipperS=CostCalc(PurchasePriceChipperS,HorsepowerChipperS,LifeChipper,svChipper,utChipper,rmChipper,fcrChipper,loChipper,personsChipper,wbChipper);
    let PMH_ChipperS=ChipperS[1];
    // Big
    PurchasePriceChipperB=353340.8834;
    HorsepowerChipperB=700;
    let ChipperB=CostCalc(PurchasePriceChipperB,HorsepowerChipperB,LifeChipper,svChipper,utChipper,rmChipper,fcrChipper,loChipper,personsChipper,wbChipper);
    let PMH_ChipperB=ChipperB[1];
    let Chipper_OwnCost=(ChipperS[0]+ChipperB[0])/2;

    // Bundler
    PurchasePriceBundler=530011.325;
    HorsepowerBundler=180;
    fcrBundler=0.025;
    // the other vars are the same as Chipper's, therefore pass chipper vars in the function below
    let Bundler=CostCalc(PurchasePriceBundler,HorsepowerBundler,LifeChipper,svChipper,utChipper,rmChipper,fcrBundler,loChipper,personsChipper,wbChipper);
    let PMH_Bundler=Bundler[1];
    let Bundler_OwnCost=Bundler[0];
    
    let resultObj = {'PMH_Chainsaw': PMH_Chainsaw,'PMH_DriveToTree': PMH_DriveToTree,'PMH_SwingBoom':PMH_SwingBoom,'PMH_SelfLevel':PMH_SelfLevel,'FB_OwnCost':FB_OwnCost,
    'PMH_HarvS':PMH_HarvS,'PMH_HarvB':PMH_HarvB,'Harvester_OwnCost':Harvester_OwnCost,'PMH_SkidderS':PMH_SkidderS,'PMH_SkidderB':PMH_SkidderB,'Skidder_OwnCost':Skidder_OwnCost,
    'PMH_YarderS': PMH_YarderS,'PMH_YarderI': PMH_YarderI,'Yarder_OwnCost': Yarder_OwnCost,'PMH_ProcessorS':PMH_ProcessorS,'PMH_ProcessorB':PMH_ProcessorB,'Processor_OwnCost':Processor_OwnCost,
    'PMH_LoaderS':PMH_LoaderS,'PMH_LoaderB':PMH_LoaderB,'Loader_OwnCost':Loader_OwnCost,'PMH_Bundler':PMH_Bundler,'Bundler_OwnCost':Bundler_OwnCost};
    console.log(resultObj);
    return resultObj;

    function CostCalc(PurchasePriceYarderS,HorsepowerYarderS,LifeYarder,svYarder,utYarder,rmYarder,fcrYarder,loYarder,personsYarder,wbYarder){
        let SalvageYarderS,AnnualDepreciationYarder,avgYearlyInvestmentYarder,PMHyarder,InterestCostYarder,InsuranceAndTaxCost,YearlyOwnershipCostYarder,OwnershipCostSMHyarder,OwnershipCostPMHyarder,FuelCostYarder,
        LubeCostYarder,RepairAndMaintenanceCostYarder,LaborCostPMHyarder,OperatingCostPMHyarder,OperatingCostSMHyarder,TotalCostSMHyarder,TotalCostPMHyarderS;

        SalvageYarderS=PurchasePriceYarderS*svYarder;
        AnnualDepreciationYarder=(PurchasePriceYarderS-SalvageYarderS)/LifeYarder;
        avgYearlyInvestmentYarder=(((PurchasePriceYarderS-SalvageYarderS)*(LifeYarder+1)/(2*LifeYarder))+SalvageYarderS);
        PMHyarder=smh*utYarder;
        InterestCostYarder=interest*avgYearlyInvestmentYarder;
        InsuranceAndTaxCost=insuranceAtax*avgYearlyInvestmentYarder;
        YearlyOwnershipCostYarder=InsuranceAndTaxCost+InterestCostYarder+AnnualDepreciationYarder;
        OwnershipCostSMHyarder=YearlyOwnershipCostYarder/smh;
        OwnershipCostPMHyarder=YearlyOwnershipCostYarder/PMHyarder;
        FuelCostYarder=HorsepowerYarderS*fcrYarder*Diesel_fuel_price;
        LubeCostYarder=loYarder*FuelCostYarder;
        RepairAndMaintenanceCostYarder=AnnualDepreciationYarder*rmYarder/PMHyarder;
        LaborCostPMHyarder=wbYarder/utYarder;
        OperatingCostPMHyarder=FuelCostYarder+LubeCostYarder+RepairAndMaintenanceCostYarder+LaborCostPMHyarder;
        OperatingCostSMHyarder=OperatingCostPMHyarder*utYarder;
        TotalCostSMHyarder=OwnershipCostSMHyarder+OperatingCostSMHyarder;
        TotalCostPMHyarderS=OwnershipCostPMHyarder+OperatingCostPMHyarder;

        return [OwnershipCostPMHyarder,TotalCostPMHyarderS];
    }
}
