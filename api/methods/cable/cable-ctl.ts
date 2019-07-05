// Outputs sheet: Cable CTL column
import { Chipping } from '../chipping';
import { AssumptionMod, InputVarMod, IntermediateVarMod, MachineCostMod } from '../frcs.model';
import { Harvesting } from '../ground/harvesting';
import { InLimits } from '../inlimits';
import { Loading } from '../loading';
import { MachineCosts } from '../machinecosts';
import { MoveInCosts } from '../moveincost';
import { CYCTL } from './cyctl';

function CableCTL(input: InputVarMod, intermediate: IntermediateVarMod, assumption: AssumptionMod) {
// ----System Product Summary--------------
    // Amounts Recovered Per Acre
    const BoleVolCCF = intermediate.VolPerAcreST / 100;
    const ResidueRecoveredPrimary = 0;
    const PrimaryProduct = intermediate.BoleWtST + ResidueRecoveredPrimary;
    const ResidueRecoveredOptional = 0;
    const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;

// Limits
    const InLimits1 = InLimits(input, intermediate);
// Machine costs
    const machineCost: MachineCostMod = MachineCosts();
// System Cost Elements-------
    const CostHarvest = Harvesting(assumption, input, intermediate, machineCost);
    const CostYardCTL = CYCTL(assumption, input, intermediate, machineCost);
    const LoadingResults = Loading(assumption, input, intermediate, machineCost);
    const CostLoadCTL = LoadingResults.CostLoadCTL;
    const ChippingResults = Chipping(assumption, input, intermediate, machineCost);
    const CostChipWT = ChippingResults.CostChipWT;
    const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
    const CostChipBundledRes = ChippingResults.CostChipBundledRes;

    // C. For All Products, $/ac
    const HarvestTreesLess80cf = CostHarvest * intermediate.VolPerAcreST / 100 * InLimits1;
    const YardCTLtreesLess80cf = CostYardCTL * intermediate.VolPerAcreST / 100 * InLimits1;
    const LoadCTLlogTreesLess80cf = CostLoadCTL * intermediate.VolPerAcreSLT / 100 * InLimits1;
    const ChipTreeBoles = CostChipWT * intermediate.VolPerAcreCT / 100 * InLimits1;

    const Stump2Truck4PrimaryProductWithoutMovein = HarvestTreesLess80cf + YardCTLtreesLess80cf
        + LoadCTLlogTreesLess80cf + ChipTreeBoles;
    const Movein4PrimaryProduct = input.CalcMoveIn ?
        MoveInCostsResults.CostPerCCFcableCTL * BoleVolCCF * InLimits1 : 0;
    const ChipBundledResiduesFromTreesLess80cf = input.CalcResidues ?
        CostChipBundledRes * ResidueRecoveredOptional * InLimits1 : 0;
    const OntoTruck4ResiduesWoMovein = ChipBundledResiduesFromTreesLess80cf;
    const  Movein4Residues = (input.CalcMoveIn && input.CalcResidues) ?
        MoveInCostsResults.CostPerCCFbundleResidues * ResidueRecoveredOptional * InLimits1 : 0;

// III. System Cost Summaries
    const TotalPerAcre = Math.round(Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct
        + OntoTruck4ResiduesWoMovein + Movein4Residues);
    const TotalPerBoleCCF = Math.round(TotalPerAcre / BoleVolCCF);
    const TotalPerGT = Math.round(TotalPerAcre / TotalPrimaryProductsAndOptionalResidues);

    return { 'TotalPerBoleCCF': TotalPerBoleCCF, 'TotalPerGT': TotalPerGT, 'TotalPerAcre': TotalPerAcre };
}

export { CableCTL };
