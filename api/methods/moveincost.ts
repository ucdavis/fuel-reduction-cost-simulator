// MoveInCosts sheet
import { CostMachineMod } from './frcs.model';

function MoveInCosts(Area: number, MoveInDist: number, TreeVol: number,
                     Removals: number, VolPerAcreCT: number, CostMachine: CostMachineMod) {
    // Move-In Assumptions
    const SpeedLoaded = 25;
    const SpeedBack = 40;
    const MoveInLabor = 0;
    const LoadHrs = 2;
    const LoadHrsYarder = 4;
    const TruckMoveInCosts = 35;
    const TruckDriverMoveInCosts = 18;
    // Move-In Calculated Values
    const TravLoadedHrs = MoveInDist / SpeedLoaded;
    const BackhaulHrs = MoveInDist / SpeedBack;
    const LowboyCost = TruckMoveInCosts + TruckDriverMoveInCosts;
    // System Costs
    // Mech WT
    const LowboyLoadsMechWT = 4 + (VolPerAcreCT > 0 ? 1 : 0);
    const FB_OwnCost = CostMachine.FB_OwnCost;
    const Skidder_OwnCost = CostMachine.Skidder_OwnCost;
    const Processor_OwnCost = CostMachine.Processor_OwnCost;
    const Loader_OwnCost = CostMachine.Loader_OwnCost;
    const Chipper_OwnCost = CostMachine.Chipper_OwnCost;
    // Fixed
    const fellerbuncherFixedMechWT = (LowboyCost + FB_OwnCost + MoveInLabor) * LoadHrs;
    const skidderFixedMechWT = (LowboyCost + Skidder_OwnCost + MoveInLabor) * LoadHrs;
    const processorFixedMechWT = (LowboyCost + Processor_OwnCost + MoveInLabor) * LoadHrs;
    const loaderFixedMechWT = (LowboyCost + Loader_OwnCost + MoveInLabor) * LoadHrs;
    const chipperFixedMechWT = VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost + MoveInLabor) * LoadHrs : 0;
    const totalFixedMechWT = fellerbuncherFixedMechWT + skidderFixedMechWT
    + processorFixedMechWT + loaderFixedMechWT + chipperFixedMechWT;
    // Variable
    const fellerbuncherVariableMechWT = (LowboyCost + FB_OwnCost) / SpeedLoaded;
    const skidderVariableMechWT = (LowboyCost + Skidder_OwnCost) / SpeedLoaded;
    const processorVariableMechWT = (LowboyCost + Processor_OwnCost) / SpeedLoaded;
    const loaderVariableMechWT = (LowboyCost + Loader_OwnCost) / SpeedLoaded;
    const chipperVariableMechWT = VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost) / SpeedLoaded : 0;
    const BackhaulVariableMechWT = LowboyCost * LowboyLoadsMechWT / SpeedBack;
    const totalVariableMechWT = fellerbuncherVariableMechWT + skidderVariableMechWT
    + processorVariableMechWT + loaderVariableMechWT + chipperVariableMechWT + BackhaulVariableMechWT;
    // Total
    const totalMechWT = totalFixedMechWT + totalVariableMechWT * MoveInDist;
    const CostPerCCFmechWT = totalMechWT * 100 / (Area * TreeVol * Removals);

    // Manual WT
    const LowboyLoadsManualWT = 3 + (VolPerAcreCT > 0 ? 1 : 0);
    // Fixed
    const skidderFixedManualWT = (LowboyCost + Skidder_OwnCost + MoveInLabor) * LoadHrs;
    const processorFixedManualWT = (LowboyCost + Processor_OwnCost + MoveInLabor) * LoadHrs;
    const loaderFixedManualWT = (LowboyCost + Loader_OwnCost + MoveInLabor) * LoadHrs;
    const chipperFixedManualWT = VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost + MoveInLabor) * LoadHrs : 0;
    const totalFixedManualWT = skidderFixedManualWT + processorFixedManualWT + loaderFixedManualWT
        + chipperFixedManualWT;
    // Variable
    const skidderVariableManualWT = (LowboyCost + Skidder_OwnCost) / SpeedLoaded;
    const processorVariableManualWT = (LowboyCost + Processor_OwnCost) / SpeedLoaded;
    const loaderVariableManualWT = (LowboyCost + Loader_OwnCost) / SpeedLoaded;
    const chipperVariableManualWT = VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost) / SpeedLoaded : 0;
    const BackhaulVariableManualWT = LowboyCost * LowboyLoadsManualWT / SpeedBack;
    const totalVariableManualWT = skidderVariableManualWT + processorVariableManualWT + loaderVariableManualWT
        + chipperVariableManualWT + BackhaulVariableManualWT;
    // Total
    const totalManualWT = totalFixedManualWT + totalVariableManualWT * MoveInDist;
    const CostPerCCFmanualWT = totalManualWT * 100 / (Area * TreeVol * Removals);

    // Manual Log
    const LowboyLoadsManualLog = 2 + (VolPerAcreCT > 0 ? 1 : 0);
    // Fixed
    const skidderFixedManualLog = (LowboyCost + Skidder_OwnCost + MoveInLabor) * LoadHrs;
    const loaderFixedManualLog = (LowboyCost + Loader_OwnCost + MoveInLabor) * LoadHrs;
    const chipperFixedManualLog = VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost + MoveInLabor) * LoadHrs : 0;
    const totalFixedManualLog = skidderFixedManualLog + loaderFixedManualLog + chipperFixedManualLog;
    // Variable
    const skidderVariableManualLog = (LowboyCost + Skidder_OwnCost) / SpeedLoaded;
    const loaderVariableManualLog = (LowboyCost + Loader_OwnCost) / SpeedLoaded;
    const chipperVariableManualLog = VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost) / SpeedLoaded : 0;
    const BackhaulVariableManualLog = LowboyCost * LowboyLoadsManualLog / SpeedBack;
    const totalVariableManualLog = skidderVariableManualLog + loaderVariableManualLog
        + chipperVariableManualLog + BackhaulVariableManualLog;
    // Total
    const totalManualLog = totalFixedManualLog + totalVariableManualLog * MoveInDist;
    const CostPerCCFmanualLog = totalManualLog * 100 / (Area * TreeVol * Removals);

    return { 'CostPerCCFmechWT': CostPerCCFmechWT, 'CostPerCCFmanualWT': CostPerCCFmanualWT,
             'CostPerCCFmanualLog': CostPerCCFmanualLog };
}

export { MoveInCosts };
