// Outputs sheet: Ground-Based CTL column
import {
  Assumptions,
  FrcsInputs,
  FrcsOutputs,
  IntermediateVariables,
  MachineCosts,
} from '../model';
import { BundleForwardResidue } from './methods/bundleforwardresidue';
import { Chipping } from './methods/chipping';
import { Forwarding } from './methods/forwarding';
import { Harvesting } from './methods/harvesting';
import { Loading } from './methods/loading';
import { calculateMachineCosts } from './methods/machinecosts';
import { MoveInCosts } from './methods/moveincost';

export function groundCTL(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  assumption: Assumptions
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.volPerAcreST / 100;
  const ResidueRecoveredPrimary = 0;
  const PrimaryProduct = intermediate.boleWeightST + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = input.includeCostsCollectChipResidues
    ? assumption.ResidueRecovFracCTL * intermediate.residueST
    : 0;
  const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
  // Amounts Unrecovered and Left within the Stand Per Acre
  const UncutTreesLarger80cf = intermediate.volPerAcreLLT / 100;
  const ResiduesUncutTreesLarger80cf = intermediate.residueLLT;
  const GroundFuel = input.includeCostsCollectChipResidues
    ? intermediate.residueST * (1 - assumption.ResidueRecovFracCTL)
    : intermediate.residueST;
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
  const HarvestingResults = Harvesting(assumption, input, intermediate, machineCost);
  const CostHarvest = HarvestingResults.CostHarvest;
  const ForwardingResults = Forwarding(assumption, input, intermediate, machineCost);
  const CostForward = ForwardingResults.CostForward;
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const CostLoadCTL = LoadingResults.CostLoadCTL;
  const ChippingResults = Chipping(assumption, input, intermediate, machineCost);
  const CostChipCTL = ChippingResults.CostChipCTL;
  const BundleForwardResidueResults = BundleForwardResidue(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostBundleResidue = BundleForwardResidueResults.CostBundleResidue;
  const CostForwardResidueBundles = BundleForwardResidueResults.CostForwardResidueBundles;
  const MoveInCostsResults = MoveInCosts(
    input,
    intermediate,
    machineCost,
    assumption.ResidueRecovFracCTL
  );
  const CostChipBundledRes = ChippingResults.CostChipBundledRes;

  const GalHarvest = HarvestingResults.GalHarvest;
  const GalForward = ForwardingResults.GalForward;
  const GalLoadCTL = LoadingResults.GalLoadCTL;
  const GalChipCTL = ChippingResults.GalChipCTL;
  const GalBundleResidue = BundleForwardResidueResults.GalBundleResidue;
  const GalForwardResidueBundles = BundleForwardResidueResults.GalForwardResidueBundles;
  const GalChipBundledRes = ChippingResults.GalChipBundledRes;

  // C. For All Products, $/ac
  const HarvestTreesLess80cf = (CostHarvest * intermediate.volPerAcreST) / 100;
  const ForwardTreesLess80cf = (CostForward * intermediate.volPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf = (CostLoadCTL * intermediate.volPerAcreSLT) / 100;
  const ChipCTLChipTreeBoles =
    (CostChipCTL *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcreST)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf +
    ForwardTreesLess80cf +
    (input.isBiomassSalvage === false ? LoadCTLlogTreesLess80cf : 0) +
    ChipCTLChipTreeBoles;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipCTLChipTreeBoles +
    (intermediate.boleWeightST > 0
      ? (HarvestTreesLess80cf + ForwardTreesLess80cf) *
        (intermediate.boleWeightCT / intermediate.boleWeightST)
      : 0);
  const Movein4PrimaryProduct = input.includeMoveInCosts
    ? MoveInCostsResults.CostPerCCFgroundCTL * BoleVolCCF
    : 0;
  const BundleCTLResidues = input.includeCostsCollectChipResidues
    ? CostBundleResidue * ResidueRecoveredOptional
    : 0;
  const ForwardCTLResidues = input.includeCostsCollectChipResidues
    ? CostForwardResidueBundles * ResidueRecoveredOptional
    : 0;
  const ChipBundledResiduesFromTreesLess80cf = input.includeCostsCollectChipResidues
    ? CostChipBundledRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein =
    ChipBundledResiduesFromTreesLess80cf + BundleCTLResidues + ForwardCTLResidues;
  const Movein4Residues =
    input.includeMoveInCosts && input.includeCostsCollectChipResidues
      ? MoveInCostsResults.CostPerCCFbundleResidues * ResidueRecoveredOptional
      : 0;

  // D. For All Products, gal/ac
  const HarvestTreesLess80cf2 = (GalHarvest * intermediate.volPerAcreST) / 100;
  const ForwardTreesLess80cf2 = (GalForward * intermediate.volPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf2 = (GalLoadCTL * intermediate.volPerAcreSLT) / 100;
  const ChipCTLChipTreeBoles2 =
    (GalChipCTL *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcreST)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf2 +
    ForwardTreesLess80cf2 +
    (input.isBiomassSalvage === false ? LoadCTLlogTreesLess80cf2 : 0) +
    ChipCTLChipTreeBoles2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    (intermediate.boleWeightST > 0
      ? (HarvestTreesLess80cf2 + ForwardTreesLess80cf2) *
        (intermediate.boleWeightCT / intermediate.boleWeightST)
      : 0) + ChipCTLChipTreeBoles2;
  const LowboyLoads = 4;
  const LowboyLoadsResidues = 2; // bundler and forwarder used to collect residues
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.includeMoveInCosts
    ? ((LowboyLoads + (input.includeCostsCollectChipResidues ? LowboyLoadsResidues : 0)) *
        2 *
        input.moveInDistance) /
      mpg /
      input.area
    : 0;
  const BundleCTLResidues2 = input.includeCostsCollectChipResidues
    ? GalBundleResidue * ResidueRecoveredOptional
    : 0;
  const ForwardCTLResidues2 = input.includeCostsCollectChipResidues
    ? GalForwardResidueBundles * ResidueRecoveredOptional
    : 0;
  const ChipBundledResiduesFromTreesLess80cf2 = input.includeCostsCollectChipResidues
    ? GalChipBundledRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein2 =
    BundleCTLResidues2 + ForwardCTLResidues2 + ChipBundledResiduesFromTreesLess80cf2;
  const Movein4Residues2 =
    input.includeMoveInCosts && input.includeCostsCollectChipResidues
      ? (LowboyLoadsResidues * 2 * input.moveInDistance) / mpg / input.area
      : 0; // two equipment: a bundler and a forwarder

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

  // System Summaries - Residue
  // Cost
  frcsOutputs.feedstock.yieldPerAcre =
    ResidueRecoveredOptional + intermediate.boleWeightCT + ResidueRecoveredPrimary;
  frcsOutputs.feedstock.costPerAcre =
    Stump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein + Movein4Residues;
  frcsOutputs.feedstock.costPerBoleCCF = frcsOutputs.feedstock.costPerAcre / BoleVolCCF;
  frcsOutputs.feedstock.costPerGT =
    frcsOutputs.feedstock.costPerAcre / frcsOutputs.totalBiomass.yieldPerAcre;
  // Fuel
  frcsOutputs.feedstock.dieselPerAcre =
    DieselStump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein2 + Movein4Residues2;
  frcsOutputs.feedstock.dieselPerBoleCCF = frcsOutputs.feedstock.dieselPerAcre / BoleVolCCF;

  if (input.isBiomassSalvage) {
    frcsOutputs.feedstock = frcsOutputs.totalBiomass;
  }

  return frcsOutputs;
}
