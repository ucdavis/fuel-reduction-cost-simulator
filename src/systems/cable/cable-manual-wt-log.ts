// Outputs sheet: Cable Manual WT/Log column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod,
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
  const CYPCUresults = CYPCU(assumption, input, intermediate, machineCost);
  const CostYardPCUB = CYPCUresults.CostYardPCUB;
  const CYCCUresults = CYCCU(input, intermediate, machineCost);
  const CostYardCCUB = CYCCUresults.CostYardCCUB;
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

  const GalChainsaw = 0.0104 * 2.83168 * 0.264172; // 0.0104 L/m3 => gal/CCF
  const GalYardPCUB = CYPCUresults.GalYardPCUB;
  const GalYardCCUB = CYCCUresults.GalYardCCUB;
  const GalLoad = LoadingResults.GalLoad;
  const GalChipWT = ChippingResults.GalChipWT;

  // C. For All Products, $/ac
  const ManualFellLimbBuckAllLogTrees =
    (CostManFLBALT2 * intermediate.VolPerAcreALT) / 100;
  const ManualFellChipTrees =
    (CostManFellCT2 * intermediate.VolPerAcreCT) / 100;
  const CableYardUnbunchedAllTrees =
    ((input.PartialCut === true
      ? CostYardPCUB
      : input.PartialCut === false
      ? CostYardCCUB
      : 0) *
      intermediate.VolPerAcre) /
    100;
  const LoadLogTrees = (CostLoad * intermediate.VolPerAcreALT) / 100;
  const ChipWholeTrees =
    (CostChipWT *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllLogTrees +
    ManualFellChipTrees +
    CableYardUnbunchedAllTrees +
    (input.ChipAll === false ? LoadLogTrees : 0) +
    ChipWholeTrees;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipWholeTrees +
    ManualFellChipTrees +
    CableYardUnbunchedAllTrees *
      ((intermediate.BoleWtCT + intermediate.ResidueCT) /
        (intermediate.BoleWt + intermediate.Residue));
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFcableManualWTLog * BoleVolCCF
    : 0;

  const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues ? 0 * ResidueRecoveredOptional : 0;

  // D. For All Products, gal/ac
  const ManualFellLimbBuckAllLogTrees2 =
    (GalChainsaw * intermediate.VolPerAcreALT) / 100;
  const ManualFellChipTrees2 = (GalChainsaw * intermediate.VolPerAcreCT) / 100;
  const CableYardUnbunchedAllTrees2 =
    ((input.PartialCut === true
      ? GalYardPCUB
      : input.PartialCut === false
      ? GalYardCCUB
      : 0) *
      intermediate.VolPerAcre) /
    100;
  const LoadLogTrees2 = (GalLoad * intermediate.VolPerAcreALT) / 100;
  const ChipWholeTrees2 =
    (GalChipWT *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    CableYardUnbunchedAllTrees2 +
    (input.ChipAll === false ? LoadLogTrees2 : 0) +
    +ChipWholeTrees2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    CableYardUnbunchedAllTrees2 *
      ((intermediate.BoleWtCT + intermediate.ResidueCT) /
        (intermediate.BoleWt + intermediate.Residue)) +
    ChipWholeTrees2;
  const GasolineStump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllLogTrees2 + ManualFellChipTrees2;
  const GasolineStump2Truck4ResiduesWithoutMovein = ManualFellChipTrees2;
  const LowboyLoads = 4;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.CalcMoveIn
    ? (LowboyLoads * input.MoveInDist) / mpg / input.Area
    : 0;

  // III. Summaries
  const Total = {
    WeightPerAcre: 0,
    CostPerAcre: 0,
    CostPerBoleCCF: 0,
    CostPerGT: 0,
    DieselPerAcre: 0,
    GasolinePerAcre: 0,
    JetFuelPerAcre: 0,
  };

  const Residue = {
    WeightPerAcre: 0,
    CostPerAcre: 0,
    CostPerBoleCCF: 0,
    CostPerGT: 0,
    DieselPerAcre: 0,
    GasolinePerAcre: 0,
    JetFuelPerAcre: 0,
  };

  // System Summaries - Total
  Total.WeightPerAcre = TotalPrimaryProductsAndOptionalResidues;
  // Cost
  Total.CostPerAcre =
    Stump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct +
    OntoTruck4ResiduesWoMovein +
    Movein4Residues;
  Total.CostPerBoleCCF = Total.CostPerAcre / BoleVolCCF;
  Total.CostPerGT = Total.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Total.DieselPerAcre =
    DieselStump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct2;
  Total.GasolinePerAcre = GasolineStump2Truck4PrimaryProductWithoutMovein;

  // System Summaries - Residue
  // Cost
  Residue.WeightPerAcre =
    ResidueRecoveredOptional + intermediate.BoleWtCT + ResidueRecoveredPrimary;
  Residue.CostPerAcre =
    OntoTruck4ResiduesWoMovein + Stump2Truck4ResiduesWithoutMovein;
  Residue.CostPerBoleCCF = Residue.CostPerAcre / BoleVolCCF;
  Residue.CostPerGT = Residue.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Residue.DieselPerAcre = DieselStump2Truck4ResiduesWithoutMovein;
  Residue.GasolinePerAcre = GasolineStump2Truck4ResiduesWithoutMovein;

  return {
    Total,
    Residue,
  };
}

export { CableManualWTLog };
