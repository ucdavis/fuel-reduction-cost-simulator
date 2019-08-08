// Outputs sheet: Ground-Based Mech WT column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { FellLargeLogTrees } from '../methods/felllargelogtrees';
import { InLimits } from '../methods/inlimits';
import { Loading } from '../methods/loading';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { Processing } from '../methods/processing';
import { FellBunch } from './methods/fellbunch';
import { Skidding } from './methods/skidding';

function GroundMechWT(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  assumption: AssumptionMod
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.VolPerAcre / 100;
  const ResidueRecoveredPrimary =
    assumption.ResidueRecovFracWT * intermediate.ResidueCT;
  const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = input.CalcResidues
    ? assumption.ResidueRecovFracWT * intermediate.ResidueSLT +
      assumption.ResidueRecovFracWT * intermediate.ResidueLLT
    : 0;
  const TotalPrimaryAndOptional = PrimaryProduct + ResidueRecoveredOptional;
  const TotalPrimaryProductsAndOptionalResidues =
    PrimaryProduct + ResidueRecoveredOptional;
  // Amounts Unrecovered and Left within the Stand Per Acre
  const GroundFuel =
    intermediate.ResidueLLT +
    intermediate.ResidueST * (1 - assumption.ResidueRecovFracWT);
  // Amounts Unrecovered and Left at the Landing
  const PiledFuel = input.CalcResidues
    ? 0
    : intermediate.ResidueSLT * assumption.ResidueRecovFracWT;
  // TotalResidues
  const ResidueUncutTrees = 0;
  const TotalResidues =
    ResidueRecoveredPrimary +
    ResidueRecoveredOptional +
    ResidueUncutTrees +
    GroundFuel +
    PiledFuel;
  // Limits
  const InLimits1 = InLimits(input, intermediate);
  // Machine costs
  const machineCost: MachineCostMod = MachineCosts();
  // System Cost Elements-------
  const FellBunchResults = FellBunch(input, intermediate, machineCost);
  const CostFellBunch = FellBunchResults.CostFellBunch;
  const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
  const CostManFLBLLT = FellLargeLogTrees(input, intermediate, machineCost);
  const SkiddingResults = Skidding(
    input,
    intermediate,
    machineCost,
    TreesPerCycleIIB
  );
  const CostSkidBun = SkiddingResults.CostSkidBun;
  const CostProcess = Processing(input, intermediate, machineCost);
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const CostLoad = LoadingResults.CostLoad;
  const ChippingResults = Chipping(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostChipWT = ChippingResults.CostChipWT;
  const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
  const CostChipLooseRes = ChippingResults.CostChipLooseRes;

  // C. For All Products, $/ac
  const FellAndBunchTreesLess80cf =
    ((CostFellBunch * intermediate.VolPerAcreST) / 100) * InLimits1;
  const ManualFellLimbBuckTreesLarger80cf =
    ((CostManFLBLLT * intermediate.VolPerAcreLLT) / 100) * InLimits1;
  const SkidBunchedAllTrees =
    ((CostSkidBun * intermediate.VolPerAcre) / 100) * InLimits1;
  const ProcessLogTreesLess80cf =
    ((CostProcess * intermediate.VolPerAcreSLT) / 100) * InLimits1;
  const LoadLogTrees =
    ((CostLoad * intermediate.VolPerAcreALT) / 100) * InLimits1;
  const ChipWholeTrees =
    ((CostChipWT * intermediate.VolPerAcreCT) / 100) * InLimits1;

  const Stump2Truck4PrimaryProductWithoutMovein =
    FellAndBunchTreesLess80cf +
    ManualFellLimbBuckTreesLarger80cf +
    SkidBunchedAllTrees +
    ProcessLogTreesLess80cf +
    LoadLogTrees +
    ChipWholeTrees;
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFmechWT * BoleVolCCF * InLimits1
    : 0;

  const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues
    ? CostChipLooseRes * ResidueRecoveredOptional * InLimits1
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues
      ? 0 * ResidueRecoveredOptional * InLimits1
      : 0;

  // III. System Cost Summaries
  const TotalPerAcre =
    Stump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct +
    OntoTruck4ResiduesWoMovein +
    Movein4Residues;
  const TotalPerBoleCCF = TotalPerAcre / BoleVolCCF;
  const TotalPerGT = TotalPerAcre / TotalPrimaryProductsAndOptionalResidues;

  const TotalPerAcreOut = Math.round(TotalPerAcre);
  const TotalPerBoleCCFout = Math.round(TotalPerBoleCCF);
  const TotalPerGTout = Math.round(TotalPerGT);

  return {
    TotalPerBoleCCF: TotalPerBoleCCFout,
    TotalPerGT: TotalPerGTout,
    TotalPerAcre: TotalPerAcreOut
  };
}

export { GroundMechWT };
