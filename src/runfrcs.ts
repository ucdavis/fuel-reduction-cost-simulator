// Inputs sheet
import {
  Assumptions,
  FrcsInputs,
  FrcsInputsDefault,
  FrcsOutputs,
  IntermediateVariables,
  SystemTypes,
} from './model';
import { cableCTL } from './systems/cable-ctl';
import { cableManualLog } from './systems/cable-manual-log';
import { cableManualWT } from './systems/cable-manual-wt';
import { cableManualWTLog } from './systems/cable-manual-wt-log';
import { groundCTL } from './systems/ground-ctl';
import { groundManualLog } from './systems/ground-manual-log';
import { groundManualWT } from './systems/ground-manual-wt';
import { groundMechWT } from './systems/ground-mech-wt';
import { helicopterCTL } from './systems/helicopter-ctl';
import { helicopterManualLog } from './systems/helicopter-manual-log';
import { InLimits } from './systems/methods/inlimits';

export function calculateHarvestCostsUnlimit(input: FrcsInputs) {
  const message = createErrorMessages(input);
  if (message) {
    throw new Error(message);
  }
  return calculateHarvestCosts(input);
}

function createErrorMessages(params: FrcsInputs) {
  const exampleObj = new FrcsInputsDefault();
  let message = '';
  const exampleDesc = Object.getOwnPropertyDescriptors(exampleObj);
  const paramDesc = Object.getOwnPropertyDescriptors(params);

  // check that each param exists (even if it is null)
  for (const key in exampleDesc) {
    if (!params.hasOwnProperty(key)) {
      message += 'missing param ' + key + '\n';
    }
  }

  // check that each param that exists has the correct type
  for (const key in paramDesc) {
    if (!key.includes('User') && typeof paramDesc[key].value !== typeof exampleDesc[key].value) {
      message += `wrong type for ${key} (should be ${typeof exampleDesc[key]
        .value}, was ${typeof paramDesc[key].value}) \n`;
    }
  }

  // check specific requirements
  if (params.system && !Object.values(SystemTypes).includes(params.system)) {
    message += 'unidentified System type\n';
  } else if (
    (params.system === SystemTypes.helicopterCtl ||
      params.system === SystemTypes.helicopterManualLog) &&
    params.elevation < 0
  ) {
    message += 'elevation is required to be a valid number for the system you have selected\n';
  }

  // check that the values of some params do not exceed the limits
  const err = InLimits(params);
  if (err !== '') {
    message += err;
  }

  return message;
}

