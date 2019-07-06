// Outputs sheet: Helicopter Manual WT column
import { AssumptionMod, InputVarMod, IntermediateVarMod, MachineCostMod } from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { FellAllTrees } from '../methods/fellalltrees';
import { InLimits } from '../methods/inlimits';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { HelicopterYarding } from './methods/helicopteryarding';

function HelicopterManualWT(input: InputVarMod, intermediate: IntermediateVarMod, assumption: AssumptionMod) {
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
    const FellAllTreesResults = FellAllTrees(input, intermediate, machineCost);
    const CostManFLB = FellAllTreesResults.CostManFLB;
    const HelicopterYardingResults = HelicopterYarding(input, intermediate);
    const CostHeliYardML = HelicopterYardingResults.CostHeliYardML;
    const CostHeliLoadML = HelicopterYardingResults.CostHeliLoadML;
    const ChippingResults = Chipping(assumption, input, intermediate, machineCost);
    const CostChipWT = ChippingResults.CostChipWT;
    const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
    const CostChipLooseRes = ChippingResults.CostChipLooseRes;

    // C. For All Products, $/ac
    const ManualFellLimbBuckAllTrees = CostManFLB * intermediate.VolPerAcre / 100 * InLimits1;
    const YardUnbunchedAllTrees = CostHeliYardML * intermediate.VolPerAcre / 100 * InLimits1;
    const LoadLogTrees = CostHeliLoadML * intermediate.VolPerAcreALT / 100 * InLimits1;
    const ChipWholeTrees = CostChipWT * intermediate.VolPerAcreCT / 100 * InLimits1;

    const Stump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckAllTrees
        + YardUnbunchedAllTrees + LoadLogTrees + ChipWholeTrees;
    const Movein4PrimaryProduct = input.CalcMoveIn ?
        MoveInCostsResults.CostPerCCFhManualLog * BoleVolCCF * InLimits1 : 0;
    const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues ?
        CostChipLooseRes * ResidueRecoveredOptional * InLimits1 : 0;
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

export { HelicopterManualWT };
