export const SystemTypes = {
  groundBasedMechWt: 'Ground-Based Mech WT',
  groundBasedManualWt: 'Ground-Based Manual WT',
  groundBasedManualLog: 'Ground-Based Manual Log',
  groundBasedCtl: 'Ground-Based CTL',
  cableManualWtLog: 'Cable Manual WT/Log',
  cableManualWt: 'Cable Manual WT',
  cableManualLog: 'Cable Manual Log',
  cableCtl: 'Cable CTL',
  helicopterManualLog: 'Helicopter Manual Log',
  helicopterCtl: 'Helicopter CTL',
};

// if you add any parameters here, you must add it to the class below
// CT: chip trees; SLT: small log trees; LLT: large log trees
export interface FrcsInputs {
  system: string;
  isPartialCut: boolean; // if true, partial-cut; otherwise clear-cut.
  deliverToLandingDistance: number; // yard/skid/forward distance
  slope: number;
  elevation: number;
  includeLoadingCosts: boolean; // if include loading costs.
  includeMoveInCosts: boolean; // if include move-in costs
  area: number;
  moveInDistance: number; // area treated and one-way move-in distance are needed when movein_cost is checked.
  includeCostsCollectChipResidues: boolean; // if include the costs of collecting and chipping residues
  // tree characteristics
  woodDensityCT: number; // green wood density of chip trees
  woodDensitySLT: number;
  woodDensityLLT: number;
  residueFractionCT: number;
  residueFractionSLT: number; // residue fraction of small log trees
  residueFractionLLT: number;
  hardwoodFractionCT: number;
  hardwoodFractionSLT: number;
  hardwoodFractionLLT: number; // hardwood fraction of large log trees
  treesPerAcreCT: number; // removals of chip trees
  volumeCT: number; // volume per chip tree (ft3)
  treesPerAcreSLT: number;
  volumeSLT: number; // volume per small log tree (ft3)
  treesPerAcreLLT: number;
  volumeLLT: number; // volume per large log tree (ft3)
  // newly added variables
  dieselFuelPrice: number;
  moistureContent: number;
  isBiomassSalvage: boolean; // indicate whether all trees are harvested for biomass
  wageFaller: number;
  wageOther: number;
  laborBenefits: number;
  ppiCurrent: number;
  residueRecovFracWT: number;
  residueRecovFracCTL: number;
}

export class FrcsInputsDefault implements FrcsInputs {
  system = SystemTypes.cableManualWt;
  isPartialCut = true;
  deliverToLandingDistance = 400;
  slope = 30;
  elevation = 5000;
  includeLoadingCosts = true;
  includeMoveInCosts = true;
  area = 1;
  moveInDistance = 2;
  includeCostsCollectChipResidues = true;
  woodDensityCT = 60;
  woodDensitySLT = 58.6235;
  woodDensityLLT = 62.1225;
  residueFractionCT = 0;
  residueFractionSLT = 0.25;
  residueFractionLLT = 0.38;
  hardwoodFractionCT = 0.2;
  hardwoodFractionSLT = 0;
  hardwoodFractionLLT = 0;
  treesPerAcreCT = 20;
  volumeCT = 50;
  treesPerAcreSLT = 50;
  volumeSLT = 70;
  treesPerAcreLLT = 5;
  volumeLLT = 100;
  dieselFuelPrice = 3.61;
  moistureContent = 50;
  isBiomassSalvage = false;
  wageFaller = 35.13; // CA FallBuckWage May 2020
  wageOther = 22.07; // CA AllOthersWage May 2020
  laborBenefits = 35; // Assume a nationwide average of 35% for benefits and other payroll costs
  ppiCurrent = 284.7; // Oct 2021
  residueRecovFracWT = 80; // FRCS default 80%
  residueRecovFracCTL = 50; // FRCS default 50%
  constructor() {}
}

export interface MoveInInputs {
  system: string;
  moveInDistance: number;
  dieselFuelPrice: number;
  isBiomassSalvage: boolean;
  wageFaller: number;
  wageOther: number;
  laborBenefits: number;
  ppiCurrent: number;
}

export interface MoveInOutputs {
  totalCost: number;
  residualCost: number;
}

export class MoveInInputsDefault implements MoveInInputs {
  system = SystemTypes.cableManualWt;
  moveInDistance = 2;
  dieselFuelPrice = 3.61; // Oct 2021
  isBiomassSalvage = false;
  wageFaller = 35.13; // CA FallBuckWage May 2020
  wageOther = 22.07; // CA AllOthersWage May 2020
  laborBenefits = 35; // Assume a nationwide average of 35% for benefits and other payroll costs
  ppiCurrent = 284.7; // Oct 2021
  constructor() {}
}

