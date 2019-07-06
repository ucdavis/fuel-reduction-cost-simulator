// MoveInCosts sheet
import { InputVarMod, IntermediateVarMod, MachineCostMod } from './frcs.model';

function MoveInCosts(input: InputVarMod, intermediate: IntermediateVarMod, machineCost: MachineCostMod) {
    // Move-In Assumptions
    const SpeedLoaded = 25;
    const SpeedBack = 40;
    const MoveInLabor = 0;
    const LoadHrs = 2;
    const LoadHrsYarder = 4;
    const TruckMoveInCosts = 35;
    const TruckDriverMoveInCosts = 18;
    // Move-In Calculated Values
    const TravLoadedHrs = input.MoveInDist / SpeedLoaded;
    const BackhaulHrs = input.MoveInDist / SpeedBack;
    const LowboyCost = TruckMoveInCosts + TruckDriverMoveInCosts;
    // System Costs
    const Harvester_OwnCost = machineCost.Harvester_OwnCost;
    const Forwarder_OwnCost = machineCost.Forwarder_OwnCost;
    const Yarder_OwnCost = machineCost.Yarder_OwnCost;
    const FB_OwnCost = machineCost.FB_OwnCost;
    const Skidder_OwnCost = machineCost.Skidder_OwnCost;
    const Processor_OwnCost = machineCost.Processor_OwnCost;
    const Loader_OwnCost = machineCost.Loader_OwnCost;
    const Chipper_OwnCost = machineCost.Chipper_OwnCost;
    const Bundler_OwnCost = machineCost.Bundler_OwnCost;

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
        return intermediate.VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost + MoveInLabor) * LoadHrs : 0;
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
    function bundlerFixedfunc() {
        return (LowboyCost + Bundler_OwnCost + MoveInLabor) * LoadHrs;
    }
    const HeliMoveInCostPerHr = (3700 / 6 + 340 + 7580 / 6.76 + 1052 + 6750 / 8.5 + 840) / 3;
    function helicopterFixedfunc() {
        return 1 * HeliMoveInCostPerHr;
    }

    const fellerbuncherFixed = fellerbuncherFixedfunc();
    const skidderFixed = skidderFixedfunc();
    const processorFixed = processorFixedfunc();
    const loaderFixed = loaderFixedfunc();
    const chipperFixed = chipperFixedfunc();
    const harvesterFixed = harvesterFixedfunc();
    const forwarderFixed = forwarderFixedfunc();
    const yarderFixed = yarderFixedfunc();
    const bundlerFixed = bundlerFixedfunc();
    const helicopterFixed = helicopterFixedfunc();

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
        return intermediate.VolPerAcreCT > 0 ? (LowboyCost + Chipper_OwnCost) / SpeedLoaded : 0;
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
    function bundlerVariablefunc() {
        return (LowboyCost + Bundler_OwnCost) / SpeedLoaded;
    }
    const HeliCruiseSpeed = 120;
    function helicopterVariablefunc() {
        return 2 * HeliMoveInCostPerHr / HeliCruiseSpeed;
    }

    const fellerbuncherVariable = fellerbuncherVariablefunc();
    const skidderVariable = skidderVariablefunc();
    const processorVariable = processorVariablefunc();
    const loaderVariable = loaderVariablefunc();
    const chipperVariable = chipperVariablefunc();
    const harvesterVariable = harvesterVariablefunc();
    const forwarderVariable = forwarderVariablefunc();
    const yarderVariable = yarderVariablefunc();
    const bundlerVariable = bundlerVariablefunc();
    const helicopterVariable = helicopterVariablefunc();

    // Mech WT
    const LowboyLoadsMechWT = 4 + (intermediate.VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedMechWT = fellerbuncherFixed + skidderFixed + processorFixed + loaderFixed + chipperFixed;
    const BackhaulVariableMechWT = BackhaulVariablefunc(LowboyLoadsMechWT);
    const totalVariableMechWT = fellerbuncherVariable + skidderVariable
        + processorVariable + loaderVariable + chipperVariable + BackhaulVariableMechWT;
    // Total
    const totalMechWT = totalFixedMechWT + totalVariableMechWT * input.MoveInDist;
    const CostPerCCFmechWT = totalMechWT * 100 / (input.Area * intermediate.TreeVol * intermediate.Removals);

    // Manual WT
    const LowboyLoadsManualWT = 3 + (intermediate.VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedManualWT = skidderFixed + processorFixed + loaderFixed + chipperFixed;
    const BackhaulVariableManualWT = BackhaulVariablefunc(LowboyLoadsManualWT);
    const totalVariableManualWT = skidderVariable + processorVariable + loaderVariable
        + chipperVariable + BackhaulVariableManualWT;
    // Total
    const totalManualWT = totalFixedManualWT + totalVariableManualWT * input.MoveInDist;
    const CostPerCCFmanualWT = totalManualWT * 100 / (input.Area * intermediate.TreeVol * intermediate.Removals);

    // Manual Log
    const LowboyLoadsManualLog = 2 + (intermediate.VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedManualLog = skidderFixed + loaderFixed + chipperFixed;
    const BackhaulVariableManualLog = BackhaulVariablefunc(LowboyLoadsManualLog);
    const totalVariableManualLog = skidderVariable + loaderVariable + chipperVariable + BackhaulVariableManualLog;
    // Total
    const totalManualLog = totalFixedManualLog + totalVariableManualLog * input.MoveInDist;
    const CostPerCCFmanualLog = totalManualLog * 100 / (input.Area * intermediate.TreeVol * intermediate.Removals);

    // Ground CTL
    const LowboyLoadsGroundCTL = 3 + (intermediate.VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedGroundCTL = harvesterFixed + forwarderFixed + loaderFixed + chipperFixed;
    const BackhaulVariableGroundCTL = BackhaulVariablefunc(LowboyLoadsGroundCTL);
    const totalVariableGroundCTL = harvesterVariable + forwarderVariable + loaderVariable
        + chipperVariable + BackhaulVariableGroundCTL;
    // Total
    const totalGroundCTL = totalFixedGroundCTL + totalVariableGroundCTL * input.MoveInDist;
    const CostPerCCFgroundCTL = totalGroundCTL * 100 / (input.Area * intermediate.TreeVolST * intermediate.RemovalsST);

    // Cable Manual WT/Log
    const LowboyLoadsCableManualWTlog = 3 + (intermediate.VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedCableManualWTlog = yarderFixed + loaderFixed + chipperFixed;
    const BackhaulVariableCableManualWTlog = BackhaulVariablefunc(LowboyLoadsCableManualWTlog);
    const totalVariableCableManualWTlog = yarderVariable + loaderVariable + chipperVariable
        + BackhaulVariableCableManualWTlog;
    // Total
    const totalCableManualWTlog = totalFixedCableManualWTlog + totalVariableCableManualWTlog * input.MoveInDist;
    const CostPerCCFcableManualWTLog = totalCableManualWTlog * 100
        / (input.Area * intermediate.TreeVol * intermediate.Removals);

    // Cable Manual WT
    const LowboyLoadsCableManualWT = 4 + (intermediate.VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedCableManualWT = yarderFixed + processorFixed + loaderFixed + chipperFixed;
    const BackhaulVariableCableManualWT = BackhaulVariablefunc(LowboyLoadsCableManualWT);
    const totalVariableCableManualWT = yarderVariable + processorVariable + loaderVariable + chipperVariable
        + BackhaulVariableCableManualWT;
    // Total
    const totalCableManualWT = totalFixedCableManualWT + totalVariableCableManualWT * input.MoveInDist;
    const CostPerCCFcableManualWT = totalCableManualWT * 100
        / (input.Area * intermediate.TreeVol * intermediate.Removals);

    // Cable Manual Log
    const LowboyLoadsCableManualLog = 2 + (intermediate.VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedCableManualLog = yarderFixed + loaderFixed + chipperFixed;
    const BackhaulVariableCableManualLog = BackhaulVariablefunc(LowboyLoadsCableManualLog);
    const totalVariableCableManualLog = yarderVariable + loaderVariable + chipperVariable
        + BackhaulVariableCableManualLog;
    // Total
    const totalCableManualLog = totalFixedCableManualLog + totalVariableCableManualLog * input.MoveInDist;
    const CostPerCCFcableManualLog = totalCableManualLog * 100
        / (input.Area * intermediate.TreeVol * intermediate.Removals);

    // Cable CTL
    const LowboyLoadsCableCTL = 3 + (intermediate.VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedCableCTL = harvesterFixed + yarderFixed + loaderFixed + chipperFixed;
    const BackhaulVariableCableCTL = BackhaulVariablefunc(LowboyLoadsCableCTL);
    const totalVariableCableCTL = harvesterVariable + yarderVariable + loaderVariable + chipperVariable
        + BackhaulVariableCableCTL;
    // Total
    const totalCableCTL = totalFixedCableCTL + totalVariableCableCTL * input.MoveInDist;
    const CostPerCCFcableCTL = totalCableCTL * 100
        / (input.Area * intermediate.TreeVolST * intermediate.RemovalsST);

    // Helicopter Manual Log
    const LowboyLoadsHManualLog = 2 + (intermediate.VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedHManualLog = helicopterFixed + 2 * loaderFixed + chipperFixed;
    const BackhaulVariableHManualLog = BackhaulVariablefunc(LowboyLoadsHManualLog);
    const totalVariableHManualLog = helicopterVariable + 2 * loaderVariable + chipperVariable
        + BackhaulVariableHManualLog;
    // Total
    const totalHManualLog = totalFixedHManualLog + totalVariableHManualLog * input.MoveInDist;
    const CostPerCCFhManualLog = totalHManualLog * 100
        / (input.Area * intermediate.TreeVol * intermediate.Removals);

    // Helicopter CTL
    const LowboyLoadsHeliCTL = 3 + (intermediate.VolPerAcreCT > 0 ? 1 : 0);
    const totalFixedHeliCTL = harvesterFixed + helicopterFixed + 2 * loaderFixed + chipperFixed;
    const BackhaulVariableHeliCTL = BackhaulVariablefunc(LowboyLoadsHeliCTL);
    const totalVariableHeliCTL = harvesterVariable + helicopterVariable + 2 * loaderVariable + chipperVariable
        + BackhaulVariableHeliCTL;
    // Total
    const totalHeliCTL = totalFixedHeliCTL + totalVariableHeliCTL * input.MoveInDist;
    const CostPerCCFheliCTL = totalHeliCTL * 100
        / (input.Area * intermediate.TreeVolST * intermediate.RemovalsST);

    // Bundling Residues
    const LowboyLoadsBundleResidues = 2;
    const totalFixedBundleResidues = bundlerFixed + forwarderFixed;
    const BackhaulBundleResidues = BackhaulVariablefunc(LowboyLoadsBundleResidues);
    const totalVariableBundleResidues = bundlerVariable + forwarderVariable + BackhaulBundleResidues;
    // Total
    const totalBundleResidues = totalFixedBundleResidues + totalVariableBundleResidues * input.MoveInDist;
    const CostPerCCFbundleResidues = totalBundleResidues / (input.Area * intermediate.ResidueST);

    return { 'CostPerCCFmechWT': CostPerCCFmechWT, 'CostPerCCFmanualWT': CostPerCCFmanualWT,
             'CostPerCCFmanualLog': CostPerCCFmanualLog, 'CostPerCCFgroundCTL': CostPerCCFgroundCTL,
             'CostPerCCFcableManualWTLog': CostPerCCFcableManualWTLog,
             'CostPerCCFcableManualWT': CostPerCCFcableManualWT, 'CostPerCCFbundleResidues': CostPerCCFbundleResidues,
             'CostPerCCFcableManualLog': CostPerCCFcableManualLog, 'CostPerCCFcableCTL': CostPerCCFcableCTL,
             'CostPerCCFhManualLog': CostPerCCFhManualLog, 'CostPerCCFheliCTL': CostPerCCFheliCTL };
}

export { MoveInCosts };
