// Outputs sheet: Ground-Based Mech WT column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { FellLargeLogTrees } from '../methods/felllargelogtrees';
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
    ? assumption.ResidueRecovFracWT * intermediate.ResidueSLT
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
  // Machine costs
  const machineCost: MachineCostMod = MachineCosts(input);
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
    (CostFellBunch * intermediate.VolPerAcreST) / 100;
  const ManualFellLimbBuckTreesLarger80cf =
    (CostManFLBLLT * intermediate.VolPerAcreLLT) / 100;
  const SkidBunchedAllTrees = (CostSkidBun * intermediate.VolPerAcre) / 100;
  const ProcessLogTreesLess80cf =
    (CostProcess * intermediate.VolPerAcreSLT) / 100;
  const LoadLogTrees = (CostLoad * intermediate.VolPerAcreALT) / 100;
  const ChipWholeTrees = (CostChipWT * intermediate.VolPerAcreCT) / 100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    FellAndBunchTreesLess80cf +
    ManualFellLimbBuckTreesLarger80cf +
    SkidBunchedAllTrees +
    ProcessLogTreesLess80cf +
    LoadLogTrees +
    ChipWholeTrees;
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFmechWT * BoleVolCCF
    : 0;

  const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues ? 0 * ResidueRecoveredOptional : 0;

  // III.0 Residue Cost Summaries
  const Residue = {
    ResidueWt: 0,
    ResiduePerGT: 0,
    ResiduePerAcre: 0
  };
  Residue.ResidueWt =
    ResidueRecoveredOptional + intermediate.BoleWtCT + intermediate.ResidueCT;
  Residue.ResiduePerAcre =
    OntoTruck4ResiduesWoMovein +
    ChipWholeTrees +
    FellAndBunchTreesLess80cf *
      (intermediate.BoleWtCT / intermediate.BoleWtST) +
    SkidBunchedAllTrees * (intermediate.BoleWtCT / intermediate.BoleWt);
  Residue.ResiduePerGT = Residue.ResiduePerAcre / Residue.ResidueWt;

  Residue.ResidueWt = Math.round(Residue.ResidueWt);
  Residue.ResiduePerAcre = Math.round(Residue.ResiduePerAcre);
  Residue.ResiduePerGT = Math.round(Residue.ResiduePerGT);

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
    TotalPerAcre: TotalPerAcreOut,
    Residue
  };
}

export { GroundMechWT };
