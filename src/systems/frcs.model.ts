export const SystemTypes = {
  groundBasedMechWt: 'Ground-Based Mech WT',
  groundBasedManualWt: 'Ground-Based Manual WT',
  groundBasedManualLog: 'Ground-Based Manual Log',
  groundBasedCtl: 'Ground-Based CTL',
  cableManualWtLog: 'Cable Manual WT/Log',
  cableManualWt: 'Cable Manual WT',
  cableManualLog: 'Cable Manual Log',
  cableCtl: 'Cable CTL',
  helicopterManualWt: 'Helicopter Manual Log',
  helicopterCtl: 'Helicopter CTL',
};

// if you add any parameters here, you must add it to the class below
export interface InputVarMod {
  System: string;
  PartialCut: boolean; // if true, partial-cut; otherwise clear-cut.
  DeliverDist: number;
  Slope: number;
  Elevation: number;
  CalcLoad: boolean; // if include loading costs.
  CalcMoveIn: boolean; // if include move-in costs
  Area: number;
  MoveInDist: number; // area treated and one-way move-in distance are needed when movein_cost is checked.
  CalcResidues: boolean; // if include the costs of collecting and chipping residues

  // ct: chip trees; slt: small log trees; llt: large log trees; rm: removals; tv: tree volume;
  // gwd: green wood density; rf: residue fraction; hf: hardwood fraction

  UserSpecWDCT: number; // green wood density of chip trees
  UserSpecWDSLT: number;
  UserSpecWDLLT: number;
  UserSpecRFCT: number;
  UserSpecRFSLT: number; // residue fraction of small log trees
  UserSpecRFLLT: number;
  UserSpecHFCT: number;
  UserSpecHFSLT: number;
  UserSpecHFLLT: number; // hardwood fraction of large log trees

  RemovalsCT: number; // removals of chip trees
  TreeVolCT: number;
  RemovalsSLT: number;
  TreeVolSLT: number; // tree volume of small log trees
  RemovalsLLT: number;
  TreeVolLLT: number;

  DieselFuelPrice: number;
  MoistureContent: number;
  ChipAll: boolean;
}

export class InputVar implements InputVar {
  System = 'Cable Manual WT';
  PartialCut = true;
  DeliverDist = 400;
  Slope = 30;
  Elevation = 5000;
  CalcLoad = true;
  CalcMoveIn = true;
  Area = 1;
  MoveInDist = 2;
  CalcResidues = true;
  UserSpecWDCT = 60;
  UserSpecWDSLT = 58.6235;
  UserSpecWDLLT = 62.1225;
  UserSpecRFCT = 0;
  UserSpecRFSLT = 0.25;
  UserSpecRFLLT = 0.38;
  UserSpecHFCT = 0.2;
  UserSpecHFSLT = 0;
  UserSpecHFLLT = 0;
  RemovalsCT = 20;
  TreeVolCT = 50;
  RemovalsSLT = 50;
  TreeVolSLT = 70;
  RemovalsLLT = 5;
  TreeVolLLT = 100;
  DieselFuelPrice = 3.356;
  MoistureContent = 50;
  ChipAll = false;
  constructor() {}
}

export interface MoveInInputVarMod {
  System: string;
  MoveInDist: number;
  DieselFuelPrice: number;
  ChipAll: boolean;
}

export class MoveInInputVar implements MoveInInputVar {
  System = 'Cable Manual WT';
  Area = 1;
  MoveInDist = 2;
  DieselFuelPrice = 3.356;
  ChipAll = false;
  constructor() {}
}

export interface IntermediateVarMod {
  RemovalsST: number;
  RemovalsALT: number;
  Removals: number;
  TreeVolST: number;
  TreeVolALT: number;
  TreeVol: number;
  VolPerAcreCT: number;
  VolPerAcreSLT: number;
  VolPerAcreLLT: number;
  VolPerAcreST: number;
  VolPerAcreALT: number;
  VolPerAcre: number;
  DBHCT: number;
  DBHSLT: number;
  DBHLLT: number;
  DBHST: number;
  DBHALT: number;
  DBH: number;
  HeightCT: number;
  HeightSLT: number;
  HeightLLT: number;
  HeightST: number;
  HeightALT: number;
  Height: number;
  WoodDensityCT: number;
  WoodDensitySLT: number;
  WoodDensityLLT: number;
  WoodDensityST: number;
  WoodDensityALT: number;
  WoodDensity: number;
  HdwdFractionCT: number;
  HdwdFractionSLT: number;
  HdwdFractionLLT: number;
  HdwdFractionST: number;
  HdwdFractionALT: number;
  HdwdFraction: number;
  ButtDiamSLT: number;
  ButtDiamST: number;
  ButtDiam: number;
  LogsPerTreeCT: number;
  LogsPerTreeSLT: number;
  LogsPerTreeLLT: number;
  LogsPerTreeST: number;
  LogsPerTreeALT: number;
  LogsPerTree: number;
  LogVolST: number;
  LogVolALT: number;
  LogVol: number;
  CTLLogsPerTreeCT: number;
  CTLLogsPerTree: number;
  CTLLogVolCT: number;
  CTLLogVol: number;
  BFperCF: number;
  BoleWtCT: number;
  BoleWtSLT: number;
  BoleWtLLT: number;
  BoleWtST: number;
  BoleWtALT: number;
  BoleWt: number;
  ResidueCT: number;
  ResidueSLT: number;
  ResidueLLT: number;
  ResidueST: number;
  ResidueALT: number;
  Residue: number;
  ManualMachineSizeALT: number;
  ManualMachineSize: number;
  MechMachineSize: number;
  ChipperSize: number;
  NonSelfLevelCabDummy: number;
  CSlopeFB_Harv: number;
  CRemovalsFB_Harv: number;
  CSlopeSkidForwLoadSize: number;
  CHardwoodCT: number;
  CHardwoodSLT: number;
  CHardwoodLLT: number;
  CHardwoodST: number;
  CHardwoodALT: number;
  CHardwood: number;
}

export interface OutputVarMod {
  Total: {
    WeightPerAcre: number;
    CostPerAcre: number;
    CostPerBoleCCF: number;
    CostPerGT: number;
    DieselPerAcre: number;
    DieselPerBoleCCF: number;
    GasolinePerAcre: number;
    GasolinePerBoleCCF: number;
    JetFuelPerAcre: number;
    JetFuelPerBoleCCF: number;
  };
  Residue: {
    WeightPerAcre: number;
    CostPerAcre: number;
    CostPerBoleCCF: number;
    CostPerGT: number;
    DieselPerAcre: number;
    GasolinePerAcre: number;
    JetFuelPerAcre: number;
  };
}

export interface AssumptionMod {
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

export interface LimitMod {
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

export interface MachineCostMod {
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
