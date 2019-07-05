// Outputs sheet: Ground-Based Manual Log column
import { Chipping } from '../chipping';
import { AssumptionMod, InputVarMod, IntermediateVarMod, MachineCostMod } from '../frcs.model';
import { InLimits } from '../inlimits';
import { Loading } from '../loading';
import { MachineCosts } from '../machinecosts';
import { MoveInCosts } from '../moveincost';
import { FellAllTrees } from './fellalltrees';
import { FellBunch } from './fellbunch';
import { Skidding } from './skidding';

function GroundManualLog(input: InputVarMod, intermediate: IntermediateVarMod, assumption: AssumptionMod) {
// ----System Product Summary--------------
    // Amounts Recovered Per Acre
    const BoleVolCCF = intermediate.VolPerAcre / 100;
    const ResidueRecoveredPrimary = 0;
    const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
    const ResidueRecoveredOptional = 0;
    const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;

// Limits
    const InLimits1 = InLimits(input, intermediate);
// Machine costs
    const machineCost: MachineCostMod = MachineCosts();
// System Cost Elements-------
    const FellBunchResults = FellBunch(input, intermediate, machineCost);
    const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
    const SkiddingResults = Skidding(input, intermediate, machineCost, TreesPerCycleIIB);
    const CostSkidUB = SkiddingResults.CostSkidUB;
    const LoadingResults = Loading(assumption, input, intermediate, machineCost);
    const CostLoad = LoadingResults.CostLoad;
    const ChippingResults = Chipping(assumption, input, intermediate, machineCost);
    const CostChipWT = ChippingResults.CostChipWT;
    const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
    const CostChipLooseRes = ChippingResults.CostChipLooseRes;

    const FellAllTreesResults = FellAllTrees(input, intermediate, machineCost);
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

    const Stump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckAllTrees + SkidUnbunchedAllTrees
        + LoadLogTrees + ChipTreeBoles;
    const Movein4PrimaryProduct = input.CalcMoveIn ?
        MoveInCostsResults.CostPerCCFmanualLog * BoleVolCCF * InLimits1 : 0;

// III. System Cost Summaries
    const TotalPerAcre = Math.round(Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct);
    const TotalPerBoleCCF = Math.round(TotalPerAcre / BoleVolCCF);
    const TotalPerGT = Math.round(TotalPerAcre / TotalPrimaryProductsAndOptionalResidues);

    return { 'TotalPerBoleCCF': TotalPerBoleCCF, 'TotalPerGT': TotalPerGT, 'TotalPerAcre': TotalPerAcre };
}

export { GroundManualLog };
