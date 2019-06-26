import { FellBunch } from './fellbunch';
import { FellLargeLogTrees } from './felllargelogtrees';
import { CostMachineMod, InputVarMod, IntermediateVarMod, OutputVarMod } from './frcs.model';

export function calculate(inputVar: InputVarMod) {

// Other Assumptions
    const MaxManualTreeVol = 150;
    const MaxMechTreeVol = 80;
    const MoistureContent = 0.50;
    const LogLength = 32;
    const LoadWeightLog = 25;
    const LoadWeightChip = 25;
    const CTLTrailSpacing = 50;
    const HdwdCostPremium = 0.20;
    const ResidueRecovFracWT = 0.80;
    const ResidueRecovFracCTL = 0.50;

// funtions
    const RemovalsST = inputVar.RemovalsCT + inputVar.RemovalsSLT;
    const RemovalsALT = inputVar.RemovalsSLT + inputVar.RemovalsLLT;
    const Removals = inputVar.RemovalsCT + inputVar.RemovalsSLT + inputVar.RemovalsLLT;

    const VolPerAcreCT = inputVar.RemovalsCT * inputVar.TreeVolCT;
    const VolPerAcreSLT = inputVar.RemovalsSLT * inputVar.TreeVolSLT;
    const VolPerAcreLLT = inputVar.RemovalsLLT * inputVar.TreeVolLLT;
    const VolPerAcreST = VolPerAcreCT + VolPerAcreSLT;
    const VolPerAcreALT = VolPerAcreSLT + VolPerAcreLLT;
    const VolPerAcre = VolPerAcreCT + VolPerAcreSLT + VolPerAcreLLT;

    const TreeVolST = RemovalsST > 0 ? VolPerAcreST / RemovalsST : 0;
    const TreeVolALT = RemovalsALT > 0 ? VolPerAcreALT / RemovalsALT : 0;
    const TreeVol = Removals > 0 ? VolPerAcre / Removals : 0;

// DBH
    const DBHCT = Math.sqrt((inputVar.TreeVolCT + 3.675) / 0.216);
    const DBHSLT = Math.sqrt((inputVar.TreeVolSLT + 3.675) / 0.216);
    const DBHLLT = Math.sqrt((inputVar.TreeVolLLT + 3.675) / 0.216);
    const DBHST = TreeVolST > 0 ? Math.sqrt((inputVar.RemovalsCT * Math.pow(DBHCT, 2)
        + inputVar.RemovalsSLT * Math.pow(DBHSLT, 2)) / RemovalsST) : 0;
    const DBHALT = TreeVolALT > 0 ? Math.sqrt((inputVar.RemovalsSLT * Math.pow(DBHSLT, 2)
        + inputVar.RemovalsLLT * Math.pow(DBHLLT, 2)) / RemovalsALT) : 0;
    const DBH = Math.sqrt((inputVar.RemovalsCT * Math.pow(DBHCT, 2) + RemovalsALT * Math.pow(DBHALT, 2)) / Removals);
// Tree Height
    const HeightCT = inputVar.TreeVolCT > 0 ? -20 + 24 * Math.sqrt(DBHCT) : 0;
    const HeightSLT = inputVar.TreeVolSLT > 0 ? -20 + 24 * Math.sqrt(DBHSLT) : 0;
    const HeightLLT = inputVar.TreeVolLLT > 0 ? -20 + 24 * Math.sqrt(DBHLLT) : 0;
    const HeightST = TreeVolST > 0
        ? (inputVar.RemovalsCT * HeightCT + inputVar.RemovalsSLT * HeightSLT) / RemovalsST : 0;
    const HeightALT = TreeVolALT > 0 ? (inputVar.RemovalsSLT * HeightSLT
        + inputVar.RemovalsLLT * HeightLLT) / RemovalsALT : 0;
    const Height = TreeVol > 0 ? (inputVar.RemovalsCT * HeightCT + RemovalsALT * HeightALT) / Removals : 0;
// Wood Density
    const WoodDensityCT = inputVar.UserSpecWDCT > 0 ? inputVar.UserSpecWDCT : 50;
    const WoodDensitySLT = inputVar.UserSpecWDSLT > 0 ? inputVar.UserSpecWDSLT : 50;
    const WoodDensityLLT = inputVar.UserSpecWDLLT > 0 ? inputVar.UserSpecWDLLT : 50;
    const WoodDensityST = VolPerAcreST > 0 ? (WoodDensityCT * VolPerAcreCT
        + WoodDensitySLT * VolPerAcreSLT) / VolPerAcreST : 0;
    const WoodDensityALT = VolPerAcreALT > 0 ? (WoodDensitySLT * VolPerAcreSLT
        + WoodDensityLLT * VolPerAcreLLT) / VolPerAcreALT : 0;
    const WoodDensity = (WoodDensityCT * VolPerAcreCT + WoodDensityALT * VolPerAcreALT) / VolPerAcre;
// Hardwood Fraction
    const HdwdFractionCT = !isNaN(inputVar.UserSpecHFCT) ? inputVar.UserSpecHFCT : 0;
    const HdwdFractionSLT = !isNaN(inputVar.UserSpecHFSLT) ? inputVar.UserSpecHFSLT : 0;
    const HdwdFractionLLT = !isNaN(inputVar.UserSpecHFLLT) ? inputVar.UserSpecHFLLT : 0;
    const HdwdFractionST = VolPerAcreST > 0 ? (HdwdFractionCT * VolPerAcreCT
        + HdwdFractionSLT * VolPerAcreSLT) / VolPerAcreST : 0;
    const HdwdFractionALT = VolPerAcreALT > 0 ? (HdwdFractionSLT * VolPerAcreSLT
        + HdwdFractionLLT * VolPerAcreLLT) / VolPerAcreALT : 0;
    const HdwdFraction = (HdwdFractionCT * VolPerAcreCT + HdwdFractionALT * VolPerAcreALT) / VolPerAcre;
// ButtDiam
    const ButtDiamSLT = DBHSLT + 3;
    const ButtDiamST = DBHST + 3;
    const ButtDiam = DBH + 3;
// Logs Per Tree
    const LogsPerTreeCT = 1;
    const LogsPerTreeSLT = (-0.43 + 0.678 * Math.sqrt(DBHSLT));
    const LogsPerTreeLLT = (-0.43 + 0.678 * Math.sqrt(DBHLLT));
    const LogsPerTreeST = (LogsPerTreeCT * inputVar.RemovalsCT + LogsPerTreeSLT * inputVar.RemovalsSLT) / RemovalsST;
    const LogsPerTreeALT = RemovalsALT === 0 ? 0 : ((LogsPerTreeSLT * inputVar.RemovalsSLT
        + LogsPerTreeLLT * inputVar.RemovalsLLT) / RemovalsALT);
    const LogsPerTree = (LogsPerTreeCT * inputVar.RemovalsCT + LogsPerTreeALT * RemovalsALT) / Removals;
// Log Volume
    const LogVolST = TreeVolST / LogsPerTreeST;
    const LogVolALT = RemovalsALT === 0 ? 0 : TreeVolALT / LogsPerTreeALT;
    const LogVol = TreeVol / LogsPerTree;
// CTL Logs Per Tree
    const CTLLogsPerTreeCT = Math.max(1, 2 * (-0.43 + 0.678 * Math.sqrt(DBHCT)));
    const CTLLogsPerTree = Math.max(1, 2 * (-0.43 + 0.678 * Math.sqrt(DBHST)));
// CTL Log Volume
    const CTLLogVolCT = inputVar.TreeVolCT / CTLLogsPerTreeCT;
    const CTLLogVol = TreeVolST / CTLLogsPerTree;
// BFperCF=5
    const BFperCF = 5;
// Bole Weight
    const BoleWtCT = WoodDensityCT * VolPerAcreCT / 2000;
    const BoleWtSLT = WoodDensitySLT * VolPerAcreSLT / 2000;
    const BoleWtLLT = WoodDensityLLT * VolPerAcreLLT / 2000;
    const BoleWtST = BoleWtCT + BoleWtSLT;
    const BoleWtALT = BoleWtSLT + BoleWtLLT;
    const BoleWt = BoleWtCT + BoleWtALT;
// Residue Weight
    const ResidueCT = inputVar.UserSpecRFCT * BoleWtCT;
    const ResidueSLT = inputVar.UserSpecRFSLT * BoleWtSLT;
    const ResidueLLT = inputVar.UserSpecRFLLT * BoleWtLLT;
    const ResidueST = ResidueCT + ResidueSLT;
    const ResidueALT = ResidueSLT + ResidueLLT;
    const Residue = ResidueCT + ResidueALT;
// Manual Machine Size
    const ManualMachineSizeALT = Math.min(1, TreeVolALT / MaxManualTreeVol);
    const ManualMachineSize = Math.min(1, TreeVol / MaxManualTreeVol);
// Mechanized Machine Size
    const MechMachineSize = Math.min(1, TreeVolST / MaxMechTreeVol);
// Chipper Size
    const ChipperSize = Math.min(1, inputVar.TreeVolCT / MaxMechTreeVol);
// NonSelfLevelCabDummy
    const NonSelfLevelCabDummy = inputVar.Slope < 15 ? 1 : (inputVar.Slope < 35 ? 1.75 - 0.05 * inputVar.Slope : 0);
// CinputVar.SlopeFB&Harv (Mellgren 90)
    const CSlopeFB_Harv = 0.00015 * Math.pow(inputVar.Slope, 2) + 0.00359 * NonSelfLevelCabDummy * inputVar.Slope;
// CRemovalsFB&Harv (Mellgren 90)
    const CRemovalsFB_Harv = Math.max(0, 0.66 - 0.001193 * RemovalsST * 2.47
        + 5.357 * Math.pow(10, -7) * Math.pow(RemovalsST * 2.47, 2));
// CinputVar.SlopeSkidForwLoadSize (Mellgren 90)
    const CSlopeSkidForwLoadSize = 1 - 0.000127 * Math.pow(inputVar.Slope, 2);
// Chardwood
    const CHardwoodCT = 1 + HdwdCostPremium * HdwdFractionCT;
    const CHardwoodSLT = 1 + HdwdCostPremium * HdwdFractionSLT;
    const CHardwoodLLT = 1 + HdwdCostPremium * HdwdFractionLLT;
    const CHardwoodST = 1 + HdwdCostPremium * HdwdFractionST;
    const CHardwoodALT = 1 + HdwdCostPremium * HdwdFractionALT;
    const CHardwood = 1 + HdwdCostPremium * HdwdFraction;

// ------------------------------------------ output ------------------------------------------------
// ----System Product Summary--------------
    // Amounts Recovered Per Acre
    const BoleVolCCF = VolPerAcre / 100;
    const ResidueRecoveredPrimary = ResidueRecovFracWT * ResidueCT;
    const PrimaryProduct = BoleWt + ResidueRecoveredPrimary;
    const ResidueRecoveredOptional = inputVar.CalcResidues === true ? (ResidueRecovFracWT * ResidueSLT)
        + (ResidueRecovFracWT * ResidueLLT) : 0;
    const TotalPrimaryAndOptional = PrimaryProduct + ResidueRecoveredOptional;
    const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
    // Amounts Unrecovered and Left within the Stand Per Acre
    const GroundFuel = ResidueLLT + ResidueST * (1 - ResidueRecovFracWT);
    // Amounts Unrecovered and Left at the Landing
    const PiledFuel = inputVar.CalcResidues === true ? 0 : ResidueSLT * ResidueRecovFracWT;
    // TotalResidues
    const ResidueUncutTrees = 0;
    const TotalResidues = ResidueRecoveredPrimary + ResidueRecoveredOptional 
        + ResidueUncutTrees + GroundFuel + PiledFuel;
// Limits
    const InLimits1
    = InLimits(inputVar.TreeVolCT, inputVar.TreeVolSLT, inputVar.TreeVolLLT, TreeVolALT, TreeVol, inputVar.Slope);
// Machine costs
    const CostMachine: CostMachineMod = MachineCosts();
// System Cost Elements-------
    const FellBunchResults
    = FellBunch(inputVar.Slope, RemovalsST, TreeVolST, DBHST,
                NonSelfLevelCabDummy, CSlopeFB_Harv, CRemovalsFB_Harv, CHardwoodST, CostMachine);
    const CostFellBunch = FellBunchResults.CostFellBunch;
    const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
    const CostManFLBLLT
    = FellLargeLogTrees(inputVar.Slope, inputVar.RemovalsLLT,inputVar.TreeVolLLT, TreeVol,
                        inputVar.cut_type, DBHLLT, LogsPerTreeLLT, CHardwoodLLT, CostMachine);
    let CostSkidBun = Skidding(inputVar.Slope, deliver_dist, Removals, TreeVol, WoodDensity, LogLength, inputVar.cut_type, CinputVar.SlopeSkidForwLoadSize, LogsPerTree, LogVol, ManualMachineSize, BFperCF, ButtDiam, CostMachine, TreesPerCycleIIB);
    let CostProcess = Processing(inputVar.TreeVolSLT, DBHSLT, ButtDiamSLT, LogsPerTreeSLT, MechMachineSize, CostMachine);
    let CostLoad = Loading(LoadWeightLog, WoodDensityALT, WoodDensitySLT, CTLLogVol, LogVolALT, DBHALT, DBHSLT, ManualMachineSizeALT, CostMachine);
    let ChippingResults = Chipping(inputVar.TreeVolCT, WoodDensityCT, LoadWeightChip, MoistureContent, CHardwoodCT, CostMachine);
    const CostChipWT = ChippingResults.CostChipWT;
    let MoveInCosts1G39 = MoveInCosts(Area, MoveInDist, TreeVol, Removals, VolPerAcreCT, CostMachine);
    const CostChipLooseRes = ChippingResults.CostChipLooseRes;

    // C. For All Products, $/ac
    FellAndBunchTreesLess80cf = CostFellBunch * VolPerAcreST / 100 * InLimits1;
    ManualFellLimbBuckTreesLarger80cf = CostManFLBLLT * VolPerAcreLLT / 100 * InLimits1;
    SkidBunchedAllTrees = CostSkidBun * VolPerAcre / 100 * InLimits1;
    ProcessLogTreesLess80cf = CostProcess * VolPerAcreSLT / 100 * InLimits1;
    LoadLogTrees = CostLoad * VolPerAcreALT / 100 * InLimits1;
    ChipWholeTrees = CostChipWT * VolPerAcreCT / 100 * InLimits1;
    Stump2Truck4PrimaryProductWithoutMovein = FellAndBunchTreesLess80cf + ManualFellLimbBuckTreesLarger80cf + SkidBunchedAllTrees + ProcessLogTreesLess80cf + LoadLogTrees + ChipWholeTrees;
    Movein4PrimaryProduct = MoveInCosts1G39 * CalcMoveIn * BoleVolCCF * InLimits1;

    ChipLooseResiduesFromLogTreesLess80cf = CostChipLooseRes * inputVar.CalcResidues * ResidueRecoveredOptional * InLimits1;
    OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf; // for Mech WT sys;
    let Movein4Residues = 0 * CalcMoveIn * inputVar.CalcResidues * ResidueRecoveredOptional * InLimits1;

// III. System Cost Summaries
    TotalPerAcre = Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct
        + OntoTruck4ResiduesWoMovein + Movein4Residues;
    TotalPerBoleCCF = TotalPerAcre / BoleVolCCF;
    TotalPerGT = TotalPerAcre / TotalPrimaryProductsAndOptionalResidues;

    return { 'TotalPerAcre': TotalPerAcre, 'TotalPerBoleCCF': TotalPerBoleCCF, 'TotalPerGT': TotalPerGT }
}

