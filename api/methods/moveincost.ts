// MoveInCosts sheet
import { CostMachineMod } from './frcs.model';

function MoveInCosts(Area: number, MoveInDist: number, TreeVol: number, TreeVolST: number,
                     Removals: number, RemovalsST: number, VolPerAcreCT: number, CostMachine: CostMachineMod) {
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
    const Harvester_OwnCost = CostMachine.Harvester_OwnCost;
    const Forwarder_OwnCost = CostMachine.Forwarder_OwnCost;
    const Yarder_OwnCost = CostMachine.Yarder_OwnCost;
    const FB_OwnCost = CostMachine.FB_OwnCost;
    const Skidder_OwnCost = CostMachine.Skidder_OwnCost;
    const Processor_OwnCost = CostMachine.Processor_OwnCost;
    const Loader_OwnCost = CostMachine.Loader_OwnCost;
    const Chipper_OwnCost = CostMachine.Chipper_OwnCost;

    // Fixed
    function fellerbuncherFixedfunc() {
        return (LowboyCost + FB_OwnCost + MoveInLabor) * LoadHrs;
    }
    function skidderFixedfunc() {
        return (LowboyCost + Skidder_OwnCost + MoveInLabor) * LoadHrs;
    }
    function processorFixedfunc() {
        return (LowboyCost + Processor_OwnCost + MoveInLabor) * LoadHrs;
    }
    function loaderFixedfunc() {
        return (LowboyCost + Loader_OwnCost + MoveInLabor) * LoadHrs;
    }
    function chipperFixedfunc() {
        return VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost + MoveInLabor) * LoadHrs : 0;
    }
    function harvesterFixedfunc() {
        return (LowboyCost + Harvester_OwnCost + MoveInLabor) * LoadHrs;
    }
    function forwarderFixedfunc() {
        return (LowboyCost + Forwarder_OwnCost + MoveInLabor) * LoadHrs;
    }
    function yarderFixedfunc() {
        return (LowboyCost + Yarder_OwnCost + MoveInLabor) * LoadHrs;
    }

    const fellerbuncherFixed = fellerbuncherFixedfunc();
    const skidderFixed = skidderFixedfunc();
    const processorFixed = processorFixedfunc();
    const loaderFixed = loaderFixedfunc();
    const chipperFixed = chipperFixedfunc();
    const harvesterFixed = harvesterFixedfunc();
    const forwarderFixed = forwarderFixedfunc();
    const yarderFixed = yarderFixedfunc();

    // Variable
    function fellerbuncherVariablefunc() {
        return (LowboyCost + FB_OwnCost) / SpeedLoaded;
    }
    function skidderVariablefunc() {
        return (LowboyCost + Skidder_OwnCost) / SpeedLoaded;
    }
    function processorVariablefunc() {
        return (LowboyCost + Processor_OwnCost) / SpeedLoaded;
    }
    function loaderVariablefunc() {
        return (LowboyCost + Loader_OwnCost) / SpeedLoaded;
    }
    function chipperVariablefunc() {
        return VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost) / SpeedLoaded : 0;
    }
    function BackhaulVariablefunc(LowboyLoads: number) {
        return LowboyCost * LowboyLoads / SpeedBack;
    }
    function harvesterVariablefunc() {
        return (LowboyCost + Harvester_OwnCost) / SpeedLoaded;
    }
    function forwarderVariablefunc() {
        return (LowboyCost + Forwarder_OwnCost) / SpeedLoaded;
    }
    function yarderVariablefunc() {
        return (LowboyCost + Yarder_OwnCost) / SpeedLoaded;
    }

    const fellerbuncherVariable = fellerbuncherVariablefunc();
    const skidderVariable = skidderVariablefunc();
    const processorVariable = processorVariablefunc();
    const loaderVariable = loaderVariablefunc();
    const chipperVariable = chipperVariablefunc();
    const harvesterVariable = harvesterVariablefunc();
    const forwarderVariable = forwarderVariablefunc();
    const yarderVariable = yarderVariablefunc();

    // Mech WT
    const LowboyLoadsMechWT = 4 + (VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedMechWT = fellerbuncherFixed + skidderFixed + processorFixed + loaderFixed + chipperFixed;
    const BackhaulVariableMechWT = BackhaulVariablefunc(LowboyLoadsMechWT);
    const totalVariableMechWT = fellerbuncherVariable + skidderVariable
        + processorVariable + loaderVariable + chipperVariable + BackhaulVariableMechWT;
    // Total
    const totalMechWT = totalFixedMechWT + totalVariableMechWT * MoveInDist;
    const CostPerCCFmechWT = totalMechWT * 100 / (Area * TreeVol * Removals);

    // Manual WT
    const LowboyLoadsManualWT = 3 + (VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedManualWT = skidderFixed + processorFixed + loaderFixed + chipperFixed;
    const BackhaulVariableManualWT = BackhaulVariablefunc(LowboyLoadsManualWT);
    const totalVariableManualWT = skidderVariable + processorVariable + loaderVariable
        + chipperVariable + BackhaulVariableManualWT;
    // Total
    const totalManualWT = totalFixedManualWT + totalVariableManualWT * MoveInDist;
    const CostPerCCFmanualWT = totalManualWT * 100 / (Area * TreeVol * Removals);

    // Manual Log
    const LowboyLoadsManualLog = 2 + (VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedManualLog = skidderFixed + loaderFixed + chipperFixed;
    const BackhaulVariableManualLog = BackhaulVariablefunc(LowboyLoadsManualLog);
    const totalVariableManualLog = skidderVariable + loaderVariable + chipperVariable + BackhaulVariableManualLog;
    // Total
    const totalManualLog = totalFixedManualLog + totalVariableManualLog * MoveInDist;
    const CostPerCCFmanualLog = totalManualLog * 100 / (Area * TreeVol * Removals);

    // Ground CTL
    const LowboyLoadsGroundCTL = 3 + (VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedGroundCTL = harvesterFixed + forwarderFixed + loaderFixed + chipperFixed;
    const BackhaulVariableGroundCTL = BackhaulVariablefunc(LowboyLoadsGroundCTL);
    const totalVariableGroundCTL = harvesterVariable + forwarderVariable + loaderVariable
        + chipperVariable + BackhaulVariableGroundCTL;
    // Total
    const totalGroundCTL = totalFixedGroundCTL + totalVariableGroundCTL * MoveInDist;
    const CostPerCCFgroundCTL = totalGroundCTL * 100 / (Area * TreeVolST * RemovalsST);

    return { 'CostPerCCFmechWT': CostPerCCFmechWT, 'CostPerCCFmanualWT': CostPerCCFmanualWT,
             'CostPerCCFmanualLog': CostPerCCFmanualLog, 'CostPerCCFgroundCTL': CostPerCCFgroundCTL };
}

export { MoveInCosts };
