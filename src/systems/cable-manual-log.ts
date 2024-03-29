// Outputs sheet: Cable Manual Log column
import {
  Assumptions,
  FrcsInputs,
  FrcsOutputs,
  IntermediateVariables,
  MachineCosts,
} from '../model';
import { Chipping } from './methods/chipping';
import { CYCCU } from './methods/cyccu';
import { CYPCU } from './methods/cypcu';
import { FellAllTrees } from './methods/fellalltrees';
import { Loading } from './methods/loading';
import { calculateMachineCosts } from './methods/machinecosts';
import { MoveInCosts } from './methods/moveincost';

export function cableManualLog(
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
  const CYPCUresults = CYPCU(assumption, input, intermediate, machineCost);
  const CostYardPCUB = CYPCUresults.CostYardPCUB;
  const CYCCUresults = CYCCU(input, intermediate, machineCost);
  const CostYardCCUB = CYCCUresults.CostYardCCUB;
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const CostLoad = LoadingResults.CostLoad;
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
  const GalYardPCUB = CYPCUresults.GalYardPCUB;
  const GalYardCCUB = CYCCUresults.GalYardCCUB;
  const GalLoad = LoadingResults.GalLoad;
  const GalChipWT = ChippingResults.GalChipWT;

  // C. For All Products, $/ac
  const ManualFellLimbBuckAllTrees = (CostManFLB * intermediate.volPerAcre) / 100;
  const CableYardUnbunchedAllTrees =
    ((input.isPartialCut === true
      ? CostYardPCUB
      : input.isPartialCut === false
      ? CostYardCCUB
      : 0) *
      intermediate.volPerAcre) /
    100;
  const LoadLogTrees = (CostLoad * intermediate.volPerAcreALT) / 100;
  const ChipTreeBoles =
    (CostChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllTrees +
    CableYardUnbunchedAllTrees +
    (input.isBiomassSalvage === false ? LoadLogTrees : 0) +
    ChipTreeBoles;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipTreeBoles +
    (intermediate.boleWeight > 0
      ? (ManualFellLimbBuckAllTrees + CableYardUnbunchedAllTrees) *
        (intermediate.boleWeightCT / intermediate.boleWeight)
      : 0);
  const Movein4PrimaryProduct = input.includeMoveInCosts
    ? MoveInCostsResults.CostPerCCFcableManualLog * BoleVolCCF
    : 0;
  const ChipLooseResiduesFromLogTreesLess80cf = input.includeCostsCollectChipResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
  const Movein4Residues =
    input.includeMoveInCosts && input.includeCostsCollectChipResidues
      ? 0 * ResidueRecoveredOptional
      : 0;

  // D. For All Products, gal/ac
  const ManualFellLimbBuckAllTrees2 = (GalChainsaw * intermediate.volPerAcre) / 100;
  const CableYardUnbunchedAllTrees2 =
    ((input.isPartialCut === true ? GalYardPCUB : input.isPartialCut === false ? GalYardCCUB : 0) *
      intermediate.volPerAcre) /
    100;
  const LoadLogTrees2 = (GalLoad * intermediate.volPerAcreALT) / 100;
  const ChipTreeBoles2 =
    (GalChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    CableYardUnbunchedAllTrees2 +
    (input.isBiomassSalvage === false ? LoadLogTrees2 : 0) +
    +ChipTreeBoles2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    (intermediate.boleWeight > 0
      ? CableYardUnbunchedAllTrees2 * (intermediate.boleWeightCT / intermediate.boleWeight)
      : 0) + ChipTreeBoles2;
  const LowboyLoads = 3;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.includeMoveInCosts
    ? (LowboyLoads * 2 * input.moveInDistance) / mpg / input.area
    : 0;
  const GasolineStump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckAllTrees2;

  // III. Summaries
  const frcsOutputs: FrcsOutputs = {
    totalBiomass: {
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
    feedstock: {
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
  frcsOutputs.totalBiomass.yieldPerAcre = TotalPrimaryProductsAndOptionalResidues;
  // Cost
  frcsOutputs.totalBiomass.costPerAcre = Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct;
  frcsOutputs.totalBiomass.costPerBoleCCF = frcsOutputs.totalBiomass.costPerAcre / BoleVolCCF;
  frcsOutputs.totalBiomass.costPerGT = frcsOutputs.totalBiomass.costPerAcre / frcsOutputs.totalBiomass.yieldPerAcre;
  // Fuel
  frcsOutputs.totalBiomass.dieselPerAcre =
    DieselStump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct2;
  frcsOutputs.totalBiomass.dieselPerBoleCCF = frcsOutputs.totalBiomass.dieselPerAcre / BoleVolCCF;
  frcsOutputs.totalBiomass.gasolinePerAcre = GasolineStump2Truck4PrimaryProductWithoutMovein;
  frcsOutputs.totalBiomass.gasolinePerBoleCCF = frcsOutputs.totalBiomass.gasolinePerAcre / BoleVolCCF;

  // System Summaries - Residue
  // Cost
  frcsOutputs.feedstock.yieldPerAcre =
    ResidueRecoveredOptional + intermediate.boleWeightCT + ResidueRecoveredPrimary;
  frcsOutputs.feedstock.costPerAcre = Stump2Truck4ResiduesWithoutMovein;
  frcsOutputs.feedstock.costPerBoleCCF = frcsOutputs.feedstock.costPerAcre / BoleVolCCF;
  frcsOutputs.feedstock.costPerGT =
    frcsOutputs.feedstock.costPerAcre / frcsOutputs.totalBiomass.yieldPerAcre;
  // Fuel
  frcsOutputs.feedstock.dieselPerAcre = DieselStump2Truck4ResiduesWithoutMovein;
  frcsOutputs.feedstock.dieselPerBoleCCF = frcsOutputs.feedstock.dieselPerAcre / BoleVolCCF;
  frcsOutputs.feedstock.gasolinePerAcre =
    intermediate.boleWeight > 0
      ? ManualFellLimbBuckAllTrees2 * (intermediate.boleWeightCT / intermediate.boleWeight)
      : 0;
  frcsOutputs.feedstock.gasolinePerBoleCCF = frcsOutputs.feedstock.gasolinePerAcre / BoleVolCCF;

  if (input.isBiomassSalvage) {
    frcsOutputs.feedstock = frcsOutputs.totalBiomass;
  }

  return frcsOutputs;
}