/**
 * @return {number}
 */

function Skidding(inputVar.Slope, YardDist, Removals, TreeVol, WoodDensity, LogLength, PartialCut,
                  CinputVar.SlopeSkidForwLoadSize, LogsPerTree, LogVol, ManualMachineSize, BFperCF, ButtDiam, CostMachine, TreesPerCycleIIB) {
// Skidding Calculated Values
    let TurnVol, LogsPerTurnS, TreesPerTurnS, PMH_SkidderB, PMH_SkidderS, SkidderHourlyCost;
// I Choker, Unbunched
    let MaxLogs, ChokerLogs, ChokerTurnVol;
    // IA CC (Johnson&Lee, 88)
    let WinchDistSkidIA, TurnTimeSkidIA, VolPerPMHskidIA, CostPerCCFSkidIA, RelevanceSkidIA;
    // IB CC (Gibson&Egging, 73)
    let TurnTimeSkidIB, VolPerPMHskidIB, CostPerCCFskidIB, RelevanceSkidIB;
    // IC CC (Schillings, 69) not used at present
    let TurnTimeSkidIC, VolPerPMHskidIC, CostPerCCFskidIC, RelevanceSkidIC;
    // ID CC (Gardner, 79)
    let TurnTimeSkidID, VolPerPMHskidID, CostPerCCFskidID, RelevanceSkidID;
    // IE Cat 518 or Cat D4H, cable (Andersson, B. and G. Young  1998.
    // Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    let TurnTimeSkidIE, VolPerPMHskidIE, CostPerCCFskidIE, RelevanceSkidIE;
// II Grapple, Unbunched
    let IntMoveDistS;
    // IIA Cat 518 (Johnson, 88)
    let TurnTimeSkidIIA, VolPerPMHskidIIA, CostPerCCFskidIIA, RelevanceSkidIIA;
    // IIB JD 648 (Gebhardt, 77)
    let GroundRatingSkidIIB, TypeOfCutSkidIIB, TurnTimeSkidIIB, VolPerPMHskidIIB, CostPerCCFskidIIB, RelevanceSkidIIB;
// III User-Defined Skidding Unbunched
    let VolPerPMHskidIII, CostPerCCFskidIII, RelevanceSkidIII;
// IV Grapple, Bunched
    // IVA Grapple Skidders (Johnson, 88)
    let DeckHeightSkidIVA, TravEmptySkidIVA, LoadSkidIVA, TravLoadedSkidIVA, DeckSkidIVA,
        TurnTImeSkidIVA, VolPerPMHskidIVA, CostPerCCFskidIVA, RelevanceSkidIVA;
    // IVB Grapple Skidders (Tufts et al, 88)
    let EastsideAdjustmentSkidIVB, BunchSizeSkidIVB, BunchVolSkidIVB, TurnWtSkidIVB, BunchesPerTurnSkidIVB, SkidderHpSkidIVB,
        TravEmptySkidIVB, GrappleSkidIVB, TravLoadedSkidIVB, UngrappleSkidIVB, CycletimeSkidIVB, VolPerPMHskidIVB, CostPerCCFskidIVB, RelevanceSkidIVB;
    // IVC John Deere 748E (Kosicki, K. 00. Productivities and costs of two harvesting trials in a western Alberta riparian zone.  FERIC Advantage 1(19))
    let LoadingStopsSkidIVC, TurnTimeSkidIVC, VolPerPMHskidIVC, CostPerCCFskidIVC, RelevanceSkidIVC;
    // IVD Cat D5H TSK Custom Track (Henderson, B. 01. Roadside harvesting with low ground-presssure skidders in northwestern British Columbia. FERIC Advantage 2(54))
    let TurnTimeSkidIVD, VolPerPMHskidIVD, CostPerCCFskidIVD, RelevanceSkidIVD;
    // IVE JD 748_G-II & TJ 560 (Kosicki, K. 02. Productivity and cost of summer harvesting in a central Alberta mixedwood stand. FERIC Advantage 3(6))
    let BunchesPerTurnSkidIVE, TurnTimeSkidIVE, VolPerPMHskidIVE, CostPerCCFskidIVE, RelevanceSkidIVE;
    // IVF Tigercat 635 (Boswell, B. 98. Vancouver Island mechanized thinning trials. FERIC Technical Note TN-271)
    let TurnTimeSkidIVF, VolPerPMHskidIVF, CostPerCCFskidIVF, RelevanceSkidIVF;
    // IVG Tigercat 635 (Kosicki, K. 02. Evaluation of Trans-Gesco TG88C and Tigercat 635 grapple skidders working in central Alberta. FERIC Advantage 3(37))
    let TreesPerTurnSkidIVG, TurnTimeSkidIVG, VolPerPMHskidIVG, CostPerCCFskidIVG, RelevanceSkidIVG;
    // IVH User-Defined Skidding Bunched
    let VolPerPMHskidIVH, CostPerCCFskidIVH, RelevanceSkidIVH;
// Skidding Summary
    let CostSkidUB, CostSkidBun;

// Skidding Calculated Values
    TurnVol = (PartialCut == 0 ? 44.87 : (PartialCut == 1 ? 31.62 : null)) * Math.pow(TreeVol, 0.282) * CinputVar.SlopeSkidForwLoadSize;
    LogsPerTurnS = TurnVol / LogVol;
    TreesPerTurnS = TurnVol / TreeVol;
    PMH_SkidderB = CostMachine.PMH_SkidderB;
    PMH_SkidderS = CostMachine.PMH_SkidderS;
    SkidderHourlyCost = PMH_SkidderS * (1 - ManualMachineSize) + PMH_SkidderB * ManualMachineSize;

// I Choker, Unbunched
    MaxLogs = 10;
    ChokerLogs = Math.min(MaxLogs, LogsPerTurnS);
    ChokerTurnVol = ChokerLogs * LogVol;
    // IA CC (Johnson&Lee, 88)
    WinchDistSkidIA = 25;
    TurnTimeSkidIA = -15.58 + 0.345 * ChokerLogs + 0.037 * ChokerTurnVol + 4.05 * Math.log(YardDist + WinchDistSkidIA);
    VolPerPMHskidIA = ChokerTurnVol / (TurnTimeSkidIA / 60);
    CostPerCCFSkidIA = 100 * SkidderHourlyCost / VolPerPMHskidIA;
    RelevanceSkidIA = (ChokerTurnVol < 90 ? 1 : (ChokerTurnVol < 180 ? 2 - ChokerTurnVol / 90 : 0));
    // IB CC (Gibson&Egging, 73)
    TurnTimeSkidIB = 2.74 + 0.726 * ChokerLogs + 0.00363 * ChokerTurnVol * BFperCF + 0.0002 * ChokerTurnVol * WoodDensity + 0.00777 * YardDist + 0.00313 * Math.pow(inputVar.Slope, 2);
    VolPerPMHskidIB = ChokerTurnVol / (TurnTimeSkidIB / 60);
    CostPerCCFskidIB = 100 * SkidderHourlyCost / VolPerPMHskidIB;
    RelevanceSkidIB = 1;
    // IC CC (Schillings, 69) not used at present
    TurnTimeSkidIC = 60 * ((0.122 + 0.089) + (0.000229 + 0.000704) * YardDist + (-0.00076 + 0.00127) * inputVar.Slope + (0.0191 + 0.0118) * ChokerLogs) / 2;
    VolPerPMHskidIC = ChokerTurnVol / (TurnTimeSkidIC / 60);
    CostPerCCFskidIC = 100 * SkidderHourlyCost / VolPerPMHskidIC;
    RelevanceSkidIC = 0;
    // ID CC (Gardner, 79)
    TurnTimeSkidID = 2.57 + 0.823 * ChokerLogs + 0.0054 * ChokerTurnVol * BFperCF + 0.0078 * 2 * YardDist;
    VolPerPMHskidID = ChokerTurnVol / (TurnTimeSkidID / 60);
    CostPerCCFskidID = 100 * SkidderHourlyCost / VolPerPMHskidID;
    RelevanceSkidID = 1;
    // IE Cat 518 or Cat D4H, cable (Andersson, B. and G. Young  1998.
    // Harvesting coastal second growth forests: summary of harvesting system performance.  FERIC Technical Report TR-120)
    TurnTimeSkidIE = (7.36 + 0.0053 * YardDist);
    VolPerPMHskidIE = ChokerTurnVol / (TurnTimeSkidIE / 60);
    CostPerCCFskidIE = 100 * SkidderHourlyCost / VolPerPMHskidIE;
    RelevanceSkidIE = (TreeVol < 5 ? 0 : (TreeVol < 15 ? -0.5 + TreeVol / 10 : (TreeVol < 75 ? 1 : (TreeVol < 150 ? 2 - TreeVol / 75 : 0))));

// II Grapple, Unbunched
    IntMoveDistS = 17.0;
    // IIA Cat 518 (Johnson, 88)
    TurnTimeSkidIIA = 0.518 + 0.0107 * YardDist + 0.0011 * Math.pow(inputVar.Slope, 3) + 1.62 * Math.log(LogsPerTurnS);
    VolPerPMHskidIIA = TurnVol / (TurnTimeSkidIIA / 60);
    CostPerCCFskidIIA = 100 * SkidderHourlyCost / VolPerPMHskidIIA;
    RelevanceSkidIIA = (ButtDiam < 20 ? 1 : (ButtDiam < 25 ? 5 - ButtDiam / 5 : 0));
    // IIB JD 648 (Gebhardt, 77)
    GroundRatingSkidIIB = 1.1;
    TypeOfCutSkidIIB = 1.5 * PartialCut;
    TurnTimeSkidIIB = 1.072 + 0.00314 * YardDist + 0.0192 * inputVar.Slope + 0.315 * TypeOfCutSkidIIB + 0.489 * LogsPerTurnS - 0.819 * GroundRatingSkidIIB + 0.00469 * IntMoveDistS + 0.00139 * TurnVol * BFperCF;
    VolPerPMHskidIIB = TurnVol / (TurnTimeSkidIIB / 60);
    CostPerCCFskidIIB = 100 * SkidderHourlyCost / VolPerPMHskidIIB;
    RelevanceSkidIIB = 1;
    
// III User-Defined Skidding Unbunched
    VolPerPMHskidIII = 0.001;
    CostPerCCFskidIII = 100 * SkidderHourlyCost / VolPerPMHskidIII;
    RelevanceSkidIII = 0;

// IV Grapple, Bunched
    // IVA Grapple Skidders (Johnson, 88)
    DeckHeightSkidIVA = 3;
    TravEmptySkidIVA = -2.179 + 0.0362 * inputVar.Slope + 0.711 * Math.log(YardDist);
    LoadSkidIVA = Math.max(0, 0.882 + 0.0042 * Math.pow(inputVar.Slope, 2) - 0.000048 * Math.pow(TreesPerTurnS, 3));
    TravLoadedSkidIVA = -0.919 + 0.00081 * YardDist + 0.000062 * Math.pow(inputVar.Slope, 3) + 0.353 * Math.log(YardDist);
    DeckSkidIVA = 0.063 + 0.55 * Math.log(DeckHeightSkidIVA) + 0.0076 * (DeckHeightSkidIVA) * (TreesPerTurnS);
    TurnTImeSkidIVA = TravEmptySkidIVA + LoadSkidIVA + TravLoadedSkidIVA + DeckSkidIVA;
    VolPerPMHskidIVA = TurnVol / (TurnTImeSkidIVA / 60);
    CostPerCCFskidIVA = 100 * SkidderHourlyCost / VolPerPMHskidIVA;
    RelevanceSkidIVA = (ButtDiam < 15 ? 1 : (ButtDiam < 20 ? 4 - ButtDiam / 5 : 0));
    // IVB Grapple Skidders (Tufts et al, 88)
    EastsideAdjustmentSkidIVB = 1.3;
    BunchSizeSkidIVB = TreesPerCycleIIB;
    BunchVolSkidIVB = TreeVol * BunchSizeSkidIVB;
    TurnWtSkidIVB = TurnVol * WoodDensity;
    BunchesPerTurnSkidIVB = Math.max(1, TurnVol / BunchVolSkidIVB);
    SkidderHpSkidIVB = 50.5 + 5.74 * Math.sqrt(TreeVol);
    TravEmptySkidIVB = (0.1905 * YardDist + 0.3557 * SkidderHpSkidIVB - 0.0003336 * YardDist * SkidderHpSkidIVB) / 100;
    GrappleSkidIVB = Math.min(5, (-38.36 + 161.6 * BunchesPerTurnSkidIVB - 0.5599 * BunchesPerTurnSkidIVB * SkidderHpSkidIVB + 1.398 * BunchesPerTurnSkidIVB * BunchSizeSkidIVB) / 100);
    TravLoadedSkidIVB = (-34.52 + 0.2634 * YardDist + 0.7634 * SkidderHpSkidIVB - 0.00122 * YardDist * SkidderHpSkidIVB + 0.03782 * YardDist * BunchesPerTurnSkidIVB) / 100;
    UngrappleSkidIVB = Math.max(0, (5.177 * BunchesPerTurnSkidIVB + 0.002508 * TurnWtSkidIVB - 0.00007944 * TurnWtSkidIVB * BunchesPerTurnSkidIVB * BunchSizeSkidIVB * BunchesPerTurnSkidIVB) / 100);
    CycletimeSkidIVB = EastsideAdjustmentSkidIVB * (TravEmptySkidIVB + GrappleSkidIVB + TravLoadedSkidIVB + UngrappleSkidIVB);
    VolPerPMHskidIVB = TurnVol / (CycletimeSkidIVB / 60);
    CostPerCCFskidIVB = 100 * SkidderHourlyCost / VolPerPMHskidIVB;
    RelevanceSkidIVB = 0.50;
    // IVC John Deere 748E (Kosicki, K. 00. Productivities and costs of two harvesting trials in a western Alberta riparian zone.  FERIC Advantage 1(19))
    LoadingStopsSkidIVC = 2.1;
    TurnTimeSkidIVC = 0.65 + 0.0054 * YardDist + 0.244 * LoadingStopsSkidIVC;
    VolPerPMHskidIVC = TurnVol / (TurnTimeSkidIVC / 60);
    CostPerCCFskidIVC = 100 * SkidderHourlyCost / VolPerPMHskidIVC;
    RelevanceSkidIVC = (TreeVol < 5 ? 0 : (TreeVol < 10 ? -1 + TreeVol / 5 : (TreeVol < 50 ? 1 : (TreeVol < 100 ? 2 - TreeVol / 50 : 0))));
    // IVD Cat D5H TSK Custom Track (Henderson, B. 01. Roadside harvesting with low ground-presssure skidders in northwestern British Columbia. FERIC Advantage 2(54))
    TurnTimeSkidIVD = 2.818 + 0.0109 * YardDist;
    VolPerPMHskidIVD = TurnVol / (TurnTimeSkidIVD / 60);
    CostPerCCFskidIVD = 100 * SkidderHourlyCost / VolPerPMHskidIVD;
    RelevanceSkidIVD = (TreeVol < 5 ? 0 : (TreeVol < 10 ? -1 + TreeVol / 5 : (TreeVol < 50 ? 1 : (TreeVol < 100 ? 2 - TreeVol / 50 : 0))));
    // IVE JD 748_G-II & TJ 560 (Kosicki, K. 02. Productivity and cost of summer harvesting in a central Alberta mixedwood stand. FERIC Advantage 3(6))
    BunchesPerTurnSkidIVE = BunchesPerTurnSkidIVB;
    TurnTimeSkidIVE = 0.649 + 0.0058 * YardDist + 0.581 * BunchesPerTurnSkidIVE;
    VolPerPMHskidIVE = TurnVol / (TurnTimeSkidIVE / 60);
    CostPerCCFskidIVE = 100 * SkidderHourlyCost / VolPerPMHskidIVE;
    RelevanceSkidIVE = (TreeVol < 30 ? 1 : (TreeVol < 60 ? 2 - TreeVol / 30 : 0));
    // IVF Tigercat 635 (Boswell, B. 98. Vancouver Island mechanized thinning trials. FERIC Technical Note TN-271)
    TurnTimeSkidIVF = 5.77 + 0.007 * YardDist;
    VolPerPMHskidIVF = TurnVol / (TurnTimeSkidIVF / 60);
    CostPerCCFskidIVF = 100 * SkidderHourlyCost / VolPerPMHskidIVF;
    RelevanceSkidIVF = (TreeVol < 5 ? 0 : (TreeVol < 10 ? -1 + TreeVol / 5 : (TreeVol < 100 ? 1 : (TreeVol < 150 ? 3 - TreeVol / 50 : 0))));
    // IVG Tigercat 635 (Kosicki, K. 02. Evaluation of Trans-Gesco TG88C and Tigercat 635 grapple skidders working in central Alberta. FERIC Advantage 3(37))
    TreesPerTurnSkidIVG = TreesPerTurnS;
    TurnTimeSkidIVG = 2.98 + 0.006 * YardDist + 0.27 * TreesPerTurnSkidIVG;
    VolPerPMHskidIVG = TurnVol / (TurnTimeSkidIVG / 60);
    CostPerCCFskidIVG = 100 * SkidderHourlyCost / VolPerPMHskidIVG;
    RelevanceSkidIVG = (TreeVol < 40 ? 1 : (TreeVol < 80 ? 2 - TreeVol / 40 : 0));
    // IVH User-Defined Skidding Bunched
    VolPerPMHskidIVH = 0.001;
    CostPerCCFskidIVH = 100 * SkidderHourlyCost / VolPerPMHskidIVH;
    RelevanceSkidIVH = 0;
// Skidding Summary
    CostSkidUB = CHardwood * 100 * (SkidderHourlyCost * RelevanceSkidIA + SkidderHourlyCost * RelevanceSkidIB + SkidderHourlyCost * RelevanceSkidIC + SkidderHourlyCost * RelevanceSkidID
        + SkidderHourlyCost * RelevanceSkidIE + SkidderHourlyCost * RelevanceSkidIIA + SkidderHourlyCost * RelevanceSkidIIB + SkidderHourlyCost * RelevanceSkidIII)
        / (RelevanceSkidIA * VolPerPMHskidIA + RelevanceSkidIB * VolPerPMHskidIB + RelevanceSkidIC * VolPerPMHskidIC + RelevanceSkidID * VolPerPMHskidID
            + RelevanceSkidIE * VolPerPMHskidIE + RelevanceSkidIIA * VolPerPMHskidIIA + RelevanceSkidIIB * VolPerPMHskidIIB + RelevanceSkidIII * VolPerPMHskidIII);
    CostSkidBun = CHardwood * 100 * (SkidderHourlyCost * RelevanceSkidIVA + SkidderHourlyCost * RelevanceSkidIVB + SkidderHourlyCost * RelevanceSkidIVC + SkidderHourlyCost * RelevanceSkidIVD
        + SkidderHourlyCost * RelevanceSkidIVE + SkidderHourlyCost * RelevanceSkidIVF + SkidderHourlyCost * RelevanceSkidIVG + SkidderHourlyCost * RelevanceSkidIVH)
        / (RelevanceSkidIVA * VolPerPMHskidIVA + RelevanceSkidIVB * VolPerPMHskidIVB + RelevanceSkidIVC * VolPerPMHskidIVC + RelevanceSkidIVD * VolPerPMHskidIVD
            + RelevanceSkidIVE * VolPerPMHskidIVE + RelevanceSkidIVF * VolPerPMHskidIVF + RelevanceSkidIVG * VolPerPMHskidIVG + RelevanceSkidIVH * VolPerPMHskidIVH);

    return CostSkidBun;
}

