import { MachineCosts, MoveInInputs, MoveInOutputs, SystemTypes } from './model';
import { calculateMachineCosts } from './systems/methods/machinecosts';

export function calculateMoveIn(input: MoveInInputs) {
  // Move-In Assumptions
  const SpeedLoaded = 25;
  const SpeedBack = 40;
  const MoveInLabor = 0;
  const LoadHrs = 2;
  const LoadHrsYarder = 4;
  const TruckMoveInCosts = 35;
  const TruckDriverMoveInCosts = 18;
  // Move-In Calculated Values
  const TravLoadedHrs = input.moveInDistance / SpeedLoaded;
  const BackhaulHrs = input.moveInDistance / SpeedBack;
  const LowboyCost = TruckMoveInCosts + TruckDriverMoveInCosts;
  const MPG = 6;
  // System Costs
  const machineCost: MachineCosts = calculateMachineCosts(
    input.dieselFuelPrice,
    input.wageFaller,
    input.wageOther,
    input.laborBenefits,
    input.ppiCurrent
  );
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
    return (LowboyCost + Chipper_OwnCost) / SpeedLoaded;
  }
  function backhaulVariablefunc(LowboyLoads: number) {
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
  let backhaulVariable = 0;

  const moveInOutputs: MoveInOutputs = {
    totalCost: 0,
    residualCost: 0,
    totalDiesel: 0,
    residualDiesel: 0,
  };
  const numChipper = input.harvestChipTrees || input.includeCostsCollectChipResidues ? 1 : 0;
  moveInOutputs.residualCost =
    numChipper *
    (chipperFixed + (chipperVariable + backhaulVariablefunc(numChipper)) * input.moveInDistance);
  moveInOutputs.residualDiesel = (numChipper * 2 * input.moveInDistance) / MPG;

  switch (input.system) {
    case SystemTypes.groundBasedMechWt:
      const LowboyLoadsMechWT = 4 + numChipper;
      const totalFixedMechWT =
        fellerbuncherFixed +
        skidderFixed +
        processorFixed +
        loaderFixed +
        numChipper * chipperFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsMechWT - 1); // e.g., if loads=3, backhaul trips#=2
      const totalVariableMechWT =
        fellerbuncherVariable +
        skidderVariable +
        processorVariable +
        loaderVariable +
        numChipper * chipperVariable +
        backhaulVariable;
      moveInOutputs.totalCost = totalFixedMechWT + totalVariableMechWT * input.moveInDistance;
      moveInOutputs.totalDiesel = ((LowboyLoadsMechWT * 2 - 1) * input.moveInDistance) / MPG;
      break;
    case SystemTypes.groundBasedManualWt:
      const LowboyLoadsManualWT = 3 + numChipper;
      const totalFixedManualWT =
        skidderFixed + processorFixed + loaderFixed + numChipper * chipperFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsManualWT - 1);
      const totalVariableManualWT =
        skidderVariable +
        processorVariable +
        loaderVariable +
        numChipper * chipperVariable +
        backhaulVariable;
      moveInOutputs.totalCost = totalFixedManualWT + totalVariableManualWT * input.moveInDistance;
      moveInOutputs.totalDiesel = ((LowboyLoadsManualWT * 2 - 1) * input.moveInDistance) / MPG;
      break;
    case SystemTypes.groundBasedManualLog:
      const LowboyLoadsManualLog = 2 + numChipper;
      const totalFixedManualLog = skidderFixed + loaderFixed + numChipper * chipperFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsManualLog - 1);
      const totalVariableManualLog =
        skidderVariable + loaderVariable + numChipper * chipperVariable + backhaulVariable;
      moveInOutputs.totalCost = totalFixedManualLog + totalVariableManualLog * input.moveInDistance;
      moveInOutputs.totalDiesel = ((LowboyLoadsManualLog * 2 - 1) * input.moveInDistance) / MPG;
      break;
    case SystemTypes.groundBasedCtl:
      const LowboyLoadsGroundCTL = 3 + numChipper;
      const totalFixedGroundCTL =
        harvesterFixed + forwarderFixed + loaderFixed + numChipper * chipperFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsGroundCTL - 1);
      const totalVariableGroundCTL =
        harvesterVariable +
        forwarderVariable +
        loaderVariable +
        numChipper * chipperVariable +
        backhaulVariable;
      moveInOutputs.totalCost = totalFixedGroundCTL + totalVariableGroundCTL * input.moveInDistance;
      moveInOutputs.totalDiesel = ((LowboyLoadsGroundCTL * 2 - 1) * input.moveInDistance) / MPG;
      // Bundling Residues
      const LowboyLoadsBundleResidues = 2;
      const totalFixedBundleResidues = bundlerFixed + forwarderFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsBundleResidues);
      const totalVariableBundleResidues = bundlerVariable + forwarderVariable + backhaulVariable;
      const totalBundleResidues =
        totalFixedBundleResidues + totalVariableBundleResidues * input.moveInDistance;
      if (input.includeCostsCollectChipResidues) {
        moveInOutputs.totalCost += totalBundleResidues;
        moveInOutputs.totalDiesel += (LowboyLoadsBundleResidues * 2 * input.moveInDistance) / MPG;
        moveInOutputs.residualCost += totalBundleResidues;
        moveInOutputs.residualDiesel +=
          (LowboyLoadsBundleResidues * 2 * input.moveInDistance) / MPG;
      }
      break;
    case SystemTypes.cableManualWtLog:
      const LowboyLoadsCableManualWTlog = 3 + numChipper;
      const totalFixedCableManualWTlog = yarderFixed + loaderFixed + numChipper * chipperFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsCableManualWTlog - 1);
      const totalVariableCableManualWTlog =
        yarderVariable + loaderVariable + numChipper * chipperVariable + backhaulVariable;
      moveInOutputs.totalCost =
        totalFixedCableManualWTlog + totalVariableCableManualWTlog * input.moveInDistance;
      moveInOutputs.totalDiesel =
        ((LowboyLoadsCableManualWTlog * 2 - 1) * input.moveInDistance) / MPG;
      break;
    case SystemTypes.cableManualWt:
      const LowboyLoadsCableManualWT = 4 + numChipper;
      const totalFixedCableManualWT =
        yarderFixed + processorFixed + loaderFixed + numChipper * chipperFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsCableManualWT - 1);
      const totalVariableCableManualWT =
        yarderVariable +
        processorVariable +
        loaderVariable +
        numChipper * chipperVariable +
        backhaulVariable;
      moveInOutputs.totalCost =
        totalFixedCableManualWT + totalVariableCableManualWT * input.moveInDistance;
      moveInOutputs.totalDiesel = ((LowboyLoadsCableManualWT * 2 - 1) * input.moveInDistance) / MPG;
      break;
    case SystemTypes.cableManualLog:
      const LowboyLoadsCableManualLog = 2 + numChipper;
      const totalFixedCableManualLog = yarderFixed + loaderFixed + numChipper * chipperFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsCableManualLog - 1);
      const totalVariableCableManualLog =
        yarderVariable + loaderVariable + numChipper * chipperVariable + backhaulVariable;
      moveInOutputs.totalCost =
        totalFixedCableManualLog + totalVariableCableManualLog * input.moveInDistance;
      moveInOutputs.totalDiesel =
        ((LowboyLoadsCableManualLog * 2 - 1) * input.moveInDistance) / MPG;
      break;
    case SystemTypes.cableCtl:
      const LowboyLoadsCableCTL = 3 + numChipper;
      const totalFixedCableCTL =
        harvesterFixed + yarderFixed + loaderFixed + numChipper * chipperFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsCableCTL - 1);
      const totalVariableCableCTL =
        harvesterVariable +
        yarderVariable +
        loaderVariable +
        numChipper * chipperVariable +
        backhaulVariable;
      moveInOutputs.totalCost = totalFixedCableCTL + totalVariableCableCTL * input.moveInDistance;
      moveInOutputs.totalDiesel = ((LowboyLoadsCableCTL * 2 - 1) * input.moveInDistance) / MPG;
      break;
    case SystemTypes.helicopterManualLog:
      const LowboyLoadsHManualLog = 2 + numChipper;
      const totalFixedHManualLog = helicopterFixed + 2 * loaderFixed + numChipper * chipperFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsHManualLog - 1);
      const totalVariableHManualLog =
        helicopterVariable + 2 * loaderVariable + numChipper * chipperVariable + backhaulVariable;
      moveInOutputs.totalCost =
        totalFixedHManualLog + totalVariableHManualLog * input.moveInDistance;
      moveInOutputs.totalDiesel = ((LowboyLoadsHManualLog * 2 - 1) * input.moveInDistance) / MPG;
      break;
    case SystemTypes.helicopterCtl:
      const LowboyLoadsHeliCTL = 3 + numChipper;
      const totalFixedHeliCTL =
        harvesterFixed + helicopterFixed + 2 * loaderFixed + numChipper * chipperFixed;
      backhaulVariable = backhaulVariablefunc(LowboyLoadsHeliCTL - 1);
      const totalVariableHeliCTL =
        harvesterVariable +
        helicopterVariable +
        2 * loaderVariable +
        numChipper * chipperVariable +
        backhaulVariable;
      moveInOutputs.totalCost = totalFixedHeliCTL + totalVariableHeliCTL * input.moveInDistance;
      moveInOutputs.totalDiesel = ((LowboyLoadsHeliCTL * 2 - 1) * input.moveInDistance) / MPG;
      break;
  }

  if (input.isBiomassSalvage) {
    moveInOutputs.residualCost = moveInOutputs.totalCost;
    moveInOutputs.residualDiesel = moveInOutputs.totalDiesel;
  }

  return moveInOutputs;
}