function calculateHarvestCosts(input: FrcsInputs) {
  let intermediate: IntermediateVariables = {
    treesPerAcreST: 0,
    treesPerAcreALT: 0,
    treesPerAcre: 0,
    volumeST: 0,
    volumeALT: 0,
    volume: 0,
    volPerAcreCT: 0,
    volPerAcreSLT: 0,
    volPerAcreLLT: 0,
    volPerAcreST: 0,
    volPerAcreALT: 0,
    volPerAcre: 0,
    dbhCT: 0,
    dbhSLT: 0,
    dbhLLT: 0,
    dbhST: 0,
    dbhALT: 0,
    dbh: 0,
    heightCT: 0,
    heightSLT: 0,
    heightLLT: 0,
    heightST: 0,
    heightALT: 0,
    height: 0,
    woodDensityCT: 0,
    woodDensitySLT: 0,
    woodDensityLLT: 0,
    woodDensityST: 0,
    woodDensityALT: 0,
    woodDensity: 0,
    hardwoodFractionCT: 0,
    hardwoodFractionSLT: 0,
    hardwoodFractionLLT: 0,
    hardwoodFractionST: 0,
    hardwoodFractionALT: 0,
    hardwoodFraction: 0,
    buttDiamSLT: 0,
    buttDiamST: 0,
    buttDiam: 0,
    logsPerTreeCT: 0,
    logsPerTreeSLT: 0,
    logsPerTreeLLT: 0,
    logsPerTreeST: 0,
    logsPerTreeALT: 0,
    logsPerTree: 0,
    logVolST: 0,
    logVolALT: 0,
    logVol: 0,
    ctlLogsPerTreeCT: 0,
    ctlLogsPerTree: 0,
    ctlLogVolCT: 0,
    ctlLogVol: 0,
    bfPerCF: 0,
    boleWeightCT: 0,
    boleWeightSLT: 0,
    boleWeightLLT: 0,
    boleWeightST: 0,
    boleWeightALT: 0,
    boleWeight: 0,
    residueCT: 0,
    residueSLT: 0,
    residueLLT: 0,
    residueST: 0,
    residueALT: 0,
    residue: 0,
    manualMachineSizeALT: 0,
    manualMachineSize: 0,
    mechMachineSize: 0,
    chipperSize: 0,
    nonSelfLevelCabDummy: 0,
    cSlopeFBHarv: 0,
    cRemovalsFBHarv: 0,
    cSlopeSkidForwLoadSize: 0,
    cHardwoodCT: 0,
    cHardwoodSLT: 0,
    cHardwoodLLT: 0,
    cHardwoodST: 0,
    cHardwoodALT: 0,
    cHardwood: 0,
  };
  const assumption: Assumptions = {
    MaxManualTreeVol: 0,
    MaxMechTreeVol: 0,
    MoistureContent: 0,
    LogLength: 0,
    LoadWeightLog: 0,
    LoadWeightChip: 0,
    CTLTrailSpacing: 0,
    HdwdCostPremium: 0,
    ResidueRecovFracWT: 0,
    ResidueRecovFracCTL: 0,
  };
  let output: FrcsOutputs = {
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
      dieselPerBoleCCF: 0,
      gasolinePerAcre: 0,
      gasolinePerBoleCCF: 0,
      jetFuelPerAcre: 0,
      jetFuelPerBoleCCF: 0,
    },
  };

  // Other Assumptions
  assumption.MaxManualTreeVol = 150;
  assumption.MaxMechTreeVol = 80;
  assumption.MoistureContent = input.moistureContent / 100;
  assumption.LogLength = 32;
  assumption.LoadWeightLog = 25;
  assumption.LoadWeightChip = 25;
  assumption.CTLTrailSpacing = 50;
  assumption.HdwdCostPremium = 0.2;
  assumption.ResidueRecovFracWT = input.residueRecovFracWT / 100;
  assumption.ResidueRecovFracCTL = input.residueRecovFracCTL / 100;

  // When TreeVolLLT > 250
  if (input.volumeLLT > 250) {
    const originalTreeVolLLT = input.volumeLLT;
    input.volumeLLT = 250;
    output = calculateHarvestCosts(input);
    const costCCF = output.total.costPerBoleCCF;
    const dieselCCF = output.total.dieselPerBoleCCF;
    const gasolineCCF = output.total.gasolinePerBoleCCF;
    const jetFuelCCF = output.total.jetFuelPerBoleCCF;

    input.volumeLLT = originalTreeVolLLT;
    intermediate = calculateIntermediate(input, intermediate, assumption);
    const AmountRecovered = calculateAmountsRecovered(input, intermediate, assumption);
    const cost = costCCF * AmountRecovered.BoleVolCCF;
    output.total.yieldPerAcre = AmountRecovered.TotalPrimaryProductsAndOptionalResidues;
    output.total.costPerAcre = cost / input.area;
    output.total.costPerGT = cost / AmountRecovered.TotalPrimaryProductsAndOptionalResidues;

    const diesel = dieselCCF * AmountRecovered.BoleVolCCF;
    const gasoline = gasolineCCF * AmountRecovered.BoleVolCCF;
    const jetFuel = jetFuelCCF * AmountRecovered.BoleVolCCF;
    output.total.dieselPerAcre = diesel / input.area;
    output.total.gasolinePerAcre = gasoline / input.area;
    output.total.jetFuelPerAcre = jetFuel / input.area;
    return output;
  }

  intermediate = calculateIntermediate(input, intermediate, assumption);

  switch (input.system) {
    case SystemTypes.groundBasedMechWt:
      output = groundMechWT(input, intermediate, assumption);
      break;
    case SystemTypes.groundBasedManualWt:
      output = groundManualWT(input, intermediate, assumption);
      break;
    case SystemTypes.groundBasedManualLog:
      output = groundManualLog(input, intermediate, assumption);
      break;
    case SystemTypes.groundBasedCtl:
      output = groundCTL(input, intermediate, assumption);
      break;
    case SystemTypes.cableManualWtLog:
      output = cableManualWTLog(input, intermediate, assumption);
      break;
    case SystemTypes.cableManualWt:
      output = cableManualWT(input, intermediate, assumption);
      break;
    case SystemTypes.cableManualLog:
      output = cableManualLog(input, intermediate, assumption);
      break;
    case SystemTypes.cableCtl:
      output = cableCTL(input, intermediate, assumption);
      break;
    case SystemTypes.helicopterManualLog:
      output = helicopterManualLog(input, intermediate, assumption);
      break;
    case SystemTypes.helicopterCtl:
      output = helicopterCTL(input, intermediate, assumption);
      break;
  }

  return output;
}