function Processing(inputVar.TreeVolSLT, DBHSLT, ButtDiamSLT, LogsPerTreeSLT, MechMachineSize, CostMachine) {
    const PMH_ProcessorS = CostMachine.PMH_ProcessorS;
    const PMH_ProcessorB = CostMachine.PMH_ProcessorB;

    // Processing Calculated Values
    let ProcessorHourlyCost;
    // A) Hahn Stroke Processor (Gonsier&Mandzak, 87)
    let TimePerTreeProcessA, VolPerPMHProcessA, CostPerCCFprocessA, RelevanceProcessA;
    // B) Stroke Processor (MacDonald, 90)
    let TimePerTreeProcessB, VolPerPMHprocessB, CostPerCCFprocessB, RelevanceProcessB;
    // C) Roger Stroke Processor (Johnson, 88)
    let TimePerTreeProcessC, VolPerPMHprocessC, CostPerCCFprocessC, RelevanceProcessC;
    // D) Harricana Stroke Processor (Johnson, 88)
    let TimePerTreeProcessD, VolPerPMHprocessD, CostPerCCFprocessD, RelevanceProcessD;
    // E) Hitachi EX150/Keto 500 (Schroder&Johnson, 97)
    let TimePerTreeProcessE, VolPerPMHprocessE, CostPerCCFprocessE, RelevanceProcessE;
    // F) FERIC Generic (Gingras, J.F. 96. The cost of product sorting during harvesting. FERIC Technical Note TN-245)
    let VolPerPMHprocessF, CostPerCCFprocessF, RelevanceProcessF;
    // G) Valmet 546 Woodstar Processor (Holtzscher, M. and B. Lanford 1997 Tree diameter effects on costs and productivity of cut-to-length systems. For. Prod. J. 47(3):25-30)
    let TimePerTreeProcessG, VolPerPMHprocessG, CostPerCCFprocessG, RelevanceProcessG;
    // H) User-Defined
    let VolPerPMHprocessH, CostPerCCFprocessH, RelevanceProcessH;
    // Processing Summary
    let CostProcess;

    // Processing Calculated Values
    ProcessorHourlyCost = PMH_ProcessorS * (1 - MechMachineSize) + PMH_ProcessorB * MechMachineSize;
    // A) Hahn Stroke Processor (Gonsier&Mandzak, 87)
    TimePerTreeProcessA = 1.26 * (0.232 + 0.0494 * DBHSLT);
    VolPerPMHProcessA = inputVar.TreeVolSLT / (TimePerTreeProcessA / 60);
    CostPerCCFprocessA = 100 * ProcessorHourlyCost / VolPerPMHProcessA;
    RelevanceProcessA = (DBHSLT < 15 ? 1 : (DBHSLT < 20 ? 4 - DBHSLT / 5 : 0));
    // B) Stroke Processor (MacDonald, 90)
    TimePerTreeProcessB = 0.153 + 0.0145 * ButtDiamSLT;
    VolPerPMHprocessB = inputVar.TreeVolSLT / (TimePerTreeProcessB / 60);
    CostPerCCFprocessB = 100 * ProcessorHourlyCost / VolPerPMHprocessB;
    RelevanceProcessB = (ButtDiamSLT < 20 ? 1 : (ButtDiamSLT < 30 ? 3 - ButtDiamSLT / 10 : 0));
    // C) Roger Stroke Processor (Johnson, 88)
    TimePerTreeProcessC = -0.05 + 0.6844 * LogsPerTreeSLT + 5 * Math.pow(10, -8) * Math.pow(inputVar.TreeVolSLT, 2);
    VolPerPMHprocessC = inputVar.TreeVolSLT / (TimePerTreeProcessC / 60);
    CostPerCCFprocessC = 100 * ProcessorHourlyCost / VolPerPMHprocessC;
    RelevanceProcessC = 1;
    // D) Harricana Stroke Processor (Johnson, 88)
    TimePerTreeProcessD = -0.13 + 0.001 * Math.pow(ButtDiamSLT, 2) + 0.5942 * LogsPerTreeSLT;
    VolPerPMHprocessD = inputVar.TreeVolSLT / (TimePerTreeProcessD / 60);
    CostPerCCFprocessD = 100 * ProcessorHourlyCost / VolPerPMHprocessD;
    RelevanceProcessD = 1;
    // E) Hitachi EX150/Keto 500 (Schroder&Johnson, 97)
    TimePerTreeProcessE = Math.pow(0.67 + 0.0116 * inputVar.TreeVolSLT, 2);
    VolPerPMHprocessE = inputVar.TreeVolSLT / (TimePerTreeProcessE / 60);
    CostPerCCFprocessE = 100 * ProcessorHourlyCost / VolPerPMHprocessE;
    RelevanceProcessE = (inputVar.TreeVolSLT < 50 ? 1 : (inputVar.TreeVolSLT < 100 ? 2 - inputVar.TreeVolSLT / 50 : 0));
    // F) FERIC Generic (Gingras, J.F. 96. The cost of product sorting during harvesting. FERIC Technical Note TN-245)
    VolPerPMHprocessF = (41.16 / 0.02832) * Math.pow(inputVar.TreeVolSLT / 35.31, 0.4902);
    CostPerCCFprocessF = 100 * ProcessorHourlyCost / VolPerPMHprocessF;
    RelevanceProcessF = 1;
    // G) Valmet 546 Woodstar Processor (Holtzscher, M. and B. Lanford 1997 Tree diameter effects on costs and productivity of cut-to-length systems. For. Prod. J. 47(3):25-30)
    TimePerTreeProcessG = -0.341 + 0.1243 * DBHSLT;
    VolPerPMHprocessG = inputVar.TreeVolSLT / (TimePerTreeProcessG / 60);
    CostPerCCFprocessG = 100 * ProcessorHourlyCost / VolPerPMHprocessG;
    RelevanceProcessG = (inputVar.TreeVolSLT < 20 ? 1 : (inputVar.TreeVolSLT < 40 ? 2 - inputVar.TreeVolSLT / 20 : 0));
    // H) User-Defined
    VolPerPMHprocessH = 0.001;
    CostPerCCFprocessH = 100 * ProcessorHourlyCost / VolPerPMHprocessH;
    RelevanceProcessH = 0;
    // Processing Summary
    CostProcess = (inputVar.TreeVolSLT > 0 ? CHardwoodSLT * 100 * (ProcessorHourlyCost * RelevanceProcessA + ProcessorHourlyCost * RelevanceProcessB + ProcessorHourlyCost * RelevanceProcessC
        + ProcessorHourlyCost * RelevanceProcessD + ProcessorHourlyCost * RelevanceProcessE + ProcessorHourlyCost * RelevanceProcessF + ProcessorHourlyCost * RelevanceProcessG + ProcessorHourlyCost * RelevanceProcessH)
        / (RelevanceProcessA * VolPerPMHProcessA + RelevanceProcessB * VolPerPMHprocessB + RelevanceProcessC * VolPerPMHprocessC + RelevanceProcessD * VolPerPMHprocessD
            + RelevanceProcessE * VolPerPMHprocessE + RelevanceProcessF * VolPerPMHprocessF + RelevanceProcessG * VolPerPMHprocessG + RelevanceProcessH * VolPerPMHprocessH) : 0);

    return CostProcess;
}

