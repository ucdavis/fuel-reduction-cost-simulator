export interface InputVarMod {
    system: string;
    cut_type: number; // if clear_cut, cut_type = 0; otherwise 1.
    deliver_dist: number;
    Slope: number;
    elevation: number;
    load_cost: number; // if include loading costs, load_cost=1; otherwise 0.
    CalcMoveIn: number; // if include move-in costs
    Area: number;
    MoveInDist: number; // area treated and one-way move-in distance are needed when movein_cost is checked.
    CalcResidues: number; // if include the costs of collecting and chipping residues

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
    RemovalsSLT: number;
    RemovalsLLT: number;
    TreeVolCT: number;
    TreeVolSLT: number; // tree volume of small log trees
    TreeVolLLT: number;
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
    BoleVolCCF: number;
    ResidueRecoveredPrimary: number;
    PrimaryProduct: number;
    ResidueRecoveredOptional: number;
    TotalPrimaryAndOptional: number;
    TotalPrimaryProductsAndOptionalResidues: number;
    GroundFuel: number;
    PiledFuel: number;
    ResidueUncutTrees: number;
    TotalResidues: number;
    Movein4PrimaryProduct: number;
    OntoTruck4ResiduesWoMovein: number;
    ChipLooseResiduesFromLogTreesLess80cf: number;
    FellAndBunchTreesLess80cf: number;
    ManualFellLimbBuckTreesLarger80cf: number;
    SkidBunchedAllTrees: number;
    ProcessLogTreesLess80cf: number;
    LoadLogTrees: number;
    ChipWholeTrees: number;
    Stump2Truck4PrimaryProductWithoutMovein: number;
    TotalPerAcre: number;
    TotalPerBoleCCF: number;
    TotalPerGT: number;
}

export interface CostMachineMod {
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
