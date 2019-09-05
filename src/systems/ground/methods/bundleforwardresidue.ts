import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../../frcs.model';

function BundleForwardResidue(
  assumption: AssumptionMod,
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  machineCost: MachineCostMod
) {
  const BundleWeight = 0.9;
  const RecoveredResidue =
    assumption.ResidueRecovFracCTL * intermediate.ResidueST;
  const LoadFractionForBundles = 0.75;
  const BoomReachF = 20;
  const DistPerMoveF = 1.5 * BoomReachF;

  // I. Bundle Residues within the stand
  // A) Timberjack Bundler (Cuchet, E., P. Roux and R. Spinelli. Submitted 2003.
  // Bundling logging residue in temperate forests)
  const MoveDistIAbfr = 43560 / (assumption.CTLTrailSpacing * RecoveredResidue);
  const TimeIAbfr = 4.5 / 1.1;
  const MoveIAbfr = (0.27 + 0.0134 * (1.1 / 3.28) * MoveDistIAbfr) / 1.1;
  const LoadIAbfr =
    ((1 + 0.57) * Math.max(3, 5.5 - 0.1 * (2.47 / 1.1) * RecoveredResidue)) /
    1.1;
  const WaitIAbfr = 0.97 / 1.1;
  const TotalIAbfr = Math.max(MoveIAbfr + LoadIAbfr + WaitIAbfr, TimeIAbfr);
  const GT1Abfr = 60 / TotalIAbfr;
  const RelevanceIAbfr = 1;
  // B) Timberjack Bundler (Rummer, B., D. Len and O. O'Brien. 2004. Forest residues bundling project.)
  const MoveDistIBbfr =
    (43560 * BundleWeight) / (assumption.CTLTrailSpacing * RecoveredResidue);
  const SwingsPerBundleIBbfr = 3.9;
  const ArrangeSlashIBbfr = 0.06;
  const FeedIBbfr = 0.34 + 0.45 * SwingsPerBundleIBbfr;
  const WaitIBbfr = 0.96;
  const TravelIBbfr = 0.048 + 0.0084 * MoveDistIBbfr;
  const RotateBundlerIBbfr = 0.34;
  const CutBundleIBbfr = 0.15;
  const TotalIBbfr =
    ArrangeSlashIBbfr +
    FeedIBbfr +
    WaitIBbfr +
    TravelIBbfr +
    RotateBundlerIBbfr +
    CutBundleIBbfr;
  const GT1Bbfr = (60 * BundleWeight) / TotalIBbfr;
  const RelevanceIBbfr = 1;
  // C) User-Defined Bundler
  const GT1Cbfr = 0.00001;
  const RelevanceICbfr = 0;

  // II. Residue Forwarding
  // A) Adjusted from Forwarding: Rottne 10-ton (McNeel&Rutherford, 94)
  const MaxLoadWeightIIAbfr = 1.1 * 10;
  const LoadWeightIIAbfr =
    LoadFractionForBundles *
    MaxLoadWeightIIAbfr *
    intermediate.CSlopeSkidForwLoadSize;
  const DistIntermIIAbrf =
    ((LoadWeightIIAbfr / intermediate.ResidueST) * 43560) /
    assumption.CTLTrailSpacing;
  const DistOut = Math.min(
    2 * input.DeliverDist,
    input.DeliverDist + DistIntermIIAbrf / 2
  );
  const DistIn = Math.max(0, input.DeliverDist - DistIntermIIAbrf / 2);
  const BundlesPerLoad = LoadWeightIIAbfr / BundleWeight;
  const DistPerMove = Math.max(DistPerMoveF, DistIntermIIAbrf / BundlesPerLoad);
  const MovesIIAbfr = DistIntermIIAbrf / DistPerMove;
  const LandingMovesIIAbfr = 0;
  const LandingMoveDistPerMove = 100;
  const TravelOut = 0.342 + 0.0135 * 0.305 * DistOut;
  const LoadIIAbfr = 9.248 / 2;
  const SortWoodIIAbfr = 0;
  const TrabelIntermIIAbfr =
    (0.2048 + 0.0146 * 0.305 * DistPerMove) * MovesIIAbfr;
  const TravelLoadedIIAbfr = 0.239 + 0.0125 * 0.305 * DistIn;
  const UnloadIIAbfr = 5.385 / 2;
  const SortLandingIIAbfr = 0;
  const MoveLandingIIAbfr =
    (0.1763 + 0.0061 * 0.305 * LandingMoveDistPerMove) * LandingMovesIIAbfr;
  const TurnTimeIIAbfr =
    TravelOut +
    LoadIIAbfr +
    SortWoodIIAbfr +
    TrabelIntermIIAbfr +
    TravelLoadedIIAbfr +
    UnloadIIAbfr +
    SortLandingIIAbfr +
    MoveLandingIIAbfr;
  const GTIIAbfr = LoadWeightIIAbfr / (TurnTimeIIAbfr / 60);
  const RelevanceIIAbfr = 1;
  // B) User-Defined Residue Forwarding
  const GTIIBbfr = 0.00001;
  const RelevanceIIBbfr = 0;
  // Summary
  const CostBundleResidue =
    intermediate.ResidueST > 0
      ? (machineCost.PMH_Bundler * RelevanceIAbfr +
          machineCost.PMH_Bundler * RelevanceIBbfr +
          machineCost.PMH_Bundler * RelevanceICbfr) /
        (RelevanceIAbfr * GT1Abfr +
          RelevanceIBbfr * GT1Bbfr +
          RelevanceICbfr * GT1Cbfr)
      : 0;
  const CostForwardResidueBundles =
    intermediate.ResidueST > 0
      ? (machineCost.PMH_ForwarderS * RelevanceIIAbfr +
          machineCost.PMH_ForwarderS * RelevanceIIBbfr) /
        (RelevanceIIAbfr * GTIIAbfr + RelevanceIIBbfr * GTIIBbfr)
      : 0;

  return {
    CostBundleResidue: CostBundleResidue,
    CostForwardResidueBundles: CostForwardResidueBundles
  };
}

export { BundleForwardResidue };