function Loading(LoadWeightLog, WoodDensityALT, WoodDensitySLT, CTLLogVol, LogVolALT, DBHALT, DBHSLT, ManualMachineSizeALT, CostMachine) {
    let ExchangeTrucks, PMH_LoaderS, PMH_LoaderB;
    // Loading Calculated Values
    let LoadVolALT, LoadVolSLT, LoaderHourlyCost;
    // I. Loading Full-Length Logs
    // A) Front-End Loader (Vaughan, 89)
    let TimePerLoadIA, VolPerPMHloadingIA, CostPerCCFloadingIA, RelevanceLoadingIA;
    // B) Knuckleboom Loader, Small Logs (Brown&Kellogg, 96)
    let CCFperPmin, TimePerLoadIB, VolPerPMHloadingIB, CostPerCCFloadingIB, RelevanceLoadingIB;
    // C) Loaders (Hartsough et al, 98)
    let TimePerCCFloadingIC, TimePerLoadIC, VolPerPMHloadingIC, CostPerCCFloadingIC, RelevanceLoadingIC;
    // D) Loaders (Jackson et al, 84)
    let VolPerPMHloadingID, CostPerCCFloadingID, RelevanceLoadingID;
    // E) User-Defined Load Full-Length Logs
    let VolPerPMHloadingIE, CostPerCCFloadingIE, RelevanceLoadingIE;
    // II. Loading CTL Logs
    // A) Knuckleboom Loader, CTL Logs (Brown&Kellogg, 96)
    let CCFperPminLoadingIIA, TimePerLoadIIA, VolPerPMHloadingIIA, CostPerCCFloadingIIA, RelevanceLoadingIIA;
    // B) Loaders (Jackson et al, 84)
    let VolPerPMHloadingIIB, CostPerCCFloadingIIB, RelevanceLoadingIIB;
    // C) User-Defined Load CTL Logs
    let VolPerPMHloadingIIC, CostPerCCFloadingIIC, RelevanceLoadingIIC;
    // Loading Summary
    // I. Loading Full-Length Logs
    let CostLoad;
    // II. Loading CTL Logs
    let CostLoadCTL;

    ExchangeTrucks = 5;
    PMH_LoaderS = CostMachine.PMH_LoaderS;
    PMH_LoaderB = CostMachine.PMH_LoaderB;
    // Loading Calculated Values
    LoadVolALT = LoadWeightLog * 2000 / (WoodDensityALT * 100);
    LoadVolSLT = LoadWeightLog * 2000 / (WoodDensitySLT * 100);
    LoaderHourlyCost = PMH_LoaderS * (1 - ManualMachineSizeALT) + PMH_LoaderB * ManualMachineSizeALT;

    // I. Loading Full-Length Logs
    // A) Front-End Loader (Vaughan, 89)
    TimePerLoadIA = 22 - 0.129 * LogVolALT + ExchangeTrucks;
    VolPerPMHloadingIA = 100 * LoadVolALT / (TimePerLoadIA / 60);
    CostPerCCFloadingIA = 100 * LoaderHourlyCost / VolPerPMHloadingIA;
    RelevanceLoadingIA = LogVolALT < 10 ? 0 : (LogVolALT < 40 ? -1 / 3 + LogVolALT / 30 : 1);
    // B) Knuckleboom Loader, Small Logs (Brown&Kellogg, 96)
    CCFperPmin = 0.1 + 0.019 * LogVolALT;
    TimePerLoadIB = LoadVolALT / CCFperPmin + ExchangeTrucks;
    VolPerPMHloadingIB = 100 * LoadVolALT / (TimePerLoadIB / 60);
    CostPerCCFloadingIB = 100 * LoaderHourlyCost / VolPerPMHloadingIB;
    RelevanceLoadingIB = LogVolALT < 10 ? 1 : (LogVolALT < 20 ? 2 - LogVolALT / 10 : 0);
    // C) Loaders (Hartsough et al, 98)
    TimePerCCFloadingIC = 0.66 + 46.2 / DBHALT;
    TimePerLoadIC = TimePerCCFloadingIC * LoadVolALT;
    VolPerPMHloadingIC = 6000 / TimePerCCFloadingIC;
    CostPerCCFloadingIC = 100 * LoaderHourlyCost / VolPerPMHloadingIC;
    RelevanceLoadingIC = 0.8; // hardcoded
    // D) Loaders (Jackson et al, 84)
    VolPerPMHloadingID = 100 * (11.04 + 0.522 * LogVolALT - 0.00173 * Math.pow(LogVolALT, 2));
    CostPerCCFloadingID = 100 * LoaderHourlyCost / VolPerPMHloadingID;
    RelevanceLoadingID = LogVolALT < 75 ? 1 : (LogVolALT < 100 ? 4 - LogVolALT / 25 : 0);
    // E) User-Defined Load Full-Length Logs
    VolPerPMHloadingIE = 0.001;
    CostPerCCFloadingIE = 100 * LoaderHourlyCost / VolPerPMHloadingIE;
    RelevanceLoadingIE = 0;

    // II. Loading CTL Logs
    // A) Knuckleboom Loader, CTL Logs (Brown&Kellogg, 96)
    CCFperPminLoadingIIA = 0.1 + 0.019 * CTLLogVol;
    TimePerLoadIIA = LoadVolSLT / CCFperPminLoadingIIA + ExchangeTrucks;
    VolPerPMHloadingIIA = 100 * LoadVolSLT / (TimePerLoadIIA / 60);
    CostPerCCFloadingIIA = 100 * LoaderHourlyCost / VolPerPMHloadingIIA;
    RelevanceLoadingIIA = CTLLogVol < 10 ? 1 : (CTLLogVol < 20 ? 2 - CTLLogVol / 10 : 0);
    // B) Loaders (Jackson et al, 84)
    VolPerPMHloadingIIB = 100 * (11.04 + 0.522 * CTLLogVol - 0.00173 * Math.pow(CTLLogVol, 2));
    CostPerCCFloadingIIB = 100 * LoaderHourlyCost / VolPerPMHloadingIIB;
    RelevanceLoadingIIB = 0.5;
    // C) User-Defined Load CTL Logs
    VolPerPMHloadingIIC = 0.001;
    CostPerCCFloadingIIC = 100 * LoaderHourlyCost / VolPerPMHloadingIIC;
    RelevanceLoadingIIC = 0;

    // Loading Summary
    // I. Loading Full-Length Logs
    CostLoad = load_cost == true ?
    (TreeVolALT > 0 ? CHardwoodALT * 100 * (LoaderHourlyCost * RelevanceLoadingIA + LoaderHourlyCost * RelevanceLoadingIB + LoaderHourlyCost * RelevanceLoadingIC + LoaderHourlyCost * RelevanceLoadingID + LoaderHourlyCost * RelevanceLoadingIE)
    / (RelevanceLoadingIA * VolPerPMHloadingIA + RelevanceLoadingIB * VolPerPMHloadingIB + RelevanceLoadingIC * VolPerPMHloadingIC + RelevanceLoadingID * VolPerPMHloadingID + RelevanceLoadingIE * VolPerPMHloadingIE) : 0) : 0;
    // II. Loading CTL Logs
    CostLoadCTL = load_cost == true ?
    (inputVar.TreeVolSLT > 0 ? CHardwoodSLT * 100 * (LoaderHourlyCost * RelevanceLoadingIIA + LoaderHourlyCost * RelevanceLoadingIIB + LoaderHourlyCost * RelevanceLoadingIIC)
    / (RelevanceLoadingIIA * VolPerPMHloadingIIA + RelevanceLoadingIIB * VolPerPMHloadingIIB + RelevanceLoadingIIC * VolPerPMHloadingIIC) : 0) : 0;

    return CostLoad;
}

