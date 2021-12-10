// Harvesting sheet
import { Assumptions, FrcsInputs, IntermediateVariables, MachineCosts } from '../model';

function Harvesting(
  assumption: Assumptions,
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  machineCost: MachineCosts
) {
  // Harvesting Calculated Values
  const HarvesterHourlyCost =
    machineCost.PMH_HarvS * (1 - intermediate.mechMachineSize) +
    machineCost.PMH_HarvB * intermediate.mechMachineSize;

  // functions
  function VolPerPMHfunc(TimePerTree: number) {
    return intermediate.volumeST / (TimePerTree / 60);
  }
  function CostPerCCFfunc(VolPerPMH: number) {
    return (100 * HarvesterHourlyCost) / VolPerPMH;
  }

  // A) Hitachi EX150/Keto 500 (Schroder&Johnson, 97)
  const TimePerTreeIAharvest =
    Math.pow(
      10,
      -1.0123 +
        0.219 * intermediate.ctlLogsPerTree +
        0.2082 * Math.pow(intermediate.buttDiamST, 0.5)
    ) *
    (1 + intermediate.cSlopeFBHarv + intermediate.cRemovalsFBHarv);
  const VolPerPMHIAharvest = VolPerPMHfunc(TimePerTreeIAharvest);
  const CostPerCCFIAharvest = CostPerCCFfunc(VolPerPMHIAharvest);
  const RelevanceIAharvest =
    intermediate.volumeST < 25
      ? 1
      : intermediate.volumeST < 50
      ? 2 - intermediate.volumeST / 25
      : 0;
  // B) Komatsu PC95/Hahn HSG140 (Schroder&Johnson, 97)
  const BoomReachIBharvest = 24;
  const TreesInReachIBharvest =
    (intermediate.treesPerAcreST * assumption.CTLTrailSpacing * BoomReachIBharvest) / 2 / 43560;
  const TreesPerCycleIBharvest = Math.max(1, TreesInReachIBharvest);
  const VolPerCycleIBharvest = TreesPerCycleIBharvest * intermediate.volumeST;
  const TimePerCycleIBharvest =
    Math.pow(
      -0.1485 +
        0.1305 * Math.log(VolPerCycleIBharvest) +
        0.6258 * Math.sqrt(TreesPerCycleIBharvest),
      2
    ) *
    (1 + intermediate.cSlopeFBHarv);
  const TimePerTreeIBharvest = TimePerCycleIBharvest / TreesPerCycleIBharvest;
  const VolPerPMHIBharvest = VolPerPMHfunc(TimePerTreeIBharvest);
  const CostPerCCFIBharvest = CostPerCCFfunc(VolPerPMHIBharvest);
  const RelevanceIBharvest =
    intermediate.volumeST < 25
      ? 1
      : intermediate.volumeST < 50
      ? 2 - intermediate.volumeST / 25
      : 0;
  // C) Timbco T425/Pika 600 (Schroder&Johnson, 97)
  const BoomReachICharvest = 24;
  const TreesInReachICharvest =
    (intermediate.treesPerAcreST * assumption.CTLTrailSpacing * BoomReachICharvest) / 2 / 43560;
  const TreesPerCycleICharvest = Math.max(1, TreesInReachICharvest);
  const LogsPerCycleICharvest = TreesPerCycleICharvest * intermediate.ctlLogsPerTree;
  const VolPerCycleICharvest = TreesPerCycleICharvest * intermediate.volumeST;
  const TimePerCycleICharvest =
    Math.pow(
      0.4886 + 0.04159 * LogsPerCycleICharvest + 0.09496 * Math.sqrt(VolPerCycleICharvest),
      2
    ) *
    (1 + intermediate.cSlopeFBHarv);
  const TimePerTreeICharvest = TimePerCycleICharvest / TreesPerCycleICharvest;
  const VolPerPMHICharvest = VolPerPMHfunc(TimePerTreeICharvest);
  const CostPerCCFICharvest = CostPerCCFfunc(VolPerPMHICharvest);
  const RelevanceICharvest =
    intermediate.volumeST < 25
      ? 1
      : intermediate.volumeST < 50
      ? 2 - intermediate.volumeST / 25
      : 0;
  // D) Timberjack 2518 (Kellogg&Bettinger, 94)
  const VolPerPMHIDharvest =
    (-617 + 189.3 * intermediate.dbhST) /
    (1 + intermediate.cSlopeFBHarv + intermediate.cRemovalsFBHarv);
  const CostPerCCFIDharvest = (100 * HarvesterHourlyCost) / VolPerPMHIDharvest;
  const RelevanceIDharvest =
    intermediate.volumeST < 40
      ? 1
      : intermediate.volumeST < 80
      ? 2 - intermediate.volumeST / 40
      : 0;
  // G) Hitachi 200LC/Keto 500 (Drews et al, 00)
  const DownDummy = 0.2;
  const DeadDummy = 0.2;
  const YarderDummyIGharvest = 0;
  const ProdDelayFractionIGharvest = 0.126;
  const BoomReachIGharvest = 24;
  const DistPerMoveIGharvest = Math.max(
    BoomReachIGharvest / 2,
    43560 / assumption.CTLTrailSpacing / intermediate.treesPerAcreST
  );
  const TreesInReachIGharvest =
    (intermediate.treesPerAcreST * assumption.CTLTrailSpacing * BoomReachIGharvest) / 2 / 43560;
  const TreesPerMoveIGharvest = Math.max(1, TreesInReachIGharvest);
  const BrushIGharvest = 0.89 / 100;
  const MoveIGharvest =
    (3.44 + (1.22 + 1.02 * YarderDummyIGharvest + 0.0369 * input.slope) * DistPerMoveIGharvest) /
    100 /
    TreesPerMoveIGharvest;
  const SwingIGharvest = (14.59 + 0.272 * intermediate.dbh - 2.38 * DownDummy) / 100;
  const FellIGharvest =
    ((2.67 + (0.472 - 0.1 * DeadDummy + 0.664 * YarderDummyIGharvest) * intermediate.dbhST) / 100) *
    (1 - DownDummy);
  const ProcessIGharvest =
    (-4.3 +
      2.104 * intermediate.dbhST +
      (6.5 - 1.17 * DeadDummy + 2.11 * DownDummy + 1.66 * YarderDummyIGharvest) *
        intermediate.ctlLogsPerTree) /
    100;
  const TimePerTreeIGharvest =
    (BrushIGharvest + MoveIGharvest + SwingIGharvest + FellIGharvest + ProcessIGharvest) *
    (1 + ProdDelayFractionIGharvest) *
    (1 + intermediate.cSlopeFBHarv);
  const VolPerPMHIGharvest = VolPerPMHfunc(TimePerTreeIGharvest);
  const CostPerCCFIGharvest = CostPerCCFfunc(VolPerPMHIGharvest);
  const RelevanceIGharvest =
    intermediate.dbhST < 12 ? 1 : intermediate.dbhST < 20 ? 2.5 - intermediate.dbhST / 8 : 0;
  // E) Rottne (McNeel&Rutherford, 94)
  const BoomReachIEharvest = 24;
  const DistPerMoveIEharvest = Math.max(
    BoomReachIEharvest / 2,
    43560 / assumption.CTLTrailSpacing / intermediate.treesPerAcreST
  );
  const TreesInReachIEharvest =
    (intermediate.treesPerAcreST * assumption.CTLTrailSpacing * BoomReachIEharvest) / 2 / 43560;
  const TreesPerMoveIEharvest = Math.max(1, TreesInReachIEharvest);
  const CutIEharvest = 0.0283 + 0.0019 * 2.54 * intermediate.dbhST;
  const ProcessIEharvest = ProcessIGharvest;
  const PositionHeadIEharvest = 0.189;
  const SlashDisposalIEharvest = 0.1091;
  const MoveIEharvest = (0.1944 + 0.0357 * 0.305 * DistPerMoveIEharvest) / TreesPerMoveIEharvest;
  const TimePerTreeIEharvest =
    (CutIEharvest +
      ProcessIEharvest +
      PositionHeadIEharvest +
      SlashDisposalIEharvest +
      MoveIEharvest) *
    (1 + intermediate.cSlopeFBHarv);
  const VolPerPMHIEharvest = VolPerPMHfunc(TimePerTreeIEharvest);
  const CostPerCCFIEharvest = CostPerCCFfunc(VolPerPMHIEharvest);
  const RelevanceIEharvest =
    intermediate.dbhST < 16 ? 1 : intermediate.dbhST < 20 ? 5 - intermediate.dbhST / 4 : 0;
  // F) Norcar 600H (Brinker&Tufts, 90)
  const Stand1VolPerPMHIFharvest = Math.max(
    100,
    (85 *
      (-1.961 +
        0.5502 * intermediate.dbhST +
        1.871 * intermediate.volumeST -
        0.04502 * intermediate.dbhST * intermediate.volumeST -
        0.1786 * intermediate.ctlLogsPerTree * intermediate.volumeST)) /
      (1 + intermediate.cSlopeFBHarv + intermediate.cRemovalsFBHarv)
  );
  const Stand2VolPerPMHIFharvest = Math.max(
    100,
    (85 *
      (-1.539 +
        0.6683 * intermediate.dbhST +
        0.9754 * intermediate.volumeST -
        0.1257 * intermediate.ctlLogsPerTree * intermediate.volumeST)) /
      (1 + intermediate.cSlopeFBHarv + intermediate.cRemovalsFBHarv)
  );
  const AvgVolPerPMHIFharvest = (Stand1VolPerPMHIFharvest + Stand2VolPerPMHIFharvest) / 2;
  const CostPerCCFIFharvest = CostPerCCFfunc(AvgVolPerPMHIFharvest);
  const RelevanceIFharvest =
    0.5 * (intermediate.dbhST < 15 ? 1 : intermediate.dbhST < 20 ? 4 - intermediate.dbhST / 5 : 0);
  // H) Rottne SMV EGS w/600 (Meek, P. 00. Productivity and costs of single-grip harvesters in commercial thinning:
  // summary report. FERIC Advantage 1(41))
  const MachineIHharvest = 1;
  const ExperienceIHharvest = 2;
  const VolPerPMHIHharvest =
    ((42.729 / 0.028317) *
      Math.pow(intermediate.volumeST * 0.028317, 0.8195) *
      Math.pow(ExperienceIHharvest, 0.5874) *
      Math.pow(MachineIHharvest, -0.4015)) /
    (1 + intermediate.cSlopeFBHarv + intermediate.cRemovalsFBHarv);
  const CostPerCCFIHharvest = CostPerCCFfunc(VolPerPMHIHharvest);
  const RelevanceIHharvest =
    intermediate.volumeST < 30
      ? 1
      : intermediate.volumeST < 60
      ? 2 - intermediate.volumeST / 30
      : 0;
  // I) Enviro w/ Pan 828 (Meek, P. 00. Productivity and costs of single-grip harvesters in commercial thinning:
  // summary report.  FERIC Advantage 1(41))
  const MachineIIharvest = 2;
  const ExperienceIIharvest = 2;
  const VolPerPMHIIharvest =
    ((42.729 / 0.028317) *
      Math.pow(intermediate.volumeST * 0.028317, 0.8195) *
      Math.pow(ExperienceIIharvest, 0.5874) *
      Math.pow(MachineIIharvest, -0.4015)) /
    (1 + intermediate.cSlopeFBHarv + intermediate.cRemovalsFBHarv);
  const CostPerCCFIIharvest = CostPerCCFfunc(VolPerPMHIIharvest);
  const RelevanceIIharvest =
    intermediate.volumeST < 30
      ? 1
      : intermediate.volumeST < 60
      ? 2 - intermediate.volumeST / 30
      : 0;
  // J) FERIC Generic (Gingras, J.F. 96. The cost of product sorting during harvesting. FERIC Technical Note TN-245)
  const VolPerPMHIJharvest =
    ((42.46 / 0.028317) * Math.pow(intermediate.volumeST * 0.028317, 0.6683)) /
    (1 + intermediate.cSlopeFBHarv + intermediate.cRemovalsFBHarv);
  const CostPerCCFIJharvest = CostPerCCFfunc(VolPerPMHIJharvest);
  const RelevanceIJharvest =
    intermediate.volumeST < 40
      ? 1
      : intermediate.volumeST < 80
      ? 2 - intermediate.volumeST / 40
      : 0;
  // K) (MacDonald, C. 88. Evaluation of the Bruun T 610-H-A single grip harvester.
  // B.S. Thesis, University of New Brunswick)
  const VolPerPMHIKharvest =
    (4.59 / 0.028317 + 67.84 * intermediate.volumeST) /
    (1 + intermediate.cSlopeFBHarv + intermediate.cRemovalsFBHarv);
  const CostPerCCFIKharvest = CostPerCCFfunc(VolPerPMHIKharvest);
  const RelevanceIKharvest =
    intermediate.volumeST < 30
      ? 1
      : intermediate.volumeST < 60
      ? 2 - intermediate.volumeST / 30
      : 0;
  // L) Rottne SMV Rapid EGS w/600 (Matzka, P. 03. Thinning with prescribed fire and timber harvesting mechanization
  // for fuels reduction and forest restoration. PhD thesis. Oregon State University)
  const StandingDeadDummyILharvest = 0;
  const DownTreeDummyILharvest = 0;
  const DougFirDummyILharvest = 0.1;
  const DistPerMoveILharvest = 43560 / assumption.CTLTrailSpacing / intermediate.treesPerAcreST;
  const TimePerTreeILharvest =
    (0.188 -
      0.155 * StandingDeadDummyILharvest -
      0.217 * DownTreeDummyILharvest +
      0.048 * DougFirDummyILharvest +
      0.012 * DistPerMoveILharvest +
      0.004 * Math.pow(intermediate.dbhST, 2)) *
    (1 + intermediate.cSlopeFBHarv);
  const VolPerPMHILharvest = VolPerPMHfunc(TimePerTreeILharvest);
  const CostPerCCFILharvest = CostPerCCFfunc(VolPerPMHILharvest);
  const RelevanceILharvest =
    intermediate.volumeST < 40
      ? 1
      : intermediate.volumeST < 80
      ? 2 - intermediate.volumeST / 40
      : 0;
  // M) JD 653C w/Waratah HTH Warrior (Matzka, P. 03. Thinning with prescribed fire and
  // timber harvesting mechanization for fuels reduction and forest restoration. PhD thesis. Oregon State University)
  const StandingDeadDummyIMharvest = 0;
  const DownTreeDummyIMharvest = 0;
  const DougFirDummyIMharvest = 0.1;
  const DistPerMoveIMharvest = 43560 / assumption.CTLTrailSpacing / intermediate.treesPerAcreST;
  const TimePerTreeIMharvest =
    (0.35 -
      0.107 * StandingDeadDummyIMharvest -
      0.304 * DownTreeDummyIMharvest +
      0.032 * DougFirDummyIMharvest +
      0.01 * DistPerMoveIMharvest +
      0.005 * Math.pow(intermediate.dbhST, 2)) *
    (1 + intermediate.cSlopeFBHarv);
  const VolPerPMHIMharvest = VolPerPMHfunc(TimePerTreeIMharvest);
  const CostPerCCFIMharvest = CostPerCCFfunc(VolPerPMHIMharvest);
  const RelevanceIMharvest =
    intermediate.volumeST < 40
      ? 1
      : intermediate.volumeST < 80
      ? 2 - intermediate.volumeST / 40
      : 0;
  // N) Cat 320L w/Keto 500 (Matzka, P. 03. Thinning with prescribed fire and timber harvesting mechanization
  // for fuels reduction and forest restoration. PhD thesis. Oregon State University)
  const StandingDeadDummyINharvest = 0;
  const DownTreeDummyINharvest = 0;
  const DougFirDummyINharvest = 0.1;
  const DistPerMoveINharvest = 43560 / assumption.CTLTrailSpacing / intermediate.treesPerAcreST;
  const TimePerTreeINharvest =
    (0.426 -
      0.256 * StandingDeadDummyINharvest -
      0.038 * DownTreeDummyINharvest +
      0.085 * DougFirDummyINharvest +
      0.011 * DistPerMoveINharvest +
      0.005 * Math.pow(intermediate.dbhST, 2)) *
    (1 + intermediate.cSlopeFBHarv);
  const VolPerPMHINharvest = VolPerPMHfunc(TimePerTreeINharvest);
  const CostPerCCFINharvest = CostPerCCFfunc(VolPerPMHINharvest);
  const RelevanceINharvest =
    intermediate.volumeST < 40
      ? 1
      : intermediate.volumeST < 80
      ? 2 - intermediate.volumeST / 40
      : 0;
  // O) FMG 1870 w/TJ 762B (Eliasson, L., J. Bengtsson, J. Cedergren and H. Lageson. 99.
  // Comparison of single grip harvester productivity in clear and shelterwood cutting. J. For. Engr. 10(1):43-48)
  const TimePerTreeIOharvest = input.isPartialCut
    ? (0.35 +
        0.012 * intermediate.volumeST +
        (0.04 + 0.003 * intermediate.volumeST) -
        0.00006 * intermediate.treesPerAcreST) *
      (1 + intermediate.cSlopeFBHarv)
    : (0.35 + 0.012 * intermediate.volumeST - 0.00006 * intermediate.treesPerAcreST) *
      (1 + intermediate.cSlopeFBHarv);
  const VolPerPMHIOharvest = VolPerPMHfunc(TimePerTreeIOharvest);
  const CostPerCCFIOharvest = CostPerCCFfunc(VolPerPMHIOharvest);
  const RelevanceIOharvest =
    intermediate.volumeST < 60
      ? 1
      : intermediate.volumeST < 100
      ? 2.5 - intermediate.volumeST / 40
      : 0;
  // P) Osa 260/752 & Valmet 862/942 (Lageson, H. 97. Effects of thinning type on the harvester productivity
  // and on the residual stand. J. For. Engr. 8(2):7-14)
  const TimePerTreeIPharvest =
    (0.232 + 0.0185 * 2.54 * intermediate.dbhST) *
    (1 + intermediate.cSlopeFBHarv + intermediate.cRemovalsFBHarv);
  const VolPerPMHIPharvest = VolPerPMHfunc(TimePerTreeIPharvest);
  const CostPerCCFIPharvest = CostPerCCFfunc(VolPerPMHIPharvest);
  const RelevanceIPharvest = input.isPartialCut
    ? intermediate.volumeST < 20
      ? 1
      : intermediate.volumeST < 40
      ? 2 - intermediate.volumeST / 20
      : 0
    : 0;
  // Q) Ponsse Ergo (Bolding, M.C. and B. Lanford. 02. Productivity of a Ponsse Ergo harvester working on
  // steep terrain. In: Council on Forest Engineering Proceedings, Auburn, Alabama)
  const TimePerTreeIQharvest =
    (0.18 +
      0.0038 * Math.pow(intermediate.dbhST, 2) +
      ((4.937 * input.slope) / 100) * Math.pow(intermediate.treesPerAcreST, -0.5)) *
    (1 + intermediate.cSlopeFBHarv + intermediate.cRemovalsFBHarv);
  const VolPerPMHIQharvest = VolPerPMHfunc(TimePerTreeIQharvest);
  const CostPerCCFIQharvest = CostPerCCFfunc(VolPerPMHIQharvest);
  const RelevanceIQharvest =
    intermediate.volumeST < 40
      ? 1
      : intermediate.volumeST < 80
      ? 2 - intermediate.volumeST / 40
      : 0;
  // R) User-Defined
  const VolPerPMHIRharvest = 0.001;
  const CostPerCCFIRharvest = CostPerCCFfunc(VolPerPMHIRharvest);
  const RelevanceIRharvest = 0;
  // Summary
  // CostHarvest
  const IntermediateCalcs1 =
    RelevanceIAharvest * VolPerPMHIAharvest +
    RelevanceIBharvest * VolPerPMHIBharvest +
    RelevanceICharvest * VolPerPMHICharvest +
    RelevanceIDharvest * VolPerPMHIDharvest +
    RelevanceIEharvest * VolPerPMHIEharvest +
    RelevanceIFharvest * AvgVolPerPMHIFharvest +
    RelevanceIGharvest * VolPerPMHIGharvest +
    RelevanceIHharvest * VolPerPMHIHharvest +
    RelevanceIIharvest * VolPerPMHIIharvest +
    RelevanceIJharvest * VolPerPMHIJharvest +
    RelevanceIKharvest * VolPerPMHIKharvest +
    RelevanceILharvest * VolPerPMHILharvest +
    RelevanceIMharvest * VolPerPMHIMharvest +
    RelevanceINharvest * VolPerPMHINharvest +
    RelevanceIOharvest * VolPerPMHIOharvest +
    RelevanceIPharvest * VolPerPMHIPharvest +
    RelevanceIQharvest * VolPerPMHIQharvest +
    RelevanceIRharvest * VolPerPMHIRharvest;
  const IntermediateCalcs2 =
    HarvesterHourlyCost * RelevanceIAharvest +
    HarvesterHourlyCost * RelevanceIBharvest +
    HarvesterHourlyCost * RelevanceICharvest +
    HarvesterHourlyCost * RelevanceIDharvest +
    HarvesterHourlyCost * RelevanceIEharvest +
    HarvesterHourlyCost * RelevanceIFharvest +
    HarvesterHourlyCost * RelevanceIGharvest +
    HarvesterHourlyCost * RelevanceIHharvest +
    HarvesterHourlyCost * RelevanceIIharvest +
    HarvesterHourlyCost * RelevanceIKharvest +
    HarvesterHourlyCost * RelevanceILharvest +
    HarvesterHourlyCost * RelevanceIMharvest +
    HarvesterHourlyCost * RelevanceINharvest +
    HarvesterHourlyCost * RelevanceIOharvest +
    HarvesterHourlyCost * RelevanceIPharvest +
    HarvesterHourlyCost * RelevanceIQharvest +
    HarvesterHourlyCost * RelevanceIRharvest +
    HarvesterHourlyCost * RelevanceIJharvest;
  const WeightAverageHarvesting =
    intermediate.volumeST > 0
      ? (intermediate.cHardwoodST * 100 * IntermediateCalcs2) / IntermediateCalcs1
      : 0;
  const CostHarvest = WeightAverageHarvesting * (input.isPartialCut ? 1 : 0.9);
  // GalHarvest
  const HorsepowerHarvesterS = 120;
  const HorsepowerHarvesterB = 200;
  const fcrHarvester = 0.029;
  const WeightedAverageGalPMH =
    HorsepowerHarvesterS * fcrHarvester * (1 - intermediate.mechMachineSize) +
    HorsepowerHarvesterB * fcrHarvester * intermediate.mechMachineSize;
  const GalHarvest = (WeightedAverageGalPMH * CostHarvest) / HarvesterHourlyCost;

  return { CostHarvest: CostHarvest, GalHarvest: GalHarvest };
}

export { Harvesting };
