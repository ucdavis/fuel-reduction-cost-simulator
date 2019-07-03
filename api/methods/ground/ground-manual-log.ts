// Outputs sheet: Ground-Based Manual Log column
import { Chipping } from '../chipping';
import { Assumption, CostMachineMod, InputVarMod, IntermediateVarMod } from '../frcs.model';
import { InLimits } from '../inlimits';
import { Loading } from '../loading';
import { MachineCosts } from '../machinecosts';
import { MoveInCosts } from '../moveincost';
import { FellAllTrees } from './fellalltrees';
import { FellBunch } from './fellbunch';
import { Skidding } from './skidding';

function GroundManualLog(input: InputVarMod, intermediate: IntermediateVarMod, assumption: Assumption) {
// ----System Product Summary--------------
    // Amounts Recovered Per Acre
    const BoleVolCCF = intermediate.VolPerAcre / 100;
    const ResidueRecoveredPrimary = 0;
    const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
    const ResidueRecoveredOptional = 0;
    const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;

// Limits
    const InLimits1
    = InLimits(input.system, input.TreeVolCT, input.TreeVolSLT, input.TreeVolLLT,
               intermediate.TreeVolALT, intermediate.TreeVol, input.Slope);
// Machine costs
    const CostMachine: CostMachineMod = MachineCosts();
// System Cost Elements-------
    const FellBunchResults
    = FellBunch(input.Slope, intermediate.RemovalsST, intermediate.TreeVolST, intermediate.DBHST,
                intermediate.NonSelfLevelCabDummy, intermediate.CSlopeFB_Harv,
                intermediate.CRemovalsFB_Harv, intermediate.CHardwoodST, CostMachine);
    const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
    const SkiddingResults
    = Skidding(input.Slope, input.deliver_dist, intermediate.Removals, intermediate.TreeVol,
               intermediate.WoodDensity, assumption.LogLength, input.cut_type,
               intermediate.CSlopeSkidForwLoadSize, intermediate.LogsPerTree, intermediate.LogVol,
               intermediate.ManualMachineSize, intermediate.BFperCF, intermediate.ButtDiam, CostMachine,
               TreesPerCycleIIB, intermediate.CHardwood);
    const CostSkidUB = SkiddingResults.CostSkidUB;
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

    const FellAllTreesResults
    = FellAllTrees(input.Slope, intermediate.Removals, intermediate.TreeVol, input.cut_type, intermediate.DBH,
                   intermediate.LogsPerTree, CostMachine, intermediate.CHardwood);
    const CostManFLB = FellAllTreesResults.CostManFLB;

    // C. For All Products, $/ac
    const ManualFellLimbBuckAllTrees = CostManFLB * intermediate.VolPerAcre / 100 * InLimits1;
    console.log('InLimits1: ' + InLimits1);
    console.log('ManualFellLimbBuckAllTrees: ' + ManualFellLimbBuckAllTrees);
    const SkidUnbunchedAllTrees = CostSkidUB * intermediate.VolPerAcre / 100 * InLimits1;
    console.log('SkidUnbunchedAllTrees: ' + SkidUnbunchedAllTrees);
    const LoadLogTrees = CostLoad * intermediate.VolPerAcreALT / 100 * InLimits1;
    console.log('LoadLogTrees: ' + LoadLogTrees);
    const ChipTreeBoles = CostChipWT * intermediate.VolPerAcreCT / 100 * InLimits1;
    console.log('ChipTreeBoles: ' + ChipTreeBoles);

    const Stump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckAllTrees
        + SkidUnbunchedAllTrees + LoadLogTrees + ChipTreeBoles;
    const Movein4PrimaryProduct = input.CalcMoveIn ?
        MoveInCostsResults.CostPerCCFmanualLog * BoleVolCCF * InLimits1 : 0;

// III. System Cost Summaries
    const TotalPerAcre = Math.round(Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct);
    const TotalPerBoleCCF = Math.round(TotalPerAcre / BoleVolCCF);
    const TotalPerGT = Math.round(TotalPerAcre / TotalPrimaryProductsAndOptionalResidues);

    return { 'TotalPerBoleCCF': TotalPerBoleCCF, 'TotalPerGT': TotalPerGT, 'TotalPerAcre': TotalPerAcre };
}

export { GroundManualLog };