function calculateIntermediate(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  assumption: Assumptions
) {
  // funtions
  intermediate.treesPerAcreST = input.treesPerAcreCT + input.treesPerAcreSLT;
  intermediate.treesPerAcreALT = input.treesPerAcreSLT + input.treesPerAcreLLT;
  intermediate.treesPerAcre = input.treesPerAcreCT + input.treesPerAcreSLT + input.treesPerAcreLLT;

  intermediate.volPerAcreCT = input.treesPerAcreCT * input.volumeCT;
  intermediate.volPerAcreSLT = input.treesPerAcreSLT * input.volumeSLT;
  intermediate.volPerAcreLLT = input.treesPerAcreLLT * input.volumeLLT;
  intermediate.volPerAcreST = intermediate.volPerAcreCT + intermediate.volPerAcreSLT;
  intermediate.volPerAcreALT = intermediate.volPerAcreSLT + intermediate.volPerAcreLLT;
  intermediate.volPerAcre =
    intermediate.volPerAcreCT + intermediate.volPerAcreSLT + intermediate.volPerAcreLLT;

  intermediate.volumeST =
    intermediate.treesPerAcreST > 0 ? intermediate.volPerAcreST / intermediate.treesPerAcreST : 0;
  intermediate.volumeALT =
    intermediate.treesPerAcreALT > 0
      ? intermediate.volPerAcreALT / intermediate.treesPerAcreALT
      : 0;
  intermediate.volume =
    intermediate.treesPerAcre > 0 ? intermediate.volPerAcre / intermediate.treesPerAcre : 0;

  // DBH
  intermediate.dbhCT = Math.sqrt((input.volumeCT + 3.675) / 0.216);
  intermediate.dbhSLT = Math.sqrt((input.volumeSLT + 3.675) / 0.216);
  intermediate.dbhLLT = Math.sqrt((input.volumeLLT + 3.675) / 0.216);
  intermediate.dbhST =
    intermediate.volumeST > 0
      ? Math.sqrt(
          (input.treesPerAcreCT * Math.pow(intermediate.dbhCT, 2) +
            input.treesPerAcreSLT * Math.pow(intermediate.dbhSLT, 2)) /
            intermediate.treesPerAcreST
        )
      : 0;
  intermediate.dbhALT =
    intermediate.volumeALT > 0
      ? Math.sqrt(
          (input.treesPerAcreSLT * Math.pow(intermediate.dbhSLT, 2) +
            input.treesPerAcreLLT * Math.pow(intermediate.dbhLLT, 2)) /
            intermediate.treesPerAcreALT
        )
      : 0;
  intermediate.dbh = Math.sqrt(
    (input.treesPerAcreCT * Math.pow(intermediate.dbhCT, 2) +
      intermediate.treesPerAcreALT * Math.pow(intermediate.dbhALT, 2)) /
      intermediate.treesPerAcre
  );
  // Tree Height
  intermediate.heightCT = input.volumeCT > 0 ? -20 + 24 * Math.sqrt(intermediate.dbhCT) : 0;
  intermediate.heightSLT = input.volumeSLT > 0 ? -20 + 24 * Math.sqrt(intermediate.dbhSLT) : 0;
  intermediate.heightLLT = input.volumeLLT > 0 ? -20 + 24 * Math.sqrt(intermediate.dbhLLT) : 0;
  intermediate.heightST =
    intermediate.volumeST > 0
      ? (input.treesPerAcreCT * intermediate.heightCT +
          input.treesPerAcreSLT * intermediate.heightSLT) /
        intermediate.treesPerAcreST
      : 0;
  intermediate.heightALT =
    intermediate.volumeALT > 0
      ? (input.treesPerAcreSLT * intermediate.heightSLT +
          input.treesPerAcreLLT * intermediate.heightLLT) /
        intermediate.treesPerAcreALT
      : 0;
  intermediate.height =
    intermediate.volume > 0
      ? (input.treesPerAcreCT * intermediate.heightCT +
          intermediate.treesPerAcreALT * intermediate.heightALT) /
        intermediate.treesPerAcre
      : 0;
  // Wood Density
  intermediate.woodDensityCT = input.woodDensityCT > 0 ? input.woodDensityCT : 50;
  intermediate.woodDensitySLT = input.woodDensitySLT > 0 ? input.woodDensitySLT : 50;
  intermediate.woodDensityLLT = input.woodDensityLLT > 0 ? input.woodDensityLLT : 50;
  intermediate.woodDensityST =
    intermediate.volPerAcreST > 0
      ? (intermediate.woodDensityCT * intermediate.volPerAcreCT +
          intermediate.woodDensitySLT * intermediate.volPerAcreSLT) /
        intermediate.volPerAcreST
      : 0;
  intermediate.woodDensityALT =
    intermediate.volPerAcreALT > 0
      ? (intermediate.woodDensitySLT * intermediate.volPerAcreSLT +
          intermediate.woodDensityLLT * intermediate.volPerAcreLLT) /
        intermediate.volPerAcreALT
      : 0;
  intermediate.woodDensity =
    (intermediate.woodDensityCT * intermediate.volPerAcreCT +
      intermediate.woodDensityALT * intermediate.volPerAcreALT) /
    intermediate.volPerAcre;
  // Hardwood Fraction
  intermediate.hardwoodFractionCT = !isNaN(input.hardwoodFractionCT) ? input.hardwoodFractionCT : 0;
  intermediate.hardwoodFractionSLT = !isNaN(input.hardwoodFractionSLT)
    ? input.hardwoodFractionSLT
    : 0;
  intermediate.hardwoodFractionLLT = !isNaN(input.hardwoodFractionLLT)
    ? input.hardwoodFractionLLT
    : 0;
  intermediate.hardwoodFractionST =
    intermediate.volPerAcreST > 0
      ? (intermediate.hardwoodFractionCT * intermediate.volPerAcreCT +
          intermediate.hardwoodFractionSLT * intermediate.volPerAcreSLT) /
        intermediate.volPerAcreST
      : 0;
  intermediate.hardwoodFractionALT =
    intermediate.volPerAcreALT > 0
      ? (intermediate.hardwoodFractionSLT * intermediate.volPerAcreSLT +
          intermediate.hardwoodFractionLLT * intermediate.volPerAcreLLT) /
        intermediate.volPerAcreALT
      : 0;
  intermediate.hardwoodFraction =
    (intermediate.hardwoodFractionCT * intermediate.volPerAcreCT +
      intermediate.hardwoodFractionALT * intermediate.volPerAcreALT) /
    intermediate.volPerAcre;
  // ButtDiam
  intermediate.buttDiamSLT = intermediate.dbhSLT + 3;
  intermediate.buttDiamST = intermediate.dbhST + 3;
  intermediate.buttDiam = intermediate.dbh + 3;
  // Logs Per Tree
  intermediate.logsPerTreeCT = 1;
  intermediate.logsPerTreeSLT = -0.43 + 0.678 * Math.sqrt(intermediate.dbhSLT);
  intermediate.logsPerTreeLLT = -0.43 + 0.678 * Math.sqrt(intermediate.dbhLLT);
  intermediate.logsPerTreeST =
    (intermediate.logsPerTreeCT * input.treesPerAcreCT +
      intermediate.logsPerTreeSLT * input.treesPerAcreSLT) /
    intermediate.treesPerAcreST;
  intermediate.logsPerTreeALT =
    intermediate.treesPerAcreALT === 0
      ? 0
      : (intermediate.logsPerTreeSLT * input.treesPerAcreSLT +
          intermediate.logsPerTreeLLT * input.treesPerAcreLLT) /
        intermediate.treesPerAcreALT;
  intermediate.logsPerTree =
    (intermediate.logsPerTreeCT * input.treesPerAcreCT +
      intermediate.logsPerTreeALT * intermediate.treesPerAcreALT) /
    intermediate.treesPerAcre;
  // Log Volume
  intermediate.logVolST = intermediate.volumeST / intermediate.logsPerTreeST;
  intermediate.logVolALT =
    intermediate.treesPerAcreALT === 0 ? 0 : intermediate.volumeALT / intermediate.logsPerTreeALT;
  intermediate.logVol = intermediate.volume / intermediate.logsPerTree;
  // CTL Logs Per Tree
  intermediate.ctlLogsPerTreeCT = Math.max(1, 2 * (-0.43 + 0.678 * Math.sqrt(intermediate.dbhCT)));
  intermediate.ctlLogsPerTree = Math.max(1, 2 * (-0.43 + 0.678 * Math.sqrt(intermediate.dbhST)));
  // CTL Log Volume
  intermediate.ctlLogVolCT = input.volumeCT / intermediate.ctlLogsPerTreeCT;
  intermediate.ctlLogVol = intermediate.volumeST / intermediate.ctlLogsPerTree;
  // BFperCF=5
  intermediate.bfPerCF = 5;
  // Bole Weight
  intermediate.boleWeightCT = (intermediate.woodDensityCT * intermediate.volPerAcreCT) / 2000;
  intermediate.boleWeightSLT = (intermediate.woodDensitySLT * intermediate.volPerAcreSLT) / 2000;
  intermediate.boleWeightLLT = (intermediate.woodDensityLLT * intermediate.volPerAcreLLT) / 2000;
  intermediate.boleWeightST = intermediate.boleWeightCT + intermediate.boleWeightSLT;
  intermediate.boleWeightALT = intermediate.boleWeightSLT + intermediate.boleWeightLLT;
  intermediate.boleWeight = intermediate.boleWeightCT + intermediate.boleWeightALT;
  // Residue Weight
  intermediate.residueCT = input.residueFractionCT * intermediate.boleWeightCT;
  intermediate.residueSLT = input.residueFractionSLT * intermediate.boleWeightSLT;
  intermediate.residueLLT = input.residueFractionLLT * intermediate.boleWeightLLT;
  intermediate.residueST = intermediate.residueCT + intermediate.residueSLT;
  intermediate.residueALT = intermediate.residueSLT + intermediate.residueLLT;
  intermediate.residue = intermediate.residueCT + intermediate.residueALT;
  // Manual Machine Size
  intermediate.manualMachineSizeALT = Math.min(
    1,
    intermediate.volumeALT / assumption.MaxManualTreeVol
  );
  intermediate.manualMachineSize = Math.min(1, intermediate.volume / assumption.MaxManualTreeVol);
  // Mechanized Machine Size
  intermediate.mechMachineSize = Math.min(1, intermediate.volumeST / assumption.MaxMechTreeVol);
  // Chipper Size
  intermediate.chipperSize = Math.min(1, input.volumeCT / assumption.MaxMechTreeVol);
  // NonSelfLevelCabDummy
  intermediate.nonSelfLevelCabDummy =
    input.slope < 15 ? 1 : input.slope < 35 ? 1.75 - 0.05 * input.slope : 0;
  // Cinput.SlopeFB&Harv (Mellgren 90)
  intermediate.cSlopeFBHarv =
    0.00015 * Math.pow(input.slope, 2) + 0.00359 * intermediate.nonSelfLevelCabDummy * input.slope;
  // CRemovalsFB&Harv (Mellgren 90)
  intermediate.cRemovalsFBHarv = Math.max(
    0,
    0.66 -
      0.001193 * intermediate.treesPerAcreST * 2.47 +
      5.357 * Math.pow(10, -7) * Math.pow(intermediate.treesPerAcreST * 2.47, 2)
  );
  // Cinput.SlopeSkidForwLoadSize (Mellgren 90)
  intermediate.cSlopeSkidForwLoadSize = 1 - 0.000127 * Math.pow(input.slope, 2);
  // Chardwood
  intermediate.cHardwoodCT = 1 + assumption.HdwdCostPremium * intermediate.hardwoodFractionCT;
  intermediate.cHardwoodSLT = 1 + assumption.HdwdCostPremium * intermediate.hardwoodFractionSLT;
  intermediate.cHardwoodLLT = 1 + assumption.HdwdCostPremium * intermediate.hardwoodFractionLLT;
  intermediate.cHardwoodST = 1 + assumption.HdwdCostPremium * intermediate.hardwoodFractionST;
  intermediate.cHardwoodALT = 1 + assumption.HdwdCostPremium * intermediate.hardwoodFractionALT;
  intermediate.cHardwood = 1 + assumption.HdwdCostPremium * intermediate.hardwoodFraction;

  return intermediate;
}

