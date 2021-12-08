// Outputs sheet: Helicopter CTL column
import {
  Assumptions,
  FrcsInputs,
  FrcsOutputs,
  IntermediateVariables,
  MachineCosts,
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { Harvesting } from '../methods/harvesting';
import { Loading } from '../methods/loading';
import { calculateMachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { HelicopterYarding } from './methods/helicopteryarding';

export function helicopterCTL(
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
  const machineCost: MachineCosts = calculateMachineCosts(input.dieselFuelPrice);
  // System Cost Elements-------
  const HarvestingResults = Harvesting(assumption, input, intermediate, machineCost);
  const CostHarvest = HarvestingResults.CostHarvest;
  const HelicopterYardingResults = HelicopterYarding(input, intermediate);
  const CostHeliYardCTL = HelicopterYardingResults.CostHeliYardCTL;
  const CostHeliLoadCTL = HelicopterYardingResults.CostHeliLoadCTL;
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
  const GalHeliYardCTL = HelicopterYardingResults.GalHeliYardCTL;
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const GalLoadCTL = LoadingResults.GalLoadCTL;
  const GalHeliLoadCTL = GalLoadCTL * 2;
  const GalChipWT = ChippingResults.GalChipWT;

  // C. For All Products, $/ac
  const HarvestTreesLess80cf = (CostHarvest * intermediate.volPerAcreST) / 100;
  const HeliYardCTLtreesLess80cf = (CostHeliYardCTL * intermediate.volPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf = (CostHeliLoadCTL * intermediate.volPerAcreSLT) / 100;
  const ChipTreeBoles =
    (CostChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcreST)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf +
    HeliYardCTLtreesLess80cf +
    (input.isBiomassSalvage === false ? LoadCTLlogTreesLess80cf : 0) +
    ChipTreeBoles;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipTreeBoles +
    (HarvestTreesLess80cf + HeliYardCTLtreesLess80cf) *
      (intermediate.boleWeightCT / intermediate.boleWeightST);
  const Movein4PrimaryProduct = input.includeMoveInCosts
    ? MoveInCostsResults.CostPerCCFheliCTL * BoleVolCCF
    : 0;
  const ChipBundledResiduesFromTreesLess80cf = input.includeCostsCollectChipResidues
    ? CostChipBundledRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipBundledResiduesFromTreesLess80cf;
  const Movein4Residues =
    input.includeMoveInCosts && input.includeCostsCollectChipResidues
      ? MoveInCostsResults.CostPerCCFheliCTL * ResidueRecoveredOptional
      : 0;

  // D. For All Products, $/ac
  const HarvestTreesLess80cf2 = (GalHarvest * intermediate.volPerAcreST) / 100;
  const HeliYardCTLtreesLess80cf2 = (GalHeliYardCTL * intermediate.volPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf2 = (GalHeliLoadCTL * intermediate.volPerAcreSLT) / 100;
  const ChipTreeBoles2 =
    (GalChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcreST)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf2 +
    (input.isBiomassSalvage === false ? LoadCTLlogTreesLess80cf2 : 0) +
    ChipTreeBoles2;
  const DieselStump2Truck4ResiduesWithoutMovein = ChipTreeBoles2;
  const LowboyLoads = 4;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.includeMoveInCosts
    ? (LowboyLoads * input.moveInDistance) / mpg / input.area
    : 0;
  const JetFuelStump2Truck4PrimaryProductWithoutMovein = HeliYardCTLtreesLess80cf2;
  const JetFuelStump2Truck4ResiduesWithoutMovein =
    HeliYardCTLtreesLess80cf2 * (intermediate.boleWeightCT / intermediate.boleWeightST);

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
    DieselStump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct2;
  frcsOutputs.total.dieselPerBoleCCF = frcsOutputs.total.dieselPerAcre / BoleVolCCF;
  frcsOutputs.total.jetFuelPerAcre = JetFuelStump2Truck4PrimaryProductWithoutMovein;
  frcsOutputs.total.jetFuelPerBoleCCF = frcsOutputs.total.jetFuelPerAcre / BoleVolCCF;

  // System Summaries - Residue
  // Cost
  frcsOutputs.biomass.yieldPerAcre =
    ResidueRecoveredOptional + intermediate.boleWeightCT + ResidueRecoveredPrimary;
  frcsOutputs.biomass.costPerAcre =
    Stump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein + Movein4Residues;
  frcsOutputs.biomass.costPerBoleCCF = frcsOutputs.biomass.costPerAcre / BoleVolCCF;
  frcsOutputs.biomass.costPerGT = frcsOutputs.biomass.costPerAcre / frcsOutputs.total.yieldPerAcre;
  // Fuel
  frcsOutputs.biomass.dieselPerAcre = DieselStump2Truck4ResiduesWithoutMovein;
  frcsOutputs.biomass.jetFuelPerAcre = JetFuelStump2Truck4ResiduesWithoutMovein;

  if (input.isBiomassSalvage) {
    frcsOutputs.biomass = frcsOutputs.total;
  }

  return frcsOutputs;
}
