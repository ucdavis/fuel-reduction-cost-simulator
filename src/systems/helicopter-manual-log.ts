// Outputs sheet: Helicopter Manual Log column
import {
  Assumptions,
  FrcsInputs,
  FrcsOutputs,
  IntermediateVariables,
  MachineCosts,
} from '../model';
import { Chipping } from './methods/chipping';
import { FellAllTrees } from './methods/fellalltrees';
import { HelicopterYarding } from './methods/helicopteryarding';
import { Loading } from './methods/loading';
import { calculateMachineCosts } from './methods/machinecosts';
import { MoveInCosts } from './methods/moveincost';

export function helicopterManualLog(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  assumption: Assumptions
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.volPerAcre / 100;
  const ResidueRecoveredPrimary = 0;
  const PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = 0;
  const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;

  // Machine costs
  const machineCost: MachineCosts = calculateMachineCosts(
    input.dieselFuelPrice,
    input.wageFaller,
    input.wageOther,
    input.laborBenefits,
    input.ppiCurrent
  );
  // System Cost Elements-------
  const FellAllTreesResults = FellAllTrees(input, intermediate, machineCost);
  const CostManFLB = FellAllTreesResults.CostManFLB;
  const HelicopterYardingResults = HelicopterYarding(input, intermediate);
  const CostHeliYardML = HelicopterYardingResults.CostHeliYardML;
  const CostHeliLoadML = HelicopterYardingResults.CostHeliLoadML;
  const ChippingResults = Chipping(assumption, input, intermediate, machineCost);
  const CostChipWT = ChippingResults.CostChipWT;
  const MoveInCostsResults = MoveInCosts(
    input,
    intermediate,
    machineCost,
    assumption.ResidueRecovFracCTL
  );
  const CostChipLooseRes = ChippingResults.CostChipLooseRes;

  const GalChainsaw = 0.077797403;
  const GalHeliYardML = HelicopterYardingResults.GalHeliYardML;
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const GalLoad = LoadingResults.GalLoad;
  const GalHeliLoadML = GalLoad * 2;
  const GalChipWT = ChippingResults.GalChipWT;

  // C. For All Products, $/ac
  const ManualFellLimbBuckAllTrees = (CostManFLB * intermediate.volPerAcre) / 100;
  const HeliYardUnbunchedAllTrees = (CostHeliYardML * intermediate.volPerAcre) / 100;
  const LoadLogTrees = (CostHeliLoadML * intermediate.volPerAcreALT) / 100;
  const ChipTreeBoles =
    (CostChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllTrees +
    HeliYardUnbunchedAllTrees +
    (input.isBiomassSalvage === false ? LoadLogTrees : 0) +
    ChipTreeBoles;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipTreeBoles +
    (intermediate.boleWeight > 0
      ? (ManualFellLimbBuckAllTrees + HeliYardUnbunchedAllTrees) *
        (intermediate.boleWeightCT / intermediate.boleWeight)
      : 0);
  const Movein4PrimaryProduct = input.includeMoveInCosts
    ? MoveInCostsResults.CostPerCCFhManualLog * BoleVolCCF
    : 0;
  const ChipLooseResiduesFromLogTreesLess80cf = input.includeCostsCollectChipResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
  const Movein4Residues =
    input.includeMoveInCosts && input.includeCostsCollectChipResidues
      ? 0 * ResidueRecoveredOptional
      : 0;

  // D. For All Products, $/ac
  const ManualFellLimbBuckAllTrees2 = (GalChainsaw * intermediate.volPerAcre) / 100;
  const HeliYardUnbunchedAllTrees2 = (GalHeliYardML * intermediate.volPerAcre) / 100;
  const LoadLogTrees2 = (GalHeliLoadML * intermediate.volPerAcreALT) / 100;
  const ChipTreeBoles2 =
    (GalChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    (input.isBiomassSalvage === false ? LoadLogTrees2 : 0) + +ChipTreeBoles2;
  const DieselStump2Truck4ResiduesWithoutMovein = ChipTreeBoles2;
  const LowboyLoads = 3;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.includeMoveInCosts
    ? (LowboyLoads * 2 * input.moveInDistance) / mpg / input.area
    : 0;
  const GasolineStump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckAllTrees2;
  const GasolineStump2Truck4ResiduesWithoutMovein =
    intermediate.boleWeight > 0
      ? ManualFellLimbBuckAllTrees2 * (intermediate.boleWeightCT / intermediate.boleWeight)
      : 0;
  const JetFuelStump2Truck4PrimaryProductWithoutMovein = HeliYardUnbunchedAllTrees2;
  const JetFuelStump2Truck4ResiduesWithoutMovein =
    intermediate.boleWeight > 0
      ? HeliYardUnbunchedAllTrees2 * (intermediate.boleWeightCT / intermediate.boleWeight)
      : 0;

  // III. Summaries
  const frcsOutputs: FrcsOutputs = {
    total: {
      yieldPerAcre: 0,
      costPerAcre: 0,
      costPerBoleCCF: 0,
      costPerGT: 0,
      dieselPerAcre: 0,
      dieselPerBoleCCF: 0,
      gasolinePerAcre: 0,
      gasolinePerBoleCCF: 0,
      jetFuelPerAcre: 0,
      jetFuelPerBoleCCF: 0,
    },
    residual: {
      yieldPerAcre: 0,
      costPerAcre: 0,
      costPerBoleCCF: 0,
      costPerGT: 0,
      dieselPerAcre: 0,
      dieselPerBoleCCF: 0,
      gasolinePerAcre: 0,
      gasolinePerBoleCCF: 0,
      jetFuelPerAcre: 0,
      jetFuelPerBoleCCF: 0,
    },
  };

  // System Summaries - Total
  frcsOutputs.total.yieldPerAcre = TotalPrimaryProductsAndOptionalResidues;
  // Cost
  frcsOutputs.total.costPerAcre =
    Stump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct +
    OntoTruck4ResiduesWoMovein +
    Movein4Residues;
  frcsOutputs.total.costPerBoleCCF = frcsOutputs.total.costPerAcre / BoleVolCCF;
  frcsOutputs.total.costPerGT = frcsOutputs.total.costPerAcre / frcsOutputs.total.yieldPerAcre;
  // Fuel
  frcsOutputs.total.dieselPerAcre =
    DieselStump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct2;
  frcsOutputs.total.dieselPerBoleCCF = frcsOutputs.total.dieselPerAcre / BoleVolCCF;
  frcsOutputs.total.gasolinePerAcre = GasolineStump2Truck4PrimaryProductWithoutMovein;
  frcsOutputs.total.gasolinePerBoleCCF = frcsOutputs.total.gasolinePerAcre / BoleVolCCF;
  frcsOutputs.total.jetFuelPerAcre = JetFuelStump2Truck4PrimaryProductWithoutMovein;
  frcsOutputs.total.jetFuelPerBoleCCF = frcsOutputs.total.jetFuelPerAcre / BoleVolCCF;

  // System Summaries - Residue
  // Cost
  frcsOutputs.residual.yieldPerAcre =
    ResidueRecoveredOptional + intermediate.boleWeightCT + ResidueRecoveredPrimary;
  frcsOutputs.residual.costPerAcre = Stump2Truck4ResiduesWithoutMovein;
  frcsOutputs.residual.costPerBoleCCF = frcsOutputs.residual.costPerAcre / BoleVolCCF;
  frcsOutputs.residual.costPerGT =
    frcsOutputs.residual.costPerAcre / frcsOutputs.total.yieldPerAcre;
  // Fuel
  frcsOutputs.residual.dieselPerAcre = DieselStump2Truck4ResiduesWithoutMovein;
  frcsOutputs.residual.dieselPerBoleCCF = frcsOutputs.residual.dieselPerAcre / BoleVolCCF;
  frcsOutputs.residual.gasolinePerAcre = GasolineStump2Truck4ResiduesWithoutMovein;
  frcsOutputs.residual.gasolinePerBoleCCF = frcsOutputs.residual.gasolinePerAcre / BoleVolCCF;
  frcsOutputs.residual.jetFuelPerAcre = JetFuelStump2Truck4ResiduesWithoutMovein;
  frcsOutputs.residual.jetFuelPerBoleCCF = frcsOutputs.residual.jetFuelPerAcre / BoleVolCCF;

  if (input.isBiomassSalvage) {
    frcsOutputs.residual = frcsOutputs.total;
  }

  return frcsOutputs;
}
