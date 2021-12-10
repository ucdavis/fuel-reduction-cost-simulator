// Outputs sheet: Ground-Based Manual WT column
import {
  Assumptions,
  FrcsInputs,
  FrcsOutputs,
  IntermediateVariables,
  MachineCosts,
} from '../model';
import { Chipping } from './methods/chipping';
import { FellBunch } from './methods/fellbunch';
import { FellwtSmallLogOther } from './methods/fellwtsmalllogother';
import { Loading } from './methods/loading';
import { calculateMachineCosts } from './methods/machinecosts';
import { MoveInCosts } from './methods/moveincost';
import { Processing } from './methods/processing';
import { Skidding } from './methods/skidding';

export function groundManualWT(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  assumption: Assumptions
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.volPerAcre / 100;
  const ResidueRecoveredPrimary = assumption.ResidueRecovFracWT * intermediate.residueCT;
  const PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = input.includeCostsCollectChipResidues
    ? assumption.ResidueRecovFracWT * intermediate.residueSLT
    : 0;
  const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;

  // Machine costs
  const machineCost: MachineCosts = calculateMachineCosts(input.dieselFuelPrice);
  // System Cost Elements-------
  const FellBunchResults = FellBunch(input, intermediate, machineCost);
  const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
  const FellwtSmallLogOtherResults = FellwtSmallLogOther(input, intermediate, machineCost);
  const CostManFLBLLT2 = FellwtSmallLogOtherResults.CostManFLBLLT2;
  const CostManFellST2 = FellwtSmallLogOtherResults.CostManFellST2;
  const SkiddingResults = Skidding(input, intermediate, machineCost, TreesPerCycleIIB);
  const CostSkidUB = SkiddingResults.CostSkidUB;
  const ProcessingResults = Processing(input, intermediate, machineCost);
  const CostProcess = ProcessingResults.CostProcess;
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

  const GalChainsaw = 0.0104 * 2.83168 * 0.264172; // 0.0104 L/m3 => gal/CCF
  const GalSkidUB = SkiddingResults.GalSkidUB;
  const GalProcess = ProcessingResults.GalProcess;
  const GalLoad = LoadingResults.GalLoad;
  const GalChipWT = ChippingResults.GalChipWT;
  const GalChipLooseRes = ChippingResults.GalChipLooseRes;

  // C. For All Products, $/ac
  const ManualFellLimbBuckTreesLarger80cf = (CostManFLBLLT2 * intermediate.volPerAcreLLT) / 100;
  const ManualFellTreesLess80cf = (CostManFellST2 * intermediate.volPerAcreST) / 100;
  const SkidUnbunchedAllTrees = (CostSkidUB * intermediate.volPerAcre) / 100;
  const ProcessLogTreesLess80cf = (CostProcess * intermediate.volPerAcreSLT) / 100;
  const LoadLogTrees = (CostLoad * intermediate.volPerAcreALT) / 100;
  const ChipWholeTrees =
    (CostChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckTreesLarger80cf +
    ManualFellTreesLess80cf +
    SkidUnbunchedAllTrees +
    (input.isBiomassSalvage === false ? ProcessLogTreesLess80cf + LoadLogTrees : 0) +
    ChipWholeTrees;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipWholeTrees +
    ManualFellTreesLess80cf *
      ((intermediate.boleWeightCT + intermediate.residueCT) /
        (intermediate.boleWeightST + intermediate.residueST)) +
    SkidUnbunchedAllTrees *
      ((intermediate.boleWeightCT + intermediate.residueCT) /
        (intermediate.boleWeight + intermediate.residue));
  const Movein4PrimaryProduct = input.includeMoveInCosts
    ? MoveInCostsResults.CostPerCCFmanualWT * BoleVolCCF
    : 0;

  const ChipLooseResiduesFromLogTreesLess80cf = input.includeCostsCollectChipResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf; // for Mech WT sys;
  const Movein4Residues =
    input.includeMoveInCosts && input.includeCostsCollectChipResidues
      ? 0 * ResidueRecoveredOptional
      : 0;

  // D. For All Products, gal/ac
  const ManualFellLimbBuckTreesLarger80cf2 = (GalChainsaw * intermediate.volPerAcreLLT) / 100;
  const ManualFellTreesLess80cf2 = (GalChainsaw * intermediate.volPerAcreST) / 100;
  const SkidUnbunchedAllTrees2 = (GalSkidUB * intermediate.volPerAcre) / 100;
  const ProcessLogTreesLess80cf2 = (GalProcess * intermediate.volPerAcreSLT) / 100;
  const LoadLogTrees2 = (GalLoad * intermediate.volPerAcreALT) / 100;
  const ChipWholeTrees2 =
    (GalChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    SkidUnbunchedAllTrees2 +
    (input.isBiomassSalvage === false ? ProcessLogTreesLess80cf2 + LoadLogTrees2 : 0) +
    ChipWholeTrees2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    SkidUnbunchedAllTrees2 *
      ((intermediate.boleWeightCT + intermediate.residueCT) /
        (intermediate.boleWeight + intermediate.residue)) +
    ChipWholeTrees2;
  const GasolineStump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckTreesLarger80cf2 + ManualFellTreesLess80cf2;
  const GasolineStump2Truck4ResiduesWithoutMovein =
    ManualFellTreesLess80cf2 *
    ((intermediate.boleWeightCT + intermediate.residueCT) /
      (intermediate.boleWeightST + intermediate.residueST));
  const LowboyLoads = 4;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.includeMoveInCosts
    ? (LowboyLoads * input.moveInDistance) / mpg / input.area
    : 0;
  const ChipLooseResiduesFromLogTreesLess80cf2 = input.includeCostsCollectChipResidues
    ? GalChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein2 = ChipLooseResiduesFromLogTreesLess80cf2;

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
    biomass: {
      yieldPerAcre: 0,
      costPerAcre: 0,
      costPerBoleCCF: 0,
      costPerGT: 0,
      dieselPerAcre: 0,
      gasolinePerAcre: 0,
      jetFuelPerAcre: 0,
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
    DieselStump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct2 +
    OntoTruck4ResiduesWoMovein2;
  frcsOutputs.total.dieselPerBoleCCF = frcsOutputs.total.dieselPerAcre / BoleVolCCF;
  frcsOutputs.total.gasolinePerAcre = GasolineStump2Truck4PrimaryProductWithoutMovein;
  frcsOutputs.total.gasolinePerBoleCCF = frcsOutputs.total.gasolinePerAcre / BoleVolCCF;

  // System Summaries - Residue
  // Cost
  frcsOutputs.biomass.yieldPerAcre =
    ResidueRecoveredOptional + intermediate.boleWeightCT + ResidueRecoveredPrimary;
  frcsOutputs.biomass.costPerAcre = Stump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein;
  frcsOutputs.biomass.costPerBoleCCF = frcsOutputs.biomass.costPerAcre / BoleVolCCF;
  frcsOutputs.biomass.costPerGT = frcsOutputs.biomass.costPerAcre / frcsOutputs.total.yieldPerAcre;
  // Fuel
  frcsOutputs.biomass.dieselPerAcre =
    DieselStump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein2;
  frcsOutputs.biomass.gasolinePerAcre = GasolineStump2Truck4ResiduesWithoutMovein;

  if (input.isBiomassSalvage) {
    frcsOutputs.biomass = frcsOutputs.total;
  }

  return frcsOutputs;
}
