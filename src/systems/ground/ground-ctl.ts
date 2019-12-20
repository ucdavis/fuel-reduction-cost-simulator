// Outputs sheet: Ground-Based CTL column
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
import { BundleForwardResidue } from './methods/bundleforwardresidue';
import { Forwarding } from './methods/forwarding';

function GroundCTL(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  assumption: AssumptionMod
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.VolPerAcreST / 100;
  const ResidueRecoveredPrimary = 0;
  const PrimaryProduct = intermediate.BoleWtST + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = input.CalcResidues
    ? assumption.ResidueRecovFracCTL * intermediate.ResidueST
    : 0;
  const TotalPrimaryAndOptional = PrimaryProduct + ResidueRecoveredOptional;
  const TotalPrimaryProductsAndOptionalResidues =
    PrimaryProduct + ResidueRecoveredOptional;
  // Amounts Unrecovered and Left within the Stand Per Acre
  const UncutTreesLarger80cf = intermediate.VolPerAcreLLT / 100;
  const ResiduesUncutTreesLarger80cf = intermediate.ResidueLLT;
  const GroundFuel = input.CalcResidues
    ? intermediate.ResidueST * (1 - assumption.ResidueRecovFracCTL)
    : intermediate.ResidueST;
  // Amounts Unrecovered and Left at the Landing
  const PiledFuel = 0;
  // TotalResidues
  const ResidueUncutTrees = 0;
  const TotalResidues =
    ResidueRecoveredPrimary +
    ResidueRecoveredOptional +
    ResidueUncutTrees +
    GroundFuel +
    PiledFuel;
  // Machine costs
  const machineCost: MachineCostMod = MachineCosts(input);
  // System Cost Elements-------
  const CostHarvest = Harvesting(assumption, input, intermediate, machineCost);
  const CostForward = Forwarding(assumption, input, intermediate, machineCost);
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const CostLoadCTL = LoadingResults.CostLoadCTL;
  const ChippingResults = Chipping(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostChipCTL = ChippingResults.CostChipCTL;
  const BundleForwardResidueResults = BundleForwardResidue(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostBundleResidue = BundleForwardResidueResults.CostBundleResidue;
  const CostForwardResidueBundles =
    BundleForwardResidueResults.CostForwardResidueBundles;
  const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
  const CostChipBundledRes = ChippingResults.CostChipBundledRes;

  // C. For All Products, $/ac
  const HarvestTreesLess80cf =
    ((CostHarvest * intermediate.VolPerAcreST) / 100);
  const ForwardTreesLess80cf =
    ((CostForward * intermediate.VolPerAcreST) / 100);
  const LoadCTLlogTreesLess80cf =
    ((CostLoadCTL * intermediate.VolPerAcreSLT) / 100);
  const ChipCTLChipTreeBoles =
    ((CostChipCTL * intermediate.VolPerAcreCT) / 100);

  const Stump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf +
    ForwardTreesLess80cf +
    LoadCTLlogTreesLess80cf +
    ChipCTLChipTreeBoles;
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFgroundCTL * BoleVolCCF
    : 0;
  const BundleCTLResidues = input.CalcResidues
    ? CostBundleResidue * ResidueRecoveredOptional
    : 0;
  const ForwardCTLResidues = input.CalcResidues
    ? CostForwardResidueBundles * ResidueRecoveredOptional
    : 0;
  const ChipBundledResiduesFromTreesLess80cf = input.CalcResidues
    ? CostChipBundledRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein =
    ChipBundledResiduesFromTreesLess80cf +
    BundleCTLResidues +
    ForwardCTLResidues;
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

export { GroundCTL };
