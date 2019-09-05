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
  const machineCost: MachineCostMod = MachineCosts();
  // System Cost Elements-------
  const CostHarvest = Harvesting(assumption, input, intermediate, machineCost);
  const CostYardCTL = CYCTL(assumption, input, intermediate, machineCost);
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

  // C. For All Products, $/ac
  const HarvestTreesLess80cf =
    ((CostHarvest * intermediate.VolPerAcreST) / 100);
  const YardCTLtreesLess80cf =
    ((CostYardCTL * intermediate.VolPerAcreST) / 100);
  const LoadCTLlogTreesLess80cf =
    ((CostLoadCTL * intermediate.VolPerAcreSLT) / 100);
  const ChipTreeBoles =
    ((CostChipWT * intermediate.VolPerAcreCT) / 100);

  const Stump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf +
    YardCTLtreesLess80cf +
    LoadCTLlogTreesLess80cf +
    ChipTreeBoles;
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFcableCTL * BoleVolCCF
    : 0;
  const ChipBundledResiduesFromTreesLess80cf = input.CalcResidues
    ? CostChipBundledRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipBundledResiduesFromTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues
      ? MoveInCostsResults.CostPerCCFbundleResidues *
        ResidueRecoveredOptional
      : 0;

  // III. System Cost Summaries
  const TotalPerAcre =
    Stump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct +
    OntoTruck4ResiduesWoMovein +
    Movein4Residues;
  const TotalPerBoleCCF = TotalPerAcre / BoleVolCCF;
  const TotalPerGT = TotalPerAcre / TotalPrimaryProductsAndOptionalResidues;

  const TotalPerAcreOut = Math.round(TotalPerAcre);
  const TotalPerBoleCCFout = Math.round(TotalPerBoleCCF);
  const TotalPerGTout = Math.round(TotalPerGT);

  return {
    TotalPerBoleCCF: TotalPerBoleCCFout,
    TotalPerGT: TotalPerGTout,
    TotalPerAcre: TotalPerAcreOut
  };
}

export { CableCTL };
