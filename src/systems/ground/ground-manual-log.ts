// Outputs sheet: Ground-Based Manual Log column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { FellAllTrees } from '../methods/fellalltrees';
import { Loading } from '../methods/loading';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { FellBunch } from './methods/fellbunch';
import { Skidding } from './methods/skidding';

function GroundManualLog(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  assumption: AssumptionMod
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.VolPerAcre / 100;
  const ResidueRecoveredPrimary = 0;
  const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = 0;
  const TotalPrimaryProductsAndOptionalResidues =
    PrimaryProduct + ResidueRecoveredOptional;

  // Machine costs
  const machineCost: MachineCostMod = MachineCosts(input);
  // System Cost Elements-------
  const FellBunchResults = FellBunch(input, intermediate, machineCost);
  const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
  const SkiddingResults = Skidding(
    input,
    intermediate,
    machineCost,
    TreesPerCycleIIB
  );
  const CostSkidUB = SkiddingResults.CostSkidUB;
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
  const FellAllTreesResults = FellAllTrees(input, intermediate, machineCost);
  const CostManFLB = FellAllTreesResults.CostManFLB;

  const GalChainsaw = 0.0104 * 2.83168 * 0.264172; // 0.0104 L/m3 => gal/CCF
  const GalSkidUB = SkiddingResults.GalSkidUB;
  const GalLoad = LoadingResults.GalLoad;
  const GalChipWT = ChippingResults.GalChipWT;

  // C. For All Products, $/ac
  const ManualFellLimbBuckAllTrees =
    (CostManFLB * intermediate.VolPerAcre) / 100;
  const SkidUnbunchedAllTrees = (CostSkidUB * intermediate.VolPerAcre) / 100;
  const LoadLogTrees = (CostLoad * intermediate.VolPerAcreALT) / 100;
  const ChipTreeBoles =
  (CostChipWT *
    (input.ChipAll === false
      ? intermediate.VolPerAcreCT
      : intermediate.VolPerAcre)) /
  100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllTrees +
    SkidUnbunchedAllTrees +
    LoadLogTrees +
    ChipTreeBoles;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipTreeBoles +
    (ManualFellLimbBuckAllTrees + SkidUnbunchedAllTrees) *
      (intermediate.BoleWtCT / intermediate.BoleWt);
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFmanualLog * BoleVolCCF
    : 0;

  // D. For All Products, gal/ac
  const ManualFellLimbBuckAllTrees2 =
    (GalChainsaw * intermediate.VolPerAcre) / 100;
  const SkidUnbunchedAllTrees2 = (GalSkidUB * intermediate.VolPerAcre) / 100;
  const LoadLogTrees2 = (GalLoad * intermediate.VolPerAcreALT) / 100;
  const ChipTreeBoles2 = (GalChipWT * intermediate.VolPerAcreCT) / 100;
  const DieselStump2Truck4PrimaryProductWithoutMovein =
    SkidUnbunchedAllTrees2 + LoadLogTrees2 + ChipTreeBoles2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    SkidUnbunchedAllTrees2 * (intermediate.BoleWtCT / intermediate.BoleWt) +
    ChipTreeBoles2;
  const LowboyLoads = 3;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.CalcMoveIn
    ? (LowboyLoads * input.MoveInDist) / mpg / input.Area
    : 0;
  const GasolineStump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckAllTrees2;

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
    Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct;
  Total.CostPerBoleCCF = Total.CostPerAcre / BoleVolCCF;
  Total.CostPerGT = Total.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Total.DieselPerAcre =
    DieselStump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct2;
  Total.GasolinePerAcre = GasolineStump2Truck4PrimaryProductWithoutMovein;

  // System Summaries - Residue
  // Cost
  Residue.WeightPerAcre =
    ResidueRecoveredOptional + intermediate.BoleWtCT + ResidueRecoveredPrimary;
  Residue.CostPerAcre = Stump2Truck4ResiduesWithoutMovein;
  Residue.CostPerBoleCCF = Residue.CostPerAcre / BoleVolCCF;
  Residue.CostPerGT = Residue.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Residue.DieselPerAcre = DieselStump2Truck4ResiduesWithoutMovein;
  Residue.GasolinePerAcre =
    ManualFellLimbBuckAllTrees2 * (intermediate.BoleWtCT / intermediate.BoleWt);

  return {
    Total,
    Residue
  };
}

export { GroundManualLog };
