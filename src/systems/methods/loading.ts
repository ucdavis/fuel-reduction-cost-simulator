// Loading sheet
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../frcs.model';

function Loading(
  assumption: AssumptionMod,
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  machineCost: MachineCostMod
) {
  const ExchangeTrucks = 5;
  const PMH_LoaderS = machineCost.PMH_LoaderS;
  const PMH_LoaderB = machineCost.PMH_LoaderB;
  // Loading Calculated Values
  const LoadVolALT =
    (assumption.LoadWeightLog * 2000) / (intermediate.WoodDensityALT * 100);
  const LoadVolSLT =
    (assumption.LoadWeightLog * 2000) / (intermediate.WoodDensitySLT * 100);
  const LoaderHourlyCost =
    PMH_LoaderS * (1 - intermediate.ManualMachineSizeALT) +
    PMH_LoaderB * intermediate.ManualMachineSizeALT;

  // I. Loading Full-Length Logs
  // A) Front-End Loader (Vaughan, 89)
  const TimePerLoadIA = 22 - 0.129 * intermediate.LogVolALT + ExchangeTrucks;
  const VolPerPMHloadingIA = (100 * LoadVolALT) / (TimePerLoadIA / 60);
  const CostPerCCFloadingIA = (100 * LoaderHourlyCost) / VolPerPMHloadingIA;
  const RelevanceLoadingIA =
    intermediate.LogVolALT < 10
      ? 0
      : intermediate.LogVolALT < 40
      ? -1 / 3 + intermediate.LogVolALT / 30
      : 1;
  // B) Knuckleboom Loader, Small Logs (Brown&Kellogg, 96)
  const CCFperPmin = 0.1 + 0.019 * intermediate.LogVolALT;
  const TimePerLoadIB = LoadVolALT / CCFperPmin + ExchangeTrucks;
  const VolPerPMHloadingIB = (100 * LoadVolALT) / (TimePerLoadIB / 60);
  const CostPerCCFloadingIB = (100 * LoaderHourlyCost) / VolPerPMHloadingIB;
  const RelevanceLoadingIB =
    intermediate.LogVolALT < 10
      ? 1
      : intermediate.LogVolALT < 20
      ? 2 - intermediate.LogVolALT / 10
      : 0;
  // C) Loaders (Hartsough et al, 98)
  const TimePerCCFloadingIC = 0.66 + 46.2 / intermediate.DBHALT;
  const TimePerLoadIC = TimePerCCFloadingIC * LoadVolALT;
  const VolPerPMHloadingIC = 6000 / TimePerCCFloadingIC;
  const CostPerCCFloadingIC = (100 * LoaderHourlyCost) / VolPerPMHloadingIC;
  const RelevanceLoadingIC = 0.8; // hardcoded
  // D) Loaders (Jackson et al, 84)
  const VolPerPMHloadingID =
    100 *
    (11.04 +
      0.522 * intermediate.LogVolALT -
      0.00173 * Math.pow(intermediate.LogVolALT, 2));
  const CostPerCCFloadingID = (100 * LoaderHourlyCost) / VolPerPMHloadingID;
  const RelevanceLoadingID =
    intermediate.LogVolALT < 75
      ? 1
      : intermediate.LogVolALT < 100
      ? 4 - intermediate.LogVolALT / 25
      : 0;
  // E) User-Defined Load Full-Length Logs
  const VolPerPMHloadingIE = 0.001;
  const CostPerCCFloadingIE = (100 * LoaderHourlyCost) / VolPerPMHloadingIE;
  const RelevanceLoadingIE = 0;

  // II. Loading CTL Logs
  // A) Knuckleboom Loader, CTL Logs (Brown&Kellogg, 96)
  const CCFperPminLoadingIIA = 0.1 + 0.019 * intermediate.CTLLogVol;
  const TimePerLoadIIA = LoadVolSLT / CCFperPminLoadingIIA + ExchangeTrucks;
  const VolPerPMHloadingIIA = (100 * LoadVolSLT) / (TimePerLoadIIA / 60);
  const CostPerCCFloadingIIA = (100 * LoaderHourlyCost) / VolPerPMHloadingIIA;
  const RelevanceLoadingIIA =
    intermediate.CTLLogVol < 10
      ? 1
      : intermediate.CTLLogVol < 20
      ? 2 - intermediate.CTLLogVol / 10
      : 0;
  // B) Loaders (Jackson et al, 84)
  const VolPerPMHloadingIIB =
    100 *
    (11.04 +
      0.522 * intermediate.CTLLogVol -
      0.00173 * Math.pow(intermediate.CTLLogVol, 2));
  const CostPerCCFloadingIIB = (100 * LoaderHourlyCost) / VolPerPMHloadingIIB;
  const RelevanceLoadingIIB = 0.5;
  // C) User-Defined Load CTL Logs
  const VolPerPMHloadingIIC = 0.001;
  const CostPerCCFloadingIIC = (100 * LoaderHourlyCost) / VolPerPMHloadingIIC;
  const RelevanceLoadingIIC = 0;

  // Loading Summary
  // I. Loading Full-Length Logs
  const CostLoad = input.CalcLoad
    ? intermediate.TreeVolALT > 0
      ? (intermediate.CHardwoodALT *
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
  // II. Loading CTL Logs
  const CostLoadCTL = input.CalcLoad
    ? input.TreeVolSLT > 0
      ? (intermediate.CHardwoodSLT *
          100 *
          (LoaderHourlyCost * RelevanceLoadingIIA +
            LoaderHourlyCost * RelevanceLoadingIIB +
            LoaderHourlyCost * RelevanceLoadingIIC)) /
        (RelevanceLoadingIIA * VolPerPMHloadingIIA +
          RelevanceLoadingIIB * VolPerPMHloadingIIB +
          RelevanceLoadingIIC * VolPerPMHloadingIIC)
      : 0
    : 0;

  return { CostLoad: CostLoad, CostLoadCTL: CostLoadCTL };
}

export { Loading };
