// Outputs sheet: Ground-Based CTL column
import { Chipping } from '../chipping';
import { FellLargeLogTrees } from '../felllargelogtrees';
import { Assumption, CostMachineMod, InputVarMod, IntermediateVarMod } from '../frcs.model';
import { InLimits } from '../inlimits';
import { Loading } from '../loading';
import { MachineCosts } from '../machinecosts';
import { MoveInCosts } from '../moveincost';
import { Processing } from '../processing';
import { FellBunch } from './fellbunch';
import { Harvesting } from './harvesting';
import { Skidding } from './skidding';

function GroundCTL(input: InputVarMod, intermediate: IntermediateVarMod, assumption: Assumption) {
// ----System Product Summary--------------
    // Amounts Recovered Per Acre
    const BoleVolCCF = intermediate.VolPerAcreST / 100;
    const ResidueRecoveredPrimary = 0;
    const PrimaryProduct = intermediate.BoleWtST + ResidueRecoveredPrimary;
    const ResidueRecoveredOptional = input.CalcResidues ? (assumption.ResidueRecovFracCTL * intermediate.ResidueST) : 0;
    const TotalPrimaryAndOptional = PrimaryProduct + ResidueRecoveredOptional;
    const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
    // Amounts Unrecovered and Left within the Stand Per Acre
    const UncutTreesLarger80cf = intermediate.VolPerAcreLLT / 100;
    const ResiduesUncutTreesLarger80cf = intermediate.ResidueLLT;
    const GroundFuel = input.CalcResidues ?
        intermediate.ResidueST * (1 - assumption.ResidueRecovFracCTL) : intermediate.ResidueST;
    // Amounts Unrecovered and Left at the Landing
    const PiledFuel = 0;
    // TotalResidues
    const ResidueUncutTrees = 0;
    const TotalResidues = ResidueRecoveredPrimary + ResidueRecoveredOptional
        + ResidueUncutTrees + GroundFuel + PiledFuel;
// Limits
    const InLimits1
    = InLimits(input.system, input.TreeVolCT, input.TreeVolSLT, input.TreeVolLLT,
               intermediate.TreeVolALT, intermediate.TreeVol, input.Slope, input.RemovalsLLT, intermediate.RemovalsALT);
// Machine costs
    const CostMachine: CostMachineMod = MachineCosts();
// System Cost Elements-------
    const CostHarvest = Harvesting(input.Slope, intermediate.RemovalsST, intermediate.TreeVolST,
                                   assumption.CTLTrailSpacing, input.cut_type, intermediate.DBHST,
                                   intermediate.ButtDiamST, intermediate.CTLLogsPerTree,
                                   intermediate.MechMachineSize, intermediate.CSlopeFB_Harv,
                                   intermediate.CRemovalsFB_Harv, intermediate.DBH,
                                   CostMachine, intermediate.CHardwoodST);
    const FellBunchResults
    = FellBunch(input.Slope, intermediate.RemovalsST, intermediate.TreeVolST, intermediate.DBHST,
                intermediate.NonSelfLevelCabDummy, intermediate.CSlopeFB_Harv,
                intermediate.CRemovalsFB_Harv, intermediate.CHardwoodST, CostMachine);
    const CostFellBunch = FellBunchResults.CostFellBunch;
    const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
    const CostManFLBLLT
    = FellLargeLogTrees(input.Slope, input.RemovalsLLT, input.TreeVolLLT, intermediate.TreeVol,
                        input.cut_type, intermediate.DBHLLT, intermediate.LogsPerTreeLLT,
                        intermediate.CHardwoodLLT, CostMachine);
    const SkiddingResults
    = Skidding(input.Slope, input.deliver_dist, intermediate.Removals, intermediate.TreeVol,
               intermediate.WoodDensity, assumption.LogLength, input.cut_type,
               intermediate.CSlopeSkidForwLoadSize, intermediate.LogsPerTree, intermediate.LogVol,
               intermediate.ManualMachineSize, intermediate.BFperCF, intermediate.ButtDiam, CostMachine,
               TreesPerCycleIIB, intermediate.CHardwood);
    const CostSkidBun = SkiddingResults.CostSkidBun;
    const CostProcess = Processing(input.TreeVolSLT, intermediate.DBHSLT, intermediate.ButtDiamSLT,
                                   intermediate.LogsPerTreeSLT, intermediate.MechMachineSize,
                                   CostMachine, intermediate.CHardwoodSLT);
    const CostLoad = Loading(assumption.LoadWeightLog, intermediate.WoodDensityALT, intermediate.WoodDensitySLT,
                             intermediate.CTLLogVol, intermediate.LogVolALT,
                             intermediate.DBHALT, intermediate.DBHSLT, intermediate.ManualMachineSizeALT, CostMachine,
                             input.load_cost, intermediate.TreeVolALT, intermediate.CHardwoodALT, input.TreeVolSLT,
                             intermediate.CHardwoodSLT);
    const ChippingResults = Chipping(input.TreeVolCT, intermediate.WoodDensityCT, assumption.LoadWeightChip,
                                     assumption.MoistureContent, intermediate.CHardwoodCT, CostMachine,
                                     intermediate.CTLLogVolCT, intermediate.ChipperSize);
    const CostChipWT = ChippingResults.CostChipWT;
    const MoveInCostsResults
        = MoveInCosts(input.Area, input.MoveInDist, intermediate.TreeVol, intermediate.Removals,
                      intermediate.VolPerAcreCT, CostMachine);
    const CostChipLooseRes = ChippingResults.CostChipLooseRes;

    // C. For All Products, $/ac
    const HarvestTreesLess80cf = CostHarvest * intermediate.VolPerAcreST / 100 * InLimits1;
    console.log('HarvestTreesLess80cf = ' + HarvestTreesLess80cf);
    const ForwardTreesLess80cf = CostForward * intermediate.VolPerAcreST / 100 * InLimits1;
    const LoadCTLlogTreesLess80cf = CostLoadCTL * intermediate.VolPerAcreSLT / 100 * InLimits1;
    const ChipCTLChipTreeBoles = CostChipCTL * intermediate.VolPerAcreCT / 100 * InLimits1;

    const Stump2Truck4PrimaryProductWithoutMovein = HarvestTreesLess80cf + ForwardTreesLess80cf
        + LoadCTLlogTreesLess80cf + ChipCTLChipTreeBoles;
    const Movein4PrimaryProduct = input.CalcMoveIn ?
        MoveInCostsResults.CostPerCCFgroundCTL * BoleVolCCF * InLimits1 : 0;

    const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues ? CostChipLooseRes
        * ResidueRecoveredOptional * InLimits1 : 0;
    const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
    const  Movein4Residues = (input.CalcMoveIn && input.CalcResidues) ?
        0 * ResidueRecoveredOptional * InLimits1 : 0;

// III. System Cost Summaries
    const TotalPerAcre = Math.round(Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct
        + OntoTruck4ResiduesWoMovein + Movein4Residues);
    const TotalPerBoleCCF = Math.round(TotalPerAcre / BoleVolCCF);
    const TotalPerGT = Math.round(TotalPerAcre / TotalPrimaryProductsAndOptionalResidues);

    return { 'TotalPerBoleCCF': TotalPerBoleCCF, 'TotalPerGT': TotalPerGT, 'TotalPerAcre': TotalPerAcre };
}

export { GroundCTL };
