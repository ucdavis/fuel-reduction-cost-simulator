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

return CostPerCCFmechWT;
}

export { MoveInCosts };
