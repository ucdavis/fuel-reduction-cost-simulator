// Outputs sheet: Ground-Based Mech WT column
import {
  Assumptions,
  FrcsInputs,
  FrcsOutputs,
  IntermediateVariables,
  MachineCosts,
} from '../model';
import { Chipping } from './methods/chipping';
import { FellBunch } from './methods/fellbunch';
import { FellLargeLogTrees } from './methods/felllargelogtrees';
import { Loading } from './methods/loading';
import { calculateMachineCosts } from './methods/machinecosts';
import { MoveInCosts } from './methods/moveincost';
import { Processing } from './methods/processing';
import { Skidding } from './methods/skidding';

export function groundMechWT(
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
  // Amounts Unrecovered and Left within the Stand Per Acre
  const GroundFuel =
    intermediate.residueLLT + intermediate.residueST * (1 - assumption.ResidueRecovFracWT);
  // Amounts Unrecovered and Left at the Landing
  const PiledFuel = input.includeCostsCollectChipResidues
    ? 0
    : intermediate.residueSLT * assumption.ResidueRecovFracWT;
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
  const FellBunchResults = FellBunch(input, intermediate, machineCost);
  const CostFellBunch = FellBunchResults.CostFellBunch;
  const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
  const CostManFLBLLT = FellLargeLogTrees(input, intermediate, machineCost);
  const SkiddingResults = Skidding(input, intermediate, machineCost, TreesPerCycleIIB);
  const CostSkidBun = SkiddingResults.CostSkidBun;
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

  const GalFellBunch = FellBunchResults.GalFellBunch;
  const GalChainsaw = 0.077797403;
  const GalSkidBun = SkiddingResults.GalSkidBun;
  const GalProcess = ProcessingResults.GalProcess;
  const GalLoad = LoadingResults.GalLoad;
  const GalChipWT = ChippingResults.GalChipWT;
  const GalChipLooseRes = ChippingResults.GalChipLooseRes;

  // C. For All Products, $/ac
  const FellAndBunchTreesLess80cf = (CostFellBunch * intermediate.volPerAcreST) / 100;
  const ManualFellLimbBuckTreesLarger80cf = (CostManFLBLLT * intermediate.volPerAcreLLT) / 100;
  const SkidBunchedAllTrees = (CostSkidBun * intermediate.volPerAcre) / 100;
  const ProcessLogTreesLess80cf = (CostProcess * intermediate.volPerAcreSLT) / 100;
  const LoadLogTrees = (CostLoad * intermediate.volPerAcreALT) / 100;
  const ChipWholeTrees =
    (CostChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    FellAndBunchTreesLess80cf +
    ManualFellLimbBuckTreesLarger80cf +
    SkidBunchedAllTrees +
    (input.isBiomassSalvage === false ? ProcessLogTreesLess80cf + LoadLogTrees : 0) +
    ChipWholeTrees;
  const weightCT = intermediate.boleWeightCT + intermediate.residueCT;
  const weightST = intermediate.boleWeightST + intermediate.residueST;
  const weightAT = intermediate.boleWeight + intermediate.residue;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipWholeTrees +
    (weightST > 0 ? FellAndBunchTreesLess80cf * (weightCT / weightST) : 0) +
    (weightAT > 0 ? SkidBunchedAllTrees * (weightCT / weightAT) : 0);
  const Movein4PrimaryProduct = input.includeMoveInCosts
    ? MoveInCostsResults.CostPerCCFmechWT * BoleVolCCF
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
  const FellAndBunchTreesLess80cf2 = (GalFellBunch * intermediate.volPerAcreST) / 100;
  const ManualFellLimbBuckTreesLarger80cf2 = (GalChainsaw * intermediate.volPerAcreLLT) / 100;
  const SkidBunchedAllTrees2 = (GalSkidBun * intermediate.volPerAcre) / 100;
  const ProcessLogTreesLess80cf2 = (GalProcess * intermediate.volPerAcreSLT) / 100;
  const LoadLogTrees2 = (GalLoad * intermediate.volPerAcreALT) / 100;
  const ChipWholeTrees2 =
    (GalChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    FellAndBunchTreesLess80cf2 +
    SkidBunchedAllTrees2 +
    (input.isBiomassSalvage === false ? ProcessLogTreesLess80cf2 + LoadLogTrees2 : 0) +
    ChipWholeTrees2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    (weightST > 0 ? FellAndBunchTreesLess80cf2 * (weightCT / weightST) : 0) +
    (weightAT > 0 ? SkidBunchedAllTrees2 * (weightCT / weightAT) : 0);
  const GasolineStump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckTreesLarger80cf2;
  const LowboyLoads = 5;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.includeMoveInCosts
    ? (LowboyLoads * 2 * input.moveInDistance) / mpg / input.area
    : 0;
  const ChipLooseResiduesFromLogTreesLess80cf2 = input.includeCostsCollectChipResidues
    ? GalChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein2 = ChipLooseResiduesFromLogTreesLess80cf2;

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
    DieselStump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct2 +
    OntoTruck4ResiduesWoMovein2;
  frcsOutputs.totalBiomass.dieselPerBoleCCF = frcsOutputs.totalBiomass.dieselPerAcre / BoleVolCCF;
  frcsOutputs.totalBiomass.gasolinePerAcre = GasolineStump2Truck4PrimaryProductWithoutMovein;
  frcsOutputs.totalBiomass.gasolinePerBoleCCF = frcsOutputs.totalBiomass.gasolinePerAcre / BoleVolCCF;

  // System Summaries - Residue
  // Cost
  frcsOutputs.feedstock.yieldPerAcre =
    ResidueRecoveredOptional + intermediate.boleWeightCT + ResidueRecoveredPrimary;
  frcsOutputs.feedstock.costPerAcre = Stump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein;
  frcsOutputs.feedstock.costPerBoleCCF = frcsOutputs.feedstock.costPerAcre / BoleVolCCF;
  frcsOutputs.feedstock.costPerGT =
    frcsOutputs.feedstock.costPerAcre / frcsOutputs.totalBiomass.yieldPerAcre;
  // Fuel
  frcsOutputs.feedstock.dieselPerAcre =
    DieselStump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein2 + ChipWholeTrees2;
  frcsOutputs.feedstock.dieselPerBoleCCF = frcsOutputs.feedstock.dieselPerAcre / BoleVolCCF;

  if (input.isBiomassSalvage) {
    frcsOutputs.feedstock = frcsOutputs.totalBiomass;
  }

  return frcsOutputs;
}
