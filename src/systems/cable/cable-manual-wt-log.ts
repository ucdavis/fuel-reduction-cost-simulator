// Outputs sheet: Cable Manual WT/Log column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { Loading } from '../methods/loading';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { CYCCU } from './methods/cyccu';
import { CYPCU } from './methods/cypcu';
import { FellwtChipLogOther } from './methods/fellwtchiplogother';

function CableManualWTLog(
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
  const ResidueRecoveredOptional = 0;
  const TotalPrimaryAndOptional = PrimaryProduct + ResidueRecoveredOptional;
  const TotalPrimaryProductsAndOptionalResidues =
    PrimaryProduct + ResidueRecoveredOptional;
  // Amounts Unrecovered and Left within the Stand Per Acre
  const GroundFuel =
    intermediate.ResidueALT +
    intermediate.ResidueCT * (1 - assumption.ResidueRecovFracWT);
  // Amounts Unrecovered and Left at the Landing
  const PiledFuel = 0;
  // TotalResidues
  const ResidueUncutTrees = 0;
  const TotalResidues =
    ResidueRecoveredPrimary +
    ResidueRecoveredOptional +
    ResidueUncutTrees +
    GroundFuel +
    PiledFuel;
  // Machine costs
  const machineCost: MachineCostMod = MachineCosts(input);
  // System Cost Elements-------
  const FellwtChipLogOtherResults = FellwtChipLogOther(
    input,
    intermediate,
    machineCost
  );
  const CostManFLBALT2 = FellwtChipLogOtherResults.CostManFLBALT2;
  const CostManFellCT2 = FellwtChipLogOtherResults.CostManFellCT2;
  const CostYardPCUB = CYPCU(assumption, input, intermediate, machineCost);
  const CostYardCCUB = CYCCU(input, intermediate, machineCost);
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
  // const ManualFellLimbBuckAllLogTrees = 0;
  // const ManualFellChipTrees = 0;
  // const CableYardUnbunchedAllTrees = 0;
  const ManualFellLimbBuckAllLogTrees =
    ((CostManFLBALT2 * intermediate.VolPerAcreALT) / 100);
  const ManualFellChipTrees =
    ((CostManFellCT2 * intermediate.VolPerAcreCT) / 100);
  const CableYardUnbunchedAllTrees =
    (((input.PartialCut === true
      ? CostYardPCUB
      : input.PartialCut === false
      ? CostYardCCUB
      : 0) *
      intermediate.VolPerAcre) /
      100);
  const LoadLogTrees =
    ((CostLoad * intermediate.VolPerAcreALT) / 100);
  const ChipWholeTrees =
    ((CostChipWT * intermediate.VolPerAcreCT) / 100);

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllLogTrees +
    ManualFellChipTrees +
    CableYardUnbunchedAllTrees +
    LoadLogTrees +
    ChipWholeTrees;
  // const Movein4PrimaryProduct = 0;
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFcableManualWTLog * BoleVolCCF
    : 0;

  const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues
      ? 0 * ResidueRecoveredOptional
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

export { CableManualWTLog };