function Chipping(inputVar.TreeVolCT, WoodDensityCT, LoadWeightChip, MoistureContent, CHardwoodCT, CostMachine) {
    let ExchangeVans = 5.3;
    // Chipping Calculated Values
    let PMH_LoaderS, PMH_ChipperS, PMH_ChipperB, LoadWeightDry, TreeWeightDry, CTLLogWeight, CTLLogWeightDry, ChipperHourlyCost;
    // I. Chip Whole Trees
    // A) (Johnson, 89)
    let ChipperHP1A, GTperPMHchippingIA, VolPerPMHchippingIA, CostPerCCFchippingIA, RelevanceChippingIA;
    // B) Morbark 22 (Hartsough, unpublished)
    let VolPerPMHchippingIB, CostPerCCFchippingIB, RelevanceChippingIB;
    // C) Morbark 60/36 (Hartsough et al, 97)
    let ProbDelayFractionIC, LogsPerSwingIC, ChipTimePerSwingIC, SlashIC, TimePerVanIC, VolPerPMHchippingIC, CostPerCCFchippingIC, RelevanceChippingIC;
    // D) User-Defined Chip Whole Trees
    let VolPerPMHchippingID, CostPerCCFchippingID, RelevanceChippingID;
    // II. Chain Flail DDC Whole Trees
    // A) adjusted from Chip Whole Trees
    let FlailProdAdjustmentIIA, FlailHrlyCostAdjustmentIIA, CostPerPMHchippingIIA, CostPerCCFchippingIIA, VolPerPMHchippingIIA, RelevanceChippingIIA;
    // B) User-Defined Chain Flail DDC WT
    let VolPerPMHchippingIIB, CostPerCCFchippingIIB, RelevanceChippingIIB;
    // III. Chip CTL Logs
    // A) Morbark 27 (Drews et al, 98)
    let ProbDelayFractionIIIA, TimePerGTchippingIIIA, TimePerVanIIIA, VolPerPMHchippingIIIA, CostPerCCFchippingIIIA, RelevanceChippingIIIA;
    // B) Morbark 60/36 (Hartsough et al, 97)
    let ProdDelayFractionIIIB, LogsPerSwingIIIB, ChipTimePerSwingIIIB, SlashIIIB, TimePerVanIIIB, VolPerPMHchippingIIIB, CostPerCCFchippingIIIB, RelevanceChippingIIIB;
    // C) User-Defined Chip CTL Logs
    let VolPerPMHchippingIIIC, CostPerCCFchippingIIIC, RelevanceChippingIIIC;
    // IV. Chip Piled Loose Residues at Landing
    // A) Drum chippers (Desrochers, L., D. Puttock and M. Ryans. 95. Recovery of roadside residues using drum chippers. FERIC Technical Report TR-111)
    let BDTperPMHchippingIVA, BDTperPMHchippingIVA2, BDTperPMHchippingIVAavg, GTperPMHchippingIVA, CostPerPMHchippingIVA, CostPerGTchippingIVA, RelevanceChippingIVA;
    // B) User-Defined Chip Piled Loose Residues at Landing
    let GTperPMHchippingIVB, CostPerGTchippingIVB, RelevanceChippingIVB;
    // V. Chip Bundles of Residue at Landing
    // A) Assume 50% faster than chipping loose residues
    let GTperPMHchippingVA, CostPerGTchippingVA, RelevanceChippingVA;
    // B) User-Defined Chip Bundles of Residue at Landing
    let GTperPMHchippingVB, CostPerGTchippingVB, RelevanceChippingVB;
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
    PMH_LoaderS = CostMachine.PMH_LoaderS;
    PMH_ChipperS = CostMachine.PMH_ChipperS;
    PMH_ChipperB = CostMachine.PMH_ChipperB;
    LoadWeightDry = LoadWeightChip * (1 - MoistureContent);
    TreeWeightDry = inputVar.TreeVolCT * WoodDensityCT * (1 - MoistureContent);
    CTLLogWeight = CTLLogVolCT * WoodDensityCT;
    CTLLogWeightDry = CTLLogWeight * (1 - MoistureContent);
    ChipperHourlyCost = PMH_ChipperS * (1 - ChipperSize) + PMH_ChipperB * ChipperSize;

    // I. Chip Whole Trees
    // A) (Johnson, 89)
    ChipperHP1A = Math.min(700, Math.max(200, 100 + 100 * Math.sqrt(inputVar.TreeVolCT)));
    GTperPMHchippingIA = -17 + ChipperHP1A / 6;
    VolPerPMHchippingIA = GTperPMHchippingIA * 2000 / WoodDensityCT;
    CostPerCCFchippingIA = 100 * ChipperHourlyCost / VolPerPMHchippingIA;
    RelevanceChippingIA = 1;
    // B) Morbark 22 (Hartsough, unpublished)
    VolPerPMHchippingIB = Math.min(4000, 463 * Math.pow(inputVar.TreeVolCT, 0.668));
    CostPerCCFchippingIB = 100 * ChipperHourlyCost / VolPerPMHchippingIB;
    RelevanceChippingIB = 1;
    // C) Morbark 60/36 (Hartsough et al, 97)
    ProbDelayFractionIC = 0.038;
    LogsPerSwingIC = 1.2 + 338 / TreeWeightDry;
    ChipTimePerSwingIC = 0.25 + 0.0264 * LogsPerSwingIC + 0.000498 * TreeWeightDry;
    SlashIC = 0.93;
    TimePerVanIC = ChipTimePerSwingIC * (1 + ProbDelayFractionIC) / (TreeWeightDry * LogsPerSwingIC) * 2000 * LoadWeightDry + (SlashIC + ExchangeVans);
    VolPerPMHchippingIC = LoadWeightChip / (WoodDensityCT / 2000) / (TimePerVanIC / 60);
    CostPerCCFchippingIC = 100 * ChipperHourlyCost / VolPerPMHchippingIC;
    RelevanceChippingIC = TreeWeightDry < 400 ? 1 : (TreeWeightDry < 800 ? 2 - TreeWeightDry / 400 : 0);
    // D) User-Defined Chip Whole Trees
    VolPerPMHchippingID = 0.001;
    CostPerCCFchippingID = 100 * ChipperHourlyCost / VolPerPMHchippingID;
    RelevanceChippingID = 0;

    // II. Chain Flail DDC Whole Trees

    // B) User-Defined Chain Flail DDC WT
    VolPerPMHchippingIIB = 0.001;
    CostPerCCFchippingIIB = 100 * ChipperHourlyCost / VolPerPMHchippingIIB;
    RelevanceChippingIIB = 0;
    
    // III. Chip CTL Logs
    // A) Morbark 27 (Drews et al, 98)
    ProbDelayFractionIIIA = 0.111;
    TimePerGTchippingIIIA = Math.max(0.8, (2.05 - 0.00541 * CTLLogWeight) * (1 + ProbDelayFractionIIIA));
    TimePerVanIIIA = TimePerGTchippingIIIA * LoadWeightChip + ExchangeVans;
    VolPerPMHchippingIIIA = LoadWeightChip / (WoodDensityCT / 2000) / (TimePerVanIIIA / 60);
    CostPerCCFchippingIIIA = 100 * ChipperHourlyCost / VolPerPMHchippingIIIA;
    RelevanceChippingIIIA = Math.max(0.1, CTLLogWeight < 100 ? 1 : (CTLLogWeight < 200 ? 2 - CTLLogWeight / 100 : 0));
    // B) Morbark 60/36 (Hartsough et al, 97)
    ProdDelayFractionIIIB = 0.038;
    LogsPerSwingIIIB = 1.2 + 338 / CTLLogWeightDry;
    ChipTimePerSwingIIIB = 0.25 + 0.0264 * LogsPerSwingIIIB + 0.000498 * CTLLogWeightDry;
    SlashIIIB = 0.93;
    TimePerVanIIIB = ChipTimePerSwingIIIB * (1 + ProdDelayFractionIIIB) / (CTLLogWeightDry * LogsPerSwingIIIB) * 2000 * LoadWeightDry + (SlashIIIB + ExchangeVans);
    VolPerPMHchippingIIIB = LoadWeightChip / (WoodDensityCT / 2000) / (TimePerVanIIIB / 60);
    CostPerCCFchippingIIIB = 100 * ChipperHourlyCost / VolPerPMHchippingIIIB;
    RelevanceChippingIIIB = CTLLogWeightDry < 400 ? 1 : (CTLLogWeightDry < 800 ? 2 - CTLLogWeightDry / 400 : 0);
    // C) User-Defined Chip CTL Logs
    VolPerPMHchippingIIIC = 0.001;
    CostPerCCFchippingIIIC = 100 * ChipperHourlyCost / VolPerPMHchippingIIIC;
    RelevanceChippingIIIC = 0;
    
    // IV. Chip Piled Loose Residues at Landing
    // A) Drum chippers (Desrochers, L., D. Puttock and M. Ryans. 95. Recovery of roadside residues using drum chippers. FERIC Technical Report TR-111)
    BDTperPMHchippingIVA = 13.5;
    BDTperPMHchippingIVA2 = 31;
    BDTperPMHchippingIVAavg = (BDTperPMHchippingIVA + BDTperPMHchippingIVA2) / 2;
    GTperPMHchippingIVA = BDTperPMHchippingIVAavg / MoistureContent;
    CostPerPMHchippingIVA = ChipperHourlyCost + PMH_LoaderS;
    CostPerGTchippingIVA = CostPerPMHchippingIVA / GTperPMHchippingIVA;
    RelevanceChippingIVA = 1;
    // B) User-Defined Chip Piled Loose Residues at Landing
    GTperPMHchippingIVB = 0.001;
    CostPerGTchippingIVB = CostPerPMHchippingIVA / GTperPMHchippingIVB;
    RelevanceChippingIVB = 0;

    // V. Chip Bundles of Residue at Landing
    // A) Assume 50% faster than chipping loose residues
    GTperPMHchippingVA = 1.5 * GTperPMHchippingIVA;
    CostPerGTchippingVA = CostPerPMHchippingIVA / GTperPMHchippingVA;
    RelevanceChippingVA = 1;
    // B) User-Defined Chip Bundles of Residue at Landing
    GTperPMHchippingVB = 0.0001;
    CostPerGTchippingVB = CostPerPMHchippingIVA / GTperPMHchippingVB;
    RelevanceChippingVB = 0;

    // Chipping Summary
    // I. Chip Whole Trees
    CostChipWT = inputVar.TreeVolCT > 0 ? CHardwoodCT * 100 * (ChipperHourlyCost * RelevanceChippingIA + ChipperHourlyCost * RelevanceChippingIB + ChipperHourlyCost * RelevanceChippingIC + ChipperHourlyCost * RelevanceChippingID)
    / (RelevanceChippingIA * VolPerPMHchippingIA + RelevanceChippingIB * VolPerPMHchippingIB + RelevanceChippingIC * VolPerPMHchippingIC + RelevanceChippingID * VolPerPMHchippingID) : 0;
    // II. Chain Flail DDC WT
    // A) adjusted from Chip Whole Trees
    FlailProdAdjustmentIIA = 0.9;
    FlailHrlyCostAdjustmentIIA = 1.1;
    CostPerPMHchippingIIA = FlailHrlyCostAdjustmentIIA * ChipperHourlyCost;
    // need CostChipWT to calculate CostPerCCFchippingIIA
    CostPerCCFchippingIIA = (FlailHrlyCostAdjustmentIIA / FlailProdAdjustmentIIA) * CostChipWT;
    VolPerPMHchippingIIA = 100 * CostPerPMHchippingIIA / CostPerCCFchippingIIA;
    RelevanceChippingIIA = Math.max(RelevanceChippingIA, RelevanceChippingIB, RelevanceChippingIC);
    // result
    CostDDChipWT = inputVar.TreeVolCT > 0 ? CHardwoodCT * 100 * (CostPerPMHchippingIIA * RelevanceChippingIIA + ChipperHourlyCost * RelevanceChippingIIB)
    / (RelevanceChippingIIA * VolPerPMHchippingIIA + RelevanceChippingIIB * VolPerPMHchippingIIB) : 0;
    // III. Chip CTL Logs
    CostChipCTL = inputVar.TreeVolCT > 0 ? CHardwoodCT * 100 * (ChipperHourlyCost * RelevanceChippingIIIA + ChipperHourlyCost * RelevanceChippingIIIB + ChipperHourlyCost * RelevanceChippingIIIC)
    / (RelevanceChippingIIIA * VolPerPMHchippingIIIA + RelevanceChippingIIIB * VolPerPMHchippingIIIB + RelevanceChippingIIIC * VolPerPMHchippingIIIC) : 0;
    // IV. Chip Piled Loose Residues at Landing
    CostChipLooseRes = (CostPerPMHchippingIVA * RelevanceChippingIVA + CostPerPMHchippingIVA * RelevanceChippingIVB)
    / (RelevanceChippingIVA * GTperPMHchippingIVA + RelevanceChippingIVB * GTperPMHchippingIVB);
    // V. Chip Bundles of Residue at Landing
    CostChipBundledRes = (CostPerPMHchippingIVA * RelevanceChippingVA + CostPerPMHchippingIVA * RelevanceChippingVB)
    / (RelevanceChippingVA * GTperPMHchippingVA + RelevanceChippingVB * GTperPMHchippingVB);

    const results = { 'CostChipWT': CostChipWT, 'CostDDChipWT': CostDDChipWT, 'CostChipCTL': CostChipCTL, 'CostChipLooseRes': CostChipLooseRes, 'CostChipBundledRes': CostChipBundledRes };
    // console.log(results);
    return results;
}