function calculateAmountsRecovered(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  assumption: Assumptions
) {
  let BoleVolCCF = 0;
  let ResidueRecoveredPrimary = 0;
  let PrimaryProduct = 0;
  let ResidueRecoveredOptional = 0;
  let TotalPrimaryProductsAndOptionalResidues = 0;
  switch (input.system) {
    case SystemTypes.groundBasedMechWt:
      BoleVolCCF = intermediate.volPerAcre / 100;
      ResidueRecoveredPrimary = assumption.ResidueRecovFracWT * intermediate.residueCT;
      PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
      ResidueRecoveredOptional = input.includeCostsCollectChipResidues
        ? assumption.ResidueRecovFracWT * intermediate.residueSLT
        : 0;
      TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
      break;
    case SystemTypes.groundBasedManualWt:
      BoleVolCCF = intermediate.volPerAcre / 100;
      ResidueRecoveredPrimary = assumption.ResidueRecovFracWT * intermediate.residueCT;
      PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
      ResidueRecoveredOptional = input.includeCostsCollectChipResidues
        ? assumption.ResidueRecovFracWT * intermediate.residueSLT
        : 0;
      TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
      break;
    case SystemTypes.groundBasedManualLog:
      BoleVolCCF = intermediate.volPerAcre / 100;
      ResidueRecoveredPrimary = 0;
      PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
      ResidueRecoveredOptional = 0;
      TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
      break;
    case SystemTypes.groundBasedCtl:
      BoleVolCCF = intermediate.volPerAcreST / 100;
      ResidueRecoveredPrimary = 0;
      PrimaryProduct = intermediate.boleWeightST + ResidueRecoveredPrimary;
      ResidueRecoveredOptional = input.includeCostsCollectChipResidues
        ? assumption.ResidueRecovFracCTL * intermediate.residueST
        : 0;
      TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
      break;
    case SystemTypes.cableManualWtLog:
      BoleVolCCF = intermediate.volPerAcre / 100;
      ResidueRecoveredPrimary = assumption.ResidueRecovFracWT * intermediate.residueCT;
      PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
      ResidueRecoveredOptional = 0;
      TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
      break;
    case SystemTypes.cableManualWt:
      BoleVolCCF = intermediate.volPerAcre / 100;
      ResidueRecoveredPrimary = assumption.ResidueRecovFracWT * intermediate.residueCT;
      PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
      ResidueRecoveredOptional = input.includeCostsCollectChipResidues
        ? assumption.ResidueRecovFracWT * intermediate.residueSLT
        : 0;
      TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
      break;
    case SystemTypes.cableManualLog:
      BoleVolCCF = intermediate.volPerAcre / 100;
      ResidueRecoveredPrimary = 0;
      PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
      ResidueRecoveredOptional = 0;
      TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
      break;
    case SystemTypes.cableCtl:
      BoleVolCCF = intermediate.volPerAcreST / 100;
      ResidueRecoveredPrimary = 0;
      PrimaryProduct = intermediate.boleWeightST + ResidueRecoveredPrimary;
      ResidueRecoveredOptional = 0;
      TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
      break;
    case SystemTypes.helicopterManualLog:
      BoleVolCCF = intermediate.volPerAcre / 100;
      ResidueRecoveredPrimary = 0;
      PrimaryProduct = intermediate.boleWeight + ResidueRecoveredPrimary;
      ResidueRecoveredOptional = 0;
      TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
      break;
    case SystemTypes.helicopterCtl:
      BoleVolCCF = intermediate.volPerAcreST / 100;
      ResidueRecoveredPrimary = 0;
      PrimaryProduct = intermediate.boleWeightST + ResidueRecoveredPrimary;
      ResidueRecoveredOptional = 0;
      TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;
      break;
  }
  return {
    BoleVolCCF,
    ResidueRecoveredPrimary,
    ResidueRecoveredOptional,
    TotalPrimaryProductsAndOptionalResidues,
  };
  // tslint:disable-next-line: max-file-line-count
}
