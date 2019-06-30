export interface InputVarMod {
    system: string;
    cut_type: boolean; // if clear_cut, cut_type = 0; otherwise 1.
    deliver_dist: number;
    Slope: number;
    elevation: number;
    load_cost: boolean; // if include loading costs, load_cost=1; otherwise 0.
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
    RemovalsSLT: number;
    RemovalsLLT: number;
    TreeVolCT: number;
    TreeVolSLT: number; // tree volume of small log trees
    TreeVolLLT: number;
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