function MoveInCosts(Area, MoveInDist, TreeVol, Removals, VolPerAcreCT, CostMachine) {
    // Move-In Assumptions
    let SpeedLoaded, SpeedBack, MoveInLabor, LoadHrs, LoadHrsYarder, TruckMoveInCosts, TruckDriverMoveInCosts;
    // Move-In Calculated Values
    let TravLoadedHrs, BackhaulHrs, LowboyCost;
    // System Costs
    // Mech WT
    let LowboyLoadsMechWT;
    // Fixed
    let fellerbuncherFixedMechWT, skidderFixedMechWT, processorFixedMechWT, loaderFixedMechWT, chipperFixedMechWT, totalFixedMechWT;
    // Variable
    let fellerbuncherVariableMechWT, skidderVariableMechWT, processorVariableMechWT, loaderVariableMechWT, chipperVariableMechWT, BackhaulVariableMechWT, totalVariableMechWT;
    // Total
    let totalMechWT, CostPerCCFmechWT;
    
    // Move-In Assumptions
    SpeedLoaded = 25;
    SpeedBack = 40;
    MoveInLabor = 0;
    LoadHrs = 2;
    LoadHrsYarder = 4;
    TruckMoveInCosts = 35;
    TruckDriverMoveInCosts = 18;
    // Move-In Calculated Values
    TravLoadedHrs = MoveInDist / SpeedLoaded;
    BackhaulHrs = MoveInDist / SpeedBack;
    LowboyCost = TruckMoveInCosts + TruckDriverMoveInCosts;
    // System Costs
    // Mech WT
    LowboyLoadsMechWT = 4 + (VolPerAcreCT > 0 ? 1 : 0);
    const FB_OwnCost = CostMachine.FB_OwnCost;
    const Skidder_OwnCost = CostMachine.Skidder_OwnCost;
    const Processor_OwnCost = CostMachine.Processor_OwnCost;
    const Loader_OwnCost = CostMachine.Loader_OwnCost;
    const Chipper_OwnCost = CostMachine.Chipper_OwnCost;
    // Fixed
    fellerbuncherFixedMechWT = (LowboyCost + FB_OwnCost + MoveInLabor) * LoadHrs;
    skidderFixedMechWT = (LowboyCost + Skidder_OwnCost + MoveInLabor) * LoadHrs;
    processorFixedMechWT = (LowboyCost + Processor_OwnCost + MoveInLabor) * LoadHrs;
    loaderFixedMechWT = (LowboyCost + Loader_OwnCost + MoveInLabor) * LoadHrs;
    chipperFixedMechWT = VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost + MoveInLabor) * LoadHrs : 0;
    totalFixedMechWT = fellerbuncherFixedMechWT + skidderFixedMechWT + processorFixedMechWT + loaderFixedMechWT + chipperFixedMechWT;
    // Variable
    fellerbuncherVariableMechWT = (LowboyCost + FB_OwnCost) / SpeedLoaded;
    skidderVariableMechWT = (LowboyCost + Skidder_OwnCost) / SpeedLoaded;
    processorVariableMechWT = (LowboyCost + Processor_OwnCost) / SpeedLoaded;
    loaderVariableMechWT = (LowboyCost + Loader_OwnCost) / SpeedLoaded;
    chipperVariableMechWT = VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost) / SpeedLoaded : 0;
    BackhaulVariableMechWT = LowboyCost * LowboyLoadsMechWT / SpeedBack;
    totalVariableMechWT = fellerbuncherVariableMechWT + skidderVariableMechWT + processorVariableMechWT + loaderVariableMechWT + chipperVariableMechWT + BackhaulVariableMechWT;
    // Total
    totalMechWT = totalFixedMechWT + totalVariableMechWT * MoveInDist;
    CostPerCCFmechWT = totalMechWT * 100 / (Area * TreeVol * Removals);

    return CostPerCCFmechWT;
}

