// CableYarding sheet: III. Cable Yarding, Bunched CTL Logs (CYCTL)
import { AssumptionMod, InputVarMod, IntermediateVarMod, MachineCostMod } from 'methods/frcs.model';

function CYCTL(assumption: AssumptionMod, input: InputVarMod, intermediate: IntermediateVarMod,
               machineCost: MachineCostMod) {
    // General Inputs for CTL bunching
    const CTLBunchArea = assumption.CTLTrailSpacing * 24 / 2;
    const YarderCTLLogVol = 1.5 * intermediate.CTLLogVol;
    const BunchLimitedTurnVol = intermediate.VolPerAcreST * CTLBunchArea * 1.5 / 43560;

    const LatDist = 35;
    const YarderHourlyCost = machineCost.PMH_YarderS * (1 - intermediate.ManualMachineSize)
        + machineCost.PMH_YarderI * intermediate.ManualMachineSize;

    // Corridor and Landing Change Costs`
    // Partial cut corridor changes
    function PCSLChangeCost(CorridorChangeTime: number) {
        const CorriderSpacingRunning = 150;
        const AreaChangeRunning = input.deliver_dist * 2 * CorriderSpacingRunning / 43560;
        return 100 * (YarderHourlyCost * CorridorChangeTime) / (intermediate.VolPerAcre * AreaChangeRunning);
    }
    // Running & Live
    const PCLiveStandSLChangeCost = PCSLChangeCost(1.5);

    // A) Diamond D210 Standing Skyline w/Eaglet Motorized Carriage (Doyal, 97)
    const YarderCapacityST = (6000 + intermediate.ManualMachineSize * 3000) / intermediate.WoodDensityST;
    const TurnVol = Math.min(YarderCapacityST, Math.max(BunchLimitedTurnVol, intermediate.TreeVolST));
    const Logs = Math.max(1, TurnVol / YarderCTLLogVol);
    const Chokers = 3;
    const Hotset = 0;
    const Chokersetters = 2;
    const TurnTime = (145.5 + 43.77 * Chokers + 45.88 * Hotset + 0.639 * LatDist - 26.1 * Chokersetters
        + 0.0004806 * Math.pow(input.deliver_dist, 2) + 0.007775 * Math.pow(LatDist, 2)) / 100;
    const VolPerPMH = TurnVol / (TurnTime / 60);
    const Yarding = 100 * YarderHourlyCost / VolPerPMH;
    const ChangePerShift = PCLiveStandSLChangeCost;
    const CostPerCCF = Yarding + ChangePerShift;
    const Relevance = YarderCTLLogVol < 10 ? 1 : (YarderCTLLogVol < 25 ? 5 / 3 - YarderCTLLogVol / 15 : 0);
    // B) User-Defined CTL Bunched
    const YarderCapacity = (6000 + intermediate.ManualMachineSize * 3000) / intermediate.WoodDensity;
    const TurnVol2 = Math.min(YarderCapacity, Math.max(BunchLimitedTurnVol, intermediate.TreeVol));
    const Logs2 = Math.max(1, TurnVol2 / YarderCTLLogVol);
    const TurnTime2 = 10000;
    const VolPerPMH2 = TurnVol2 / (TurnTime2 / 60);
    const Yarding2 = 100 * YarderHourlyCost / VolPerPMH2;
    const ChangePerShift2 = 0;
    const CostPerCCF2 = Yarding2 + ChangePerShift2;
    const Relevance2 = 0;
    // Summary
    const WeightingProduct = VolPerPMH * CostPerCCF * Relevance + VolPerPMH2 * CostPerCCF2 * Relevance2;
    const WeightingDivisor = VolPerPMH * Relevance + VolPerPMH2 * Relevance2;
    const CostYardCTL = WeightingProduct / WeightingDivisor;

    return CostYardCTL;
}

export { CYCTL };
