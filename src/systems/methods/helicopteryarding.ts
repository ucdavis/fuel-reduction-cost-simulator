// HelicopterYarding sheet
import { FrcsInputs, IntermediateVariables } from '../../model';

function HelicopterYarding(input: FrcsInputs, intermediate: IntermediateVariables) {
  const HookAreaDiam = 75;
  const ExtraServiceFlightDist = 5000;
  const HeliCruiseSpeed = 120;
  const HookArea = (Math.PI * Math.pow(HookAreaDiam / 2, 2)) / 43506;
  const WtInHook_Area = HookArea * intermediate.volPerAcre * intermediate.woodDensity;
  const VolInHookArea = WtInHook_Area / intermediate.woodDensity;
  const LogWt = intermediate.woodDensity * intermediate.logVol;
  const WtSTInHook_Area = HookArea * intermediate.volPerAcreST * intermediate.woodDensityST;
  const VolSTInHookArea = WtSTInHook_Area / intermediate.woodDensityST;
  const LogWtST = intermediate.woodDensityST * intermediate.logVolST;
  // I. Helicopter Yarding, Manual Log-Length
  const ServiceCycles = 7;
  // A) Bell 204 class
  const ObservedAvgAtElevIA = -0.116 * input.elevation + 4500;
  const Total1A = (1 + 0.1) * (6 * 340 + 263 * 6 + 3700 + 460);
  const LoadUnload1A = 1.63;
  const YardingSpeed1A = 39;
  const FlightTimeA = 6;
  const CCFperDay1A = calc1(
    ObservedAvgAtElevIA,
    Total1A,
    LoadUnload1A,
    YardingSpeed1A,
    FlightTimeA
  ).CCFperDay;
  const CostPerCCF1A = calc1(
    ObservedAvgAtElevIA,
    Total1A,
    LoadUnload1A,
    YardingSpeed1A,
    FlightTimeA
  ).CostPerCCF;
  const Relevance1A =
    intermediate.volume < 75 ? 1 : intermediate.volume < 150 ? 2 - intermediate.volume / 75 : 0;
  // B) Boeing Vertol 107 - 61A
  const ObservedAvgAtElevIB = -0.0352 * input.elevation + 8160;
  const Total1B = (1 + 0.1) * (6.76 * 1052 + 263 * 10 + 7580 + 2155);
  const LoadUnload1B = 1.18;
  const YardingSpeed1B = 58;
  const FlightTimeB = 6.76;
  const CCFperDay1B = calc1(
    ObservedAvgAtElevIB,
    Total1B,
    LoadUnload1B,
    YardingSpeed1B,
    FlightTimeB
  ).CCFperDay;
  const CostPerCCF1B = calc1(
    ObservedAvgAtElevIB,
    Total1B,
    LoadUnload1B,
    YardingSpeed1B,
    FlightTimeB
  ).CostPerCCF;
  const Relevance1B =
    intermediate.volume < 75 ? 1 : intermediate.volume < 150 ? 2 - intermediate.volume / 75 : 0;
  // C) K-MAX
  const ObservedAvgAtElevIC = -0.0046 * input.elevation + 4800.9;
  const Total1C = (1 + 0.1) * (8.5 * 840 + 263 * 9 + 6750 + 1000);
  const LoadUnload1C = 1.15;
  const YardingSpeed1C = 60;
  const FlightTimeC = 8.5;
  const CCFperDay1C = calc1(
    ObservedAvgAtElevIC,
    Total1C,
    LoadUnload1C,
    YardingSpeed1C,
    FlightTimeC
  ).CCFperDay;
  const CostPerCCF1C = calc1(
    ObservedAvgAtElevIC,
    Total1C,
    LoadUnload1C,
    YardingSpeed1C,
    FlightTimeC
  ).CostPerCCF;
  const Relevance1C =
    intermediate.volume < 75 ? 1 : intermediate.volume < 150 ? 2 - intermediate.volume / 75 : 0;
  // D) User-Defined
  const CCFperDay1D = 0.001;
  const CostPerCCF1D = CCFperDay1D / 10000;
  const Relevance1D = 0;

  // II. Helicopter Yarding, CTL
  // A) Bell 204 class
  const CCFperDay2A = calc2(
    ObservedAvgAtElevIA,
    Total1A,
    LoadUnload1A,
    YardingSpeed1A,
    FlightTimeA
  ).CCFperDay;
  const CostPerCCF2A = calc2(
    ObservedAvgAtElevIA,
    Total1A,
    LoadUnload1A,
    YardingSpeed1A,
    FlightTimeA
  ).CostPerCCF;
  const Relevance2A =
    intermediate.volume < 75 ? 1 : intermediate.volume < 150 ? 2 - intermediate.volume / 75 : 0;
  // B) Boeing Vertol 107 - 61A
  const CCFperDay2B = calc2(
    ObservedAvgAtElevIB,
    Total1B,
    LoadUnload1B,
    YardingSpeed1B,
    FlightTimeB
  ).CCFperDay;
  const CostPerCCF2B = calc2(
    ObservedAvgAtElevIB,
    Total1B,
    LoadUnload1B,
    YardingSpeed1B,
    FlightTimeB
  ).CostPerCCF;
  const Relevance2B =
    intermediate.volume < 75 ? 1 : intermediate.volume < 150 ? 2 - intermediate.volume / 75 : 0;
  // C) K-MAX
  const ObservedAvgAtElevIIC = -0.0046 * input.elevation + 4800;
  const CCFperDay2C = calc2(
    ObservedAvgAtElevIIC,
    Total1C,
    LoadUnload1C,
    YardingSpeed1C,
    FlightTimeC
  ).CCFperDay;
  const CostPerCCF2C = calc2(
    ObservedAvgAtElevIIC,
    Total1C,
    LoadUnload1C,
    YardingSpeed1C,
    FlightTimeC
  ).CostPerCCF;
  const Relevance2C =
    intermediate.volume < 75 ? 1 : intermediate.volume < 150 ? 2 - intermediate.volume / 75 : 0;
  // D) User-Defined
  const CCFperDay2D = 0.001;
  const CostPerCCF2D = CCFperDay1D / 10000;
  const Relevance2D = 0;

  // Helicopter Yarding Summary
  // I. Manual Log-Length
  const CostHeliYardML =
    (intermediate.cHardwood *
      (CCFperDay1A * CostPerCCF1A * Relevance1A +
        CCFperDay1B * CostPerCCF1B * Relevance1B +
        CCFperDay1C * CostPerCCF1C * Relevance1C +
        CCFperDay1D * CostPerCCF1D * Relevance1D)) /
    (CCFperDay1A * Relevance1A +
      CCFperDay1B * Relevance1B +
      CCFperDay1C * Relevance1C +
      CCFperDay1D * Relevance1D);
  // GalHeliYardML
  const WeightedCostPerDay =
    (CCFperDay1A * CostPerCCF1A * Relevance1A +
      CCFperDay1B * CostPerCCF1B * Relevance1B +
      CCFperDay1C * CostPerCCF1C * Relevance1C +
      CCFperDay1D * CostPerCCF1D * Relevance1D) /
    (Relevance1A + Relevance1B + Relevance1C + Relevance1D);
  const GalPMHIA = 86;
  const GalPMHIB = 180;
  const GalPMHIC = 86;
  const GalPMHID = 0; // User Defined
  const FlightTimeIA = 6;
  const FlightTimeIB = 6.76;
  const FlightTimeIC = 8.5;
  const FlightTimeID = 0;
  const WeightedGallonPerDay =
    (GalPMHIA * Relevance1A * FlightTimeIA +
      GalPMHIB * Relevance1B * FlightTimeIB +
      GalPMHIC * Relevance1C * FlightTimeIC +
      GalPMHID * Relevance1D * FlightTimeID) /
    (Relevance1A + Relevance1B + Relevance1C + Relevance1D);
  const GalHeliYardML = (WeightedGallonPerDay * CostHeliYardML) / WeightedCostPerDay;
  // II. CTL
  const CostHeliYardCTL =
    (intermediate.cHardwood *
      (CCFperDay2A * CostPerCCF2A * Relevance2A +
        CCFperDay2B * CostPerCCF2B * Relevance2B +
        CCFperDay2C * CostPerCCF2C * Relevance2C +
        CCFperDay2D * CostPerCCF2D * Relevance2D)) /
    (CCFperDay2A * Relevance2A +
      CCFperDay2B * Relevance2B +
      CCFperDay2C * Relevance2C +
      CCFperDay2D * Relevance2D);
  // GalHeliYardCTL
  const WeightedCostPerDayCTL =
    (CCFperDay2A * CostPerCCF2A * Relevance2A +
      CCFperDay2B * CostPerCCF2B * Relevance2B +
      CCFperDay2C * CostPerCCF2C * Relevance2C +
      CCFperDay2D * CostPerCCF2D * Relevance2D) /
    (Relevance2A + Relevance2B + Relevance2C + Relevance2D);
  const GalHeliYardCTL = (WeightedGallonPerDay * CostHeliYardCTL) / WeightedCostPerDayCTL;

  // Helicopter Loading Summary
  const Total2A = (1 + 0.1) * 1 * (263 + 770);
  const Total2B = (1 + 0.1) * 2 * (263 + 770);
  const Total2C = (1 + 0.1) * 2 * (263 + 770);
  const Total2D = 1000;
  const CostPerCCF1A2 = Total2A / CCFperDay1A;
  const CostPerCCF1B2 = Total2B / CCFperDay1B;
  const CostPerCCF1C2 = Total2C / CCFperDay1C;
  const CostPerCCF1D2 = Total2D / CCFperDay1D;
  const CostPerCCF2A2 = Total2A / CCFperDay2A;
  const CostPerCCF2B2 = Total2B / CCFperDay2B;
  const CostPerCCF2C2 = Total2C / CCFperDay2C;
  const CostPerCCF2D2 = Total2D / CCFperDay2D;
  // I. Manual Log-Length
  const CostHeliLoadML =
    (intermediate.cHardwood *
      (CCFperDay1A * CostPerCCF1A2 * Relevance1A +
        CCFperDay1B * CostPerCCF1B2 * Relevance1B +
        CCFperDay1C * CostPerCCF1C2 * Relevance1C +
        CCFperDay1D * CostPerCCF1D2 * Relevance1D)) /
    (CCFperDay1A * Relevance1A +
      CCFperDay1B * Relevance1B +
      CCFperDay1C * Relevance1C +
      CCFperDay1D * Relevance1D);
  // II. CTL
  const CostHeliLoadCTL =
    (intermediate.cHardwood *
      (CCFperDay2A * CostPerCCF2A2 * Relevance2A +
        CCFperDay2B * CostPerCCF2B2 * Relevance2B +
        CCFperDay2C * CostPerCCF2C2 * Relevance2C +
        CCFperDay2D * CostPerCCF2D2 * Relevance2D)) /
    (CCFperDay2A * Relevance2A +
      CCFperDay2B * Relevance2B +
      CCFperDay2C * Relevance2C +
      CCFperDay2D * Relevance2D);

  const resultObj = {
    CostHeliYardML: CostHeliYardML,
    CostHeliYardCTL: CostHeliYardCTL,
    CostHeliLoadML: CostHeliLoadML,
    CostHeliLoadCTL: CostHeliLoadCTL,
    GalHeliYardML: GalHeliYardML,
    GalHeliYardCTL: GalHeliYardCTL,
  };

  return resultObj;

  function calc1(
    ObservedAvgAtElev: number,
    Total: number,
    LoadUnload: number,
    YardingSpeed: number,
    FlightTime: number
  ) {
    const LogWtPerMaxPayload = LogWt / (1.25 * ObservedAvgAtElev);
    const MaxPayloadsPerHookArea = WtInHook_Area / (1.25 * ObservedAvgAtElev);
    const LoadAdjustFactor =
      (0.9 +
        (LogWtPerMaxPayload < 0.5 ? 0.1 - 0.2 * LogWtPerMaxPayload : 0) +
        (MaxPayloadsPerHookArea < 4 ? -0.05 + (0.05 / 3) * (MaxPayloadsPerHookArea - 1) : 0)) *
      (MaxPayloadsPerHookArea < 1 ? MaxPayloadsPerHookArea : 1);
    const AfterAdjustment = LoadAdjustFactor * ObservedAvgAtElev;
    const AfterOneLogMinCheck = Math.max(AfterAdjustment, Math.min(LogWt, ObservedAvgAtElev));
    const After10LogMaxCheck = Math.min(10 * LogWt, AfterOneLogMinCheck);
    const TravEmptyLoaded = (2 * 60 * input.deliverToLandingDistance) / (YardingSpeed * 5280);
    const TotalCycleTime = LoadUnload + TravEmptyLoaded;
    const ServiceFlightTime =
      (ServiceCycles * 2 * 60 * ExtraServiceFlightDist) / (YardingSpeed * 5280);
    const TurnsPerDay = (60 * FlightTime - ServiceFlightTime) / TotalCycleTime;
    const TonsPerDay = (After10LogMaxCheck * TurnsPerDay) / 2000;
    const CCFperDay = (TonsPerDay * 2000) / (intermediate.woodDensity * 100);
    const CostPerCCF = Total / CCFperDay;
    return { CCFperDay: CCFperDay, CostPerCCF: CostPerCCF };
  }

  function calc2(
    ObservedAvgAtElev: number,
    Total: number,
    LoadUnload: number,
    YardingSpeed: number,
    FlightTime: number
  ) {
    const LogWtPerMaxPayload = LogWtST / (1.25 * ObservedAvgAtElev);
    const MaxPayloadsPerHookArea = WtSTInHook_Area / (1.25 * ObservedAvgAtElev);
    const LoadAdjustFactor =
      (0.9 +
        (LogWtPerMaxPayload < 0.5 ? 0.1 - 0.2 * LogWtPerMaxPayload : 0) +
        (MaxPayloadsPerHookArea < 4 ? -0.05 + (0.05 / 3) * (MaxPayloadsPerHookArea - 1) : 0)) *
      (MaxPayloadsPerHookArea < 1 ? MaxPayloadsPerHookArea : 1);
    const AfterAdjustment = LoadAdjustFactor * ObservedAvgAtElev;
    const AfterOneLogMinCheck = Math.max(AfterAdjustment, Math.min(LogWtST, ObservedAvgAtElev));
    const After10LogMaxCheck = Math.min(10 * LogWtST, AfterOneLogMinCheck);
    const TravEmptyLoaded = (2 * 60 * input.deliverToLandingDistance) / (YardingSpeed * 5280);
    const TotalCycleTime = LoadUnload + TravEmptyLoaded;
    const ServiceFlightTime =
      (ServiceCycles * 2 * 60 * ExtraServiceFlightDist) / (YardingSpeed * 5280);
    const TurnsPerDay = (60 * FlightTime - ServiceFlightTime) / TotalCycleTime;
    const TonsPerDay = (After10LogMaxCheck * TurnsPerDay) / 2000;
    const CCFperDay = (TonsPerDay * 2000) / (intermediate.woodDensityST * 100);
    const CostPerCCF = Total / CCFperDay;
    return { CCFperDay: CCFperDay, CostPerCCF: CostPerCCF };
  }
}

export { HelicopterYarding };