function InLimits(TreeVolCT, TreeVolSLT, TreeVolLLT, TreeVolALT, TreeVol, Slope) {
    // Mech WT
    let MaxLLTperAcre, MaxLLTasPercentALT, ExceededMaxLLT, AvgTreeSizeLimit4Chipping, AvgTreeSizeLimit4Processing, AvgTreeSizeLimit4ManualFellLimbBuck, AvgTreeSizeLimit4loading, AvgTreeSize4GrappleSkidding,
    ExceededMaxTreeVol, SkiddingLimit, ExceededMaxSkidLimit, YardingDistLimit, ExceededMaxYardingDist, InLimits1;

    // Mech WT
    MaxLLTperAcre = null;
    MaxLLTasPercentALT = null;
    ExceededMaxLLT = 0;
    AvgTreeSizeLimit4Chipping = 80;
    AvgTreeSizeLimit4Processing = 80;
    AvgTreeSizeLimit4ManualFellLimbBuck = 250;
    AvgTreeSizeLimit4loading = 250;
    AvgTreeSize4GrappleSkidding = 250;
    ExceededMaxTreeVol
    = (inputVar.TreeVolCT > AvgTreeSizeLimit4Chipping || inputVar.TreeVolSLT > AvgTreeSizeLimit4Processing || inputVar.TreeVolLLT > AvgTreeSizeLimit4ManualFellLimbBuck || TreeVolALT > AvgTreeSizeLimit4loading || TreeVol > AvgTreeSize4GrappleSkidding) ? 1 : 0;
    // inputVar.Slope, %
    SkiddingLimit = 40; // inputVar.Slope
    ExceededMaxSkidLimit = inputVar.Slope > SkiddingLimit ? 1 : 0;
    // Yarding distance, ft
    YardingDistLimit = 0;
    ExceededMaxYardingDist = 0;
    InLimits1 = (ExceededMaxLLT == 1 || ExceededMaxTreeVol == 1 || ExceededMaxSkidLimit == 1 || ExceededMaxYardingDist == 1) ? null : 1;

    return InLimits1;
}