// ST: small trees; ALT: all log trees
export interface IntermediateVariables {
  treesPerAcreST: number;
  treesPerAcreALT: number;
  treesPerAcre: number;
  volumeST: number;
  volumeALT: number;
  volume: number;
  volPerAcreCT: number;
  volPerAcreSLT: number;
  volPerAcreLLT: number;
  volPerAcreST: number;
  volPerAcreALT: number;
  volPerAcre: number;
  dbhCT: number;
  dbhSLT: number;
  dbhLLT: number;
  dbhST: number;
  dbhALT: number;
  dbh: number;
  heightCT: number;
  heightSLT: number;
  heightLLT: number;
  heightST: number;
  heightALT: number;
  height: number;
  woodDensityCT: number;
  woodDensitySLT: number;
  woodDensityLLT: number;
  woodDensityST: number;
  woodDensityALT: number;
  woodDensity: number;
  hardwoodFractionCT: number;
  hardwoodFractionSLT: number;
  hardwoodFractionLLT: number;
  hardwoodFractionST: number;
  hardwoodFractionALT: number;
  hardwoodFraction: number;
  buttDiamSLT: number;
  buttDiamST: number;
  buttDiam: number;
  logsPerTreeCT: number;
  logsPerTreeSLT: number;
  logsPerTreeLLT: number;
  logsPerTreeST: number;
  logsPerTreeALT: number;
  logsPerTree: number;
  logVolST: number;
  logVolALT: number;
  logVol: number;
  ctlLogsPerTreeCT: number;
  ctlLogsPerTree: number;
  ctlLogVolCT: number;
  ctlLogVol: number;
  bfPerCF: number;
  boleWeightCT: number;
  boleWeightSLT: number;
  boleWeightLLT: number;
  boleWeightST: number;
  boleWeightALT: number;
  boleWeight: number;
  residueCT: number;
  residueSLT: number;
  residueLLT: number;
  residueST: number;
  residueALT: number;
  residue: number;
  manualMachineSizeALT: number;
  manualMachineSize: number;
  mechMachineSize: number;
  chipperSize: number;
  nonSelfLevelCabDummy: number;
  cSlopeFBHarv: number;
  cRemovalsFBHarv: number;
  cSlopeSkidForwLoadSize: number;
  cHardwoodCT: number;
  cHardwoodSLT: number;
  cHardwoodLLT: number;
  cHardwoodST: number;
  cHardwoodALT: number;
  cHardwood: number;
}

export interface FrcsOutputs {
  total: {
    yieldPerAcre: number;
    costPerAcre: number;
    costPerBoleCCF: number;
    costPerGT: number;
    dieselPerAcre: number;
    dieselPerBoleCCF: number;
    gasolinePerAcre: number;
    gasolinePerBoleCCF: number;
    jetFuelPerAcre: number;
    jetFuelPerBoleCCF: number;
  };
  residual: {
    yieldPerAcre: number;
    costPerAcre: number;
    costPerBoleCCF: number;
    costPerGT: number;
    dieselPerAcre: number;
    dieselPerBoleCCF: number;
    gasolinePerAcre: number;
    gasolinePerBoleCCF: number;
    jetFuelPerAcre: number;
    jetFuelPerBoleCCF: number;
  };
}

export interface Assumptions {
  MaxManualTreeVol: number;
  MaxMechTreeVol: number;
  MoistureContent: number;
  LogLength: number;
  LoadWeightLog: number;
  LoadWeightChip: number;
  CTLTrailSpacing: number;
  HdwdCostPremium: number;
  ResidueRecovFracWT: number;
  ResidueRecovFracCTL: number;
}

export interface Limits {
  MaxLLTperAcre: number;
  MaxLLTasPercentALT: number;
  AvgTreeSizeLimit4Chipping: number; // average tree size limit for chipping
  AvgTreeSizeLimit4Processing: number; // average tree size limit for processing
  AvgTreeSizeLimit4ManualFellLimbBuck: number; // average tree size limit for manual felling, limbing & bucking
  AvgTreeSizeLimit4loading: number; // average tree size limit for loading
  AvgTreeSize4GrappleSkidding: number; // average tree size limit for grapple skidding of bunched trees
  SlopeLimit: number; // Slope, %
  YardingDistLimit: number; // Yarding distance, ft
}

export interface MachineCosts {
  PMH_Chainsaw: number;
  PMH_DriveToTree: number;
  PMH_SwingBoom: number;
  PMH_SelfLevel: number;
  FB_OwnCost: number;
  PMH_HarvS: number;
  PMH_HarvB: number;
  Harvester_OwnCost: number;
  PMH_SkidderS: number;
  PMH_SkidderB: number;
  Skidder_OwnCost: number;
  PMH_ForwarderS: number;
  PMH_ForwarderB: number;
  Forwarder_OwnCost: number;
  PMH_YarderS: number;
  PMH_YarderI: number;
  Yarder_OwnCost: number;
  PMH_ProcessorS: number;
  PMH_ProcessorB: number;
  Processor_OwnCost: number;
  PMH_LoaderS: number;
  PMH_LoaderB: number;
  Loader_OwnCost: number;
  PMH_ChipperS: number;
  PMH_ChipperB: number;
  Chipper_OwnCost: number;
  PMH_Bundler: number;
  Bundler_OwnCost: number;
}
