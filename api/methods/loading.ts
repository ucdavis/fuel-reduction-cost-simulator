// Loading sheet
import { CostMachineMod } from './frcs.model';

function Loading(LoadWeightLog: number, WoodDensityALT: number, WoodDensitySLT: number,
                 CTLLogVol: number, LogVolALT: number, DBHALT: number, DBHSLT: number,
                 ManualMachineSizeALT: number, CostMachine: CostMachineMod, load_cost: boolean,
                 TreeVolALT: number, CHardwoodALT: number, TreeVolSLT: number, CHardwoodSLT: number) {

    const ExchangeTrucks = 5;
    const PMH_LoaderS = CostMachine.PMH_LoaderS;
    const PMH_LoaderB = CostMachine.PMH_LoaderB;
    // Loading Calculated Values
    const LoadVolALT = LoadWeightLog * 2000 / (WoodDensityALT * 100);
    const LoadVolSLT = LoadWeightLog * 2000 / (WoodDensitySLT * 100);
    const LoaderHourlyCost = PMH_LoaderS * (1 - ManualMachineSizeALT) + PMH_LoaderB * ManualMachineSizeALT;

    // I. Loading Full-Length Logs
    // A) Front-End Loader (Vaughan, 89)
    const TimePerLoadIA = 22 - 0.129 * LogVolALT + ExchangeTrucks;
    const VolPerPMHloadingIA = 100 * LoadVolALT / (TimePerLoadIA / 60);
    const CostPerCCFloadingIA = 100 * LoaderHourlyCost / VolPerPMHloadingIA;
    const RelevanceLoadingIA = LogVolALT < 10 ? 0 : (LogVolALT < 40 ? -1 / 3 + LogVolALT / 30 : 1);
    // B) Knuckleboom Loader, Small Logs (Brown&Kellogg, 96)
    const CCFperPmin = 0.1 + 0.019 * LogVolALT;
    const TimePerLoadIB = LoadVolALT / CCFperPmin + ExchangeTrucks;
    const VolPerPMHloadingIB = 100 * LoadVolALT / (TimePerLoadIB / 60);
    const CostPerCCFloadingIB = 100 * LoaderHourlyCost / VolPerPMHloadingIB;
    const RelevanceLoadingIB = LogVolALT < 10 ? 1 : (LogVolALT < 20 ? 2 - LogVolALT / 10 : 0);
    // C) Loaders (Hartsough et al, 98)
    const TimePerCCFloadingIC = 0.66 + 46.2 / DBHALT;
    const TimePerLoadIC = TimePerCCFloadingIC * LoadVolALT;
    const VolPerPMHloadingIC = 6000 / TimePerCCFloadingIC;
    const CostPerCCFloadingIC = 100 * LoaderHourlyCost / VolPerPMHloadingIC;
    const RelevanceLoadingIC = 0.8; // hardcoded
    // D) Loaders (Jackson et al, 84)
    const VolPerPMHloadingID = 100 * (11.04 + 0.522 * LogVolALT - 0.00173 * Math.pow(LogVolALT, 2));
    const CostPerCCFloadingID = 100 * LoaderHourlyCost / VolPerPMHloadingID;
    const RelevanceLoadingID = LogVolALT < 75 ? 1 : (LogVolALT < 100 ? 4 - LogVolALT / 25 : 0);
    // E) User-Defined Load Full-Length Logs
    const VolPerPMHloadingIE = 0.001;
    const CostPerCCFloadingIE = 100 * LoaderHourlyCost / VolPerPMHloadingIE;
    const RelevanceLoadingIE = 0;

    // II. Loading CTL Logs
    // A) Knuckleboom Loader, CTL Logs (Brown&Kellogg, 96)
    const CCFperPminLoadingIIA = 0.1 + 0.019 * CTLLogVol;
    const TimePerLoadIIA = LoadVolSLT / CCFperPminLoadingIIA + ExchangeTrucks;
    const VolPerPMHloadingIIA = 100 * LoadVolSLT / (TimePerLoadIIA / 60);
    const CostPerCCFloadingIIA = 100 * LoaderHourlyCost / VolPerPMHloadingIIA;
    const RelevanceLoadingIIA = CTLLogVol < 10 ? 1 : (CTLLogVol < 20 ? 2 - CTLLogVol / 10 : 0);
    // B) Loaders (Jackson et al, 84)
    const VolPerPMHloadingIIB = 100 * (11.04 + 0.522 * CTLLogVol - 0.00173 * Math.pow(CTLLogVol, 2));
    const CostPerCCFloadingIIB = 100 * LoaderHourlyCost / VolPerPMHloadingIIB;
    const RelevanceLoadingIIB = 0.5;
    // C) User-Defined Load CTL Logs
    const VolPerPMHloadingIIC = 0.001;
    const CostPerCCFloadingIIC = 100 * LoaderHourlyCost / VolPerPMHloadingIIC;
    const RelevanceLoadingIIC = 0;

    // Loading Summary
    // I. Loading Full-Length Logs
    const CostLoad = load_cost ?
    (TreeVolALT > 0 ? CHardwoodALT * 100 * (LoaderHourlyCost * RelevanceLoadingIA
    + LoaderHourlyCost * RelevanceLoadingIB + LoaderHourlyCost * RelevanceLoadingIC
    + LoaderHourlyCost * RelevanceLoadingID + LoaderHourlyCost * RelevanceLoadingIE)
    / (RelevanceLoadingIA * VolPerPMHloadingIA + RelevanceLoadingIB * VolPerPMHloadingIB
    + RelevanceLoadingIC * VolPerPMHloadingIC + RelevanceLoadingID * VolPerPMHloadingID
    + RelevanceLoadingIE * VolPerPMHloadingIE) : 0) : 0;
    // II. Loading CTL Logs
    const CostLoadCTL = load_cost ?
    (TreeVolSLT > 0 ? CHardwoodSLT * 100 * (LoaderHourlyCost * RelevanceLoadingIIA
    + LoaderHourlyCost * RelevanceLoadingIIB + LoaderHourlyCost * RelevanceLoadingIIC)
    / (RelevanceLoadingIIA * VolPerPMHloadingIIA + RelevanceLoadingIIB * VolPerPMHloadingIIB
    + RelevanceLoadingIIC * VolPerPMHloadingIIC) : 0) : 0;

    return { 'CostLoad': CostLoad, 'CostLoadCTL': CostLoadCTL };
}

export { Loading };
