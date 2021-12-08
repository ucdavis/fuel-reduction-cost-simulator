// CableYarding sheet: I. Cable Yarding, Clearcut, Unbunched (CYCCU)
import { FrcsInputs, IntermediateVariables, MachineCosts } from '../../frcs.model';

function CYCCU(input: FrcsInputs, intermediate: IntermediateVariables, machineCost: MachineCosts) {
  // Cable Yarding Inputs
  const TurnArea = 800;
  // Yarding Calculated Values
  const AreaLimitedTurnVol = (intermediate.volPerAcre * TurnArea) / 43560;
  const YarderHourlyCost =
    machineCost.PMH_YarderS * (1 - intermediate.manualMachineSize) +
    machineCost.PMH_YarderI * intermediate.manualMachineSize;
  const YarderCapacity = (6000 + intermediate.manualMachineSize * 3000) / intermediate.woodDensity;

  // Corridor and Landing Change Costs`
  // Clearcut corridor & landing changes
  // Jammer
  const TailblockSpacingJammer = 50;
  const AreaLineShiftJammer = (TailblockSpacingJammer * 2 * input.deliverToLandingDistance) / 43560;
  const LineShiftTimeJammer = 0.5;
  const LineShiftCostJammer =
    (100 * (machineCost.PMH_YarderS * LineShiftTimeJammer)) /
    (intermediate.volPerAcre * AreaLineShiftJammer);
  const LandingShiftCostJammer = 0;
  const CCJammerChangeCost = LineShiftCostJammer + LandingShiftCostJammer;

  function CCSLChangeCost(LineShiftTime: number) {
    const TailblockSpacingRunning = 70;
    const AreaLineShiftRunning =
      ((TailblockSpacingRunning / 2) * 1.5 * input.deliverToLandingDistance) / 43560;
    const LineShiftCostRunning =
      (100 * (YarderHourlyCost * LineShiftTime)) / (intermediate.volPerAcre * AreaLineShiftRunning);
    const AreaLandingRunning =
      ((Math.PI / 2) * Math.pow(1.5 * input.deliverToLandingDistance, 2)) / 43560;
    const LandingShiftTimeRunning = 2;
    const LandingShiftCostRunning =
      (100 * (YarderHourlyCost * LandingShiftTimeRunning)) /
      (intermediate.volPerAcre * AreaLandingRunning);
    return LineShiftCostRunning + LandingShiftCostRunning;
  }
  // Running & Live
  const CCRunSLChangeCost = CCSLChangeCost(0.25);
  const CCLiveSLChangeCost = CCSLChangeCost(0.5);

  const LogsI = 1;
  const TurnVol1 = intermediate.logVol * LogsI;
  function VolPerPMH1(TurnTimeCable: number) {
    return TurnVol1 / (TurnTimeCable / 60);
  }
  function YardingPerCCF1(VolPerPMHarg: number) {
    return (100 * machineCost.PMH_YarderS) / VolPerPMHarg;
  }
  const TurnVol2 = Math.min(YarderCapacity, Math.max(AreaLimitedTurnVol, intermediate.volume));
  const LogsII = Math.max(1, TurnVol2 / intermediate.logVol);
  function VolPerPMH2(TurnTimeCable: number) {
    return TurnVol2 / (TurnTimeCable / 60);
  }
  function YardingPerCCF2(VolPerPMHarg: number) {
    return (100 * YarderHourlyCost) / VolPerPMHarg;
  }

  // I. Cable Yarding, Clearcut, Unbunched (CYCCU)
  // A) Idaho Jammer (Schillings, 69)
  const TurnTimeIAcable = 0.321 + 0.00285 * input.deliverToLandingDistance + 0.009906 * input.slope;
  const VolPerPMHIAcable = VolPerPMH1(TurnTimeIAcable);
  const YardingPerCCFIAcable = YardingPerCCF1(VolPerPMHIAcable);
  const CostPerCCFIAcable = YardingPerCCFIAcable + CCJammerChangeCost;
  const RelevanceIAcable =
    intermediate.logVol < 5
      ? 0
      : intermediate.logVol < 10
      ? -1 + intermediate.logVol / 5
      : intermediate.logVol < 50
      ? 1
      : intermediate.logVol < 100
      ? 2 - intermediate.logVol / 50
      : 1;
  const WeightingProductIAcable = VolPerPMHIAcable * CostPerCCFIAcable * RelevanceIAcable;
  const WeightingDivisorIAcable = VolPerPMHIAcable * RelevanceIAcable;
  // B) Idaho Jammer (Hensel&Johnson, 79)
  const TurnTimeIBcable =
    (72.26 +
      0.0638 * intermediate.bfPerCF * intermediate.logVol +
      0.1152 * input.deliverToLandingDistance -
      996 / Math.max(20, input.slope)) /
    60;
  const VolPerPMHIBcable = VolPerPMH1(TurnTimeIBcable);
  const YardingPerCCFIBcable = YardingPerCCF1(VolPerPMHIBcable);
  const CostPerCCFIBcable = YardingPerCCFIBcable + CCJammerChangeCost;
  const RelevanceIBcable =
    intermediate.logVol < 5 ? 0 : intermediate.logVol < 10 ? -1 + intermediate.logVol / 5 : 1;
  const WeightingProductIBcable = VolPerPMHIBcable * CostPerCCFIBcable * RelevanceIBcable;
  const WeightingDivisorIBcable = VolPerPMHIBcable * RelevanceIBcable;
  // C) LinkBelt 98 Live Skyline (Hensel&Johnson, 79)
  const TurnTimeICcable =
    (177.3 +
      0.3568 * intermediate.logVol +
      0.000522 * Math.pow(input.deliverToLandingDistance, 2) +
      0.0105 * Math.pow(input.slope, 2)) /
    60;
  const VolPerPMHICcable = VolPerPMH2(TurnTimeICcable);
  const YardingPerCCFICcable = YardingPerCCF2(VolPerPMHICcable);
  const CostPerCCFICcable = YardingPerCCFICcable + CCLiveSLChangeCost;
  const RelevanceICcable =
    intermediate.logVol < 5 ? 0 : intermediate.logVol < 10 ? -1 + intermediate.logVol / 5 : 1;
  const WeightingProductICcable = VolPerPMHICcable * CostPerCCFICcable * RelevanceICcable;
  const WeightingDivisorICcable = VolPerPMHICcable * RelevanceICcable;
  // D) Skagit GT3 Running Skyline (Hensel&Johnson, 79)
  const TurnTimeIDcable =
    (164 +
      0.04872 * intermediate.bfPerCF * intermediate.logVol +
      0.000405 * Math.pow(input.deliverToLandingDistance, 2) +
      607 / Math.max(20, input.slope)) /
    60;
  const VolPerPMHIDcable = VolPerPMH2(TurnTimeIDcable);
  const YardingPerCCFIDcable = YardingPerCCF2(VolPerPMHIDcable);
  const CostPerCCFIDcable = YardingPerCCFIDcable + CCRunSLChangeCost;
  const RelevanceIDcable =
    intermediate.logVol < 5 ? 0 : intermediate.logVol < 10 ? -1 + intermediate.logVol / 5 : 1;
  const WeightingProductIDcable = VolPerPMHIDcable * CostPerCCFIDcable * RelevanceIDcable;
  const WeightingDivisorIDcable = VolPerPMHIDcable * RelevanceIDcable;
  // E) Skagit GT3 Running Skyline (Gardner, 80)
  const LatDistCC = 5;
  const TurnTimeIEcable = Math.exp(
    1.09 +
      0.0196 * LogsII +
      0.00106 * input.deliverToLandingDistance +
      0.000617 * TurnVol2 +
      0.000043 * LatDistCC * input.slope
  );
  const VolPerPMHIEcable = VolPerPMH2(TurnTimeIEcable);
  const YardingPerCCFIEcable = YardingPerCCF2(VolPerPMHIEcable);
  const CostPerCCFIEcable = YardingPerCCFIEcable + CCRunSLChangeCost;
  const RelevanceIEcable =
    intermediate.logVol < 30 ? 1 : intermediate.logVol < 60 ? 2 - intermediate.logVol / 30 : 0;
  const WeightingProductIEcable = VolPerPMHIEcable * CostPerCCFIEcable * RelevanceIEcable;
  const WeightingDivisorIEcable = VolPerPMHIEcable * RelevanceIEcable;
  // F) LinkBelt 78 Shotgun Live Skyline (Gardner, 80)
  const TurnTimeIFcable = Math.exp(
    1.91 +
      0.000545 * input.deliverToLandingDistance -
      0.0068 * input.slope +
      0.00212 * TurnVol2 -
      0.416 / Math.max(1, LogsII)
  );
  const VolPerPMHIFcable = VolPerPMH2(TurnTimeIFcable);
  const YardingPerCCFIFcable = YardingPerCCF2(VolPerPMHIFcable);
  const CostPerCCFIFcable = YardingPerCCFIFcable + CCLiveSLChangeCost;
  const RelevanceIFcable =
    (intermediate.logVol < 30 ? 1 : intermediate.logVol < 60 ? 2 - intermediate.logVol / 30 : 0) *
    (input.slope < 30 ? 0 : input.slope < 40 ? input.slope / 10 - 3 : 1);
  const WeightingProductIFcable = VolPerPMHIFcable * CostPerCCFIFcable * RelevanceIFcable;
  const WeightingDivisorIFcable = VolPerPMHIFcable * RelevanceIFcable;
  // G) Washington SLH78 (Andersson, B. and G. Young. 98. Harvesting coastal second growth forests:
  // summary of harvesting system performance. FERIC Technical Report TR-120)
  const DelayFracIGcable = 0.042;
  const TurnTimeIGcable =
    (1 + DelayFracIGcable) *
    (0.31 +
      0.00323 * input.deliverToLandingDistance +
      1.593 +
      1.24 * Math.log10(LogsII) +
      0.326 +
      0.107 * LogsII +
      0.021);
  const VolPerPMHIGcable = VolPerPMH2(TurnTimeIGcable);
  const YardingPerCCFIGcable = YardingPerCCF2(VolPerPMHIGcable);
  const CostPerCCFIGcable = YardingPerCCFIGcable + CCRunSLChangeCost;
  const RelevanceIGcable =
    intermediate.volume < 80 ? 1 : intermediate.volume < 160 ? 2 - intermediate.volume / 80 : 0;
  const WeightingProductIGcable = VolPerPMHIGcable * CostPerCCFIGcable * RelevanceIGcable;
  const WeightingDivisorIGcable = VolPerPMHIGcable * RelevanceIGcable;
  // H) User-Defined Clearcut, Unbunched
  const TurnTimeIHcable = 10000;
  const VolPerPMHIHcable = VolPerPMH2(TurnTimeIHcable);
  const YardingPerCCFIHcable = YardingPerCCF2(VolPerPMHIHcable);
  const CostPerCCFIHcable = YardingPerCCFIHcable + 0;
  const RelevanceIHcable = 0;
  const WeightingProductIHcable = VolPerPMHIHcable * CostPerCCFIHcable * RelevanceIHcable;
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
    HorsepowerYarderS * fcrYarder * (1 - intermediate.manualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.manualMachineSize;
  const GalPerPMHID =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.manualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.manualMachineSize;
  const GalPerPMHIE =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.manualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.manualMachineSize;
  const GalPerPMHIF =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.manualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.manualMachineSize;
  const GalPerPMHIG =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.manualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.manualMachineSize;
  const GalPerPMHIH =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.manualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.manualMachineSize;
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
