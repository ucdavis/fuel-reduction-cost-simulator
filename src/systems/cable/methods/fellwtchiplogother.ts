// Felling (WT chip, log other) sheet
import { FrcsInputs, IntermediateVariables, MachineCosts } from '../../frcs.model';

function FellwtChipLogOther(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  machineCost: MachineCosts
) {
  // Felling Calculated Values
  const WalkDistAT = Math.sqrt(43560 / Math.max(intermediate.treesPerAcre, 1));
  // Chip Trees
  // I. Felling Only
  // A) (McNeel, 94)
  const SelectionTimePerTreeIA =
    0.568 + 0.0193 * 0.305 * WalkDistAT + 0.0294 * 2.54 * intermediate.dbhCT;
  const ClearcutTimePerTreeIA =
    0.163 + 0.0444 * 0.305 * WalkDistAT + 0.0323 * 2.54 * intermediate.dbhCT;
  const TimePerTreeIA =
    input.isPartialCut === true
      ? SelectionTimePerTreeIA
      : Math.min(SelectionTimePerTreeIA, ClearcutTimePerTreeIA);
  const VolPerPMHIA = input.volumeCT / (TimePerTreeIA / 60);
  const CostPerCCFIA = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIA;
  const RelevanceIA = 1;
  // B) (Peterson, 87)
  const TimePerTreeIB =
    intermediate.dbhCT < 10
      ? 0.33 + 0.012 * intermediate.dbhCT
      : 0.1 + 0.0111 * Math.pow(intermediate.dbhCT, 1.496);
  const VolPerPMHIB = input.volumeCT / (TimePerTreeIB / 60);
  const CostPerCCFIB = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIB;
  const RelevanceIB = 1;
  // C) (Keatley, 2000)
  const TimePerTreeIC = Math.sqrt(4.58 + 0.07 * WalkDistAT + 0.16 * intermediate.dbhCT);
  const VolPerPMHIC = input.volumeCT / (TimePerTreeIC / 60);
  const CostPerCCFIC = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIC;
  const RelevanceIC = 1;
  // D) (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests:
  // summary of harvesting system performance.  FERIC Technical Report TR-120)
  const TimePerTreeID = 1.082 + 0.01505 * input.volumeCT - 0.634 / input.volumeCT;
  const VolPerPMHID = input.volumeCT / (TimePerTreeID / 60);
  const CostPerCCFID = (100 * machineCost.PMH_Chainsaw) / VolPerPMHID;
  const RelevanceID =
    input.volumeCT < 0.6
      ? 0
      : input.volumeCT < 15
      ? 1 - 15 / (15 - 0.6) + input.volumeCT / (15 - 0.6)
      : input.volumeCT < 90
      ? 1
      : input.volumeCT < 180
      ? 2 - input.volumeCT / 90
      : 0;
  // E) User-Defined Felling Only
  const VolPerPMHIE = 0.001;
  const CostPerCCFIE = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIE;
  const RelevanceIE = 0;
  // Summary
  const CostManFellCT2 =
    input.volumeCT > 0
      ? (intermediate.cHardwoodCT *
          100 *
          (machineCost.PMH_Chainsaw * RelevanceIA +
            machineCost.PMH_Chainsaw * RelevanceIB +
            machineCost.PMH_Chainsaw * RelevanceIC +
            machineCost.PMH_Chainsaw * RelevanceID +
            machineCost.PMH_Chainsaw * RelevanceIE)) /
        (RelevanceIA * VolPerPMHIA +
          RelevanceIB * VolPerPMHIB +
          RelevanceIC * VolPerPMHIC +
          RelevanceID * VolPerPMHID +
          RelevanceIE * VolPerPMHIE)
      : 0;
  // II. Felling, Limbing & Bucking - not used

  // All Log Trees
  // Felling Calculated Values
  const WalkDistAT2 = Math.sqrt(43560 / intermediate.treesPerAcre);
  // I. Felling Only - not used
  // II. Felling, Limbing & Bucking
  // A)  (Kellogg&Olsen, 86)
  const EastsideAdjustmentIIA = 1.2;
  const ClearcutAdjustmentIIA = 0.9;
  const TimePerTreeIIA =
    EastsideAdjustmentIIA *
    (input.isPartialCut === true ? 1 : input.isPartialCut === false ? ClearcutAdjustmentIIA : 0) *
    (1.33 + 0.0187 * WalkDistAT2 + 0.0143 * input.slope + 0.0987 * intermediate.volumeALT + 0.14);
  const VolPerPMHIIA = intermediate.volumeALT / (TimePerTreeIIA / 60);
  const CostPerCCFIIA = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIIA;
  const RelevanceIIA = 1;
  // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
  // IF(treevol<90,1,IF(treevol<180,2-treevol/90,0))

  // B) (Kellogg, L., M. Miller and E. Olsen, 1999)  Skyline thinning production and costs:
  // experience from the Willamette Young Stand Project. Research Contribtion 21.
  // Forest Research Laboratory, Oregon State University, Corvallis.
  const LimbsIIB = 31.5;
  const LogsIIB = intermediate.logsPerTreeALT;
  const WedgeIIB = 0.02;
  const CorridorIIB = 0.21;
  const NotBetweenOpeningsIIB = 1;
  const OpeningsIIB = 0;
  const HeavyThinIIB = input.isPartialCut ? 0 : 1;
  const DelayFracIIB = 0.25;
  const TimePerTreeIIB =
    (-0.465 +
      0.102 * intermediate.dbhALT +
      0.016 * LimbsIIB +
      0.562 * LogsIIB +
      0.009 * input.slope +
      0.734 * WedgeIIB +
      0.137 * CorridorIIB +
      0.449 * NotBetweenOpeningsIIB +
      0.437 * OpeningsIIB +
      0.426 * HeavyThinIIB) *
    (1 + DelayFracIIB);
  const VolPerPMHIIB = intermediate.volumeALT / (TimePerTreeIIB / 60);
  const CostPerCCFIIB = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIIB;
  const RelevanceIIB =
    intermediate.volume < 1
      ? 0
      : intermediate.volume < 2
      ? -1 + intermediate.volume / 1
      : intermediate.volume < 70
      ? 1
      : 1.2 - intermediate.volume / 350;
  // RelevanceIIB =IF(intermediate.TreeVolALT<1,0,IF(intermediate.TreeVolALT<2,-1+intermediate.TreeVolALT/1,
  // IF(intermediate.TreeVolALT<70,1,1.2-intermediate.TreeVolALT/350)))
  // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
  // IF(treevol<1,0,IF(treevol<2,-1+treevol/1,IF(treevol<70,1,IF(treevol<140,2-treevol/70,0))))

  // C) (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of
  // harvesting system performance. FERIC Technical Report TR-120)
  const DelayFracIIC = 0.197;
  const TimePerTreeIIC =
    (1.772 + 0.02877 * intermediate.volumeALT - 2.6486 / intermediate.volumeALT) *
    (1 + DelayFracIIC);
  const VolPerPMHIIC = intermediate.volumeALT / (TimePerTreeIIC / 60);
  const CostPerCCFIIC = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIIC;
  const RelevanceIIC =
    intermediate.volumeALT < 5
      ? 0
      : intermediate.volumeALT < 15
      ? -0.5 + intermediate.volumeALT / 10
      : 1;
  // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
  // IF(treevol<5,0,IF(treevol<15,-0.5+treevol/10,IF(treevol<90,1,IF(treevol<180,2-treevol/90,0))))

  // D) User-Defined Felling, Limbing & Bucking
  const VolPerPMHIID = 0.001;
  const CostPerCCFIIDllt = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIID;
  const RelevanceIID = 0;

  // Summary;
  const CostManFLBALT2 =
    intermediate.volumeALT > 0
      ? (intermediate.cHardwoodALT *
          100 *
          (machineCost.PMH_Chainsaw * RelevanceIIA +
            machineCost.PMH_Chainsaw * RelevanceIIB +
            machineCost.PMH_Chainsaw * RelevanceIIC +
            machineCost.PMH_Chainsaw * RelevanceIID)) /
        (RelevanceIIA * VolPerPMHIIA +
          RelevanceIIB * VolPerPMHIIB +
          RelevanceIIC * VolPerPMHIIC +
          RelevanceIID * VolPerPMHIID)
      : 0;

  return {
    CostManFellCT2: CostManFellCT2,
    CostManFLBALT2: CostManFLBALT2,
  };
}

export { FellwtChipLogOther };
