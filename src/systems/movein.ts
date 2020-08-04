import { MachineCostMod, MoveInInputVarMod } from './frcs.model';
import { MachineCosts } from './methods/machinecosts';

export function calculateMoveIn(input: MoveInInputVarMod) {
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
  const machineCost: MachineCostMod = MachineCosts(input.DieselFuelPrice);
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
    return (LowboyCost + Chipper_OwnCost + MoveInLabor) * LoadHrs;
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
  const HeliMoveInCostPerHr =
    (3700 / 6 + 340 + 7580 / 6.76 + 1052 + 6750 / 8.5 + 840) / 3;
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
    return (LowboyCost + Chipper_OwnCost) / SpeedLoaded;
  }
  function BackhaulVariablefunc(LowboyLoads: number) {
    return (LowboyCost * LowboyLoads) / SpeedBack;
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
    return (2 * HeliMoveInCostPerHr) / HeliCruiseSpeed;
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

  let total = 0;
  let residue = 0;
  switch (input.System) {
    case 'Ground-Based Mech WT':
      const LowboyLoadsMechWT = 4 + 1;
      const totalFixedMechWT =
        fellerbuncherFixed +
        skidderFixed +
        processorFixed +
        loaderFixed +
        chipperFixed;
      const BackhaulVariableMechWT = BackhaulVariablefunc(LowboyLoadsMechWT);
      const totalVariableMechWT =
        fellerbuncherVariable +
        skidderVariable +
        processorVariable +
        loaderVariable +
        chipperVariable +
        BackhaulVariableMechWT;
      total = totalFixedMechWT + totalVariableMechWT * input.MoveInDist;
      break;
    case 'Ground-Based Manual WT':
      const LowboyLoadsManualWT = 3 + 1;
      const totalFixedManualWT =
        skidderFixed + processorFixed + loaderFixed + chipperFixed;
      const BackhaulVariableManualWT = BackhaulVariablefunc(
        LowboyLoadsManualWT
      );
      const totalVariableManualWT =
        skidderVariable +
        processorVariable +
        loaderVariable +
        chipperVariable +
        BackhaulVariableManualWT;
      total = totalFixedManualWT + totalVariableManualWT * input.MoveInDist;
      break;
    case 'Ground-Based Manual Log':
      const LowboyLoadsManualLog = 2 + 1;
      const totalFixedManualLog = skidderFixed + loaderFixed + chipperFixed;
      const BackhaulVariableManualLog = BackhaulVariablefunc(
        LowboyLoadsManualLog
      );
      const totalVariableManualLog =
        skidderVariable +
        loaderVariable +
        chipperVariable +
        BackhaulVariableManualLog;
      total = totalFixedManualLog + totalVariableManualLog * input.MoveInDist;
      break;
    case 'Ground-Based CTL':
      const LowboyLoadsGroundCTL = 3 + 1;
      const totalFixedGroundCTL =
        harvesterFixed + forwarderFixed + loaderFixed + chipperFixed;
      const BackhaulVariableGroundCTL = BackhaulVariablefunc(
        LowboyLoadsGroundCTL
      );
      const totalVariableGroundCTL =
        harvesterVariable +
        forwarderVariable +
        loaderVariable +
        chipperVariable +
        BackhaulVariableGroundCTL;
      total = totalFixedGroundCTL + totalVariableGroundCTL * input.MoveInDist;
      // Bundling Residues
      const LowboyLoadsBundleResidues = 2;
      const totalFixedBundleResidues = bundlerFixed + forwarderFixed;
      const BackhaulBundleResidues = BackhaulVariablefunc(
        LowboyLoadsBundleResidues
      );
      const totalVariableBundleResidues =
        bundlerVariable + forwarderVariable + BackhaulBundleResidues;
      // Total
      const totalBundleResidues =
        totalFixedBundleResidues +
        totalVariableBundleResidues * input.MoveInDist;
      residue = totalBundleResidues;
      total += totalBundleResidues;
      break;
    case 'Cable Manual WT/Log':
      const LowboyLoadsCableManualWTlog = 3 + 1;
      const totalFixedCableManualWTlog =
        yarderFixed + loaderFixed + chipperFixed;
      const BackhaulVariableCableManualWTlog = BackhaulVariablefunc(
        LowboyLoadsCableManualWTlog
      );
      const totalVariableCableManualWTlog =
        yarderVariable +
        loaderVariable +
        chipperVariable +
        BackhaulVariableCableManualWTlog;
      total =
        totalFixedCableManualWTlog +
        totalVariableCableManualWTlog * input.MoveInDist;
      break;
    case 'Cable Manual WT':
      const LowboyLoadsCableManualWT = 4 + 1;
      const totalFixedCableManualWT =
        yarderFixed + processorFixed + loaderFixed + chipperFixed;
      const BackhaulVariableCableManualWT = BackhaulVariablefunc(
        LowboyLoadsCableManualWT
      );
      const totalVariableCableManualWT =
        yarderVariable +
        processorVariable +
        loaderVariable +
        chipperVariable +
        BackhaulVariableCableManualWT;
      total =
        totalFixedCableManualWT + totalVariableCableManualWT * input.MoveInDist;
      break;
    case 'Cable Manual Log':
      const LowboyLoadsCableManualLog = 2 + 1;
      const totalFixedCableManualLog = yarderFixed + loaderFixed + chipperFixed;
      const BackhaulVariableCableManualLog = BackhaulVariablefunc(
        LowboyLoadsCableManualLog
      );
      const totalVariableCableManualLog =
        yarderVariable +
        loaderVariable +
        chipperVariable +
        BackhaulVariableCableManualLog;
      total =
        totalFixedCableManualLog +
        totalVariableCableManualLog * input.MoveInDist;
      break;
    case 'Cable CTL':
      const LowboyLoadsCableCTL = 3 + 1;
      const totalFixedCableCTL =
        harvesterFixed + yarderFixed + loaderFixed + chipperFixed;
      const BackhaulVariableCableCTL = BackhaulVariablefunc(
        LowboyLoadsCableCTL
      );
      const totalVariableCableCTL =
        harvesterVariable +
        yarderVariable +
        loaderVariable +
        chipperVariable +
        BackhaulVariableCableCTL;
      total = totalFixedCableCTL + totalVariableCableCTL * input.MoveInDist;
      break;
    case 'Helicopter Manual Log':
      const LowboyLoadsHManualLog = 2 + 1;
      const totalFixedHManualLog =
        helicopterFixed + 2 * loaderFixed + chipperFixed;
      const BackhaulVariableHManualLog = BackhaulVariablefunc(
        LowboyLoadsHManualLog
      );
      const totalVariableHManualLog =
        helicopterVariable +
        2 * loaderVariable +
        chipperVariable +
        BackhaulVariableHManualLog;
      total = totalFixedHManualLog + totalVariableHManualLog * input.MoveInDist;
      break;
    case 'Helicopter CTL':
      const LowboyLoadsHeliCTL = 3 + 1;
      const totalFixedHeliCTL =
        harvesterFixed + helicopterFixed + 2 * loaderFixed + chipperFixed;
      const BackhaulVariableHeliCTL = BackhaulVariablefunc(LowboyLoadsHeliCTL);
      const totalVariableHeliCTL =
        harvesterVariable +
        helicopterVariable +
        2 * loaderVariable +
        chipperVariable +
        BackhaulVariableHeliCTL;
      total = totalFixedHeliCTL + totalVariableHeliCTL * input.MoveInDist;
      break;
  }

  if (input.ChipAll) {
    residue = total;
  }

  return { Total: total, Residue: residue };
}
