// Outputs sheet: Cable CTL column
import {
  Assumptions,
  FrcsInputs,
  FrcsOutputs,
  IntermediateVariables,
  MachineCosts,
} from '../model';
import { Chipping } from './methods/chipping';
import { CYCTL } from './methods/cyctl';
import { Harvesting } from './methods/harvesting';
import { Loading } from './methods/loading';
import { calculateMachineCosts } from './methods/machinecosts';
import { MoveInCosts } from './methods/moveincost';

export function cableCTL(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  assumption: Assumptions
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.volPerAcreST / 100;
  const ResidueRecoveredPrimary = 0;
  const PrimaryProduct = intermediate.boleWeightST + ResidueRecoveredPrimary;
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
  const HarvestingResults = Harvesting(assumption, input, intermediate, machineCost);
  const CostHarvest = HarvestingResults.CostHarvest;
  const CYCTLresults = CYCTL(assumption, input, intermediate, machineCost);
  const CostYardCTL = CYCTLresults.CostYardCTL;
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const CostLoadCTL = LoadingResults.CostLoadCTL;
  const ChippingResults = Chipping(assumption, input, intermediate, machineCost);
  const CostChipWT = ChippingResults.CostChipWT;
  const MoveInCostsResults = MoveInCosts(
    input,
    intermediate,
    machineCost,
    assumption.ResidueRecovFracCTL
  );
  const CostChipBundledRes = ChippingResults.CostChipBundledRes;

  const GalHarvest = HarvestingResults.GalHarvest;
  const GalYardCTL = CYCTLresults.GalYardCTL;
  const GalLoadCTL = LoadingResults.GalLoadCTL;
  const GalChipWT = ChippingResults.GalChipWT;

  // C. For All Products, $/ac
  const HarvestTreesLess80cf = (CostHarvest * intermediate.volPerAcreST) / 100;
  const CableYardCTLtreesLess80cf = (CostYardCTL * intermediate.volPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf = (CostLoadCTL * intermediate.volPerAcreSLT) / 100;
  const ChipTreeBoles =
    (CostChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcreST)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf +
    CableYardCTLtreesLess80cf +
    (input.isBiomassSalvage === false ? LoadCTLlogTreesLess80cf : 0) +
    ChipTreeBoles;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipTreeBoles +
    (HarvestTreesLess80cf + CableYardCTLtreesLess80cf) *
      (intermediate.boleWeightCT / intermediate.boleWeightST);
  const Movein4PrimaryProduct = input.includeMoveInCosts
    ? MoveInCostsResults.CostPerCCFcableCTL * BoleVolCCF
    : 0;
  const ChipBundledResiduesFromTreesLess80cf = input.includeCostsCollectChipResidues
    ? CostChipBundledRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipBundledResiduesFromTreesLess80cf;
  const Movein4Residues =
    input.includeMoveInCosts && input.includeCostsCollectChipResidues
      ? MoveInCostsResults.CostPerCCFbundleResidues * ResidueRecoveredOptional
      : 0;

  // D. For All Products, gal/ac
  const HarvestTreesLess80cf2 = (GalHarvest * intermediate.volPerAcreST) / 100;
  const CableYardCTLtreesLess80cf2 = (GalYardCTL * intermediate.volPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf2 = (GalLoadCTL * intermediate.volPerAcreSLT) / 100;
  const ChipTreeBoles2 =
    (GalChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcreST)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf2 +
    CableYardCTLtreesLess80cf2 +
    (input.isBiomassSalvage === false ? LoadCTLlogTreesLess80cf2 : 0) +
    ChipTreeBoles2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    (HarvestTreesLess80cf2 + CableYardCTLtreesLess80cf2) *
      (intermediate.boleWeightCT / intermediate.boleWeightST) +
    ChipTreeBoles2;
  const LowboyLoads = 4;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.includeMoveInCosts
    ? (LowboyLoads * 2 * input.moveInDistance) / mpg / input.area
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

  // System Summaries - Residue
  // Cost
  frcsOutputs.residual.yieldPerAcre =
    ResidueRecoveredOptional + intermediate.boleWeightCT + ResidueRecoveredPrimary;
  frcsOutputs.residual.costPerAcre =
    Stump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein + Movein4Residues;
  frcsOutputs.residual.costPerBoleCCF = frcsOutputs.residual.costPerAcre / BoleVolCCF;
  frcsOutputs.residual.costPerGT =
    frcsOutputs.residual.costPerAcre / frcsOutputs.total.yieldPerAcre;
  // Fuel
  frcsOutputs.residual.dieselPerAcre = DieselStump2Truck4ResiduesWithoutMovein;
  frcsOutputs.residual.dieselPerBoleCCF = frcsOutputs.residual.dieselPerAcre / BoleVolCCF;

  if (input.isBiomassSalvage) {
    frcsOutputs.residual = frcsOutputs.total;
  }

  return frcsOutputs;
}
