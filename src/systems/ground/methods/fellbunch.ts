// FellBunch sheet
import {
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../../frcs.model';

function FellBunch(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  machineCost: MachineCostMod
) {
  /*--------------Fell&Bunch START---------------------------*/
  const PMH_DriveToTree = machineCost.PMH_DriveToTree;
  const DistBetweenTrees = Math.sqrt(
    43560 / Math.max(intermediate.RemovalsST, 1)
  );
  // I. Drive-To-Tree
  // IA: Melroe Bobcat (Johnson, 79)
  const TimePerTreeIA =
    0.204 +
    0.00822 * DistBetweenTrees +
    0.02002 * intermediate.DBHST +
    0.00244 * input.Slope;
  const VolPerPMHIA = intermediate.TreeVolST / (TimePerTreeIA / 60);
  const CostPerPMHIA = PMH_DriveToTree;
  const CostPerCCFIA = (100 * CostPerPMHIA) / VolPerPMHIA;
  const RelevanceIA =
    (intermediate.DBHST < 10
      ? 1
      : intermediate.DBHST < 15
      ? 3 - intermediate.DBHST / 5
      : 0) *
    (input.Slope < 10 ? 1 : input.Slope < 20 ? 2 - input.Slope / 10 : 0);
  // IB: Chainsaw Heads START
  const CutsIB = 1.1;
  const TimePerTreeIB =
    (-0.0368 +
      0.02914 * intermediate.DBHST +
      0.00289 * DistBetweenTrees +
      0.2134 * CutsIB) *
    (1 + intermediate.CSlopeFB_Harv);
  const VolPerPMHIB = intermediate.TreeVolST / (TimePerTreeIB / 60);
  const CostPerPMHIB = PMH_DriveToTree;
  const CostPerCCFIB = (100 * CostPerPMHIB) / VolPerPMHIB;
  const RelevanceIB =
    (intermediate.DBHST < 15
      ? 1
      : intermediate.DBHST < 20
      ? 4 - intermediate.DBHST / 5
      : 0) *
    (input.Slope < 10 ? 1 : input.Slope < 20 ? 2 - input.Slope / 10 : 0);
  // IC: Intermittent Circular Sawheads (Greene&McNeel, 91)
  const CutsIC = 1.01;
  const TimePerTreeIC =
    (-0.4197 +
      0.01345 * intermediate.DBHST +
      0.001245 * DistBetweenTrees +
      0.7271 * CutsIC) *
    (1 + intermediate.CSlopeFB_Harv);
  const VolPerPMHIC = intermediate.TreeVolST / (TimePerTreeIC / 60);
  const CostPerPMHIC = PMH_DriveToTree;
  const CostPerCCFIC = (100 * CostPerPMHIC) / VolPerPMHIC;
  const RelevanceIC =
    (intermediate.DBHST < 15
      ? 1
      : intermediate.DBHST < 20
      ? 4 - intermediate.DBHST / 5
      : 0) *
    (input.Slope < 10 ? 1 : input.Slope < 20 ? 2 - input.Slope / 10 : 0);
  // ID: Hydro-Ax 211 (Hartsough, 01)
  const TreesPerAccumID = Math.max(
    1,
    14.2 - 2.18 * intermediate.DBHST + 0.0799 * Math.pow(intermediate.DBHST, 2)
  );
  const TimePerAccumID =
    0.114 +
    0.266 +
    0.073 * TreesPerAccumID +
    0.00999 * TreesPerAccumID * intermediate.DBHST;
  const TreesPerPMHID = (60 * TreesPerAccumID) / TimePerAccumID;
  const VolPerPMHID = intermediate.TreeVolST * TreesPerPMHID;
  const CostPerPMHID = PMH_DriveToTree;
  const CostPerCCFID = (100 * CostPerPMHID) / VolPerPMHID;
  const RelevanceID =
    (intermediate.DBHST < 10
      ? 1
      : intermediate.DBHST < 15
      ? 3 - intermediate.DBHST / 5
      : 0) *
    (input.Slope < 10 ? 1 : input.Slope < 20 ? 2 - input.Slope / 10 : 0);
  // II. Swing Boom
  // IIA: Drott (Johnson, 79) not used at present
  const PMH_SwingBoom = machineCost.PMH_SwingBoom;
  const TimePerTreeIIA =
    0.388 + 0.0137 * DistBetweenTrees + 0.0398 * input.Slope;
  const VolPerPMHIIA = intermediate.TreeVolST / (TimePerTreeIIA / 60);
  const CostPerPMHIIA = PMH_SwingBoom;
  const CostPerCCFIIA = (100 * CostPerPMHIIA) / VolPerPMHIIA;
  const RelevanceIIA = 0;

  // IIB: Timbco 2520&Cat 227 (Johnson, 88)
  const PMH_SelfLevel = machineCost.PMH_SelfLevel;
  const BoomReachIIB = 24; //
  const TreeInReachIIB =
    (intermediate.RemovalsST * Math.PI * Math.pow(BoomReachIIB, 2)) / 43560;
  const TreesPerCycleIIB = Math.max(1, TreeInReachIIB);
  const TimePerCycleIIB =
    (0.242 +
      0.1295 * TreesPerCycleIIB +
      0.0295 * intermediate.DBHST * TreesPerCycleIIB) *
    (1 + intermediate.CSlopeFB_Harv);
  const TimePerTreeIIB = TimePerCycleIIB / TreesPerCycleIIB;
  const VolPerPMHIIB = intermediate.TreeVolST / (TimePerTreeIIB / 60);
  const CostPerPMHIIB =
    PMH_SwingBoom * intermediate.NonSelfLevelCabDummy +
    PMH_SelfLevel * (1 - intermediate.NonSelfLevelCabDummy);
  const CostPerCCFIIB = (100 * CostPerPMHIIB) / VolPerPMHIIB;
  const RelevanceIIB =
    (intermediate.DBHST < 15
      ? 1
      : intermediate.DBHST < 20
      ? 4 - intermediate.DBHST / 5
      : 0) *
    (input.Slope < 5 ? 0 : input.Slope < 20 ? -1 / 3 + input.Slope / 15 : 1);
  // IIC: JD 693B&TJ Timbco 2518 (Gingras, 88)
  const UnmerchTreesPerHaIIC = 285;
  const UnmerchPerMerchIIC = Math.min(
    1.5,
    285 / (2.47 * intermediate.RemovalsST)
  );
  const BoomReachIIC = 24;
  const TreesInReachIIC =
    (intermediate.RemovalsST * Math.PI * Math.pow(BoomReachIIC, 2)) / 43560;
  const ObsTreesPerCycleIIC =
    (4.36 +
      9 -
      (0.12 + 0.34) * intermediate.DBHST +
      0.00084 * 2.47 * intermediate.RemovalsST) /
    2;
  const TreesPerCycleIIC = Math.max(
    1,
    Math.min(TreesInReachIIC, ObsTreesPerCycleIIC)
  );
  const TreesPerPMHIIC =
    (127.8 +
      21.2 * TreesPerCycleIIC -
      63.1 * UnmerchPerMerchIIC +
      0.033 * UnmerchTreesPerHaIIC) /
    (1 + intermediate.CSlopeFB_Harv);
  const VolPerPMHIIC = intermediate.TreeVolST * TreesPerPMHIIC;
  const CostPerPMHIIC =
    PMH_SwingBoom * intermediate.NonSelfLevelCabDummy +
    PMH_SelfLevel * (1 - intermediate.NonSelfLevelCabDummy);
  const CostPerCCFIIC = (100 * CostPerPMHIIC) / VolPerPMHIIC;
  const RelevanceIIC =
    (intermediate.DBHST < 12
      ? 1
      : intermediate.DBHST < 18
      ? 3 - intermediate.DBHST / 6
      : 0) *
    (input.Slope < 5 ? 0 : input.Slope < 20 ? -1 / 3 + input.Slope / 15 : 1);
  // IID: Timbco (Gonsier&Mandzak, 87)
  const TimePerTreeIID =
    (0.324 + 0.00138 * Math.pow(intermediate.DBHST, 2)) *
    (1 + intermediate.CSlopeFB_Harv + intermediate.CRemovalsFB_Harv);
  const VolPerPMHIID = intermediate.TreeVolST / (TimePerTreeIID / 60);
  const CostPerPMHIID = PMH_SelfLevel;
  const CostPerCCFIID = (100 * CostPerPMHIID) / VolPerPMHIID;
  const RelevanceIID =
    (intermediate.DBHST < 15
      ? 1
      : intermediate.DBHST < 20
      ? 4 - intermediate.DBHST / 5
      : 0) *
    (input.Slope < 15 ? 0 : input.Slope < 35 ? -3 / 4 + input.Slope / 20 : 1);
  // IIE: FERIC Generic (Gingras, J.F., 96.  The cost of product sorting during harvesting.
  // FERIC Technical Note TN-245)
  const VolPerPMHIIE =
    ((50.338 / 0.028317) *
      Math.pow(intermediate.TreeVolST * 0.028317, 0.3011)) /
    (1 + intermediate.CSlopeFB_Harv + intermediate.CRemovalsFB_Harv);
  const CostPerPMHIIE =
    PMH_SwingBoom * intermediate.NonSelfLevelCabDummy +
    PMH_SelfLevel * (1 - intermediate.NonSelfLevelCabDummy);
  const CostPerCCFIIE = (100 * CostPerPMHIIE) / VolPerPMHIIE;
  const RelevanceIIE =
    input.Slope < 5 ? 0 : input.Slope < 20 ? -1 / 3 + input.Slope / 15 : 1;
  // IIF: (Plamondon, J. 1998.  Trials of mechanized tree-length harvesting in eastern Canada.
  // FERIC Technical Note TN-273)
  const VolPerPMHIIF =
    (5 / 0.028317 + 57.7 * intermediate.TreeVolST) /
    (1 + intermediate.CSlopeFB_Harv + intermediate.CRemovalsFB_Harv);
  const CostPerPMHIIF =
    PMH_SwingBoom * intermediate.NonSelfLevelCabDummy +
    PMH_SelfLevel * (1 - intermediate.NonSelfLevelCabDummy);
  const CostPerCCFIIF = (100 * CostPerPMHIIF) / VolPerPMHIIF;
  const RelevanceIIF =
    (intermediate.TreeVolST < 20
      ? 1
      : intermediate.TreeVolST < 50
      ? 5 / 3 - intermediate.TreeVolST / 30
      : 0) *
    (input.Slope < 5 ? 0 : input.Slope < 20 ? -1 / 3 + input.Slope / 15 : 1);
  // IIG: Timbco 420 (Hartsough, B., E. Drews, J. McNeel, T. Durston and B. Stokes. 97.
  // Comparison of mechanized systems for thinning ponderosa pine and mixed conifer stands.
  // Forest Products Journal 47(11/12):59-68)
  const HybridIIG = 0;
  const DeadIIG = 0;
  const DelayFracIIG = 0.0963;
  const BoomReachIIG = 24;
  const TreesInReachIIG =
    (intermediate.RemovalsST * Math.PI * Math.pow(BoomReachIIG, 2)) / 43560;
  const TreesPerAccumIIG = Math.max(
    1,
    1.81 -
      0.0664 * intermediate.DBHST +
      3.64 / intermediate.DBHST -
      0.0058 * 20 -
      0.27 * 0 -
      0.1 * 0
  );
  const MoveFracIIG =
    0.5 / (Math.trunc(TreesInReachIIG / TreesPerAccumIIG) + 1);
  const MoveIIG =
    0.192 + 0.00779 * (BoomReachIIG + DistBetweenTrees) + 0.35 * HybridIIG;
  const FellIIG =
    0.285 +
    0.126 * TreesPerAccumIIG +
    0.0176 * intermediate.DBHST * TreesPerAccumIIG -
    0.0394 * DeadIIG;
  const TimePerAccumIIG = MoveFracIIG * MoveIIG + FellIIG;
  const TimePerTreeIIG =
    ((TimePerAccumIIG * (1 + DelayFracIIG)) / TreesPerAccumIIG) *
    (1 + intermediate.CSlopeFB_Harv);
  const VolPerPMHIIG = (intermediate.TreeVolST / TimePerTreeIIG) * 60;
  const CostPerPMHIIG =
    PMH_SwingBoom * intermediate.NonSelfLevelCabDummy +
    PMH_SelfLevel * (1 - intermediate.NonSelfLevelCabDummy);
  const CostPerCCFIIG = (100 * CostPerPMHIIG) / VolPerPMHIIG;
  const RelevanceIIG =
    (intermediate.DBHST < 15
      ? 1
      : intermediate.DBHST < 20
      ? 4 - intermediate.DBHST / 5
      : 0) *
    (input.Slope < 5 ? 0 : input.Slope < 20 ? -1 / 3 + input.Slope / 15 : 1);

  // III. User-Defined
  const UserDefinedVolPerPMH = 0.001;
  const UserDefinedCostPerPMH = 0;
  const UserDefinedCostPerCCF =
    (100 * UserDefinedCostPerPMH) / UserDefinedVolPerPMH;
  const UserDefinedRelevance = 0;

  // Summary
  const RelevanceSum =
    RelevanceIA +
    RelevanceIB +
    RelevanceIC +
    RelevanceID +
    RelevanceIIA +
    RelevanceIIB +
    RelevanceIIC +
    RelevanceIID +
    RelevanceIIE +
    RelevanceIIF +
    RelevanceIIG +
    UserDefinedRelevance;
  const WeightedCostPerPMH =
    (CostPerPMHIA * RelevanceIA +
      CostPerPMHIB * RelevanceIB +
      CostPerPMHIC * RelevanceIC +
      CostPerPMHID * RelevanceID +
      CostPerPMHIIA * RelevanceIIA +
      CostPerPMHIIB * RelevanceIIB +
      CostPerPMHIIC * RelevanceIIC +
      CostPerPMHIID * RelevanceIID +
      CostPerPMHIIE * RelevanceIIE +
      CostPerPMHIIF * RelevanceIIF +
      CostPerPMHIIG * RelevanceIIG +
      UserDefinedCostPerPMH * UserDefinedRelevance) /
    RelevanceSum;

  const WeightedVolPerPMH =
    (VolPerPMHIA * RelevanceIA +
      VolPerPMHIB * RelevanceIB +
      VolPerPMHIC * RelevanceIC +
      VolPerPMHID * RelevanceID +
      VolPerPMHIIA * RelevanceIIA +
      VolPerPMHIIB * RelevanceIIB +
      VolPerPMHIIC * RelevanceIIC +
      VolPerPMHIID * RelevanceIID +
      VolPerPMHIIE * RelevanceIIE +
      VolPerPMHIIF * RelevanceIIF +
      VolPerPMHIIG * RelevanceIIG +
      UserDefinedVolPerPMH * UserDefinedRelevance) /
    RelevanceSum;

  const CostFellBunch =
    intermediate.TreeVolST > 0
      ? (intermediate.CHardwoodST * 100 * WeightedCostPerPMH) /
        WeightedVolPerPMH
      : 0;

  const HorsepowerFBuncherDTT = 150;
  const HorsepowerFBuncherSB = 200;
  const HorsepowerFBuncherSL = 240;
  const fcrFBuncher = 0.026;
  const GalPerPMHIA = HorsepowerFBuncherDTT * fcrFBuncher;
  const GalPerPMHIB = HorsepowerFBuncherDTT * fcrFBuncher;
  const GalPerPMHIC = HorsepowerFBuncherDTT * fcrFBuncher;
  const GalPerPMHID = HorsepowerFBuncherDTT * fcrFBuncher;
  const GalPerPMHIIA = HorsepowerFBuncherDTT * fcrFBuncher;
  const GalPerPMHIIB =
    HorsepowerFBuncherSB * fcrFBuncher * intermediate.NonSelfLevelCabDummy +
    HorsepowerFBuncherSL *
      fcrFBuncher *
      (1 - intermediate.NonSelfLevelCabDummy);
  const GalPerPMHIIC =
    HorsepowerFBuncherSB * fcrFBuncher * intermediate.NonSelfLevelCabDummy +
    HorsepowerFBuncherSL *
      fcrFBuncher *
      (1 - intermediate.NonSelfLevelCabDummy);
  const GalPerPMHIID = HorsepowerFBuncherSL * fcrFBuncher;
  const GalPerPMHIIE =
    HorsepowerFBuncherSB * fcrFBuncher * intermediate.NonSelfLevelCabDummy +
    HorsepowerFBuncherSL *
      fcrFBuncher *
      (1 - intermediate.NonSelfLevelCabDummy);
  const GalPerPMHIIF =
    HorsepowerFBuncherSB * fcrFBuncher * intermediate.NonSelfLevelCabDummy +
    HorsepowerFBuncherSL *
      fcrFBuncher *
      (1 - intermediate.NonSelfLevelCabDummy);
  const GalPerPMHIIG =
    HorsepowerFBuncherSB * fcrFBuncher * intermediate.NonSelfLevelCabDummy +
    HorsepowerFBuncherSL *
      fcrFBuncher *
      (1 - intermediate.NonSelfLevelCabDummy);
  const UserDefinedGalPerPMH = 0;
  const WeightedGalPerPMH =
    (GalPerPMHIA * RelevanceIA +
      GalPerPMHIB * RelevanceIB +
      GalPerPMHIC * RelevanceIC +
      GalPerPMHID * RelevanceID +
      GalPerPMHIIA * RelevanceIIA +
      GalPerPMHIIB * RelevanceIIB +
      GalPerPMHIIC * RelevanceIIC +
      GalPerPMHIID * RelevanceIID +
      GalPerPMHIIE * RelevanceIIE +
      GalPerPMHIIF * RelevanceIIF +
      GalPerPMHIIG * RelevanceIIG +
      UserDefinedGalPerPMH * UserDefinedRelevance) /
    RelevanceSum;

  const GalFellBunch = (WeightedGalPerPMH * CostFellBunch) / WeightedCostPerPMH;

  /*------------Fell&Bunch END---------------------------*/
  return {
    CostFellBunch: CostFellBunch,
    TreesPerCycleIIB: TreesPerCycleIIB,
    GalFellBunch: GalFellBunch
  };
}

export { FellBunch };
