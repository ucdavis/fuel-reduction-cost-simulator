// Skidding sheet
import { FrcsInputs, IntermediateVariables, MachineCosts } from '../../frcs.model';

function Skidding(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  machineCost: MachineCosts,
  TreesPerCycleIIB: number
) {
  // Skidding Calculated Values
  const TurnVol =
    (!input.isPartialCut ? 44.87 : input.isPartialCut ? 31.62 : 0) *
    Math.pow(intermediate.volume, 0.282) *
    intermediate.cSlopeSkidForwLoadSize;
  const LogsPerTurnS = TurnVol / intermediate.logVol;
  const TreesPerTurnS = TurnVol / intermediate.volume;
  const PMH_SkidderB = machineCost.PMH_SkidderB;
  const PMH_SkidderS = machineCost.PMH_SkidderS;
  const SkidderHourlyCost =
    PMH_SkidderS * (1 - intermediate.manualMachineSize) +
    PMH_SkidderB * intermediate.manualMachineSize;

  // I Choker, Unbunched
  const MaxLogs = 10;
  const ChokerLogs = Math.min(MaxLogs, LogsPerTurnS);
  const ChokerTurnVol = ChokerLogs * intermediate.logVol;
  // IA CC (Johnson&Lee, 88)
  const WinchDistSkidIA = 25;
  const TurnTimeSkidIA =
    -15.58 +
    0.345 * ChokerLogs +
    0.037 * ChokerTurnVol +
    4.05 * Math.log(input.deliverToLandingDistance + WinchDistSkidIA);
  const VolPerPMHskidIA = ChokerTurnVol / (TurnTimeSkidIA / 60);
  const CostPerCCFSkidIA = (100 * SkidderHourlyCost) / VolPerPMHskidIA;
  const RelevanceSkidIA = ChokerTurnVol < 90 ? 1 : ChokerTurnVol < 180 ? 2 - ChokerTurnVol / 90 : 0;
  // IB CC (Gibson&Egging, 73)
  const TurnTimeSkidIB =
    2.74 +
    0.726 * ChokerLogs +
    0.00363 * ChokerTurnVol * intermediate.bfPerCF +
    0.0002 * ChokerTurnVol * intermediate.woodDensity +
    0.00777 * input.deliverToLandingDistance +
    0.00313 * Math.pow(input.slope, 2);
  const VolPerPMHskidIB = ChokerTurnVol / (TurnTimeSkidIB / 60);
  const CostPerCCFskidIB = (100 * SkidderHourlyCost) / VolPerPMHskidIB;
  const RelevanceSkidIB = 1;
  // IC CC (Schillings, 69) not used at present
  const TurnTimeSkidIC =
    (60 *
      (0.122 +
        0.089 +
        (0.000229 + 0.000704) * input.deliverToLandingDistance +
        (-0.00076 + 0.00127) * input.slope +
        (0.0191 + 0.0118) * ChokerLogs)) /
    2;
  const VolPerPMHskidIC = ChokerTurnVol / (TurnTimeSkidIC / 60);
  const CostPerCCFskidIC = (100 * SkidderHourlyCost) / VolPerPMHskidIC;
  const RelevanceSkidIC = 0;
  // ID CC (Gardner, 79)
  const TurnTimeSkidID =
    2.57 +
    0.823 * ChokerLogs +
    0.0054 * ChokerTurnVol * intermediate.bfPerCF +
    0.0078 * 2 * input.deliverToLandingDistance;
  const VolPerPMHskidID = ChokerTurnVol / (TurnTimeSkidID / 60);
  const CostPerCCFskidID = (100 * SkidderHourlyCost) / VolPerPMHskidID;
  const RelevanceSkidID = 1;
  // IE Cat 518 or Cat D4H, cable (Andersson, B. and G. Young  1998.
  // Harvesting coastal second growth forests: summary of harvesting system performance.
  // FERIC Technical Report TR-120)
  const TurnTimeSkidIE = 7.36 + 0.0053 * input.deliverToLandingDistance;
  const VolPerPMHskidIE = ChokerTurnVol / (TurnTimeSkidIE / 60);
  const CostPerCCFskidIE = (100 * SkidderHourlyCost) / VolPerPMHskidIE;
  const RelevanceSkidIE =
    intermediate.volume < 5
      ? 0
      : intermediate.volume < 15
      ? -0.5 + intermediate.volume / 10
      : intermediate.volume < 75
      ? 1
      : intermediate.volume < 150
      ? 2 - intermediate.volume / 75
      : 0;

  // II Grapple, Unbunched
  const IntMoveDistS = 17.0;
  // IIA Cat 518 (Johnson, 88)
  const TurnTimeSkidIIA =
    0.518 +
    0.0107 * input.deliverToLandingDistance +
    0.0011 * Math.pow(input.slope, 3) +
    1.62 * Math.log(LogsPerTurnS);
  const VolPerPMHskidIIA = TurnVol / (TurnTimeSkidIIA / 60);
  const CostPerCCFskidIIA = (100 * SkidderHourlyCost) / VolPerPMHskidIIA;
  const RelevanceSkidIIA =
    intermediate.buttDiam < 20 ? 1 : intermediate.buttDiam < 25 ? 5 - intermediate.buttDiam / 5 : 0;
  // IIB JD 648 (Gebhardt, 77)
  const GroundRatingSkidIIB = 1.1;
  const TypeOfCutSkidIIB = input.isPartialCut ? 1.5 : 0;
  const TurnTimeSkidIIB =
    1.072 +
    0.00314 * input.deliverToLandingDistance +
    0.0192 * input.slope +
    0.315 * TypeOfCutSkidIIB +
    0.489 * LogsPerTurnS -
    0.819 * GroundRatingSkidIIB +
    0.00469 * IntMoveDistS +
    0.00139 * TurnVol * intermediate.bfPerCF;
  const VolPerPMHskidIIB = TurnVol / (TurnTimeSkidIIB / 60);
  const CostPerCCFskidIIB = (100 * SkidderHourlyCost) / VolPerPMHskidIIB;
  const RelevanceSkidIIB = 1;

  // III User-Defined Skidding Unbunched
  const VolPerPMHskidIII = 0.001;
  const CostPerCCFskidIII = (100 * SkidderHourlyCost) / VolPerPMHskidIII;
  const RelevanceSkidIII = 0;

  // IV Grapple, Bunched
  // IVA Grapple Skidders (Johnson, 88)
  const DeckHeightSkidIVA = 3;
  const TravEmptySkidIVA =
    -2.179 + 0.0362 * input.slope + 0.711 * Math.log(input.deliverToLandingDistance);
  const LoadSkidIVA = Math.max(
    0,
    0.882 + 0.0042 * Math.pow(input.slope, 2) - 0.000048 * Math.pow(TreesPerTurnS, 3)
  );
  const TravLoadedSkidIVA =
    -0.919 +
    0.00081 * input.deliverToLandingDistance +
    0.000062 * Math.pow(input.slope, 3) +
    0.353 * Math.log(input.deliverToLandingDistance);
  const DeckSkidIVA =
    0.063 + 0.55 * Math.log(DeckHeightSkidIVA) + 0.0076 * DeckHeightSkidIVA * TreesPerTurnS;
  const TurnTImeSkidIVA = TravEmptySkidIVA + LoadSkidIVA + TravLoadedSkidIVA + DeckSkidIVA;
  const VolPerPMHskidIVA = TurnVol / (TurnTImeSkidIVA / 60);
  const CostPerCCFskidIVA = (100 * SkidderHourlyCost) / VolPerPMHskidIVA;
  const RelevanceSkidIVA =
    intermediate.buttDiam < 15 ? 1 : intermediate.buttDiam < 20 ? 4 - intermediate.buttDiam / 5 : 0;
  // IVB Grapple Skidders (Tufts et al, 88)
  const EastsideAdjustmentSkidIVB = 1.3;
  const BunchSizeSkidIVB = TreesPerCycleIIB;
  const BunchVolSkidIVB = intermediate.volume * BunchSizeSkidIVB;
  const TurnWtSkidIVB = TurnVol * intermediate.woodDensity;
  const BunchesPerTurnSkidIVB = Math.max(1, TurnVol / BunchVolSkidIVB);
  const SkidderHpSkidIVB = 50.5 + 5.74 * Math.sqrt(intermediate.volume);
  const TravEmptySkidIVB =
    (0.1905 * input.deliverToLandingDistance +
      0.3557 * SkidderHpSkidIVB -
      0.0003336 * input.deliverToLandingDistance * SkidderHpSkidIVB) /
    100;
  const GrappleSkidIVB = Math.min(
    5,
    (-38.36 +
      161.6 * BunchesPerTurnSkidIVB -
      0.5599 * BunchesPerTurnSkidIVB * SkidderHpSkidIVB +
      1.398 * BunchesPerTurnSkidIVB * BunchSizeSkidIVB) /
      100
  );
  const TravLoadedSkidIVB =
    (-34.52 +
      0.2634 * input.deliverToLandingDistance +
      0.7634 * SkidderHpSkidIVB -
      0.00122 * input.deliverToLandingDistance * SkidderHpSkidIVB +
      0.03782 * input.deliverToLandingDistance * BunchesPerTurnSkidIVB) /
    100;
  const UngrappleSkidIVB = Math.max(
    0,
    (5.177 * BunchesPerTurnSkidIVB +
      0.002508 * TurnWtSkidIVB -
      0.00007944 *
        TurnWtSkidIVB *
        BunchesPerTurnSkidIVB *
        BunchSizeSkidIVB *
        BunchesPerTurnSkidIVB) /
      100
  );
  const CycletimeSkidIVB =
    EastsideAdjustmentSkidIVB *
    (TravEmptySkidIVB + GrappleSkidIVB + TravLoadedSkidIVB + UngrappleSkidIVB);
  const VolPerPMHskidIVB = TurnVol / (CycletimeSkidIVB / 60);
  const CostPerCCFskidIVB = (100 * SkidderHourlyCost) / VolPerPMHskidIVB;
  const RelevanceSkidIVB = 0.5;
  // IVC John Deere 748E (Kosicki, K. 00. Productivities and costs of two harvesting trials
  // in a western Alberta riparian zone. FERIC Advantage 1(19))
  const LoadingStopsSkidIVC = 2.1;
  const TurnTimeSkidIVC =
    0.65 + 0.0054 * input.deliverToLandingDistance + 0.244 * LoadingStopsSkidIVC;
  const VolPerPMHskidIVC = TurnVol / (TurnTimeSkidIVC / 60);
  const CostPerCCFskidIVC = (100 * SkidderHourlyCost) / VolPerPMHskidIVC;
  const RelevanceSkidIVC =
    intermediate.volume < 5
      ? 0
      : intermediate.volume < 10
      ? -1 + intermediate.volume / 5
      : intermediate.volume < 50
      ? 1
      : intermediate.volume < 100
      ? 2 - intermediate.volume / 50
      : 0;
  // IVD Cat D5H TSK Custom Track (Henderson, B. 01. Roadside harvesting with low ground-presssure skidders
  // in northwestern British Columbia. FERIC Advantage 2(54))
  const TurnTimeSkidIVD = 2.818 + 0.0109 * input.deliverToLandingDistance;
  const VolPerPMHskidIVD = TurnVol / (TurnTimeSkidIVD / 60);
  const CostPerCCFskidIVD = (100 * SkidderHourlyCost) / VolPerPMHskidIVD;
  const RelevanceSkidIVD =
    intermediate.volume < 5
      ? 0
      : intermediate.volume < 10
      ? -1 + intermediate.volume / 5
      : intermediate.volume < 50
      ? 1
      : intermediate.volume < 100
      ? 2 - intermediate.volume / 50
      : 0;
  // IVE JD 748_G-II & TJ 560 (Kosicki, K. 02. Productivity and
  // cost of summer harvesting in a central Alberta mixedwood stand. FERIC Advantage 3(6))
  const BunchesPerTurnSkidIVE = BunchesPerTurnSkidIVB;
  const TurnTimeSkidIVE =
    0.649 + 0.0058 * input.deliverToLandingDistance + 0.581 * BunchesPerTurnSkidIVE;
  const VolPerPMHskidIVE = TurnVol / (TurnTimeSkidIVE / 60);
  const CostPerCCFskidIVE = (100 * SkidderHourlyCost) / VolPerPMHskidIVE;
  const RelevanceSkidIVE =
    intermediate.volume < 30 ? 1 : intermediate.volume < 60 ? 2 - intermediate.volume / 30 : 0;
  // IVF Tigercat 635 (Boswell, B. 98. Vancouver Island mechanized thinning trials. FERIC Technical Note TN-271)
  const TurnTimeSkidIVF = 5.77 + 0.007 * input.deliverToLandingDistance;
  const VolPerPMHskidIVF = TurnVol / (TurnTimeSkidIVF / 60);
  const CostPerCCFskidIVF = (100 * SkidderHourlyCost) / VolPerPMHskidIVF;
  const RelevanceSkidIVF =
    intermediate.volume < 5
      ? 0
      : intermediate.volume < 10
      ? -1 + intermediate.volume / 5
      : intermediate.volume < 100
      ? 1
      : intermediate.volume < 150
      ? 3 - intermediate.volume / 50
      : 0;
  // IVG Tigercat 635 (Kosicki, K. 02. Evaluation of Trans-Gesco TG88C and
  // Tigercat 635 grapple skidders working in central Alberta. FERIC Advantage 3(37))
  const TreesPerTurnSkidIVG = TreesPerTurnS;
  const TurnTimeSkidIVG =
    2.98 + 0.006 * input.deliverToLandingDistance + 0.27 * TreesPerTurnSkidIVG;
  const VolPerPMHskidIVG = TurnVol / (TurnTimeSkidIVG / 60);
  const CostPerCCFskidIVG = (100 * SkidderHourlyCost) / VolPerPMHskidIVG;
  const RelevanceSkidIVG =
    intermediate.volume < 40 ? 1 : intermediate.volume < 80 ? 2 - intermediate.volume / 40 : 0;
  // IVH User-Defined Skidding Bunched
  const VolPerPMHskidIVH = 0.001;
  const CostPerCCFskidIVH = (100 * SkidderHourlyCost) / VolPerPMHskidIVH;
  const RelevanceSkidIVH = 0;
  // Skidding Summary
  // CostSkidUB ($/CCF)
  const RelevanceSumUB =
    RelevanceSkidIA +
    RelevanceSkidIB +
    RelevanceSkidIC +
    RelevanceSkidID +
    RelevanceSkidIE +
    RelevanceSkidIIA +
    RelevanceSkidIIB +
    RelevanceSkidIII;
  const WeightedCostPerPMHUB =
    (SkidderHourlyCost * RelevanceSkidIA +
      SkidderHourlyCost * RelevanceSkidIB +
      SkidderHourlyCost * RelevanceSkidIC +
      SkidderHourlyCost * RelevanceSkidID +
      SkidderHourlyCost * RelevanceSkidIE +
      SkidderHourlyCost * RelevanceSkidIIA +
      SkidderHourlyCost * RelevanceSkidIIB +
      SkidderHourlyCost * RelevanceSkidIII) /
    RelevanceSumUB;
  const WeightedVolPerPMHUB =
    (RelevanceSkidIA * VolPerPMHskidIA +
      RelevanceSkidIB * VolPerPMHskidIB +
      RelevanceSkidIC * VolPerPMHskidIC +
      RelevanceSkidID * VolPerPMHskidID +
      RelevanceSkidIE * VolPerPMHskidIE +
      RelevanceSkidIIA * VolPerPMHskidIIA +
      RelevanceSkidIIB * VolPerPMHskidIIB +
      RelevanceSkidIII * VolPerPMHskidIII) /
    RelevanceSumUB;
  const CostSkidUB = (intermediate.cHardwood * 100 * WeightedCostPerPMHUB) / WeightedVolPerPMHUB;
  // GalSkidUB (gal/CCF)
  const HorsepowerSkidderS = 120;
  const HorsepowerSkidderB = 200;
  const fcrSkidder = 0.028;
  const WeightedGalPerPMH =
    HorsepowerSkidderS * fcrSkidder * (1 - intermediate.manualMachineSize) +
    HorsepowerSkidderB * fcrSkidder * intermediate.manualMachineSize;
  const GalSkidUB = (WeightedGalPerPMH * CostSkidUB) / WeightedCostPerPMHUB;
  // CostSkidBun
  const RelevanceSumB =
    RelevanceSkidIVA +
    RelevanceSkidIVB +
    RelevanceSkidIVC +
    RelevanceSkidIVD +
    RelevanceSkidIVE +
    RelevanceSkidIVF +
    RelevanceSkidIVG +
    RelevanceSkidIVH;
  const WeightedCostPerPMHB =
    (SkidderHourlyCost * RelevanceSkidIVA +
      SkidderHourlyCost * RelevanceSkidIVB +
      SkidderHourlyCost * RelevanceSkidIVC +
      SkidderHourlyCost * RelevanceSkidIVD +
      SkidderHourlyCost * RelevanceSkidIVE +
      SkidderHourlyCost * RelevanceSkidIVF +
      SkidderHourlyCost * RelevanceSkidIVG +
      SkidderHourlyCost * RelevanceSkidIVH) /
    RelevanceSumB;
  const WeightedVolPerPMHB =
    (RelevanceSkidIVA * VolPerPMHskidIVA +
      RelevanceSkidIVB * VolPerPMHskidIVB +
      RelevanceSkidIVC * VolPerPMHskidIVC +
      RelevanceSkidIVD * VolPerPMHskidIVD +
      RelevanceSkidIVE * VolPerPMHskidIVE +
      RelevanceSkidIVF * VolPerPMHskidIVF +
      RelevanceSkidIVG * VolPerPMHskidIVG +
      RelevanceSkidIVH * VolPerPMHskidIVH) /
    RelevanceSumB;
  const CostSkidBun = (intermediate.cHardwood * 100 * WeightedCostPerPMHB) / WeightedVolPerPMHB;
  // GalSkidBun
  const GalSkidBun = (WeightedGalPerPMH * CostSkidBun) / WeightedCostPerPMHB;

  return {
    CostSkidBun: CostSkidBun,
    CostSkidUB: CostSkidUB,
    GalSkidUB: GalSkidUB,
    GalSkidBun: GalSkidBun,
  };
}

export { Skidding };