function MachineCosts() {
    // global var
    let WageAndBenRateF, WageAndBenRate, interest, insuranceAtax, Diesel_fuel_price, smh;
    // Chainsaw
    let PurchasePriceChainsaw, HorsepowerChainsaw, LifeChainsaw, svChainsaw, utChainsaw, rmChainsaw, fcrChainsaw, loChainsaw, personsChainsaw, wbChainsaw;
    // Harvester
    // global
    let LifeHarvester, svHarvester, utHarvester, rmHarvester, fcrHarvester, loHarvester, personsHarvester, wbHarvester;
    // Small
    let PurchasePriceHarvesterS, HorsepowerHarvesterS;
    // Big
    let PurchasePriceHarvesterB, HorsepowerHarvesterB;
    // Skidder
    let svSkidder, utSkidder, rmSkidder, fcrSkidder, loSkidder, personsSkidder, wbSkidder;
    // Small
    let PurchasePriceSkidderS, HorsepowerSkidderS, LifeSkidderS;
    // Big
    let PurchasePriceSkidderB, HorsepowerSkidderB, LifeSkidderB;
    // Forwarder
    let LifeForwarder, fcrForwarder, rmForwarder;
    // Small
    let PurchasePriceForwarderS, HorsepowerForwarderS, svForwarderS;
    // Big
    let PurchasePriceForwarderB, HorsepowerForwarderB, svForwarderB;
    // Yard small
    let PurchasePriceYarderS, HorsepowerYarderS, LifeYarder, svYarder, utYarder, rmYarder, fcrYarder, loYarder, personsYarder, wbYarder;
    // Yarder intermediate
    let PurchasePriceYarderI, HorsepowerYarderI;
    // Processor
    let LifeProcessor, svProcessor, utProcessor, rmProcessor, fcrProcessor, loProcessor, personsProcessor, wbProcessor;
    // Small
    let PurchasePriceProcessorS, HorsepowerProcessorS;
    // Big
    let PurchasePriceProcessorB, HorsepowerProcessorB;
    // Loader
    let LifeLoader, svLoader, utLoader, rmLoader, fcrLoader, loLoader, personsLoader, wbLoader;
    // Small
    let PurchasePriceLoaderS, HorsepowerLoaderS;
    // Big
    let PurchasePriceLoaderB, HorsepowerLoaderB;
    // Chipper
    let LifeChipper, svChipper, utChipper, rmChipper, fcrChipper, loChipper, personsChipper, wbChipper;
    // Small
    let PurchasePriceChipperS, HorsepowerChipperS;
    // Big
    let PurchasePriceChipperB, HorsepowerChipperB;
    // Bundler
    let PurchasePriceBundler, HorsepowerBundler, fcrBundler;
    
    WageAndBenRateF = 44.44814821; // =FallBuckWage // hardcoded
    WageAndBenRate = 35.25197962; // =OtherWage // hardcoded
    interest = 0.08;
    insuranceAtax = 0.07;
    Diesel_fuel_price = 3.327; // hardcoded
    smh = 1600;

    // Chainsaw
    PurchasePriceChainsaw = 824.4620612; // hardcoded
    HorsepowerChainsaw = 0;
    LifeChainsaw = 1;
    svChainsaw = 0.2;
    utChainsaw = 0.5;
    rmChainsaw = 7;
    fcrChainsaw = 0;
    loChainsaw = 0;
    personsChainsaw = 0;
    wbChainsaw = WageAndBenRateF;
    let Chainsaw = CostCalc(PurchasePriceChainsaw, HorsepowerChainsaw, LifeChainsaw, svChainsaw, utChainsaw, rmChainsaw, fcrChainsaw, loChainsaw, personsChainsaw, wbChainsaw);
    let PMH_Chainsaw = Chainsaw[1];

    // FBuncher
    let fcrFBuncher, loFBuncher, personsFBuncher, wbFBuncher;
    // FBuncher global
    fcrFBuncher = 0.026;
    loFBuncher = 0.37;
    personsFBuncher = 1;
    wbFBuncher = personsFBuncher * WageAndBenRate;
    // DriveToTree
    let PurchasePriceFBuncherDTT, HorsepowerFBuncherDTT, LifeFBuncherDTT, svFBuncherDTT, utFBuncherDTT, rmFBuncherDTT;

    PurchasePriceFBuncherDTT = 176670.4417; // hardcoded
    HorsepowerFBuncherDTT = 150;
    LifeFBuncherDTT = 3;
    svFBuncherDTT = 0.2;
    utFBuncherDTT = 0.65;
    rmFBuncherDTT = 1;
    let DriveToTree = CostCalc(PurchasePriceFBuncherDTT, HorsepowerFBuncherDTT, LifeFBuncherDTT, svFBuncherDTT, utFBuncherDTT, rmFBuncherDTT, fcrFBuncher, loFBuncher, personsFBuncher, wbFBuncher);
    let PMH_DriveToTree = DriveToTree[1];
    // SwingBoom
    let PurchasePriceFBuncherSB, HorsepowerFBuncherSB, LifeFBuncherSB, svFBuncherSB, utFBuncherSB, rmFBuncherSB;

    PurchasePriceFBuncherSB = 365118.9128; // hardcoded
    HorsepowerFBuncherSB = 200;
    LifeFBuncherSB = 5;
    svFBuncherSB = 0.15;
    utFBuncherSB = 0.6;
    rmFBuncherSB = 0.75;
    let SwingBoom = CostCalc(PurchasePriceFBuncherSB, HorsepowerFBuncherSB, LifeFBuncherSB, svFBuncherSB, utFBuncherSB, rmFBuncherSB, fcrFBuncher, loFBuncher, personsFBuncher, wbFBuncher);
    let PMH_SwingBoom = SwingBoom[1];
    // SelfLeveling
    let HorsepowerFBuncherSL;
    HorsepowerFBuncherSL = 240;
    let SelfLeveling = CostCalc(PurchasePriceFBuncherSB, HorsepowerFBuncherSL, LifeFBuncherSB, svFBuncherSB, utFBuncherSB, rmFBuncherSB, fcrFBuncher, loFBuncher, personsFBuncher, wbFBuncher);
    let PMH_SelfLevel = SelfLeveling[1];

    let FB_OwnCost = (DriveToTree[0] + SwingBoom[0] + SelfLeveling[0]) / 3;
    
    // Harvester
    LifeHarvester = 4;
    svHarvester = 0.2;
    utHarvester = 0.65;
    rmHarvester = 1.1;
    fcrHarvester = 0.029;
    loHarvester = 0.37;
    personsHarvester = 1;
    wbHarvester = personsHarvester * WageAndBenRate;
    // Small
    PurchasePriceHarvesterS = 412231.0306; // hardcoded
    HorsepowerHarvesterS = 120;
    let HarvesterS = CostCalc(PurchasePriceHarvesterS, HorsepowerHarvesterS, LifeHarvester, svHarvester, utHarvester, rmHarvester, fcrHarvester, loHarvester, personsHarvester, wbHarvester);
    let PMH_HarvS = HarvesterS[1];
    // Big
    PurchasePriceHarvesterB = 530011.325; // hardcoded
    HorsepowerHarvesterB = 200;
    let HarvesterB = CostCalc(PurchasePriceHarvesterB, HorsepowerHarvesterB, LifeHarvester, svHarvester, utHarvester, rmHarvester, fcrHarvester, loHarvester, personsHarvester, wbHarvester);
    let PMH_HarvB = HarvesterB[1];

    let Harvester_OwnCost = (HarvesterS[0] + HarvesterB[0]) / 2;

    // Skidder global
    svSkidder = 0.2;
    utSkidder = 0.65;
    rmSkidder = 0.9;
    fcrSkidder = 0.028;
    loSkidder = 0.37;
    personsSkidder = 1;
    wbSkidder = personsSkidder * WageAndBenRate;
    // Small
    PurchasePriceSkidderS = 164892.4122; // hardcoded
    HorsepowerSkidderS = 120;
    LifeSkidderS = 5;
    let SkidderS = CostCalc(PurchasePriceSkidderS, HorsepowerSkidderS, LifeSkidderS, svSkidder, utSkidder, rmSkidder, fcrSkidder, loSkidder, personsSkidder, wbSkidder);
    let PMH_SkidderS = SkidderS[1];
    // Big
    PurchasePriceSkidderB = 235560.5889; // hardcoded
    HorsepowerSkidderB = 200;
    LifeSkidderB = 4;
    let SkidderB = CostCalc(PurchasePriceSkidderB, HorsepowerSkidderB, LifeSkidderB, svSkidder, utSkidder, rmSkidder, fcrSkidder, loSkidder, personsSkidder, wbSkidder);
    let PMH_SkidderB = SkidderB[1];
    let Skidder_OwnCost = (SkidderS[0] + SkidderB[0]) / 2;
    
    // Forwarder
    LifeForwarder = 4;
    fcrForwarder = 0.025;
    rmForwarder = 1;
    // Small
    PurchasePriceForwarderS = 282672.7067; // hardcoded
    HorsepowerForwarderS = 110;
    svForwarderS = 0.25;
    // some vars have the same value as in Skidder, therefore keep those Skidder vars in the function below
    let ForwarderS = CostCalc(PurchasePriceForwarderS, HorsepowerForwarderS, LifeForwarder, svForwarderS, utSkidder, rmForwarder, fcrForwarder, loSkidder, personsSkidder, wbSkidder);
    let PMH_ForwarderS = ForwarderS[1];
    // Big
    PurchasePriceForwarderB = 365118.9128; // hardcoded
    HorsepowerForwarderB = 200;
    svForwarderB = 0.2;
    let ForwarderB = CostCalc(PurchasePriceForwarderB, HorsepowerForwarderB, LifeForwarder, svForwarderB, utSkidder, rmForwarder, fcrForwarder, loSkidder, personsSkidder, wbSkidder);
    let PMH_ForwarderB = ForwarderB[1];
    let Forwarder_OwnCost = (ForwarderS[0] + ForwarderB[0]) / 2;
    
    // Yarder small
    PurchasePriceYarderS = 188448.4711; // hardcoded
    HorsepowerYarderS = 100;
    LifeYarder = 10;
    svYarder = 0.1;
    utYarder = 0.75;
    rmYarder = 1;
    fcrYarder = 0.04;
    loYarder = 0.1;
    personsYarder = 5;
    wbYarder = personsYarder * WageAndBenRate;
    let YarderS = CostCalc(PurchasePriceYarderS, HorsepowerYarderS, LifeYarder, svYarder, utYarder, rmYarder, fcrYarder, loYarder, personsYarder, wbYarder);
    let PMH_YarderS = YarderS[1];
    // Yarder intermediate
    PurchasePriceYarderI = 388674.9717; // hardcoded
    HorsepowerYarderI = 200;
    let YarderI = CostCalc(PurchasePriceYarderI, HorsepowerYarderI, LifeYarder, svYarder, utYarder, rmYarder, fcrYarder, loYarder, personsYarder, wbYarder);
    let PMH_YarderI = YarderI[1];
    let Yarder_OwnCost = (YarderS[0] + YarderI[0]) / 2;

    // Processor
    LifeProcessor = 5;
    svProcessor = 0.2;
    utProcessor = 0.65;
    rmProcessor = 1;
    fcrProcessor = 0.022;
    loProcessor = 0.37;
    personsProcessor = 1;
    wbProcessor = personsProcessor * WageAndBenRate;
    // Small
    PurchasePriceProcessorS = 353340.8834; // hardcoded
    HorsepowerProcessorS = 120;
    let ProcessorS = CostCalc(PurchasePriceProcessorS, HorsepowerProcessorS, LifeProcessor, svProcessor, utProcessor, rmProcessor, fcrProcessor, loProcessor, personsProcessor, wbProcessor);
    let PMH_ProcessorS = ProcessorS[1];
    // Big
    PurchasePriceProcessorB = 471121.1778; // hardcoded
    HorsepowerProcessorB = 200;
    let ProcessorB = CostCalc(PurchasePriceProcessorB, HorsepowerProcessorB, LifeProcessor, svProcessor, utProcessor, rmProcessor, fcrProcessor, loProcessor, personsProcessor, wbProcessor);
    let PMH_ProcessorB = ProcessorB[1];
    let Processor_OwnCost = (ProcessorS[0] + ProcessorB[0]) / 2;

    // Loader
    LifeLoader = 5;
    svLoader = 0.3;
    utLoader = 0.65;
    rmLoader = 0.9;
    fcrLoader = 0.022;
    loLoader = 0.37;
    personsLoader = 1;
    wbLoader = personsLoader * WageAndBenRate;
    // Small
    PurchasePriceLoaderS = 223782.5595; // hardcoded
    HorsepowerLoaderS = 120;
    let LoaderS = CostCalc(PurchasePriceLoaderS, HorsepowerLoaderS, LifeLoader, svLoader, utLoader, rmLoader, fcrLoader, loLoader, personsLoader, wbLoader);
    let PMH_LoaderS = LoaderS[1];
    // Big
    PurchasePriceLoaderB = 294450.7361; // hardcoded
    HorsepowerLoaderB = 200;
    let LoaderB = CostCalc(PurchasePriceLoaderB, HorsepowerLoaderB, LifeLoader, svLoader, utLoader, rmLoader, fcrLoader, loLoader, personsLoader, wbLoader);
    let PMH_LoaderB = LoaderB[1];
    let Loader_OwnCost = (LoaderS[0] + LoaderB[0]) / 2;
    
    // Chipper
    LifeChipper = 5;
    svChipper = 0.2;
    utChipper = 0.75;
    rmChipper = 1;
    fcrChipper = 0.023;
    loChipper = 0.37;
    personsChipper = 1;
    wbChipper = personsChipper * WageAndBenRate;
    // Small
    PurchasePriceChipperS = 235560.5889; // hardcoded
    HorsepowerChipperS = 350;
    let ChipperS = CostCalc(PurchasePriceChipperS, HorsepowerChipperS, LifeChipper, svChipper, utChipper, rmChipper, fcrChipper, loChipper, personsChipper, wbChipper);
    let PMH_ChipperS = ChipperS[1];
    // Big
    PurchasePriceChipperB = 353340.8834; // hardcoded
    HorsepowerChipperB = 700;
    let ChipperB = CostCalc(PurchasePriceChipperB, HorsepowerChipperB, LifeChipper, svChipper, utChipper, rmChipper, fcrChipper, loChipper, personsChipper, wbChipper);
    let PMH_ChipperB = ChipperB[1];
    let Chipper_OwnCost = (ChipperS[0] + ChipperB[0]) / 2;

    // Bundler
    PurchasePriceBundler = 530011.325; // hardcoded
    HorsepowerBundler = 180;
    fcrBundler = 0.025;
    // the other vars are the same as Chipper's, therefore pass chipper vars in the function below
    let Bundler = CostCalc(PurchasePriceBundler, HorsepowerBundler, LifeChipper, svChipper, utChipper, rmChipper, fcrBundler, loChipper, personsChipper, wbChipper);
    let PMH_Bundler = Bundler[1];
    let Bundler_OwnCost = Bundler[0];
    
    const resultObj = {'PMH_Chainsaw': PMH_Chainsaw, 'PMH_DriveToTree': PMH_DriveToTree, 'PMH_SwingBoom': PMH_SwingBoom, 'PMH_SelfLevel': PMH_SelfLevel, 'FB_OwnCost': FB_OwnCost,
                       'PMH_HarvS': PMH_HarvS, 'PMH_HarvB': PMH_HarvB, 'Harvester_OwnCost': Harvester_OwnCost, 'PMH_SkidderS': PMH_SkidderS, 'PMH_SkidderB': PMH_SkidderB, 'Skidder_OwnCost': Skidder_OwnCost,
                       'PMH_ForwarderS': PMH_ForwarderS, 'PMH_ForwarderB': PMH_ForwarderB, 'Forwarder_OwnCost': Forwarder_OwnCost, 'PMH_YarderS': PMH_YarderS, 'PMH_YarderI': PMH_YarderI, 'Yarder_OwnCost': Yarder_OwnCost,
                       'PMH_ProcessorS': PMH_ProcessorS, 'PMH_ProcessorB': PMH_ProcessorB, 'Processor_OwnCost': Processor_OwnCost, 'PMH_LoaderS': PMH_LoaderS, 'PMH_LoaderB': PMH_LoaderB, 'Loader_OwnCost': Loader_OwnCost,
                       'PMH_ChipperS': PMH_ChipperS, 'PMH_ChipperB': PMH_ChipperB, 'Chipper_OwnCost': Chipper_OwnCost, 'PMH_Bundler': PMH_Bundler, 'Bundler_OwnCost': Bundler_OwnCost};
    console.log(resultObj);
    return resultObj;

    function CostCalc(PurchasePriceYarderS, HorsepowerYarderS, LifeYarder, svYarder, utYarder, rmYarder, fcrYarder, loYarder, personsYarder, wbYarder) {
        let SalvageYarderS, AnnualDepreciationYarder, avgYearlyInvestmentYarder, PMHyarder, InterestCostYarder, InsuranceAndTaxCost, YearlyOwnershipCostYarder, OwnershipCostSMHyarder, OwnershipCostPMHyarder, FuelCostYarder,
        LubeCostYarder, RepairAndMaintenanceCostYarder, LaborCostPMHyarder, OperatingCostPMHyarder, OperatingCostSMHyarder, TotalCostSMHyarder, TotalCostPMHyarderS;

        SalvageYarderS = PurchasePriceYarderS * svYarder;
        AnnualDepreciationYarder = (PurchasePriceYarderS - SalvageYarderS) / LifeYarder;
        avgYearlyInvestmentYarder = (((PurchasePriceYarderS - SalvageYarderS) * (LifeYarder + 1) / (2 * LifeYarder)) + SalvageYarderS);
        PMHyarder = smh * utYarder;
        InterestCostYarder = interest * avgYearlyInvestmentYarder;
        InsuranceAndTaxCost = insuranceAtax * avgYearlyInvestmentYarder;
        YearlyOwnershipCostYarder = InsuranceAndTaxCost + InterestCostYarder + AnnualDepreciationYarder;
        OwnershipCostSMHyarder = YearlyOwnershipCostYarder / smh;
        OwnershipCostPMHyarder = YearlyOwnershipCostYarder / PMHyarder;
        FuelCostYarder = HorsepowerYarderS * fcrYarder * Diesel_fuel_price;
        LubeCostYarder = loYarder * FuelCostYarder;
        RepairAndMaintenanceCostYarder = AnnualDepreciationYarder * rmYarder / PMHyarder;
        LaborCostPMHyarder = wbYarder / utYarder;
        OperatingCostPMHyarder = FuelCostYarder + LubeCostYarder + RepairAndMaintenanceCostYarder + LaborCostPMHyarder;
        OperatingCostSMHyarder = OperatingCostPMHyarder * utYarder;
        TotalCostSMHyarder = OwnershipCostSMHyarder + OperatingCostSMHyarder;
        TotalCostPMHyarderS = OwnershipCostPMHyarder + OperatingCostPMHyarder;

        return [OwnershipCostPMHyarder, TotalCostPMHyarderS];
    }
}
