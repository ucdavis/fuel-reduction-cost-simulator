import { Chipping } from './chipping';
import { FellBunch } from './fellbunch';
import { FellLargeLogTrees } from './felllargelogtrees';
import { CostMachineMod, InputVarMod, IntermediateVarMod, OutputVarMod } from './frcs.model';
import { InLimits } from './inlimits';
import { Loading } from './loading';
import { MachineCosts } from './machinecosts';
import { MoveInCosts } from './moveincost';
import { Processing } from './processing';
import { Skidding } from './skidding';

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
    const ResidueRecoveredOptional = inputVar.CalcResidues === 1 ? (ResidueRecovFracWT * ResidueSLT)
        + (ResidueRecovFracWT * ResidueLLT) : 0;
    const TotalPrimaryAndOptional = PrimaryProduct + ResidueRecoveredOptional;
    const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
    // Amounts Unrecovered and Left within the Stand Per Acre
    const GroundFuel = ResidueLLT + ResidueST * (1 - ResidueRecovFracWT);
    // Amounts Unrecovered and Left at the Landing
    const PiledFuel = inputVar.CalcResidues === 1 ? 0 : ResidueSLT * ResidueRecovFracWT;
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
    = FellLargeLogTrees(inputVar.Slope, inputVar.RemovalsLLT, inputVar.TreeVolLLT, TreeVol,
                        inputVar.cut_type, DBHLLT, LogsPerTreeLLT, CHardwoodLLT, CostMachine);
    const CostSkidBun
    = Skidding(inputVar.Slope, inputVar.deliver_dist, Removals, TreeVol, WoodDensity, LogLength,
               inputVar.cut_type, CSlopeSkidForwLoadSize, LogsPerTree, LogVol,
               ManualMachineSize, BFperCF, ButtDiam, CostMachine, TreesPerCycleIIB, CHardwood);
    const CostProcess = Processing(inputVar.TreeVolSLT, DBHSLT, ButtDiamSLT,
                                   LogsPerTreeSLT, MechMachineSize, CostMachine, CHardwoodSLT);
    const CostLoad = Loading(LoadWeightLog, WoodDensityALT, WoodDensitySLT, CTLLogVol, LogVolALT,
                             DBHALT, DBHSLT, ManualMachineSizeALT, CostMachine, inputVar.load_cost,
                             TreeVolALT, CHardwoodALT, inputVar.TreeVolSLT, CHardwoodSLT);
    const ChippingResults = Chipping(inputVar.TreeVolCT, WoodDensityCT, LoadWeightChip,
                                     MoistureContent, CHardwoodCT, CostMachine, CTLLogVolCT, ChipperSize);
    const CostChipWT = ChippingResults.CostChipWT;
    const MoveInCosts1G39
        = MoveInCosts(inputVar.Area, inputVar.MoveInDist, TreeVol, Removals, VolPerAcreCT, CostMachine);
    const CostChipLooseRes = ChippingResults.CostChipLooseRes;

    // C. For All Products, $/ac
    const FellAndBunchTreesLess80cf = CostFellBunch * VolPerAcreST / 100 * InLimits1;
    const ManualFellLimbBuckTreesLarger80cf = CostManFLBLLT * VolPerAcreLLT / 100 * InLimits1;
    const SkidBunchedAllTrees = CostSkidBun * VolPerAcre / 100 * InLimits1;
    const ProcessLogTreesLess80cf = CostProcess * VolPerAcreSLT / 100 * InLimits1;
    const LoadLogTrees = CostLoad * VolPerAcreALT / 100 * InLimits1;
    const ChipWholeTrees = CostChipWT * VolPerAcreCT / 100 * InLimits1;
    const Stump2Truck4PrimaryProductWithoutMovein = FellAndBunchTreesLess80cf
        + ManualFellLimbBuckTreesLarger80cf + SkidBunchedAllTrees
        + ProcessLogTreesLess80cf + LoadLogTrees + ChipWholeTrees;
    const Movein4PrimaryProduct = MoveInCosts1G39 * inputVar.CalcMoveIn * BoleVolCCF * InLimits1;

    const ChipLooseResiduesFromLogTreesLess80cf = CostChipLooseRes * inputVar.CalcResidues
        * ResidueRecoveredOptional * InLimits1;
    const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf; // for Mech WT sys;
    const  Movein4Residues = 0 * inputVar.CalcMoveIn * inputVar.CalcResidues * ResidueRecoveredOptional * InLimits1;

// III. System Cost Summaries
    const TotalPerAcre = Math.round(Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct
        + OntoTruck4ResiduesWoMovein + Movein4Residues);
    const TotalPerBoleCCF = Math.round(TotalPerAcre / BoleVolCCF);
    const TotalPerGT = Math.round(TotalPerAcre / TotalPrimaryProductsAndOptionalResidues);

    return { 'TotalPerBoleCCF': TotalPerBoleCCF, 'TotalPerGT': TotalPerGT, 'TotalPerAcre': TotalPerAcre };
}
