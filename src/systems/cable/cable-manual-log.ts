// Outputs sheet: Cable Manual Log column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod,
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { FellAllTrees } from '../methods/fellalltrees';
import { Loading } from '../methods/loading';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { CYCCU } from './methods/cyccu';
import { CYPCU } from './methods/cypcu';

function CableManualLog(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  assumption: AssumptionMod
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.VolPerAcre / 100;
  const ResidueRecoveredPrimary = 0;
  const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = 0;
  const TotalPrimaryProductsAndOptionalResidues =
    PrimaryProduct + ResidueRecoveredOptional;

  // Machine costs
  const machineCost: MachineCostMod = MachineCosts(input);
  // System Cost Elements-------
  const FellAllTreesResults = FellAllTrees(input, intermediate, machineCost);
  const CostManFLB = FellAllTreesResults.CostManFLB;
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
  const ManualFellLimbBuckAllTrees =
    (CostManFLB * intermediate.VolPerAcre) / 100;
  const CableYardUnbunchedAllTrees =
    ((input.PartialCut === true
      ? CostYardPCUB
      : input.PartialCut === false
      ? CostYardCCUB
      : 0) *
      intermediate.VolPerAcre) /
    100;
  const LoadLogTrees = (CostLoad * intermediate.VolPerAcreALT) / 100;
  const ChipTreeBoles =
    (CostChipWT *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllTrees +
    CableYardUnbunchedAllTrees +
    (input.ChipAll === false ? LoadLogTrees : 0) +
    ChipTreeBoles;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipTreeBoles +
    (ManualFellLimbBuckAllTrees + CableYardUnbunchedAllTrees) *
      (intermediate.BoleWtCT / intermediate.BoleWt);
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFcableManualLog * BoleVolCCF
    : 0;
  const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues ? 0 * ResidueRecoveredOptional : 0;

  // D. For All Products, gal/ac
  const ManualFellLimbBuckAllTrees2 =
    (GalChainsaw * intermediate.VolPerAcre) / 100;
  const CableYardUnbunchedAllTrees2 =
    ((input.PartialCut === true
      ? GalYardPCUB
      : input.PartialCut === false
      ? GalYardCCUB
      : 0) *
      intermediate.VolPerAcre) /
    100;
  const LoadLogTrees2 = (GalLoad * intermediate.VolPerAcreALT) / 100;
  const ChipTreeBoles2 =
    (GalChipWT *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    CableYardUnbunchedAllTrees2 +
    (input.ChipAll === false ? LoadLogTrees2 : 0) +
    +ChipTreeBoles2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    CableYardUnbunchedAllTrees2 *
      (intermediate.BoleWtCT / intermediate.BoleWt) +
    ChipTreeBoles2;
  const LowboyLoads = 3;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.CalcMoveIn
    ? (LowboyLoads * input.MoveInDist) / mpg / input.Area
    : 0;
  const GasolineStump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckAllTrees2;

  // III. Summaries
  const Total = {
    WeightPerAcre: 0,
    CostPerAcre: 0,
    CostPerBoleCCF: 0,
    CostPerGT: 0,
    DieselPerAcre: 0,
    DieselPerBoleCCF: 0,
    GasolinePerAcre: 0,
    GasolinePerBoleCCF: 0,
    JetFuelPerAcre: 0,
    JetFuelPerBoleCCF: 0
  };

  let Residue = {
    WeightPerAcre: 0,
    CostPerAcre: 0,
    CostPerBoleCCF: 0,
    CostPerGT: 0,
    DieselPerAcre: 0,
    DieselPerBoleCCF: 0,
    GasolinePerAcre: 0,
    GasolinePerBoleCCF: 0,
    JetFuelPerAcre: 0,
    JetFuelPerBoleCCF: 0
  };

  // System Summaries - Total
  Total.WeightPerAcre = TotalPrimaryProductsAndOptionalResidues;
  // Cost
  Total.CostPerAcre =
    Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct;
  Total.CostPerBoleCCF = Total.CostPerAcre / BoleVolCCF;
  Total.CostPerGT = Total.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Total.DieselPerAcre =
    DieselStump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct2;
  Total.DieselPerBoleCCF = Total.DieselPerAcre / BoleVolCCF;
  Total.GasolinePerAcre = GasolineStump2Truck4PrimaryProductWithoutMovein;
  Total.GasolinePerBoleCCF = Total.GasolinePerAcre / BoleVolCCF;

  // System Summaries - Residue
  // Cost
  Residue.WeightPerAcre =
    ResidueRecoveredOptional + intermediate.BoleWtCT + ResidueRecoveredPrimary;
  Residue.CostPerAcre = Stump2Truck4ResiduesWithoutMovein;
  Residue.CostPerBoleCCF = Residue.CostPerAcre / BoleVolCCF;
  Residue.CostPerGT = Residue.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Residue.DieselPerAcre = DieselStump2Truck4ResiduesWithoutMovein;
  Residue.DieselPerBoleCCF = Residue.DieselPerAcre / BoleVolCCF;
  Residue.GasolinePerAcre =
    ManualFellLimbBuckAllTrees2 * (intermediate.BoleWtCT / intermediate.BoleWt);
  Residue.GasolinePerBoleCCF = Residue.GasolinePerAcre / BoleVolCCF;

  if (input.ChipAll) {
    Residue = Total;
  }

  return {
    Total,
    Residue,
  };
}

export { CableManualLog };
