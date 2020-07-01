// Outputs sheet: Ground-Based Mech WT column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod,
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { FellLargeLogTrees } from '../methods/felllargelogtrees';
import { Loading } from '../methods/loading';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { Processing } from '../methods/processing';
import { FellBunch } from './methods/fellbunch';
import { Skidding } from './methods/skidding';

function GroundMechWT(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  assumption: AssumptionMod
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.VolPerAcre / 100;
  const ResidueRecoveredPrimary =
    assumption.ResidueRecovFracWT * intermediate.ResidueCT;
  const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = input.CalcResidues
    ? assumption.ResidueRecovFracWT * intermediate.ResidueSLT
    : 0;
  const TotalPrimaryAndOptional = PrimaryProduct + ResidueRecoveredOptional;
  const TotalPrimaryProductsAndOptionalResidues =
    PrimaryProduct + ResidueRecoveredOptional;
  // Amounts Unrecovered and Left within the Stand Per Acre
  const GroundFuel =
    intermediate.ResidueLLT +
    intermediate.ResidueST * (1 - assumption.ResidueRecovFracWT);
  // Amounts Unrecovered and Left at the Landing
  const PiledFuel = input.CalcResidues
    ? 0
    : intermediate.ResidueSLT * assumption.ResidueRecovFracWT;
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
  const FellBunchResults = FellBunch(input, intermediate, machineCost);
  const CostFellBunch = FellBunchResults.CostFellBunch;
  const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
  const CostManFLBLLT = FellLargeLogTrees(input, intermediate, machineCost);
  const SkiddingResults = Skidding(
    input,
    intermediate,
    machineCost,
    TreesPerCycleIIB
  );
  const CostSkidBun = SkiddingResults.CostSkidBun;
  const ProcessingResults = Processing(input, intermediate, machineCost);
  const CostProcess = ProcessingResults.CostProcess;
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const CostLoad = LoadingResults.CostLoad;
  const ChippingResults = Chipping(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostChipWT = ChippingResults.CostChipWT;
  const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
  const CostChipLooseRes = ChippingResults.CostChipLooseRes;

  const GalFellBunch = FellBunchResults.GalFellBunch;
  const GalChainsaw = 0.0104 * 2.83168 * 0.264172; // 0.0104 L/m3 => gal/CCF
  const GalSkidBun = SkiddingResults.GalSkidBun;
  const GalProcess = ProcessingResults.GalProcess;
  const GalLoad = LoadingResults.GalLoad;
  const GalChipWT = ChippingResults.GalChipWT;
  const GalChipLooseRes = ChippingResults.GalChipLooseRes;

  // C. For All Products, $/ac
  const FellAndBunchTreesLess80cf =
    (CostFellBunch * intermediate.VolPerAcreST) / 100;
  const ManualFellLimbBuckTreesLarger80cf =
    (CostManFLBLLT * intermediate.VolPerAcreLLT) / 100;
  const SkidBunchedAllTrees = (CostSkidBun * intermediate.VolPerAcre) / 100;
  const ProcessLogTreesLess80cf =
    (CostProcess * intermediate.VolPerAcreSLT) / 100;
  const LoadLogTrees = (CostLoad * intermediate.VolPerAcreALT) / 100;
  const ChipWholeTrees =
    (CostChipWT *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    FellAndBunchTreesLess80cf +
    ManualFellLimbBuckTreesLarger80cf +
    SkidBunchedAllTrees +
    (input.ChipAll === false ? ProcessLogTreesLess80cf + LoadLogTrees : 0) +
    ChipWholeTrees;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipWholeTrees +
    FellAndBunchTreesLess80cf *
      ((intermediate.BoleWtCT + intermediate.ResidueCT) /
        (intermediate.BoleWtST + intermediate.ResidueST)) +
    SkidBunchedAllTrees *
      ((intermediate.BoleWtCT + intermediate.ResidueCT) /
        (intermediate.BoleWt + intermediate.Residue));
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFmechWT * BoleVolCCF
    : 0;

  const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues ? 0 * ResidueRecoveredOptional : 0;

  // D. For All Products, gal/ac
  const FellAndBunchTreesLess80cf2 =
    (GalFellBunch * intermediate.VolPerAcreST) / 100;
  const ManualFellLimbBuckTreesLarger80cf2 =
    (GalChainsaw * intermediate.VolPerAcreLLT) / 100;
  const SkidBunchedAllTrees2 = (GalSkidBun * intermediate.VolPerAcre) / 100;
  const ProcessLogTreesLess80cf2 =
    (GalProcess * intermediate.VolPerAcreSLT) / 100;
  const LoadLogTrees2 = (GalLoad * intermediate.VolPerAcreALT) / 100;
  const ChipWholeTrees2 =
    (GalChipWT *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    FellAndBunchTreesLess80cf2 +
    SkidBunchedAllTrees2 +
    (input.ChipAll === false ? ProcessLogTreesLess80cf2 + LoadLogTrees2 : 0) +
    ChipWholeTrees2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    FellAndBunchTreesLess80cf2 *
      ((intermediate.BoleWtCT + intermediate.ResidueCT) /
        (intermediate.BoleWtST + intermediate.ResidueST)) +
    SkidBunchedAllTrees2 *
      ((intermediate.BoleWtCT + intermediate.ResidueCT) /
        (intermediate.BoleWt + intermediate.Residue));
  const GasolineStump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckTreesLarger80cf2;
  const LowboyLoads = 5;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.CalcMoveIn
    ? (LowboyLoads * input.MoveInDist) / mpg / input.Area
    : 0;
  const ChipLooseResiduesFromLogTreesLess80cf2 = input.CalcResidues
    ? GalChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein2 = ChipLooseResiduesFromLogTreesLess80cf2;

  // III. Summaries
  const Total = {
    WeightPerAcre: 0,
    CostPerAcre: 0,
    CostPerBoleCCF: 0,
    CostPerGT: 0,
    DieselPerAcre: 0,
    GasolinePerAcre: 0,
    JetFuelPerAcre: 0,
  };

  let Residue = {
    WeightPerAcre: 0,
    CostPerAcre: 0,
    CostPerBoleCCF: 0,
    CostPerGT: 0,
    DieselPerAcre: 0,
    GasolinePerAcre: 0,
    JetFuelPerAcre: 0,
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
    DieselStump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct2 +
    OntoTruck4ResiduesWoMovein2;
  Total.GasolinePerAcre = GasolineStump2Truck4PrimaryProductWithoutMovein;

  // System Summaries - Residue
  // Cost
  Residue.WeightPerAcre =
    ResidueRecoveredOptional + intermediate.BoleWtCT + ResidueRecoveredPrimary;
  Residue.CostPerAcre =
    Stump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein;
  Residue.CostPerBoleCCF = Residue.CostPerAcre / BoleVolCCF;
  Residue.CostPerGT = Residue.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Residue.DieselPerAcre =
    DieselStump2Truck4ResiduesWithoutMovein +
    OntoTruck4ResiduesWoMovein2 +
    ChipWholeTrees2;

  if (input.ChipAll) {
    Residue = Total;
  }

  return {
    Total,
    Residue,
  };
}

export { GroundMechWT };
