// Felling (WT small, log other) sheet
import { CostMachineMod } from 'methods/frcs.model';

function FellwtSmallLogOther(Slope: number, Removals: number, TreeVolST: number, TreeVolLLT: number,
                             PartialCut: boolean, DBHST: number, DBHLLT: number, LogsPerTreeST: number,
                             LogsPerTreeLLT: number, CostMachine: CostMachineMod, CHardwoodST: number,
                             CHardwoodLLT: number) {
    // Felling Calculated Values
    const WalkDistAT = Math.sqrt(43560 / Math.max(Removals, 1));
    // Small Trees
    // I. Felling Only
    // A) (McNeel, 94)
    const SelectionTimePerTreeIAst = 0.568 + 0.0193 * 0.305 * WalkDistAT + 0.0294 * 2.54 * DBHST;
    const ClearcutTimePerTreeIAst = 0.163 + 0.0444 * 0.305 * WalkDistAT + 0.0323 * 2.54 * DBHST;
    const TimePerTreeIAst = PartialCut === true ? SelectionTimePerTreeIAst
        : Math.min(SelectionTimePerTreeIAst, ClearcutTimePerTreeIAst);
    const VolPerPMHIAst = TreeVolST / (TimePerTreeIAst / 60);
    const CostPerCCFIAst = 100 * CostMachine.PMH_Chainsaw / VolPerPMHIAst;
    const RelevanceIAst = 1;
    // B) (Peterson, 87)
    const TimePerTreeIBst = DBHST < 10 ? 0.33 + 0.012 * DBHST : 0.1 + 0.0111 * Math.pow(DBHST, 1.496);
    const VolPerPMHIBst = TreeVolST / (TimePerTreeIBst / 60);
    const CostPerCCFIBst = 100 * CostMachine.PMH_Chainsaw / VolPerPMHIBst;
    const RelevanceIBst = 1;
    // C) (Keatley, 2000)
    const TimePerTreeICst = Math.sqrt(4.58 + 0.07 * WalkDistAT + 0.16 * DBHST);
    const VolPerPMHICst = TreeVolST / (TimePerTreeICst / 60);
    const CostPerCCFICst = 100 * CostMachine.PMH_Chainsaw / VolPerPMHICst;
    const RelevanceICst = 1;
    // D) (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests:
    // summary of harvesting system performance.  FERIC Technical Report TR-120)
    const TimePerTreeIDst = 1.082 + 0.01505 * TreeVolST - 0.634 / TreeVolST;
    const VolPerPMHIDst = TreeVolST / (TimePerTreeIDst / 60);
    const CostPerCCFIDst = 100 * CostMachine.PMH_Chainsaw / VolPerPMHIDst;
    const RelevanceIDst = TreeVolST < 0.6 ? 0 : (TreeVolST < 15 ? 1 - (15 / (15 - 0.6))
        + (TreeVolST / (15 - 0.6)) : (TreeVolST < 90 ? 1 : (TreeVolST < 180 ? 2 - TreeVolST / 90 : 0)));
    // E) User-Defined Felling Only
    const VolPerPMHIEst = 0.001;
    const CostPerCCFIEst = 100 * CostMachine.PMH_Chainsaw / VolPerPMHIEst;
    const RelevanceIEst = 0;
    // Summary
    const CostManFellST2 = TreeVolST > 0 ? CHardwoodST * 100 * (CostMachine.PMH_Chainsaw * RelevanceIAst
        + CostMachine.PMH_Chainsaw * RelevanceIBst + CostMachine.PMH_Chainsaw * RelevanceICst
        + CostMachine.PMH_Chainsaw * RelevanceIDst + CostMachine.PMH_Chainsaw * RelevanceIEst)
        / (RelevanceIAst * VolPerPMHIAst + RelevanceIBst * VolPerPMHIBst + RelevanceICst * VolPerPMHICst
            + RelevanceIDst * VolPerPMHIDst + RelevanceIEst * VolPerPMHIEst) : 0;
    // II. Felling, Limbing & Bucking - not used

    // Large Log Trees
    // Felling Calculated Values
    const WalkDistAT2 = Math.sqrt(43560 / Removals);
    // I. Felling Only - not used
    // II. Felling, Limbing & Bucking
    // A)  (Kellogg&Olsen, 86)
    const EastsideAdjustmentIIAllt = 1.2;
    const ClearcutAdjustmentIIAllt = 0.9;
    const TimePerTreeIIAllt = EastsideAdjustmentIIAllt * (PartialCut === true ? 1 : (PartialCut === false ?
        ClearcutAdjustmentIIAllt : 0)) * (1.33 + 0.0187 * WalkDistAT2 + 0.0143 * Slope + 0.0987 * TreeVolLLT + 0.14);
    const VolPerPMHIIAllt = TreeVolLLT / (TimePerTreeIIAllt / 60);
    const CostPerCCFIIAllt = 100 * CostMachine.PMH_Chainsaw / VolPerPMHIIAllt;
    const RelevanceIIAllt = 1;
    // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
    // IF(treevol<90,1,IF(treevol<180,2-treevol/90,0))
    // B) (Kellogg, L., M. Miller and E. Olsen, 1999)  Skyline thinning production and costs:
    // experience from the Willamette Young Stand Project. Research Contribtion 21.
    // Forest Research Laboratory, Oregon State University, Corvallis.
    const LimbsIIBllt = 31.5;
    const LogsIIBllt = LogsPerTreeLLT;
    const WedgeIIBllt = 0.02;
    const CorridorIIBllt = 0.21;
    const NotBetweenOpeningsIIBllt = 1;
    const OpeningsIIBllt = 0;
    const HeavyThinIIBllt = 0;
    const DelayFracIIBllt = 0.25;
    const TimePerTreeIIBllt = (-0.465 + 0.102 * DBHLLT + 0.016 * LimbsIIBllt + 0.562 * LogsIIBllt + 0.009 * Slope
        + 0.734 * WedgeIIBllt + 0.137 * CorridorIIBllt + 0.449 * NotBetweenOpeningsIIBllt + 0.437 * OpeningsIIBllt
        + 0.426 * HeavyThinIIBllt) * (1 + DelayFracIIBllt);
    const VolPerPMHIIBllt = TreeVolLLT / (TimePerTreeIIBllt / 60);
    const CostPerCCFIIBllt = 100 * CostMachine.PMH_Chainsaw / VolPerPMHIIBllt;
    const RelevanceIIBllt = 1;
    // RelevanceIIBllt =IF(TreeVolLLT<1,0,IF(TreeVolLLT<2,-1+TreeVolLLT/1,IF(TreeVolLLT<70,1,1.2-TreeVolLLT/350)))
    // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
    // IF(treevol<1,0,IF(treevol<2,-1+treevol/1,IF(treevol<70,1,IF(treevol<140,2-treevol/70,0))))
    // C) (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of
    // harvesting system performance. FERIC Technical Report TR-120)
    const DelayFracIICllt = 0.197;
    const TimePerTreeIICllt = (1.772 + 0.02877 * TreeVolLLT - 2.6486 / TreeVolLLT) * (1 + DelayFracIICllt);
    const VolPerPMHIICllt = TreeVolLLT / (TimePerTreeIICllt / 60);
    const CostPerCCFIICllt = 100 * CostMachine.PMH_Chainsaw / VolPerPMHIICllt;
    const RelevanceIICllt = TreeVolLLT < 5 ? 0 : (TreeVolLLT < 15 ? -0.5 + TreeVolLLT / 10 : 1);
    // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
    // IF(treevol<5,0,IF(treevol<15,-0.5+treevol/10,IF(treevol<90,1,IF(treevol<180,2-treevol/90,0))))
    // D) User-Defined Felling, Limbing & Bucking
    const VolPerPMHIIDllt = 0.001;
    const CostPerCCFIIDllt = 100 * CostMachine.PMH_Chainsaw / VolPerPMHIIDllt;
    const RelevanceIIDllt = 0;
    // Summary;
    const CostManFLBLLT2 = TreeVolLLT > 0 ? CHardwoodLLT * 100 * (CostMachine.PMH_Chainsaw * RelevanceIIAllt
        + CostMachine.PMH_Chainsaw * RelevanceIIBllt + CostMachine.PMH_Chainsaw * RelevanceIICllt
        + CostMachine.PMH_Chainsaw * RelevanceIIDllt) / (RelevanceIIAllt * VolPerPMHIIAllt
        + RelevanceIIBllt * VolPerPMHIIBllt + RelevanceIICllt * VolPerPMHIICllt + RelevanceIIDllt * VolPerPMHIIDllt)
        : 0;

    return {
        'CostManFellST2': CostManFellST2, 'CostManFLBLLT2': CostManFLBLLT2
    };
}

export { FellwtSmallLogOther };
