import { Chipping } from './chipping';
import { FellBunch } from './fellbunch';
import { FellLargeLogTrees } from './felllargelogtrees';
import { CostMachineMod, InputVarMod, IntermediateVarMod, OutputVarMod } from './frcs.model';
import { Loading } from './loading';
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
    let MoveInCosts1G39 = MoveInCosts(Area, MoveInDist, TreeVol, Removals, VolPerAcreCT, CostMachine);
    const CostChipLooseRes = ChippingResults.CostChipLooseRes;

    // C. For All Products, $/ac
    const FellAndBunchTreesLess80cf = CostFellBunch * VolPerAcreST / 100 * InLimits1;
    const ManualFellLimbBuckTreesLarger80cf = CostManFLBLLT * VolPerAcreLLT / 100 * InLimits1;
    const SkidBunchedAllTrees = CostSkidBun * VolPerAcre / 100 * InLimits1;
    const ProcessLogTreesLess80cf = CostProcess * VolPerAcreSLT / 100 * InLimits1;
    const LoadLogTrees = CostLoad * VolPerAcreALT / 100 * InLimits1;
    const ChipWholeTrees = CostChipWT * VolPerAcreCT / 100 * InLimits1;
    const Stump2Truck4PrimaryProductWithoutMovein = FellAndBunchTreesLess80cf + ManualFellLimbBuckTreesLarger80cf + SkidBunchedAllTrees + ProcessLogTreesLess80cf + LoadLogTrees + ChipWholeTrees;
    const Movein4PrimaryProduct = MoveInCosts1G39 * CalcMoveIn * BoleVolCCF * InLimits1;

    const ChipLooseResiduesFromLogTreesLess80cf = CostChipLooseRes * inputVar.CalcResidues * ResidueRecoveredOptional * InLimits1;
    const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf; // for Mech WT sys;
    const  Movein4Residues = 0 * CalcMoveIn * inputVar.CalcResidues * ResidueRecoveredOptional * InLimits1;

// III. System Cost Summaries
    const TotalPerAcre = Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct
        + OntoTruck4ResiduesWoMovein + Movein4Residues;
    const TotalPerBoleCCF = TotalPerAcre / BoleVolCCF;
    const TotalPerGT = TotalPerAcre / TotalPrimaryProductsAndOptionalResidues;

    return { 'TotalPerAcre': TotalPerAcre, 'TotalPerBoleCCF': TotalPerBoleCCF, 'TotalPerGT': TotalPerGT }
}

/**
 * @return {number}
 */

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
