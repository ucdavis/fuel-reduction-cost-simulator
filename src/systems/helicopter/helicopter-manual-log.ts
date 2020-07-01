// Outputs sheet: Helicopter Manual Log column
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
import { HelicopterYarding } from './methods/helicopteryarding';

function HelicopterManualLog(
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
  const HelicopterYardingResults = HelicopterYarding(input, intermediate);
  const CostHeliYardML = HelicopterYardingResults.CostHeliYardML;
  const CostHeliLoadML = HelicopterYardingResults.CostHeliLoadML;
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
  const GalHeliYardML = HelicopterYardingResults.GalHeliYardML;
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const GalLoad = LoadingResults.GalLoad;
  const GalHeliLoadML = GalLoad * 2;
  const GalChipWT = ChippingResults.GalChipWT;

  // C. For All Products, $/ac
  const ManualFellLimbBuckAllTrees =
    (CostManFLB * intermediate.VolPerAcre) / 100;
  const HeliYardUnbunchedAllTrees =
    (CostHeliYardML * intermediate.VolPerAcre) / 100;
  const LoadLogTrees = (CostHeliLoadML * intermediate.VolPerAcreALT) / 100;
  const ChipTreeBoles =
    (CostChipWT *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllTrees +
    HeliYardUnbunchedAllTrees +
    (input.ChipAll === false ? LoadLogTrees : 0) +
    ChipTreeBoles;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipTreeBoles +
    (ManualFellLimbBuckAllTrees + HeliYardUnbunchedAllTrees) *
      (intermediate.BoleWtCT / intermediate.BoleWt);
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFhManualLog * BoleVolCCF
    : 0;
  const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues ? 0 * ResidueRecoveredOptional : 0;

  // D. For All Products, $/ac
  const ManualFellLimbBuckAllTrees2 =
    (GalChainsaw * intermediate.VolPerAcre) / 100;
  const HeliYardUnbunchedAllTrees2 =
    (GalHeliYardML * intermediate.VolPerAcre) / 100;
  const LoadLogTrees2 = (GalHeliLoadML * intermediate.VolPerAcreALT) / 100;
  const ChipTreeBoles2 =
    (GalChipWT *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    (input.ChipAll === false ? LoadLogTrees2 : 0) + +ChipTreeBoles2;
  const DieselStump2Truck4ResiduesWithoutMovein = ChipTreeBoles2;
  const LowboyLoads = 3;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.CalcMoveIn
    ? (LowboyLoads * input.MoveInDist) / mpg / input.Area
    : 0;
  const GasolineStump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckAllTrees2;
  const GasolineStump2Truck4ResiduesWithoutMovein =
    ManualFellLimbBuckAllTrees2 * (intermediate.BoleWtCT / intermediate.BoleWt);
  const JetFuelStump2Truck4PrimaryProductWithoutMovein = HeliYardUnbunchedAllTrees2;
  const JetFuelStump2Truck4ResiduesWithoutMovein =
    HeliYardUnbunchedAllTrees2 * (intermediate.BoleWtCT / intermediate.BoleWt);

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
  Total.JetFuelPerAcre = JetFuelStump2Truck4PrimaryProductWithoutMovein;

  // System Summaries - Residue
  // Cost
  Residue.WeightPerAcre =
    ResidueRecoveredOptional + intermediate.BoleWtCT + ResidueRecoveredPrimary;
  Residue.CostPerAcre = Stump2Truck4ResiduesWithoutMovein;
  Residue.CostPerBoleCCF = Residue.CostPerAcre / BoleVolCCF;
  Residue.CostPerGT = Residue.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Residue.DieselPerAcre = DieselStump2Truck4ResiduesWithoutMovein;
  Residue.GasolinePerAcre = GasolineStump2Truck4ResiduesWithoutMovein;
  Residue.JetFuelPerAcre = JetFuelStump2Truck4ResiduesWithoutMovein;

  return {
    Total,
    Residue,
  };
}

export { HelicopterManualLog };
