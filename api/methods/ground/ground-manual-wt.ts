// Outputs sheet: Ground-Based Manual WT column
import { Chipping } from '../chipping';
import { Assumption, CostMachineMod, InputVarMod, IntermediateVarMod } from '../frcs.model';
import { InLimits } from '../inlimits';
import { Loading } from '../loading';
import { MachineCosts } from '../machinecosts';
import { MoveInCosts } from '../moveincost';
import { Processing } from '../processing';
import { FellBunch } from './fellbunch';
import { FellwtSmallLogOther } from './fellwtsmalllogother';
import { Skidding } from './skidding';

function GroundManualWT(input: InputVarMod, intermediate: IntermediateVarMod, assumption: Assumption) {
// ----System Product Summary--------------
    // Amounts Recovered Per Acre
    const BoleVolCCF = intermediate.VolPerAcre / 100;
    const ResidueRecoveredPrimary = assumption.ResidueRecovFracWT * intermediate.ResidueCT;
    const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
    const ResidueRecoveredOptional = input.CalcResidues ? (assumption.ResidueRecovFracWT * intermediate.ResidueSLT)
        + (assumption.ResidueRecovFracWT * intermediate.ResidueLLT) : 0;
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
    const FellwtSmallLogOtherResults = FellwtSmallLogOther(input.Slope, intermediate.Removals, intermediate.TreeVolST,
                                                           input.TreeVolLLT, input.cut_type, intermediate.DBHST,
                                                           intermediate.DBHLLT, intermediate.LogsPerTreeST,
                                                           intermediate.LogsPerTreeLLT, CostMachine,
                                                           intermediate.CHardwoodST, intermediate.CHardwoodLLT);
    const CostManFLBLLT2 = FellwtSmallLogOtherResults.CostManFLBLLT2;
    const CostManFellST2 = FellwtSmallLogOtherResults.CostManFellST2;
    const SkiddingResults
    = Skidding(input.Slope, input.deliver_dist, intermediate.Removals, intermediate.TreeVol,
               intermediate.WoodDensity, assumption.LogLength, input.cut_type,
               intermediate.CSlopeSkidForwLoadSize, intermediate.LogsPerTree, intermediate.LogVol,
               intermediate.ManualMachineSize, intermediate.BFperCF, intermediate.ButtDiam, CostMachine,
               TreesPerCycleIIB, intermediate.CHardwood);
    const CostSkidUB = SkiddingResults.CostSkidUB;
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
    const ManualFellLimbBuckTreesLarger80cf = CostManFLBLLT2 * intermediate.VolPerAcreLLT / 100 * InLimits1;
    const ManualFellTreesLess80cf = CostManFellST2 * intermediate.VolPerAcreST / 100 * InLimits1;
    const SkidUnbunchedAllTrees = CostSkidUB * intermediate.VolPerAcre / 100 * InLimits1;
    const ProcessLogTreesLess80cf = CostProcess * intermediate.VolPerAcreSLT / 100 * InLimits1;
    const LoadLogTrees = CostLoad * intermediate.VolPerAcreALT / 100 * InLimits1;
    const ChipWholeTrees = CostChipWT * intermediate.VolPerAcreCT / 100 * InLimits1;

    const Stump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckTreesLarger80cf
        + ManualFellTreesLess80cf + SkidUnbunchedAllTrees
        + ProcessLogTreesLess80cf + LoadLogTrees + ChipWholeTrees;
    const Movein4PrimaryProduct = input.CalcMoveIn ? MoveInCostsResults.CostPerCCFmanualWT * BoleVolCCF * InLimits1 : 0;

    const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues ? CostChipLooseRes
        * ResidueRecoveredOptional * InLimits1 : 0;
    const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf; // for Mech WT sys;
    const  Movein4Residues = (input.CalcMoveIn && input.CalcResidues) ?
        0 * ResidueRecoveredOptional * InLimits1 : 0;

// III. System Cost Summaries
    const TotalPerAcre = Math.round(Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct
        + OntoTruck4ResiduesWoMovein + Movein4Residues);
    const TotalPerBoleCCF = Math.round(TotalPerAcre / BoleVolCCF);
    const TotalPerGT = Math.round(TotalPerAcre / TotalPrimaryProductsAndOptionalResidues);

    return { 'TotalPerBoleCCF': TotalPerBoleCCF, 'TotalPerGT': TotalPerGT, 'TotalPerAcre': TotalPerAcre };
}

export { GroundManualWT };
