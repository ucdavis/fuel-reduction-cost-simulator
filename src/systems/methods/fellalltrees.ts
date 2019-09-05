// Felling (all trees) sheet
import { InputVarMod, IntermediateVarMod, MachineCostMod } from '../frcs.model';

function FellAllTrees(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  machineCost: MachineCostMod
) {
  // Felling Calculated Values
  const WalkDistAT = Math.sqrt(43560 / Math.max(intermediate.Removals, 1));
  // I. Felling Only
  // A) (McNeel, 94)
  const SelectionTimePerTreeIAat =
    0.568 + 0.0193 * 0.305 * WalkDistAT + 0.0294 * 2.54 * intermediate.DBH;
  const ClearcutTimePerTreeIAat =
    0.163 + 0.0444 * 0.305 * WalkDistAT + 0.0323 * 2.54 * intermediate.DBH;
  const TimePerTreeIAat =
    input.PartialCut === true
      ? SelectionTimePerTreeIAat
      : Math.min(SelectionTimePerTreeIAat, ClearcutTimePerTreeIAat);
  const VolPerPMHIAat = intermediate.TreeVol / (TimePerTreeIAat / 60);
  const CostPerCCFIAat = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIAat;
  const RelevanceIAat = 1;
  // B) (Peterson, 87)
  const TimePerTreeIBat =
    intermediate.DBH < 10
      ? 0.33 + 0.012 * intermediate.DBH
      : 0.1 + 0.0111 * Math.pow(intermediate.DBH, 1.496);
  const VolPerPMHIBat = intermediate.TreeVol / (TimePerTreeIBat / 60);
  const CostPerCCFIBat = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIBat;
  const RelevanceIBat = 1;
  // C) (Keatley, 2000)
  const TimePerTreeICat = Math.sqrt(
    4.58 + 0.07 * WalkDistAT + 0.16 * intermediate.DBH
  );
  const VolPerPMHICat = intermediate.TreeVol / (TimePerTreeICat / 60);
  const CostPerCCFICat = (100 * machineCost.PMH_Chainsaw) / VolPerPMHICat;
  const RelevanceICat = 1;
  // D) (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests:
  // summary of harvesting system performance.  FERIC Technical Report TR-120)
  const TimePerTreeIDat =
    1.082 + 0.01505 * intermediate.TreeVol - 0.634 / intermediate.TreeVol;
  const VolPerPMHIDat = intermediate.TreeVol / (TimePerTreeIDat / 60);
  const CostPerCCFIDat = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIDat;
  const RelevanceIDat =
    intermediate.TreeVol < 0.6
      ? 0
      : intermediate.TreeVol < 15
      ? 1 - 15 / (15 - 0.6) + intermediate.TreeVol / (15 - 0.6)
      : intermediate.TreeVol < 90
      ? 1
      : intermediate.TreeVol < 180
      ? 2 - intermediate.TreeVol / 90
      : 0;
  // E) User-Defined Felling Only
  const VolPerPMHIEat = 0.001;
  const CostPerCCFIEat = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIEat;
  const RelevanceIEat = 0;
  // Summary
  const CostManFell =
    (intermediate.CHardwood *
      100 *
      (machineCost.PMH_Chainsaw * RelevanceIAat +
        machineCost.PMH_Chainsaw * RelevanceIBat +
        machineCost.PMH_Chainsaw * RelevanceICat +
        machineCost.PMH_Chainsaw * RelevanceIDat +
        machineCost.PMH_Chainsaw * RelevanceIEat)) /
    (RelevanceIAat * VolPerPMHIAat +
      RelevanceIBat * VolPerPMHIBat +
      RelevanceICat * VolPerPMHICat +
      RelevanceIDat * VolPerPMHIDat +
      RelevanceIEat * VolPerPMHIEat);

  // II. Felling, Limbing & Bucking
  // A)  (Kellogg&Olsen, 86)
  const EastsideAdjustmentIIAat = 1.2;
  const ClearcutAdjustmentIIAat = 0.9;
  const TimePerTreeIIAat =
    EastsideAdjustmentIIAat *
    (input.PartialCut === true
      ? 1
      : input.PartialCut === false
      ? ClearcutAdjustmentIIAat
      : 0) *
    (1.33 +
      0.0187 * WalkDistAT +
      0.0143 * input.Slope +
      0.0987 * intermediate.TreeVol +
      0.14);
  const VolPerPMHIIAat = intermediate.TreeVol / (TimePerTreeIIAat / 60);
  const CostPerCCFIIAat = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIIAat;
  const RelevanceIIAat = 1;
  // Weight relaxed at upper end to allow extrapolation to larger trees.
  // Original was IF(intermediate.treevol<90,1,IF(intermediate.treevol<180,2-intermediate.treevol/90,0))

  // B) (Kellogg, L., M. Miller and E. Olsen, 1999)  Skyline thinning production and costs:
  // experience from the Willamette Young Stand Project. Research Contribtion 21.
  // Forest Research Laboratory, Oregon State University, Corvallis.
  const LimbsIIBat = 31.5;
  const LogsIIBat = intermediate.LogsPerTree;
  const WedgeIIBat = 0.02;
  const CorridorIIBat = 0.21;
  const NotBetweenOpeningsIIBat = 1;
  const OpeningsIIBat = 0;
  const HeavyThinIIBat = 0;
  const DelayFracIIBat = 0.25;
  const TimePerTreeIIBat =
    (-0.465 +
      0.102 * intermediate.DBH +
      0.016 * LimbsIIBat +
      0.562 * LogsIIBat +
      0.009 * input.Slope +
      0.734 * WedgeIIBat +
      0.137 * CorridorIIBat +
      0.449 * NotBetweenOpeningsIIBat +
      0.437 * OpeningsIIBat +
      0.426 * HeavyThinIIBat) *
    (1 + DelayFracIIBat);
  const VolPerPMHIIBat = intermediate.TreeVol / (TimePerTreeIIBat / 60);
  const CostPerCCFIIBat = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIIBat;
  const RelevanceIIBat =
    intermediate.TreeVol < 1
      ? 0
      : intermediate.TreeVol < 2
      ? -1 + intermediate.TreeVol / 1
      : intermediate.TreeVol < 70
      ? 1
      : 1.2 - intermediate.TreeVol / 350;
  // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
  // IF(intermediate.treevol<1,0,IF(intermediate.treevol<2,-1+intermediate.treevol/1,
  // IF(intermediate.treevol<70,1,IF(intermediate.treevol<140,2-intermediate.treevol/70,0))))

  // C) (Andersson, B. and G. Young, 98. Harvesting coastal second growth forests: summary of
  // harvesting system performance. FERIC Technical Report TR-120)
  const DelayFracIICat = 0.197;
  const TimePerTreeIICat =
    (1.772 + 0.02877 * intermediate.TreeVol - 2.6486 / intermediate.TreeVol) *
    (1 + DelayFracIICat);
  const VolPerPMHIICat = intermediate.TreeVol / (TimePerTreeIICat / 60);
  const CostPerCCFIICat = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIICat;
  const RelevanceIICat =
    intermediate.TreeVol < 5
      ? 0
      : intermediate.TreeVol < 15
      ? -0.5 + intermediate.TreeVol / 10
      : 1;
  // Weight relaxed at upper end to allow extrapolation to larger trees. Original was
  // IF(intermediate.treevol<5,0,IF(intermediate.treevol<15,-0.5+intermediate.treevol/10,
  // IF(intermediate.treevol<90,1,IF(intermediate.treevol<180,2-intermediate.treevol/90,0))))

  // D) User-Defined Felling, Limbing & Bucking
  const VolPerPMHIIDat = 0.001;
  const CostPerCCFIIDat = (100 * machineCost.PMH_Chainsaw) / VolPerPMHIIDat;
  const RelevanceIIDat = 0;
  // Summary
  const CostManFLB =
    (intermediate.CHardwood *
      100 *
      (machineCost.PMH_Chainsaw * RelevanceIIAat +
        machineCost.PMH_Chainsaw * RelevanceIIBat +
        machineCost.PMH_Chainsaw * RelevanceIICat +
        machineCost.PMH_Chainsaw * RelevanceIIDat)) /
    (RelevanceIIAat * VolPerPMHIIAat +
      RelevanceIIBat * VolPerPMHIIBat +
      RelevanceIICat * VolPerPMHIICat +
      RelevanceIIDat * VolPerPMHIIDat);

  return { CostManFell: CostManFell, CostManFLB: CostManFLB };
}

export { FellAllTrees };
