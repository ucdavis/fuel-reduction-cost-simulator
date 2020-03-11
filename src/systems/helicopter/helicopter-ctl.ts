// Outputs sheet: Helicopter CTL column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { Harvesting } from '../methods/harvesting';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { HelicopterYarding } from './methods/helicopteryarding';

function HelicopterCTL(
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
  const CostHarvest = Harvesting(assumption, input, intermediate, machineCost);
  const HelicopterYardingResults = HelicopterYarding(input, intermediate);
  const CostHeliYardCTL = HelicopterYardingResults.CostHeliYardCTL;
  const CostHeliLoadCTL = HelicopterYardingResults.CostHeliLoadCTL;
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
  const HarvestTreesLess80cf = (CostHarvest * intermediate.VolPerAcreST) / 100;
  const HeliYardCTLtreesLess80cf =
    (CostHeliYardCTL * intermediate.VolPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf =
    (CostHeliLoadCTL * intermediate.VolPerAcreSLT) / 100;
  const ChipTreeBoles = (CostChipWT * intermediate.VolPerAcreCT) / 100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf +
    HeliYardCTLtreesLess80cf +
    LoadCTLlogTreesLess80cf +
    ChipTreeBoles;
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFheliCTL * BoleVolCCF
    : 0;
  const ChipBundledResiduesFromTreesLess80cf = input.CalcResidues
    ? CostChipBundledRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipBundledResiduesFromTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues
      ? MoveInCostsResults.CostPerCCFheliCTL * ResidueRecoveredOptional
      : 0;

  // III.0 Residue Cost Summaries
  const Residue = {
    ResidueWt: 0,
    ResiduePerGT: 0,
    ResiduePerAcre: 0
  };
  Residue.ResidueWt = intermediate.BoleWtCT + intermediate.ResidueCT;
  Residue.ResiduePerAcre =
    ChipTreeBoles +
    (HarvestTreesLess80cf + HeliYardCTLtreesLess80cf) *
      (intermediate.BoleWtCT / intermediate.BoleWtST);
  Residue.ResiduePerGT = Residue.ResiduePerAcre / Residue.ResidueWt;

  Residue.ResidueWt = Math.round(Residue.ResidueWt);
  Residue.ResiduePerAcre = Math.round(Residue.ResiduePerAcre);
  Residue.ResiduePerGT = Math.round(Residue.ResiduePerGT);

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
    TotalPerAcre: TotalPerAcreOut,
    Residue
  };
}

export { HelicopterCTL };
