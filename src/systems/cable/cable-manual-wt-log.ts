// Outputs sheet: Cable Manual WT/Log column
import { Chipping } from '../methods/chipping';
import { Loading } from '../methods/loading';
import { calculateMachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import {
  Assumptions,
  FrcsInputs,
  FrcsOutputs,
  IntermediateVariables,
  MachineCosts,
} from '../model';
import { CYCCU } from './methods/cyccu';
import { CYPCU } from './methods/cypcu';
import { FellwtChipLogOther } from './methods/fellwtchiplogother';

export function cableManualWTLog(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  assumption: Assumptions
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.volPerAcre / 100;
  const ResidueRecoveredPrimary = assumption.ResidueRecovFracWT * intermediate.residueCT;
  const PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = 0;
  const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
  // Amounts Unrecovered and Left within the Stand Per Acre
  const GroundFuel =
    intermediate.residueALT + intermediate.residueCT * (1 - assumption.ResidueRecovFracWT);
  // Amounts Unrecovered and Left at the Landing
  const PiledFuel = 0;
  // TotalResidues
  const ResidueUncutTrees = 0;
  const TotalResidues =
    ResidueRecoveredPrimary + ResidueRecoveredOptional + ResidueUncutTrees + GroundFuel + PiledFuel;
  // Machine costs
  const machineCost: MachineCosts = calculateMachineCosts(input.dieselFuelPrice);
  // System Cost Elements-------
  const FellwtChipLogOtherResults = FellwtChipLogOther(input, intermediate, machineCost);
  const CostManFLBALT2 = FellwtChipLogOtherResults.CostManFLBALT2;
  const CostManFellCT2 = FellwtChipLogOtherResults.CostManFellCT2;
  const CYPCUresults = CYPCU(assumption, input, intermediate, machineCost);
  const CostYardPCUB = CYPCUresults.CostYardPCUB;
  const CYCCUresults = CYCCU(input, intermediate, machineCost);
  const CostYardCCUB = CYCCUresults.CostYardCCUB;
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

  const GalChainsaw = 0.0104 * 2.83168 * 0.264172; // 0.0104 L/m3 => gal/CCF
  const GalYardPCUB = CYPCUresults.GalYardPCUB;
  const GalYardCCUB = CYCCUresults.GalYardCCUB;
  const GalLoad = LoadingResults.GalLoad;
  const GalChipWT = ChippingResults.GalChipWT;

  // C. For All Products, $/ac
  const ManualFellLimbBuckAllLogTrees = (CostManFLBALT2 * intermediate.volPerAcreALT) / 100;
  const ManualFellChipTrees = (CostManFellCT2 * intermediate.volPerAcreCT) / 100;
  const CableYardUnbunchedAllTrees =
    ((input.isPartialCut === true
      ? CostYardPCUB
      : input.isPartialCut === false
      ? CostYardCCUB
      : 0) *
      intermediate.volPerAcre) /
    100;
  const LoadLogTrees = (CostLoad * intermediate.volPerAcreALT) / 100;
  const ChipWholeTrees =
    (CostChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllLogTrees +
    ManualFellChipTrees +
    CableYardUnbunchedAllTrees +
    (input.isBiomassSalvage === false ? LoadLogTrees : 0) +
    ChipWholeTrees;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipWholeTrees +
    ManualFellChipTrees +
    CableYardUnbunchedAllTrees *
      ((intermediate.boleWeightCT + intermediate.residueCT) /
        (intermediate.boleWeight + intermediate.residue));
  const Movein4PrimaryProduct = input.includeMoveInCosts
    ? MoveInCostsResults.CostPerCCFcableManualWTLog * BoleVolCCF
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
  const ManualFellLimbBuckAllLogTrees2 = (GalChainsaw * intermediate.volPerAcreALT) / 100;
  const ManualFellChipTrees2 = (GalChainsaw * intermediate.volPerAcreCT) / 100;
  const CableYardUnbunchedAllTrees2 =
    ((input.isPartialCut === true ? GalYardPCUB : input.isPartialCut === false ? GalYardCCUB : 0) *
      intermediate.volPerAcre) /
    100;
  const LoadLogTrees2 = (GalLoad * intermediate.volPerAcreALT) / 100;
  const ChipWholeTrees2 =
    (GalChipWT *
      (input.isBiomassSalvage === false ? intermediate.volPerAcreCT : intermediate.volPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    CableYardUnbunchedAllTrees2 +
    (input.isBiomassSalvage === false ? LoadLogTrees2 : 0) +
    +ChipWholeTrees2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    CableYardUnbunchedAllTrees2 *
      ((intermediate.boleWeightCT + intermediate.residueCT) /
        (intermediate.boleWeight + intermediate.residue)) +
    ChipWholeTrees2;
  const GasolineStump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllLogTrees2 + ManualFellChipTrees2;
  const GasolineStump2Truck4ResiduesWithoutMovein = ManualFellChipTrees2;
  const LowboyLoads = 4;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.includeMoveInCosts
    ? (LowboyLoads * input.moveInDistance) / mpg / input.area
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
  frcsOutputs.total.gasolinePerAcre = GasolineStump2Truck4PrimaryProductWithoutMovein;
  frcsOutputs.total.gasolinePerBoleCCF = frcsOutputs.total.gasolinePerAcre / BoleVolCCF;

  // System Summaries - Residue
  // Cost
  frcsOutputs.biomass.yieldPerAcre =
    ResidueRecoveredOptional + intermediate.boleWeightCT + ResidueRecoveredPrimary;
  frcsOutputs.biomass.costPerAcre = OntoTruck4ResiduesWoMovein + Stump2Truck4ResiduesWithoutMovein;
  frcsOutputs.biomass.costPerBoleCCF = frcsOutputs.biomass.costPerAcre / BoleVolCCF;
  frcsOutputs.biomass.costPerGT = frcsOutputs.biomass.costPerAcre / frcsOutputs.total.yieldPerAcre;
  // Fuel
  frcsOutputs.biomass.dieselPerAcre = DieselStump2Truck4ResiduesWithoutMovein;
  frcsOutputs.biomass.gasolinePerAcre = GasolineStump2Truck4ResiduesWithoutMovein;

  if (input.isBiomassSalvage) {
    frcsOutputs.biomass = frcsOutputs.total;
  }

  return frcsOutputs;
}
