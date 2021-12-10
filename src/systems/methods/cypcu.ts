// CableYarding sheet: II. Cable Yarding, Partial Cut, Unbunched (CYPCU)
import { Assumptions, FrcsInputs, IntermediateVariables, MachineCosts } from '../../model';

function CYPCU(
  assumption: Assumptions,
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  machineCost: MachineCosts
) {
  // Cable Yarding Inputs
  const LatDist = 35;
  const TurnArea = 800;
  // Yarding Calculated Values
  const AreaLimitedTurnVol = (intermediate.volPerAcre * TurnArea) / 43560;
  const YarderHourlyCost =
    machineCost.PMH_YarderS * (1 - intermediate.manualMachineSize) +
    machineCost.PMH_YarderI * intermediate.manualMachineSize;
  const YarderCapacity = (6000 + intermediate.manualMachineSize * 3000) / intermediate.woodDensity;

  // Corridor and Landing Change Costs`
  // Partial cut corridor changes
  function PCSLChangeCost(CorridorChangeTime: number) {
    const CorriderSpacingRunning = 150;
    const AreaChangeRunning = (input.deliverToLandingDistance * 2 * CorriderSpacingRunning) / 43560;
    return (
      (100 * (YarderHourlyCost * CorridorChangeTime)) /
      (intermediate.volPerAcre * AreaChangeRunning)
    );
  }
  // Running & Live
  const PCRunSLChangeCost = PCSLChangeCost(1);
  const PCLiveStandSLChangeCost = PCSLChangeCost(1.5);

  const TurnVol2 = Math.min(YarderCapacity, Math.max(AreaLimitedTurnVol, intermediate.volume));
  const LogsII = Math.max(1, TurnVol2 / intermediate.logVol);
  function VolPerPMH2(TurnTimeCable: number) {
    return TurnVol2 / (TurnTimeCable / 60);
  }
  function YardingPerCCF2(VolPerPMHarg: number) {
    return (100 * YarderHourlyCost) / VolPerPMHarg;
  }

  // II. Cable Yarding, Partial Cut, Unbunched (CYPCU)
  // A) Clearwater Shotgun Live Skyline (Johnson&Lee, 88)
  const TurnEndAreaIIAcable = (2 * TurnVol2) / assumption.LogLength;
  const DeckHeightIIAcable = 5;
  const TurnTimeIIAcable =
    1.51 +
    0.012 * TurnVol2 +
    0.011 * DeckHeightIIAcable * LogsII +
    0.021 * DeckHeightIIAcable * TurnEndAreaIIAcable +
    0.004 * (input.deliverToLandingDistance + LatDist) +
    0.0002 * Math.pow(LatDist, 2);
  const VolPerPMHIIAcable = VolPerPMH2(TurnTimeIIAcable);
  const YardingPerCCFIIAcable = YardingPerCCF2(VolPerPMHIIAcable);
  const CostPerCCFIIAcable = YardingPerCCFIIAcable + PCRunSLChangeCost;
  const RelevanceIIAcable =
    intermediate.volume < 10 ? 1 : intermediate.volume < 20 ? 2 - intermediate.volume / 10 : 0;
  const WeightingProductIIAcable = VolPerPMHIIAcable * CostPerCCFIIAcable * RelevanceIIAcable;
  const WeightingDivisorIIAcable = VolPerPMHIIAcable * RelevanceIIAcable;
  // B) Madill 071 Live Skyline w/Danebo MSP (Kellogg,Olsen&Hargrave, 86)
  const TurnTimeIIBcable =
    1.82 +
    0.0024 * input.deliverToLandingDistance +
    0.00021 * Math.pow(LatDist, 2) +
    0.0125 * TurnVol2 +
    0.0151 * input.slope +
    1.05;
  const VolPerPMHIIBcable = VolPerPMH2(TurnTimeIIBcable);
  const YardingPerCCFIIBcable = YardingPerCCF2(VolPerPMHIIBcable);
  const CostPerCCFIIBcable = YardingPerCCFIIBcable + PCLiveStandSLChangeCost;
  const RelevanceIIBcable = TurnVol2 < 200 ? 1 : TurnVol2 < 400 ? 2 - TurnVol2 / 200 : 0;
  const WeightingProductIIBcable = VolPerPMHIIBcable * CostPerCCFIIBcable * RelevanceIIBcable;
  const WeightingDivisorIIBcable = VolPerPMHIIBcable * RelevanceIIBcable;
  // C) Skagit GT3 Running Skyline, Shelterwood (Gardner, 80)
  const TurnTimeIICcable = Math.exp(
    1.46 +
      0.000486 * input.deliverToLandingDistance +
      0.00114 * LatDist +
      0.00000896 * intermediate.woodDensity * TurnVol2
  );
  const VolPerPMHIICcable = VolPerPMH2(TurnTimeIICcable);
  const YardingPerCCFIICcable = YardingPerCCF2(VolPerPMHIICcable);
  const CostPerCCFIICcable = YardingPerCCFIICcable + PCRunSLChangeCost;
  const RelevanceIICcable =
    intermediate.logVol < 30 ? 1 : intermediate.logVol < 60 ? 2 - intermediate.logVol / 30 : 0;
  const WeightingProductIICcable = VolPerPMHIICcable * CostPerCCFIICcable * RelevanceIICcable;
  const WeightingDivisorIICcable = VolPerPMHIICcable * RelevanceIICcable;
  // D) Skagit GT3 Running Skyline, Group Selection (Gardner, 80)
  const TurnTimeIIDcable = Math.exp(
    0.58 +
      0.192 * Math.log(input.deliverToLandingDistance) -
      0.00308 * input.slope +
      0.00193 * LatDist +
      0.000004 * LogsII * intermediate.woodDensity * TurnVol2
  );
  const VolPerPMHIIDcable = VolPerPMH2(TurnTimeIIDcable);
  const YardingPerCCFIIDcable = YardingPerCCF2(VolPerPMHIIDcable);
  const CostPerCCFIIDcable = YardingPerCCFIIDcable + PCRunSLChangeCost;
  const RelevanceIIDcable =
    intermediate.logVol < 30 ? 1 : intermediate.logVol < 60 ? 2 - intermediate.logVol / 30 : 0;
  const WeightingProductIIDcable = VolPerPMHIIDcable * CostPerCCFIIDcable * RelevanceIIDcable;
  const WeightingDivisorIIDcable = VolPerPMHIIDcable * RelevanceIIDcable;
  // E) LinkBelt 78 Shotgun Live Skyline, Group Selection (Gardner, 80)
  const TurnTimeIIEcable = Math.exp(
    1.813 +
      0.00094 * input.deliverToLandingDistance -
      0.0095 * input.slope +
      0.00172 * LatDist +
      0.00000277 * LogsII * intermediate.woodDensity * TurnVol2
  );
  const VolPerPMHIIEcable = VolPerPMH2(TurnTimeIIEcable);
  const YardingPerCCFIIEcable = YardingPerCCF2(VolPerPMHIIEcable);
  const CostPerCCFIIEcable = YardingPerCCFIIEcable + PCLiveStandSLChangeCost;
  const RelevanceIIEcable =
    (intermediate.logVol < 30 ? 1 : intermediate.logVol < 60 ? 2 - intermediate.logVol / 30 : 0) *
    (input.slope < 30 ? 0 : input.slope < 40 ? input.slope / 10 - 3 : 1);
  const WeightingProductIIEcable = VolPerPMHIIEcable * CostPerCCFIIEcable * RelevanceIIEcable;
  const WeightingDivisorIIEcable = VolPerPMHIIEcable * RelevanceIIEcable;
  // F) Madill 044 w/Bowman Mark Vd (Boswell, B. 01. Partial cutting with a cable yarding system
  // in coastal British Columbia. FERIC Advantage 2(44))
  const TurnTimeIIFcable = 3.73 + 0.0028 * input.deliverToLandingDistance + 0.154 * LatDist;
  const VolPerPMHIIFcable = VolPerPMH2(TurnTimeIIFcable);
  const YardingPerCCFIIFcable = YardingPerCCF2(VolPerPMHIIFcable);
  const CostPerCCFIIFcable = YardingPerCCFIIFcable + PCLiveStandSLChangeCost;
  const RelevanceIIFcable =
    intermediate.volume < 90 ? 1 : intermediate.volume < 180 ? 2 - intermediate.volume / 90 : 0;
  const WeightingProductIIFcable = VolPerPMHIIFcable * CostPerCCFIIFcable * RelevanceIIFcable;
  const WeightingDivisorIIFcable = VolPerPMHIIFcable * RelevanceIIFcable;
  // G) Skylead C40 w/Mini-Maki II (Pavel, M. 99. Analysis of a skyline partial cutting operation
  // in the interior cedar-hemlock biogeoclimatic zone. FERIC Technical Report TR-125)
  const TurnTimeIIGcable = 2.761 + 0.0014 * input.deliverToLandingDistance + 0.0114 * LatDist;
  const VolPerPMHIIGcable = VolPerPMH2(TurnTimeIIGcable);
  const YardingPerCCFIIGcable = YardingPerCCF2(VolPerPMHIIGcable);
  const CostPerCCFIIGcable = YardingPerCCFIIGcable + PCLiveStandSLChangeCost;
  const RelevanceIIGcable =
    intermediate.volume < 90 ? 1 : intermediate.volume < 180 ? 2 - intermediate.volume / 90 : 0;
  const WeightingProductIIGcable = VolPerPMHIIGcable * CostPerCCFIIGcable * RelevanceIIGcable;
  const WeightingDivisorIIGcable = VolPerPMHIIGcable * RelevanceIIGcable;
  // H) Koller K501 w/Koller SKA 2.5 manual slackpulling carriage  (Yachats site: Kellogg, L.,
  // G. Milota and M. Miller. 96. A comparison of skyline harvesting costs for
  // alternative commercial thinning prescriptions. J. For. Engr. 7(3):7-23)
  const PresetIIHcable = 1;
  const DamageIIHcable = 0;
  const SpanIIHcable = 0;
  const TurnTimeIIHcable =
    2.341 +
    0.0017 * input.deliverToLandingDistance +
    0.012 * LatDist +
    0.722 * PresetIIHcable +
    0.191 * LogsII +
    0.334 * SpanIIHcable +
    0.17 * DamageIIHcable;
  const VolPerPMHIIHcable = VolPerPMH2(TurnTimeIIHcable);
  const YardingPerCCFIIHcable = YardingPerCCF2(VolPerPMHIIHcable);
  const CostPerCCFIIHcable = YardingPerCCFIIHcable + PCLiveStandSLChangeCost;
  const RelevanceIIHcable =
    intermediate.volume < 60 ? 1 : intermediate.volume < 120 ? 2 - intermediate.volume / 60 : 0;
  const WeightingProductIIHcable = VolPerPMHIIHcable * CostPerCCFIIHcable * RelevanceIIHcable;
  const WeightingDivisorIIHcable = VolPerPMHIIHcable * RelevanceIIHcable;
  // I) Koller K501 w/Eaglet mechanical slackpulling carriage
  // (Kellogg, L., Miller, M. and E. Olsen. 99. Skyline thinning production and costs:
  // experience from the Willamette Young Stand Project. OSU For. Res. Lab. Research Contribution 21)
  const PresetIIIcable = 1;
  const CarriageHtIIIcable = 40;
  const TurnTimeIIIcable =
    0.231 +
    0.003 * input.deliverToLandingDistance +
    0.01 * LatDist +
    0.017 * CarriageHtIIIcable +
    0.141 * LogsII +
    0.012 * input.slope -
    0.668 * PresetIIIcable;
  const VolPerPMHIIIcable = VolPerPMH2(TurnTimeIIIcable);
  const YardingPerCCFIIIcable = YardingPerCCF2(VolPerPMHIIIcable);
  const CostPerCCFIIIcable = YardingPerCCFIIIcable + PCLiveStandSLChangeCost;
  const RelevanceIIIcable =
    intermediate.volume < 70 ? 1 : intermediate.volume < 140 ? 2 - intermediate.volume / 70 : 0;
  const WeightingProductIIIcable = VolPerPMHIIIcable * CostPerCCFIIIcable * RelevanceIIIcable;
  const WeightingDivisorIIIcable = VolPerPMHIIIcable * RelevanceIIIcable;
  // J) (Huyler, N. and C. LeDoux. 1997. Cycle-time equation for the Koller K300 cable yarder operating
  // on steep input.slopes in the Northeast. USDA FS Research Paper NE-705)
  const TurnTimeIIJcable =
    0.223 +
    0.004 * input.deliverToLandingDistance +
    0.024 * LatDist +
    0.059 * TurnVol2 +
    35.23 / intermediate.volume;
  const VolPerPMHIIJcable = VolPerPMH2(TurnTimeIIJcable);
  const YardingPerCCFIIJcable = YardingPerCCF2(VolPerPMHIIJcable);
  const CostPerCCFIIJcable = YardingPerCCFIIJcable + PCLiveStandSLChangeCost;
  const RelevanceIIJcable =
    intermediate.volume < 5
      ? 0
      : intermediate.volume < 10
      ? -1 + intermediate.volume / 5
      : intermediate.volume < 40
      ? 1
      : intermediate.volume < 80
      ? 2 - intermediate.volume / 40
      : 0;
  const WeightingProductIIJcable = VolPerPMHIIJcable * CostPerCCFIIJcable * RelevanceIIJcable;
  const WeightingDivisorIIJcable = VolPerPMHIIJcable * RelevanceIIJcable;
  // LeDoux, C. 1985. Stump-to-Mill Timber Production Cost Equations for Cable Logging
  // in Eastern Hardwoods. RP-NE-566.
  // K) Appalachian Thinner-LeDoux 1985 (see columns at far right for regression equation)
  const VolPerPMHIIKcable =
    44.09 /
    (-0.089289 +
      81.991053 / intermediate.volPerAcre +
      0.000269 * input.deliverToLandingDistance +
      -496.820821 / (intermediate.volPerAcre * intermediate.dbh) +
      1.535553 / intermediate.dbh); // regression
  const YardingPerCCFIIKcable = YardingPerCCF2(VolPerPMHIIKcable);
  const CostPerCCFIIKcable = YardingPerCCFIIKcable + PCLiveStandSLChangeCost;
  const RelevanceIIKcable = intermediate.dbh >= 7 && intermediate.dbh <= 24 ? 1 : 0;
  const RelevanceIIKcable2 = Math.min(RelevanceIIKcable, 0);
  const WeightingProductIIKcable = VolPerPMHIIKcable * CostPerCCFIIKcable * RelevanceIIKcable2;
  const WeightingDivisorIIKcable = VolPerPMHIIKcable * RelevanceIIKcable2;
  // L) Bitterroot Yarder-LeDoux 1985 (see columns at far right for regression equation)
  const VolPerPMHIILcable =
    23.61 /
    (0.161995 +
      0.000783 * intermediate.dbh * intermediate.dbh +
      0.000172 * input.deliverToLandingDistance); // regression
  const YardingPerCCFIILcable = YardingPerCCF2(VolPerPMHIILcable);
  const CostPerCCFIILcable = YardingPerCCFIILcable + PCLiveStandSLChangeCost;
  const RelevanceIILcable =
    intermediate.dbh >= 5 && intermediate.dbh <= 9 && input.deliverToLandingDistance <= 500 ? 1 : 0;
  const RelevanceIILcable2 = Math.min(RelevanceIILcable, 0);
  const WeightingProductIILcable = VolPerPMHIILcable * CostPerCCFIILcable * RelevanceIILcable2;
  const WeightingDivisorIILcable = VolPerPMHIILcable * RelevanceIILcable2;
  // M) Clearwater Yarder-LeDoux 1985 (see columns at far right for regression equation)
  const VolPerPMHIIMcable =
    70.45 /
    (0.12577 +
      -0.00328 * intermediate.dbh +
      0.000048 * input.deliverToLandingDistance +
      623.08404 / (intermediate.volPerAcre * intermediate.dbh)); // regression
  const YardingPerCCFIIMcable = YardingPerCCF2(VolPerPMHIIMcable);
  const CostPerCCFIIMcable = YardingPerCCFIIMcable + PCRunSLChangeCost;
  const RelevanceIIMcable = intermediate.dbh >= 7 && intermediate.dbh <= 16 ? 1 : 0;
  const RelevanceIIMcable2 = Math.min(RelevanceIIMcable, 0);
  const WeightingProductIIMcable = VolPerPMHIIMcable * CostPerCCFIIMcable * RelevanceIIMcable2;
  const WeightingDivisorIIMcable = VolPerPMHIIMcable * RelevanceIIMcable2;
  // N) Ecologger-LeDoux 1985 (see columns at far right for regression equation)
  const VolPerPMHIINcable =
    55.77 /
    (0.707187 +
      -0.050285 * intermediate.dbh +
      0.001089 * intermediate.dbh * intermediate.dbh +
      33.101018 / intermediate.volPerAcre +
      0.000168 * input.deliverToLandingDistance +
      -2.095831 / intermediate.dbh); // regression
  const YardingPerCCFIINcable = YardingPerCCF2(VolPerPMHIINcable);
  const CostPerCCFIINcable = YardingPerCCFIINcable + PCRunSLChangeCost;
  const RelevanceIINcable = intermediate.dbh >= 7 && intermediate.dbh <= 24 ? 1 : 0;
  const RelevanceIINcable2 = Math.min(RelevanceIINcable, 0);
  const WeightingProductIINcable = VolPerPMHIINcable * CostPerCCFIINcable * RelevanceIINcable2;
  const WeightingDivisorIINcable = VolPerPMHIINcable * RelevanceIINcable2;
  // O) Skylok 78-LeDoux 1985 (see columns at far right for regression equation)
  const VolPerPMHIIOcable =
    121.65 /
    (0.090775 +
      0.000071 * input.deliverToLandingDistance +
      739.473795 / (intermediate.volPerAcre * intermediate.dbh) +
      0.594844 / intermediate.dbh); // regression
  const YardingPerCCFIIOcable = YardingPerCCF2(VolPerPMHIIOcable);
  const CostPerCCFIIOcable = YardingPerCCFIIOcable + PCRunSLChangeCost;
  const RelevanceIIOcable = intermediate.dbh >= 7 && intermediate.dbh <= 24 ? 1 : 0;
  const RelevanceIIOcable2 = Math.min(RelevanceIIOcable, 0);
  const WeightingProductIIOcable = VolPerPMHIIOcable * CostPerCCFIIOcable * RelevanceIIOcable2;
  const WeightingDivisorIIOcable = VolPerPMHIIOcable * RelevanceIIOcable2;
  // P) User-Defined Partial Cut, Unbunched
  const TurnTimeIIPcable = 10000;
  const VolPerPMHIIPcable = VolPerPMH2(TurnTimeIIPcable);
  const YardingPerCCFIIPcable = YardingPerCCF2(VolPerPMHIIPcable);
  const CostPerCCFIIPcable = YardingPerCCFIIPcable + 0;
  const RelevanceIIPcable = 0;
  const WeightingProductIIPcable = VolPerPMHIIPcable * CostPerCCFIIPcable * RelevanceIIPcable;
  const WeightingDivisorIIPcable = VolPerPMHIIPcable * RelevanceIIPcable;

  // Results
  // CostYardPCUB
  const WeightingProductSum =
    WeightingProductIIAcable +
    WeightingProductIIBcable +
    WeightingProductIICcable +
    WeightingProductIIDcable +
    WeightingProductIIEcable +
    WeightingProductIIFcable +
    WeightingProductIIGcable +
    WeightingProductIIHcable +
    WeightingProductIIIcable +
    WeightingProductIIJcable +
    WeightingProductIIKcable +
    WeightingProductIILcable +
    WeightingProductIIMcable +
    WeightingProductIINcable +
    WeightingProductIIOcable +
    WeightingProductIIPcable;
  const WeightingDivisorSum =
    WeightingDivisorIIAcable +
    WeightingDivisorIIBcable +
    WeightingDivisorIICcable +
    WeightingDivisorIIDcable +
    WeightingDivisorIIEcable +
    WeightingDivisorIIFcable +
    WeightingDivisorIIGcable +
    WeightingDivisorIIHcable +
    WeightingDivisorIIIcable +
    WeightingDivisorIIJcable +
    WeightingDivisorIIKcable +
    WeightingDivisorIILcable +
    WeightingDivisorIIMcable +
    WeightingDivisorIINcable +
    WeightingDivisorIIOcable +
    WeightingDivisorIIPcable;
  const CostYardPCUB = WeightingProductSum / WeightingDivisorSum;
  // GalYardPCUB
  const HorsepowerYarderS = 100;
  const HorsepowerYarderI = 200;
  const fcrYarder = 0.04;
  const WeightedGalPMH =
    HorsepowerYarderS * fcrYarder * (1 - intermediate.manualMachineSize) +
    HorsepowerYarderI * fcrYarder * intermediate.manualMachineSize;
  const WeightedCostPMH = YarderHourlyCost;
  const GalYardPCUB = (WeightedGalPMH * CostYardPCUB) / WeightedCostPMH;

  return { CostYardPCUB: CostYardPCUB, GalYardPCUB: GalYardPCUB };
}

export { CYPCU };
