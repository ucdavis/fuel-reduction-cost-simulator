// CableYarding sheet: I. Cable Yarding, Clearcut, Unbunched (CYCCU)
import {
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../../frcs.model';

function CYCCU(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  machineCost: MachineCostMod
) {
  // Cable Yarding Inputs
  const TurnArea = 800;
  // Yarding Calculated Values
  const AreaLimitedTurnVol = (intermediate.VolPerAcre * TurnArea) / 43560;
  const YarderHourlyCost =
    machineCost.PMH_YarderS * (1 - intermediate.ManualMachineSize) +
    machineCost.PMH_YarderI * intermediate.ManualMachineSize;
  const YarderCapacity =
    (6000 + intermediate.ManualMachineSize * 3000) / intermediate.WoodDensity;

  // Corridor and Landing Change Costs`
  // Clearcut corridor & landing changes
  // Jammer
  const TailblockSpacingJammer = 50;
  const AreaLineShiftJammer =
    (TailblockSpacingJammer * 2 * input.DeliverDist) / 43560;
  const LineShiftTimeJammer = 0.5;
  const LineShiftCostJammer =
    (100 * (machineCost.PMH_YarderS * LineShiftTimeJammer)) /
    (intermediate.VolPerAcre * AreaLineShiftJammer);
  const LandingShiftCostJammer = 0;
  const CCJammerChangeCost = LineShiftCostJammer + LandingShiftCostJammer;

  function CCSLChangeCost(LineShiftTime: number) {
    const TailblockSpacingRunning = 70;
    const AreaLineShiftRunning =
      ((TailblockSpacingRunning / 2) * 1.5 * input.DeliverDist) / 43560;
    const LineShiftCostRunning =
      (100 * (YarderHourlyCost * LineShiftTime)) /
      (intermediate.VolPerAcre * AreaLineShiftRunning);
    const AreaLandingRunning =
      ((Math.PI / 2) * Math.pow(1.5 * input.DeliverDist, 2)) / 43560;
    const LandingShiftTimeRunning = 2;
    const LandingShiftCostRunning =
      (100 * (YarderHourlyCost * LandingShiftTimeRunning)) /
      (intermediate.VolPerAcre * AreaLandingRunning);
    return LineShiftCostRunning + LandingShiftCostRunning;
  }
  // Running & Live
  const CCRunSLChangeCost = CCSLChangeCost(0.25);
  const CCLiveSLChangeCost = CCSLChangeCost(0.5);

  const LogsI = 1;
  const TurnVol1 = intermediate.LogVol * LogsI;
  function VolPerPMH1(TurnTimeCable: number) {
    return TurnVol1 / (TurnTimeCable / 60);
  }
  function YardingPerCCF1(VolPerPMHarg: number) {
    return (100 * machineCost.PMH_YarderS) / VolPerPMHarg;
  }
  const TurnVol2 = Math.min(
    YarderCapacity,
    Math.max(AreaLimitedTurnVol, intermediate.TreeVol)
  );
  const LogsII = Math.max(1, TurnVol2 / intermediate.LogVol);
  function VolPerPMH2(TurnTimeCable: number) {
    return TurnVol2 / (TurnTimeCable / 60);
  }
  function YardingPerCCF2(VolPerPMHarg: number) {
    return (100 * YarderHourlyCost) / VolPerPMHarg;
  }

  // I. Cable Yarding, Clearcut, Unbunched (CYCCU)
  // A) Idaho Jammer (Schillings, 69)
  const TurnTimeIAcable =
    0.321 + 0.00285 * input.DeliverDist + 0.009906 * input.Slope;
  const VolPerPMHIAcable = VolPerPMH1(TurnTimeIAcable);
  const YardingPerCCFIAcable = YardingPerCCF1(VolPerPMHIAcable);
  const CostPerCCFIAcable = YardingPerCCFIAcable + CCJammerChangeCost;
  const RelevanceIAcable =
    intermediate.LogVol < 5
      ? 0
      : intermediate.LogVol < 10
      ? -1 + intermediate.LogVol / 5
      : intermediate.LogVol < 50
      ? 1
      : intermediate.LogVol < 100
      ? 2 - intermediate.LogVol / 50
      : 1;
  const WeightingProductIAcable =
    VolPerPMHIAcable * CostPerCCFIAcable * RelevanceIAcable;
  const WeightingDivisorIAcable = VolPerPMHIAcable * RelevanceIAcable;
  // B) Idaho Jammer (Hensel&Johnson, 79)
  const TurnTimeIBcable =
    (72.26 +
      0.0638 * intermediate.BFperCF * intermediate.LogVol +
      0.1152 * input.DeliverDist -
      996 / Math.max(20, input.Slope)) /
    60;
  const VolPerPMHIBcable = VolPerPMH1(TurnTimeIBcable);
  const YardingPerCCFIBcable = YardingPerCCF1(VolPerPMHIBcable);
  const CostPerCCFIBcable = YardingPerCCFIBcable + CCJammerChangeCost;
  const RelevanceIBcable =
    intermediate.LogVol < 5
      ? 0
      : intermediate.LogVol < 10
      ? -1 + intermediate.LogVol / 5
      : 1;
  const WeightingProductIBcable =
    VolPerPMHIBcable * CostPerCCFIBcable * RelevanceIBcable;
  const WeightingDivisorIBcable = VolPerPMHIBcable * RelevanceIBcable;
  // C) LinkBelt 98 Live Skyline (Hensel&Johnson, 79)
  const TurnTimeICcable =
    (177.3 +
      0.3568 * intermediate.LogVol +
      0.000522 * Math.pow(input.DeliverDist, 2) +
      0.0105 * Math.pow(input.Slope, 2)) /
    60;
  const VolPerPMHICcable = VolPerPMH2(TurnTimeICcable);
  const YardingPerCCFICcable = YardingPerCCF2(VolPerPMHICcable);
  const CostPerCCFICcable = YardingPerCCFICcable + CCLiveSLChangeCost;
  const RelevanceICcable =
    intermediate.LogVol < 5
      ? 0
      : intermediate.LogVol < 10
      ? -1 + intermediate.LogVol / 5
      : 1;
  const WeightingProductICcable =
    VolPerPMHICcable * CostPerCCFICcable * RelevanceICcable;
  const WeightingDivisorICcable = VolPerPMHICcable * RelevanceICcable;
  // D) Skagit GT3 Running Skyline (Hensel&Johnson, 79)
  const TurnTimeIDcable =
    (164 +
      0.04872 * intermediate.BFperCF * intermediate.LogVol +
      0.000405 * Math.pow(input.DeliverDist, 2) +
      607 / Math.max(20, input.Slope)) /
    60;
  const VolPerPMHIDcable = VolPerPMH2(TurnTimeIDcable);
  const YardingPerCCFIDcable = YardingPerCCF2(VolPerPMHIDcable);
  const CostPerCCFIDcable = YardingPerCCFIDcable + CCRunSLChangeCost;
  const RelevanceIDcable =
    intermediate.LogVol < 5
      ? 0
      : intermediate.LogVol < 10
      ? -1 + intermediate.LogVol / 5
      : 1;
  const WeightingProductIDcable =
    VolPerPMHIDcable * CostPerCCFIDcable * RelevanceIDcable;
  const WeightingDivisorIDcable = VolPerPMHIDcable * RelevanceIDcable;
  // E) Skagit GT3 Running Skyline (Gardner, 80)
  const LatDistCC = 5;
  const TurnTimeIEcable = Math.exp(
    1.09 +
      0.0196 * LogsII +
      0.00106 * input.DeliverDist +
      0.000617 * TurnVol2 +
      0.000043 * LatDistCC * input.Slope
  );
  const VolPerPMHIEcable = VolPerPMH2(TurnTimeIEcable);
  const YardingPerCCFIEcable = YardingPerCCF2(VolPerPMHIEcable);
  const CostPerCCFIEcable = YardingPerCCFIEcable + CCRunSLChangeCost;
  const RelevanceIEcable =
    intermediate.LogVol < 30
      ? 1
      : intermediate.LogVol < 60
      ? 2 - intermediate.LogVol / 30
      : 0;
  const WeightingProductIEcable =
    VolPerPMHIEcable * CostPerCCFIEcable * RelevanceIEcable;
  const WeightingDivisorIEcable = VolPerPMHIEcable * RelevanceIEcable;
  // F) LinkBelt 78 Shotgun Live Skyline (Gardner, 80)
  const TurnTimeIFcable = Math.exp(
    1.91 +
      0.000545 * input.DeliverDist -
      0.0068 * input.Slope +
      0.00212 * TurnVol2 -
      0.416 / Math.max(1, LogsII)
  );
  const VolPerPMHIFcable = VolPerPMH2(TurnTimeIFcable);
  const YardingPerCCFIFcable = YardingPerCCF2(VolPerPMHIFcable);
  const CostPerCCFIFcable = YardingPerCCFIFcable + CCLiveSLChangeCost;
  const RelevanceIFcable =
    (intermediate.LogVol < 30
      ? 1
      : intermediate.LogVol < 60
      ? 2 - intermediate.LogVol / 30
      : 0) *
    (input.Slope < 30 ? 0 : input.Slope < 40 ? input.Slope / 10 - 3 : 1);
  const WeightingProductIFcable =
    VolPerPMHIFcable * CostPerCCFIFcable * RelevanceIFcable;
  const WeightingDivisorIFcable = VolPerPMHIFcable * RelevanceIFcable;
  // G) Washington SLH78 (Andersson, B. and G. Young. 98. Harvesting coastal second growth forests:
  // summary of harvesting system performance. FERIC Technical Report TR-120)
  const DelayFracIGcable = 0.042;
  const TurnTimeIGcable =
    (1 + DelayFracIGcable) *
    (0.31 +
      0.00323 * input.DeliverDist +
      1.593 +
      1.24 * Math.log10(LogsII) +
      0.326 +
      0.107 * LogsII +
      0.021);
  const VolPerPMHIGcable = VolPerPMH2(TurnTimeIGcable);
  const YardingPerCCFIGcable = YardingPerCCF2(VolPerPMHIGcable);
  const CostPerCCFIGcable = YardingPerCCFIGcable + CCRunSLChangeCost;
  const RelevanceIGcable =
    intermediate.TreeVol < 80
      ? 1
      : intermediate.TreeVol < 160
      ? 2 - intermediate.TreeVol / 80
      : 0;
  const WeightingProductIGcable =
    VolPerPMHIGcable * CostPerCCFIGcable * RelevanceIGcable;
  const WeightingDivisorIGcable = VolPerPMHIGcable * RelevanceIGcable;
  // H) User-Defined Clearcut, Unbunched
  const TurnTimeIHcable = 10000;
  const VolPerPMHIHcable = VolPerPMH2(TurnTimeIHcable);
  const YardingPerCCFIHcable = YardingPerCCF2(VolPerPMHIHcable);
  const CostPerCCFIHcable = YardingPerCCFIHcable + 0;
  const RelevanceIHcable = 0;
  const WeightingProductIHcable =
    VolPerPMHIHcable * CostPerCCFIHcable * RelevanceIHcable;
  const WeightingDivisorIHcable = VolPerPMHIHcable * RelevanceIHcable;
  // Results
  // CostYardCCUB
  const WeightingProduct1Sum =
    WeightingProductIAcable +
    WeightingProductIBcable +
    WeightingProductICcable +
    WeightingProductIDcable +
    WeightingProductIEcable +
    WeightingProductIFcable +
    WeightingProductIGcable +
    WeightingProductIHcable;
  const WeightingDivisor1Sum =
    WeightingDivisorIAcable +
    WeightingDivisorIBcable +
    WeightingDivisorICcable +
    WeightingDivisorIDcable +
    WeightingDivisorIEcable +
    WeightingDivisorIFcable +
    WeightingDivisorIGcable +
    WeightingDivisorIHcable;
  const CostYardCCUB = WeightingProduct1Sum / WeightingDivisor1Sum;
  // GalYardCCUB
  const HorsepowerYarderS = 100;
  const HorsepowerYarderI = 200;
  const fcrYarder = 0.04;
  const GalPerPMHIA = HorsepowerYarderS * fcrYarder;
  const GalPerPMHIB = HorsepowerYarderS * fcrYarder;
  const GalPerPMHIC =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.ManualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.ManualMachineSize;
  const GalPerPMHID =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.ManualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.ManualMachineSize;
  const GalPerPMHIE =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.ManualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.ManualMachineSize;
  const GalPerPMHIF =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.ManualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.ManualMachineSize;
  const GalPerPMHIG =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.ManualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.ManualMachineSize;
  const GalPerPMHIH =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.ManualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.ManualMachineSize;
  const RelevanceSum =
    RelevanceIAcable +
    RelevanceIBcable +
    RelevanceICcable +
    RelevanceIDcable +
    RelevanceIEcable +
    RelevanceIFcable +
    RelevanceIGcable +
    RelevanceIHcable;
  const WeightedGalPerPMH =
    (GalPerPMHIA * RelevanceIAcable +
      GalPerPMHIB * RelevanceIBcable +
      GalPerPMHIC * RelevanceICcable +
      GalPerPMHID * RelevanceIDcable +
      GalPerPMHIE * RelevanceIEcable +
      GalPerPMHIF * RelevanceIFcable +
      GalPerPMHIG * RelevanceIGcable +
      GalPerPMHIH * RelevanceIHcable) /
    RelevanceSum;
  const WeightedCostPerPMH =
    (machineCost.PMH_YarderS * RelevanceIAcable +
      machineCost.PMH_YarderS * RelevanceIBcable +
      YarderHourlyCost * RelevanceICcable +
      YarderHourlyCost * RelevanceIDcable +
      YarderHourlyCost * RelevanceIEcable +
      YarderHourlyCost * RelevanceIFcable +
      YarderHourlyCost * RelevanceIGcable +
      YarderHourlyCost * RelevanceIHcable) /
    RelevanceSum;
  const GalYardCCUB = (WeightedGalPerPMH * CostYardCCUB) / WeightedCostPerPMH;

  return { CostYardCCUB, GalYardCCUB };
}

export { CYCCU };
