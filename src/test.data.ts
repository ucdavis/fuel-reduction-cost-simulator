import { FrcsInputs, SystemTypes } from './model';

const testGroundMechWt: FrcsInputs = {
  system: SystemTypes.groundBasedMechWt,
  isPartialCut: false,
  deliverToLandingDistance: 553.9059701791816,
  slope: 12.4204116232628,
  elevation: 1586.2924459463827,
  includeLoadingCosts: true,
  includeMoveInCosts: false,
  moveInDistance: 0,
  area: 32.025456,
  includeCostsCollectChipResidues: true,
  woodDensityCT: 81.08754477475162,
  woodDensitySLT: 67.169795406641,
  woodDensityLLT: 57.64241518721146,
  residueFractionCT: 0.2695949034364167,
  residueFractionSLT: 0.2968554014193552,
  residueFractionLLT: 0.2635482997321487,
  hardwoodFractionCT: 0.2,
  hardwoodFractionSLT: 0,
  hardwoodFractionLLT: 0,
  treesPerAcreCT: 77.41439577247948,
  treesPerAcreSLT: 19.69666658424669,
  treesPerAcreLLT: 2.6986111029077113,
  volumeCT: 2.0570140545145352,
  volumeSLT: 23.602336943950174,
  volumeLLT: 137.70275419498432,
  dieselFuelPrice: 2.24,
  moistureContent: 50,
  isBiomassSalvage: false,
  wageFaller: 35.13,
  wageOther: 22.07,
  laborBenefits: 35,
  ppiCurrent: 284.7,
  residueRecovFracWT: 80,
  residueRecovFracCTL: 50,
};

const testGroundManualWt: FrcsInputs = {
  ...testGroundMechWt,
  system: SystemTypes.groundBasedManualWt,
};
const testGroundManualLog: FrcsInputs = {
  ...testGroundMechWt,
  system: SystemTypes.groundBasedManualLog,
};
const testGroundBasedCtl: FrcsInputs = {
  ...testGroundMechWt,
  system: SystemTypes.groundBasedCtl,
};
const testCableManualWtLog: FrcsInputs = {
  ...testGroundMechWt,
  system: SystemTypes.cableManualWtLog,
};
const testCableManualWt: FrcsInputs = { ...testGroundMechWt, system: SystemTypes.cableManualWt };
const testCableManualLog: FrcsInputs = { ...testGroundMechWt, system: SystemTypes.cableManualLog };
const testCableCTL: FrcsInputs = { ...testGroundMechWt, system: SystemTypes.cableCtl };
const testHelicopterManualLog: FrcsInputs = {
  ...testGroundMechWt,
  system: SystemTypes.helicopterManualLog,
};

export {
  testGroundMechWt,
  testGroundManualWt,
  testGroundManualLog,
  testGroundBasedCtl,
  testCableManualWtLog,
  testCableManualWt,
  testCableManualLog,
  testCableCTL,
  testHelicopterManualLog,
};
