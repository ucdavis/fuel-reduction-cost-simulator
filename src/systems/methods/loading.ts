// Loading sheet
import { Assumptions, FrcsInputs, IntermediateVariables, MachineCosts } from '../frcs.model';

function Loading(
  assumption: Assumptions,
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  machineCost: MachineCosts
) {
  const ExchangeTrucks = 5;
  const PMH_LoaderS = machineCost.PMH_LoaderS;
  const PMH_LoaderB = machineCost.PMH_LoaderB;
  // Loading Calculated Values
  const LoadVolALT = (assumption.LoadWeightLog * 2000) / (intermediate.woodDensityALT * 100);
  const LoadVolSLT = (assumption.LoadWeightLog * 2000) / (intermediate.woodDensitySLT * 100);
  const LoaderHourlyCost =
    PMH_LoaderS * (1 - intermediate.manualMachineSizeALT) +
    PMH_LoaderB * intermediate.manualMachineSizeALT;

  // I. Loading Full-Length Logs
  // A) Front-End Loader (Vaughan, 89)
  const TimePerLoadIA = 22 - 0.129 * intermediate.logVolALT + ExchangeTrucks;
  const VolPerPMHloadingIA = (100 * LoadVolALT) / (TimePerLoadIA / 60);
  const CostPerCCFloadingIA = (100 * LoaderHourlyCost) / VolPerPMHloadingIA;
  const RelevanceLoadingIA =
    intermediate.logVolALT < 10
      ? 0
      : intermediate.logVolALT < 40
      ? -1 / 3 + intermediate.logVolALT / 30
      : 1;
  // B) Knuckleboom Loader, Small Logs (Brown&Kellogg, 96)
  const CCFperPmin = 0.1 + 0.019 * intermediate.logVolALT;
  const TimePerLoadIB = LoadVolALT / CCFperPmin + ExchangeTrucks;
  const VolPerPMHloadingIB = (100 * LoadVolALT) / (TimePerLoadIB / 60);
  const CostPerCCFloadingIB = (100 * LoaderHourlyCost) / VolPerPMHloadingIB;
  const RelevanceLoadingIB =
    intermediate.logVolALT < 10
      ? 1
      : intermediate.logVolALT < 20
      ? 2 - intermediate.logVolALT / 10
      : 0;
  // C) Loaders (Hartsough et al, 98)
  const TimePerCCFloadingIC = 0.66 + 46.2 / intermediate.dbhALT;
  const TimePerLoadIC = TimePerCCFloadingIC * LoadVolALT;
  const VolPerPMHloadingIC = 6000 / TimePerCCFloadingIC;
  const CostPerCCFloadingIC = (100 * LoaderHourlyCost) / VolPerPMHloadingIC;
  const RelevanceLoadingIC = 0.8; // hardcoded
  // D) Loaders (Jackson et al, 84)
  const VolPerPMHloadingID =
    100 * (11.04 + 0.522 * intermediate.logVolALT - 0.00173 * Math.pow(intermediate.logVolALT, 2));
  const CostPerCCFloadingID = (100 * LoaderHourlyCost) / VolPerPMHloadingID;
  const RelevanceLoadingID =
    intermediate.logVolALT < 75
      ? 1
      : intermediate.logVolALT < 100
      ? 4 - intermediate.logVolALT / 25
      : 0;
  // E) User-Defined Load Full-Length Logs
  const VolPerPMHloadingIE = 0.001;
  const CostPerCCFloadingIE = (100 * LoaderHourlyCost) / VolPerPMHloadingIE;
  const RelevanceLoadingIE = 0;

  // II. Loading CTL Logs
  // A) Knuckleboom Loader, CTL Logs (Brown&Kellogg, 96)
  const CCFperPminLoadingIIA = 0.1 + 0.019 * intermediate.ctlLogVol;
  const TimePerLoadIIA = LoadVolSLT / CCFperPminLoadingIIA + ExchangeTrucks;
  const VolPerPMHloadingIIA = (100 * LoadVolSLT) / (TimePerLoadIIA / 60);
  const CostPerCCFloadingIIA = (100 * LoaderHourlyCost) / VolPerPMHloadingIIA;
  const RelevanceLoadingIIA =
    intermediate.ctlLogVol < 10
      ? 1
      : intermediate.ctlLogVol < 20
      ? 2 - intermediate.ctlLogVol / 10
      : 0;
  // B) Loaders (Jackson et al, 84)
  const VolPerPMHloadingIIB =
    100 * (11.04 + 0.522 * intermediate.ctlLogVol - 0.00173 * Math.pow(intermediate.ctlLogVol, 2));
  const CostPerCCFloadingIIB = (100 * LoaderHourlyCost) / VolPerPMHloadingIIB;
  const RelevanceLoadingIIB = 0.5;
  // C) User-Defined Load CTL Logs
  const VolPerPMHloadingIIC = 0.001;
  const CostPerCCFloadingIIC = (100 * LoaderHourlyCost) / VolPerPMHloadingIIC;
  const RelevanceLoadingIIC = 0;

  // Loading Summary
  // I. Loading Full-Length Logs
  // CostLoad
  const CostLoad = input.includeLoadingCosts
    ? intermediate.volumeALT > 0
      ? (intermediate.cHardwoodALT *
          100 *
          (LoaderHourlyCost * RelevanceLoadingIA +
            LoaderHourlyCost * RelevanceLoadingIB +
            LoaderHourlyCost * RelevanceLoadingIC +
            LoaderHourlyCost * RelevanceLoadingID +
            LoaderHourlyCost * RelevanceLoadingIE)) /
        (RelevanceLoadingIA * VolPerPMHloadingIA +
          RelevanceLoadingIB * VolPerPMHloadingIB +
          RelevanceLoadingIC * VolPerPMHloadingIC +
          RelevanceLoadingID * VolPerPMHloadingID +
          RelevanceLoadingIE * VolPerPMHloadingIE)
      : 0
    : 0;
  // GalLoad
  const HorsepowerLoaderS = 120;
  const HorsepowerLoaderB = 200;
  const fcrLoader = 0.022;
  const WeightedGalPMH =
    HorsepowerLoaderS * fcrLoader * (1 - intermediate.manualMachineSizeALT) +
    HorsepowerLoaderB * fcrLoader * intermediate.manualMachineSizeALT;
  const WeightedCostPMH = LoaderHourlyCost;
  const GalLoad = (WeightedGalPMH * CostLoad) / WeightedCostPMH;

  // II. Loading CTL Logs
  // CostLoadCTL
  const CostLoadCTL = input.includeLoadingCosts
    ? input.volumeSLT > 0
      ? (intermediate.cHardwoodSLT *
          100 *
          (LoaderHourlyCost * RelevanceLoadingIIA +
            LoaderHourlyCost * RelevanceLoadingIIB +
            LoaderHourlyCost * RelevanceLoadingIIC)) /
        (RelevanceLoadingIIA * VolPerPMHloadingIIA +
          RelevanceLoadingIIB * VolPerPMHloadingIIB +
          RelevanceLoadingIIC * VolPerPMHloadingIIC)
      : 0
    : 0;
  // GalLoadCTL
  const GalLoadCTL = (WeightedGalPMH * CostLoadCTL) / WeightedCostPMH;

  return {
    CostLoad: CostLoad,
    CostLoadCTL: CostLoadCTL,
    GalLoad: GalLoad,
    GalLoadCTL: GalLoadCTL,
  };
}

export { Loading };
