// Outputs sheet: Ground-Based Mech WT column
import { Chipping } from '../chipping';
import { Assumption, CostMachineMod, InputVarMod, IntermediateVarMod } from '../frcs.model';
import { InLimits } from '../inlimits';
import { Loading } from '../loading';
import { MachineCosts } from '../machinecosts';
import { MoveInCosts } from '../moveincost';
import { CYCCU } from './cyccu';
import { CYPCU } from './cypcu';
import { FellwtChipLogOther } from './fellwtchiplogother';

function CableManualWTLog(input: InputVarMod, intermediate: IntermediateVarMod, assumption: Assumption) {
// ----System Product Summary--------------
    // Amounts Recovered Per Acre
    const BoleVolCCF = intermediate.VolPerAcre / 100;
    const ResidueRecoveredPrimary = assumption.ResidueRecovFracWT * intermediate.ResidueCT;
    const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
    const ResidueRecoveredOptional = 0;
    const TotalPrimaryAndOptional = PrimaryProduct + ResidueRecoveredOptional;
    const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
    // Amounts Unrecovered and Left within the Stand Per Acre
    const GroundFuel = intermediate.ResidueALT + intermediate.ResidueCT * (1 - assumption.ResidueRecovFracWT);
    // Amounts Unrecovered and Left at the Landing
    const PiledFuel = 0;
    // TotalResidues
    const ResidueUncutTrees = 0;
    const TotalResidues = ResidueRecoveredPrimary + ResidueRecoveredOptional
        + ResidueUncutTrees + GroundFuel + PiledFuel;
// Limits
    const InLimits1
    = InLimits(input, intermediate);
// Machine costs
    const CostMachine: CostMachineMod = MachineCosts();
// System Cost Elements-------
    const FellwtChipLogOtherResults = FellwtChipLogOther(input, intermediate, CostMachine);
    const CostManFLBALT2 = FellwtChipLogOtherResults.CostManFLBALT2;
    const CostManFellCT2 = FellwtChipLogOtherResults.CostManFellCT2;
    const CostYardPCUB = CYPCU(input, intermediate, CostMachine, assumption);
    const CostYardCCUB = CYCCU(input, intermediate, CostMachine, assumption);
    const LoadingResults = Loading(assumption.LoadWeightLog, intermediate.WoodDensityALT, intermediate.WoodDensitySLT,
                                   intermediate.CTLLogVol, intermediate.LogVolALT, intermediate.DBHALT,
                                   intermediate.DBHSLT, intermediate.ManualMachineSizeALT, CostMachine,
                                   input.load_cost, intermediate.TreeVolALT, intermediate.CHardwoodALT,
                                   input.TreeVolSLT, intermediate.CHardwoodSLT);
    const CostLoad = LoadingResults.CostLoad;
    const ChippingResults = Chipping(input.TreeVolCT, intermediate.WoodDensityCT, assumption.LoadWeightChip,
                                     assumption.MoistureContent, intermediate.CHardwoodCT, CostMachine,
                                     intermediate.CTLLogVolCT, intermediate.ChipperSize);
    const CostChipWT = ChippingResults.CostChipWT;
    const MoveInCostsResults
        = MoveInCosts(input.Area, input.MoveInDist, intermediate.TreeVol, intermediate.TreeVolST, intermediate.Removals,
                      intermediate.RemovalsST, intermediate.VolPerAcreCT, CostMachine);
    const CostChipLooseRes = ChippingResults.CostChipLooseRes;

    // C. For All Products, $/ac
    // const ManualFellLimbBuckAllLogTrees = 0;
    // const ManualFellChipTrees = 0;
    // const YardUnbunchedAllTrees = 0;
    const ManualFellLimbBuckAllLogTrees = CostManFLBALT2 * intermediate.VolPerAcreALT / 100 * InLimits1;
    const ManualFellChipTrees = CostManFellCT2 * intermediate.VolPerAcreCT / 100 * InLimits1;
    const YardUnbunchedAllTrees = (input.cut_type === true ?
        CostYardPCUB : (input.cut_type === false ? CostYardCCUB : 0)) * intermediate.VolPerAcre / 100 * InLimits1;
    const LoadLogTrees = CostLoad * intermediate.VolPerAcreALT / 100 * InLimits1;
    const ChipWholeTrees = CostChipWT * intermediate.VolPerAcreCT / 100 * InLimits1;

    const Stump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckAllLogTrees
        + ManualFellChipTrees + YardUnbunchedAllTrees + LoadLogTrees + ChipWholeTrees;
    // const Movein4PrimaryProduct = 0;
    const Movein4PrimaryProduct = input.CalcMoveIn ?
        MoveInCostsResults.CostPerCCFcableManualWTLog * BoleVolCCF * InLimits1 : 0;

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

export { CableManualWTLog };
