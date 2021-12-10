// Felling (WT small, log other) sheet
import { FrcsInputs, IntermediateVariables, MachineCosts } from '../../model';
import { FellAllTrees } from './fellalltrees';

function FellwtSmallLogOther(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  machineCost: MachineCosts
) {
  // Felling Calculated Values
  const WalkDistAT = Math.sqrt(43560 / Math.max(intermediate.treesPerAcre, 1));
  // Small Trees
  // I. Felling Only
  // A) (McNeel, 94)
  const SelectionTimePerTreeIAst =
    0.568 + 0.0193 * 0.305 * WalkDistAT + 0.0294 * 2.54 * intermediate.dbhST;
  const ClearcutTimePerTreeIAst =
    0.163 + 0.0444 * 0.305 * WalkDistAT + 0.0323 * 2.54 * intermediate.dbhST;
  const TimePerTreeIAst =
    input.isPartialCut === true
      ? SelectionTimePerTreeIAst
      : Math.min(SelectionTimePerTreeIAst, ClearcutTimePerTreeIAst);
  const VolPerPMHIAst = intermediate.volumeST / (TimePerTreeIAst / 60);
  const CostPerCCFIAst = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIAst;
  const RelevanceIAst = 1;
  // B) (Peterson, 87)
  const TimePerTreeIBst =
    intermediate.dbhST < 10
      ? 0.33 + 0.012 * intermediate.dbhST
      : 0.1 + 0.0111 * Math.pow(intermediate.dbhST, 1.496);
  const VolPerPMHIBst = intermediate.volumeST / (TimePerTreeIBst / 60);
  const CostPerCCFIBst = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIBst;
  const RelevanceIBst = 1;
  // C) (Keatley, 2000)
  const TimePerTreeICst = Math.sqrt(4.58 + 0.07 * WalkDistAT + 0.16 * intermediate.dbhST);
  const VolPerPMHICst = intermediate.volumeST / (TimePerTreeICst / 60);
  const CostPerCCFICst = (100 * machineCost.PMH_Chainsaw) / VolPerPMHICst;
  const RelevanceICst = 1;
  // D) (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests:
  // summary of harvesting system performance.  FERIC Technical Report TR-120)
  const TimePerTreeIDst = 1.082 + 0.01505 * intermediate.volumeST - 0.634 / intermediate.volumeST;
  const VolPerPMHIDst = intermediate.volumeST / (TimePerTreeIDst / 60);
  const CostPerCCFIDst = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIDst;
  let RelevanceIDst =
    intermediate.volumeST < 0.6
      ? 0
      : intermediate.volumeST < 15
      ? 1 - 15 / (15 - 0.6) + intermediate.volumeST / (15 - 0.6)
      : intermediate.volumeST < 90
      ? 1
      : intermediate.volumeST < 180
      ? 2 - intermediate.volumeST / 90
      : 0;
  // E) User-Defined Felling Only
  const VolPerPMHIEst = 0.001;
  const CostPerCCFIEst = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIEst;
  const RelevanceIEst = 0;

  const FellAllTreesResults = FellAllTrees(input, intermediate, machineCost);
  const RelevanceIDat = FellAllTreesResults.RelevanceIDat;
  const RelevanceIIBat = FellAllTreesResults.RelevanceIIBat;
  // Summary
  RelevanceIDst = Math.min(RelevanceIDst, RelevanceIDat);
  const CostManFellST2 =
    intermediate.volumeST > 0
      ? (intermediate.cHardwoodST *
          100 *
          (machineCost.PMH_Chainsaw * RelevanceIAst +
            machineCost.PMH_Chainsaw * RelevanceIBst +
            machineCost.PMH_Chainsaw * RelevanceICst +
            machineCost.PMH_Chainsaw * RelevanceIDst +
            machineCost.PMH_Chainsaw * RelevanceIEst)) /
        (RelevanceIAst * VolPerPMHIAst +
          RelevanceIBst * VolPerPMHIBst +
          RelevanceICst * VolPerPMHICst +
          RelevanceIDst * VolPerPMHIDst +
          RelevanceIEst * VolPerPMHIEst)
      : 0;
  // II. Felling, Limbing & Bucking - not used

  // Large Log Trees
  // Felling Calculated Values
  const WalkDistAT2 = Math.sqrt(43560 / intermediate.treesPerAcre);
  // I. Felling Only - not used
  // II. Felling, Limbing & Bucking
  // A)  (Kellogg&Olsen, 86)
  const EastsideAdjustmentIIAllt = 1.2;
  const ClearcutAdjustmentIIAllt = 0.9;
  const TimePerTreeIIAllt =
    EastsideAdjustmentIIAllt *
    (input.isPartialCut === true
      ? 1
      : input.isPartialCut === false
      ? ClearcutAdjustmentIIAllt
      : 0) *
    (1.33 + 0.0187 * WalkDistAT2 + 0.0143 * input.slope + 0.0987 * input.volumeLLT + 0.14);
  const VolPerPMHIIAllt = input.volumeLLT / (TimePerTreeIIAllt / 60);
  const CostPerCCFIIAllt = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIIAllt;
  const RelevanceIIAllt = 1;
  // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
  // IF(treevol<90,1,IF(treevol<180,2-treevol/90,0))

  // B) (Kellogg, L., M. Miller and E. Olsen, 1999)  Skyline thinning production and costs:
  // experience from the Willamette Young Stand Project. Research Contribtion 21.
  // Forest Research Laboratory, Oregon State University, Corvallis.
  const LimbsIIBllt = 31.5;
  const LogsIIBllt = intermediate.logsPerTreeLLT;
  const WedgeIIBllt = 0.02;
  const CorridorIIBllt = 0.21;
  const NotBetweenOpeningsIIBllt = 1;
  const OpeningsIIBllt = 0;
  const HeavyThinIIBllt = input.isPartialCut ? 0 : 1;
  const DelayFracIIBllt = 0.25;
  const TimePerTreeIIBllt =
    (-0.465 +
      0.102 * intermediate.dbhLLT +
      0.016 * LimbsIIBllt +
      0.562 * LogsIIBllt +
      0.009 * input.slope +
      0.734 * WedgeIIBllt +
      0.137 * CorridorIIBllt +
      0.449 * NotBetweenOpeningsIIBllt +
      0.437 * OpeningsIIBllt +
      0.426 * HeavyThinIIBllt) *
    (1 + DelayFracIIBllt);
  const VolPerPMHIIBllt = input.volumeLLT / (TimePerTreeIIBllt / 60);
  const CostPerCCFIIBllt = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIIBllt;
  const RelevanceIIBllt = 1;

  // RelevanceIIBllt =IF(input.TreeVolLLT<1,0,IF(input.TreeVolLLT<2,-1+input.TreeVolLLT/1,
  // IF(input.TreeVolLLT<70,1,1.2-input.TreeVolLLT/350)))
  // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
  // IF(treevol<1,0,IF(treevol<2,-1+treevol/1,IF(treevol<70,1,IF(treevol<140,2-treevol/70,0))))

  // C) (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of
  // harvesting system performance. FERIC Technical Report TR-120)
  const DelayFracIICllt = 0.197;
  const TimePerTreeIICllt =
    (1.772 + 0.02877 * input.volumeLLT - 2.6486 / input.volumeLLT) * (1 + DelayFracIICllt);
  const VolPerPMHIICllt = input.volumeLLT / (TimePerTreeIICllt / 60);
  const CostPerCCFIICllt = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIICllt;
  const RelevanceIICllt =
    input.volumeLLT < 5 ? 0 : input.volumeLLT < 15 ? -0.5 + input.volumeLLT / 10 : 1;

  // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
  // IF(treevol<5,0,IF(treevol<15,-0.5+treevol/10,IF(treevol<90,1,IF(treevol<180,2-treevol/90,0))))
  // D) User-Defined Felling, Limbing & Bucking
  const VolPerPMHIIDllt = 0.001;
  const CostPerCCFIIDllt = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIIDllt;
  const RelevanceIIDllt = 0;

  // Summary;
  const CostManFLBLLT2 =
    input.volumeLLT > 0
      ? (intermediate.cHardwoodLLT *
          100 *
          (machineCost.PMH_Chainsaw * RelevanceIIAllt +
            machineCost.PMH_Chainsaw * RelevanceIIBat +
            machineCost.PMH_Chainsaw * RelevanceIICllt +
            machineCost.PMH_Chainsaw * RelevanceIIDllt)) /
        (RelevanceIIAllt * VolPerPMHIIAllt +
          RelevanceIIBat * VolPerPMHIIBllt +
          RelevanceIICllt * VolPerPMHIICllt +
          RelevanceIIDllt * VolPerPMHIIDllt)
      : 0;

  return {
    CostManFellST2: CostManFellST2,
    CostManFLBLLT2: CostManFLBLLT2,
  };
}

export { FellwtSmallLogOther };
