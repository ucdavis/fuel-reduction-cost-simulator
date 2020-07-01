// Outputs sheet: Cable CTL column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { Harvesting } from '../methods/harvesting';
import { Loading } from '../methods/loading';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { CYCTL } from './methods/cyctl';

function CableCTL(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  assumption: AssumptionMod
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.VolPerAcreST / 100;
  const ResidueRecoveredPrimary = 0;
  const PrimaryProduct = intermediate.BoleWtST + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = 0;
  const TotalPrimaryProductsAndOptionalResidues =
    PrimaryProduct + ResidueRecoveredOptional;

  // Machine costs
  const machineCost: MachineCostMod = MachineCosts(input);
  // System Cost Elements-------
  const HarvestingResults = Harvesting(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostHarvest = HarvestingResults.CostHarvest;
  const CYCTLresults = CYCTL(assumption, input, intermediate, machineCost);
  const CostYardCTL = CYCTLresults.CostYardCTL;
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const CostLoadCTL = LoadingResults.CostLoadCTL;
  const ChippingResults = Chipping(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostChipWT = ChippingResults.CostChipWT;
  const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
  const CostChipBundledRes = ChippingResults.CostChipBundledRes;

  const GalHarvest = HarvestingResults.GalHarvest;
  const GalYardCTL = CYCTLresults.GalYardCTL;
  const GalLoadCTL = LoadingResults.GalLoadCTL;
  const GalChipWT = ChippingResults.GalChipWT;

  // C. For All Products, $/ac
  const HarvestTreesLess80cf = (CostHarvest * intermediate.VolPerAcreST) / 100;
  const CableYardCTLtreesLess80cf =
    (CostYardCTL * intermediate.VolPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf =
    (CostLoadCTL * intermediate.VolPerAcreSLT) / 100;
  const ChipTreeBoles =
  (CostChipWT *
    (input.ChipAll === false
      ? intermediate.VolPerAcreCT
      : intermediate.VolPerAcreST)) /
  100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf +
    CableYardCTLtreesLess80cf +
    (input.ChipAll === false ? LoadCTLlogTreesLess80cf : 0) +
    ChipTreeBoles;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipTreeBoles +
    (HarvestTreesLess80cf + CableYardCTLtreesLess80cf) *
      (intermediate.BoleWtCT / intermediate.BoleWtST);
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFcableCTL * BoleVolCCF
    : 0;
  const ChipBundledResiduesFromTreesLess80cf = input.CalcResidues
    ? CostChipBundledRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipBundledResiduesFromTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues
      ? MoveInCostsResults.CostPerCCFbundleResidues * ResidueRecoveredOptional
      : 0;

  // D. For All Products, gal/ac
  const HarvestTreesLess80cf2 = (GalHarvest * intermediate.VolPerAcreST) / 100;
  const CableYardCTLtreesLess80cf2 =
    (GalYardCTL * intermediate.VolPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf2 =
    (GalLoadCTL * intermediate.VolPerAcreSLT) / 100;
  const ChipTreeBoles2 =
  (GalChipWT *
    (input.ChipAll === false
      ? intermediate.VolPerAcreCT
      : intermediate.VolPerAcreST)) /
  100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf2 +
    CableYardCTLtreesLess80cf2 +
    LoadCTLlogTreesLess80cf2 +
    ChipTreeBoles2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    (HarvestTreesLess80cf2 + CableYardCTLtreesLess80cf2) *
      (intermediate.BoleWtCT / intermediate.BoleWtST) +
    ChipTreeBoles2;
  const LowboyLoads = 4;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.CalcMoveIn
    ? (LowboyLoads * input.MoveInDist) / mpg / input.Area
    : 0;

  // III. Summaries
  const Total = {
    WeightPerAcre: 0,
    CostPerAcre: 0,
    CostPerBoleCCF: 0,
    CostPerGT: 0,
    DieselPerAcre: 0,
    GasolinePerAcre: 0,
    JetFuelPerAcre: 0
  };

  const Residue = {
    WeightPerAcre: 0,
    CostPerAcre: 0,
    CostPerBoleCCF: 0,
    CostPerGT: 0,
    DieselPerAcre: 0,
    GasolinePerAcre: 0,
    JetFuelPerAcre: 0
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

  // System Summaries - Residue
  // Cost
  Residue.WeightPerAcre =
    ResidueRecoveredOptional + intermediate.BoleWtCT + ResidueRecoveredPrimary;
  Residue.CostPerAcre =
    Stump2Truck4ResiduesWithoutMovein +
    OntoTruck4ResiduesWoMovein +
    Movein4Residues;
  Residue.CostPerBoleCCF = Residue.CostPerAcre / BoleVolCCF;
  Residue.CostPerGT = Residue.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Residue.DieselPerAcre =
    DieselStump2Truck4ResiduesWithoutMovein;

  return {
    Total,
    Residue
  };
}

export { CableCTL };
