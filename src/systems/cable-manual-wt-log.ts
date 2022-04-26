// Outputs sheet: Cable Manual WT/Log column
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
import { FellwtChipLogOther } from './methods/fellwtchiplogother';
import { Loading } from './methods/loading';
import { calculateMachineCosts } from './methods/machinecosts';
import { MoveInCosts } from './methods/moveincost';

export function cableManualWTLog(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  assumption: Assumptions
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.volPerAcre / 100;
  const ResidueRecoveredPrimary = assumption.ResidueRecovFracWT * intermediate.residueCT;
  const PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = 0;
  const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
  // Amounts Unrecovered and Left within the Stand Per Acre
  const GroundFuel =
    intermediate.residueALT + intermediate.residueCT * (1 - assumption.ResidueRecovFracWT);
  // Amounts Unrecovered and Left at the Landing
  const PiledFuel = 0;
  // TotalResidues
  const ResidueUncutTrees = 0;
  const TotalResidues =
    ResidueRecoveredPrimary + ResidueRecoveredOptional + ResidueUncutTrees + GroundFuel + PiledFuel;
  // Machine costs
  const machineCost: MachineCosts = calculateMachineCosts(
    input.dieselFuelPrice,
    input.wageFaller,
    input.wageOther,
    input.laborBenefits,
    input.ppiCurrent
  );
  // System Cost Elements-------
  const FellwtChipLogOtherResults = FellwtChipLogOther(input, intermediate, machineCost);
  const CostManFLBALT2 = FellwtChipLogOtherResults.CostManFLBALT2;
  const CostManFellCT2 = FellwtChipLogOtherResults.CostManFellCT2;
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
  const ManualFellLimbBuckAllLogTrees = (CostManFLBALT2 * intermediate.volPerAcreALT) / 100;
  const ManualFellChipTrees = (CostManFellCT2 * intermediate.volPerAcreCT) / 100;
  const CableYardUnbunchedAllTrees =
    ((input.isPartialCut === true
      ? CostYardPCUB
      : input.isPartialCut === false
      ? CostYardCCUB
      : 0) *
      intermediate.volPerAcre) /
    100;
  const LoadLogTrees = (CostLoad * intermediate.volPerAcreALT) / 100;
  const ChipWholeTrees =
    (CostChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllLogTrees +
    ManualFellChipTrees +
    CableYardUnbunchedAllTrees +
    (input.isBiomassSalvage === false ? LoadLogTrees : 0) +
    ChipWholeTrees;
  const weightCT = intermediate.boleWeightCT + intermediate.residueCT;
  const weightAT = intermediate.boleWeight + intermediate.residue;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipWholeTrees +
    ManualFellChipTrees +
    (weightAT > 0 ? CableYardUnbunchedAllTrees * (weightCT / weightAT) : 0);
  const Movein4PrimaryProduct = input.includeMoveInCosts
    ? MoveInCostsResults.CostPerCCFcableManualWTLog * BoleVolCCF
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
  const ManualFellLimbBuckAllLogTrees2 = (GalChainsaw * intermediate.volPerAcreALT) / 100;
  const ManualFellChipTrees2 = (GalChainsaw * intermediate.volPerAcreCT) / 100;
  const CableYardUnbunchedAllTrees2 =
    ((input.isPartialCut === true ? GalYardPCUB : input.isPartialCut === false ? GalYardCCUB : 0) *
      intermediate.volPerAcre) /
    100;
  const LoadLogTrees2 = (GalLoad * intermediate.volPerAcreALT) / 100;
  const ChipWholeTrees2 =
    (GalChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    CableYardUnbunchedAllTrees2 +
    (input.isBiomassSalvage === false ? LoadLogTrees2 : 0) +
    +ChipWholeTrees2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    (weightAT > 0 ? CableYardUnbunchedAllTrees2 * (weightCT / weightAT) : 0) + ChipWholeTrees2;
  const GasolineStump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllLogTrees2 + ManualFellChipTrees2;
  const GasolineStump2Truck4ResiduesWithoutMovein = ManualFellChipTrees2;
  const LowboyLoads = 4;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.includeMoveInCosts
    ? (LowboyLoads * 2 * input.moveInDistance) / mpg / input.area
    : 0;

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
  frcsOutputs.totalBiomass.costPerAcre =
    Stump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct +
    OntoTruck4ResiduesWoMovein +
    Movein4Residues;
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
  frcsOutputs.feedstock.costPerAcre = OntoTruck4ResiduesWoMovein + Stump2Truck4ResiduesWithoutMovein;
  frcsOutputs.feedstock.costPerBoleCCF = frcsOutputs.feedstock.costPerAcre / BoleVolCCF;
  frcsOutputs.feedstock.costPerGT =
    frcsOutputs.feedstock.costPerAcre / frcsOutputs.totalBiomass.yieldPerAcre;
  // Fuel
  frcsOutputs.feedstock.dieselPerAcre = DieselStump2Truck4ResiduesWithoutMovein;
  frcsOutputs.feedstock.dieselPerBoleCCF = frcsOutputs.feedstock.dieselPerAcre / BoleVolCCF;
  frcsOutputs.feedstock.gasolinePerAcre = GasolineStump2Truck4ResiduesWithoutMovein;
  frcsOutputs.feedstock.gasolinePerBoleCCF = frcsOutputs.feedstock.gasolinePerAcre / BoleVolCCF;

  if (input.isBiomassSalvage) {
    frcsOutputs.feedstock = frcsOutputs.totalBiomass;
  }

  return frcsOutputs;
}
