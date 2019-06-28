// Skidding sheet
import { CostMachineMod } from '../frcs.model';

function Skidding(Slope: number, YardDist: number, Removals: number, TreeVol: number, WoodDensity: number,
                  LogLength: number, PartialCut: number, CSlopeSkidForwLoadSize: number, LogsPerTree: number,
                  LogVol: number, ManualMachineSize: number, BFperCF: number, ButtDiam: number,
                  CostMachine: CostMachineMod, TreesPerCycleIIB: number, CHardwood: number) {

// Skidding Calculated Values
const TurnVol = (PartialCut === 0 ?
44.87 : (PartialCut === 1 ? 31.62 : 0)) * Math.pow(TreeVol, 0.282) * CSlopeSkidForwLoadSize;
const LogsPerTurnS = TurnVol / LogVol;
const TreesPerTurnS = TurnVol / TreeVol;
const PMH_SkidderB = CostMachine.PMH_SkidderB;
const PMH_SkidderS = CostMachine.PMH_SkidderS;
const SkidderHourlyCost = PMH_SkidderS * (1 - ManualMachineSize) + PMH_SkidderB * ManualMachineSize;

// I Choker, Unbunched
const MaxLogs = 10;
const ChokerLogs = Math.min(MaxLogs, LogsPerTurnS);
const ChokerTurnVol = ChokerLogs * LogVol;
// IA CC (Johnson&Lee, 88)
const WinchDistSkidIA = 25;
const TurnTimeSkidIA = -15.58 + 0.345 * ChokerLogs
+ 0.037 * ChokerTurnVol + 4.05 * Math.log(YardDist + WinchDistSkidIA);
const VolPerPMHskidIA = ChokerTurnVol / (TurnTimeSkidIA / 60);
const CostPerCCFSkidIA = 100 * SkidderHourlyCost / VolPerPMHskidIA;
const RelevanceSkidIA = (ChokerTurnVol < 90 ? 1 : (ChokerTurnVol < 180 ? 2 - ChokerTurnVol / 90 : 0));
// IB CC (Gibson&Egging, 73)
const TurnTimeSkidIB = 2.74 + 0.726 * ChokerLogs + 0.00363 * ChokerTurnVol * BFperCF
+ 0.0002 * ChokerTurnVol * WoodDensity + 0.00777 * YardDist + 0.00313 * Math.pow(Slope, 2);
const VolPerPMHskidIB = ChokerTurnVol / (TurnTimeSkidIB / 60);
const CostPerCCFskidIB = 100 * SkidderHourlyCost / VolPerPMHskidIB;
const RelevanceSkidIB = 1;
// IC CC (Schillings, 69) not used at present
const TurnTimeSkidIC = 60 * ((0.122 + 0.089) + (0.000229 + 0.000704) * YardDist
+ (-0.00076 + 0.00127) * Slope + (0.0191 + 0.0118) * ChokerLogs) / 2;
const VolPerPMHskidIC = ChokerTurnVol / (TurnTimeSkidIC / 60);
const CostPerCCFskidIC = 100 * SkidderHourlyCost / VolPerPMHskidIC;
const RelevanceSkidIC = 0;
// ID CC (Gardner, 79)
const TurnTimeSkidID = 2.57 + 0.823 * ChokerLogs + 0.0054 * ChokerTurnVol * BFperCF + 0.0078 * 2 * YardDist;
const VolPerPMHskidID = ChokerTurnVol / (TurnTimeSkidID / 60);
const CostPerCCFskidID = 100 * SkidderHourlyCost / VolPerPMHskidID;
const RelevanceSkidID = 1;
// IE Cat 518 or Cat D4H, cable (Andersson, B. and G. Young  1998.
// Harvesting coastal second growth forests: summary of harvesting system performance.
// FERIC Technical Report TR-120)
const TurnTimeSkidIE = (7.36 + 0.0053 * YardDist);
const VolPerPMHskidIE = ChokerTurnVol / (TurnTimeSkidIE / 60);
const CostPerCCFskidIE = 100 * SkidderHourlyCost / VolPerPMHskidIE;
const RelevanceSkidIE = (TreeVol < 5 ? 0 : (TreeVol < 15 ? -0.5
+ TreeVol / 10 : (TreeVol < 75 ? 1 : (TreeVol < 150 ? 2 - TreeVol / 75 : 0))));

// II Grapple, Unbunched
const IntMoveDistS = 17.0;
// IIA Cat 518 (Johnson, 88)
const TurnTimeSkidIIA = 0.518 + 0.0107 * YardDist + 0.0011 * Math.pow(Slope, 3) + 1.62 * Math.log(LogsPerTurnS);
const VolPerPMHskidIIA = TurnVol / (TurnTimeSkidIIA / 60);
const CostPerCCFskidIIA = 100 * SkidderHourlyCost / VolPerPMHskidIIA;
const RelevanceSkidIIA = (ButtDiam < 20 ? 1 : (ButtDiam < 25 ? 5 - ButtDiam / 5 : 0));
// IIB JD 648 (Gebhardt, 77)
const GroundRatingSkidIIB = 1.1;
const TypeOfCutSkidIIB = 1.5 * PartialCut;
const TurnTimeSkidIIB = 1.072 + 0.00314 * YardDist + 0.0192 * Slope + 0.315 * TypeOfCutSkidIIB
+ 0.489 * LogsPerTurnS - 0.819 * GroundRatingSkidIIB + 0.00469 * IntMoveDistS + 0.00139 * TurnVol * BFperCF;
const VolPerPMHskidIIB = TurnVol / (TurnTimeSkidIIB / 60);
const CostPerCCFskidIIB = 100 * SkidderHourlyCost / VolPerPMHskidIIB;
const RelevanceSkidIIB = 1;

// III User-Defined Skidding Unbunched
const VolPerPMHskidIII = 0.001;
const CostPerCCFskidIII = 100 * SkidderHourlyCost / VolPerPMHskidIII;
const RelevanceSkidIII = 0;

// IV Grapple, Bunched
// IVA Grapple Skidders (Johnson, 88)
const DeckHeightSkidIVA = 3;
const TravEmptySkidIVA = -2.179 + 0.0362 * Slope + 0.711 * Math.log(YardDist);
const LoadSkidIVA = Math.max(0, 0.882 + 0.0042 * Math.pow(Slope, 2) - 0.000048 * Math.pow(TreesPerTurnS, 3));
const TravLoadedSkidIVA = -0.919 + 0.00081 * YardDist + 0.000062 * Math.pow(Slope, 3) + 0.353 * Math.log(YardDist);
const DeckSkidIVA = 0.063 + 0.55 * Math.log(DeckHeightSkidIVA) + 0.0076 * (DeckHeightSkidIVA) * (TreesPerTurnS);
const TurnTImeSkidIVA = TravEmptySkidIVA + LoadSkidIVA + TravLoadedSkidIVA + DeckSkidIVA;
const VolPerPMHskidIVA = TurnVol / (TurnTImeSkidIVA / 60);
const CostPerCCFskidIVA = 100 * SkidderHourlyCost / VolPerPMHskidIVA;
const RelevanceSkidIVA = (ButtDiam < 15 ? 1 : (ButtDiam < 20 ? 4 - ButtDiam / 5 : 0));
// IVB Grapple Skidders (Tufts et al, 88)
const EastsideAdjustmentSkidIVB = 1.3;
const BunchSizeSkidIVB = TreesPerCycleIIB;
const BunchVolSkidIVB = TreeVol * BunchSizeSkidIVB;
const TurnWtSkidIVB = TurnVol * WoodDensity;
const BunchesPerTurnSkidIVB = Math.max(1, TurnVol / BunchVolSkidIVB);
const SkidderHpSkidIVB = 50.5 + 5.74 * Math.sqrt(TreeVol);
const TravEmptySkidIVB = (0.1905 * YardDist + 0.3557 * SkidderHpSkidIVB
- 0.0003336 * YardDist * SkidderHpSkidIVB) / 100;
const GrappleSkidIVB = Math.min(5, (-38.36 + 161.6 * BunchesPerTurnSkidIVB
- 0.5599 * BunchesPerTurnSkidIVB * SkidderHpSkidIVB + 1.398 * BunchesPerTurnSkidIVB * BunchSizeSkidIVB) / 100);
const TravLoadedSkidIVB = (-34.52 + 0.2634 * YardDist + 0.7634 * SkidderHpSkidIVB
- 0.00122 * YardDist * SkidderHpSkidIVB + 0.03782 * YardDist * BunchesPerTurnSkidIVB) / 100;
const UngrappleSkidIVB = Math.max(0, (5.177 * BunchesPerTurnSkidIVB + 0.002508 * TurnWtSkidIVB
- 0.00007944 * TurnWtSkidIVB * BunchesPerTurnSkidIVB * BunchSizeSkidIVB * BunchesPerTurnSkidIVB) / 100);
const CycletimeSkidIVB = EastsideAdjustmentSkidIVB
* (TravEmptySkidIVB + GrappleSkidIVB + TravLoadedSkidIVB + UngrappleSkidIVB);
const VolPerPMHskidIVB = TurnVol / (CycletimeSkidIVB / 60);
const CostPerCCFskidIVB = 100 * SkidderHourlyCost / VolPerPMHskidIVB;
const RelevanceSkidIVB = 0.50;
// IVC John Deere 748E (Kosicki, K. 00. Productivities and costs of two harvesting trials
// in a western Alberta riparian zone. FERIC Advantage 1(19))
const LoadingStopsSkidIVC = 2.1;
const TurnTimeSkidIVC = 0.65 + 0.0054 * YardDist + 0.244 * LoadingStopsSkidIVC;
const VolPerPMHskidIVC = TurnVol / (TurnTimeSkidIVC / 60);
const CostPerCCFskidIVC = 100 * SkidderHourlyCost / VolPerPMHskidIVC;
const RelevanceSkidIVC = (TreeVol < 5 ? 0 : (TreeVol < 10 ? -1 + TreeVol / 5
: (TreeVol < 50 ? 1 : (TreeVol < 100 ? 2 - TreeVol / 50 : 0))));
// IVD Cat D5H TSK Custom Track (Henderson, B. 01. Roadside harvesting with low ground-presssure skidders
// in northwestern British Columbia. FERIC Advantage 2(54))
const TurnTimeSkidIVD = 2.818 + 0.0109 * YardDist;
const VolPerPMHskidIVD = TurnVol / (TurnTimeSkidIVD / 60);
const CostPerCCFskidIVD = 100 * SkidderHourlyCost / VolPerPMHskidIVD;
const RelevanceSkidIVD = (TreeVol < 5 ? 0 : (TreeVol < 10 ? -1 + TreeVol / 5
: (TreeVol < 50 ? 1 : (TreeVol < 100 ? 2 - TreeVol / 50 : 0))));
// IVE JD 748_G-II & TJ 560 (Kosicki, K. 02. Productivity and
// cost of summer harvesting in a central Alberta mixedwood stand. FERIC Advantage 3(6))
const BunchesPerTurnSkidIVE = BunchesPerTurnSkidIVB;
const TurnTimeSkidIVE = 0.649 + 0.0058 * YardDist + 0.581 * BunchesPerTurnSkidIVE;
const VolPerPMHskidIVE = TurnVol / (TurnTimeSkidIVE / 60);
const CostPerCCFskidIVE = 100 * SkidderHourlyCost / VolPerPMHskidIVE;
const RelevanceSkidIVE = (TreeVol < 30 ? 1 : (TreeVol < 60 ? 2 - TreeVol / 30 : 0));
// IVF Tigercat 635 (Boswell, B. 98. Vancouver Island mechanized thinning trials. FERIC Technical Note TN-271)
const TurnTimeSkidIVF = 5.77 + 0.007 * YardDist;
const VolPerPMHskidIVF = TurnVol / (TurnTimeSkidIVF / 60);
const CostPerCCFskidIVF = 100 * SkidderHourlyCost / VolPerPMHskidIVF;
const RelevanceSkidIVF = (TreeVol < 5 ? 0 : (TreeVol < 10 ? -1 + TreeVol / 5
: (TreeVol < 100 ? 1 : (TreeVol < 150 ? 3 - TreeVol / 50 : 0))));
// IVG Tigercat 635 (Kosicki, K. 02. Evaluation of Trans-Gesco TG88C and
// Tigercat 635 grapple skidders working in central Alberta. FERIC Advantage 3(37))
const TreesPerTurnSkidIVG = TreesPerTurnS;
const TurnTimeSkidIVG = 2.98 + 0.006 * YardDist + 0.27 * TreesPerTurnSkidIVG;
const VolPerPMHskidIVG = TurnVol / (TurnTimeSkidIVG / 60);
const CostPerCCFskidIVG = 100 * SkidderHourlyCost / VolPerPMHskidIVG;
const RelevanceSkidIVG = (TreeVol < 40 ? 1 : (TreeVol < 80 ? 2 - TreeVol / 40 : 0));
// IVH User-Defined Skidding Bunched
const VolPerPMHskidIVH = 0.001;
const CostPerCCFskidIVH = 100 * SkidderHourlyCost / VolPerPMHskidIVH;
const RelevanceSkidIVH = 0;
// Skidding Summary
const CostSkidUB = CHardwood * 100 * (SkidderHourlyCost * RelevanceSkidIA + SkidderHourlyCost * RelevanceSkidIB
+ SkidderHourlyCost * RelevanceSkidIC + SkidderHourlyCost * RelevanceSkidID
+ SkidderHourlyCost * RelevanceSkidIE + SkidderHourlyCost * RelevanceSkidIIA
+ SkidderHourlyCost * RelevanceSkidIIB + SkidderHourlyCost * RelevanceSkidIII)
/ (RelevanceSkidIA * VolPerPMHskidIA + RelevanceSkidIB * VolPerPMHskidIB
+ RelevanceSkidIC * VolPerPMHskidIC + RelevanceSkidID * VolPerPMHskidID
+ RelevanceSkidIE * VolPerPMHskidIE + RelevanceSkidIIA * VolPerPMHskidIIA
+ RelevanceSkidIIB * VolPerPMHskidIIB + RelevanceSkidIII * VolPerPMHskidIII);
const CostSkidBun = CHardwood * 100 * (SkidderHourlyCost * RelevanceSkidIVA + SkidderHourlyCost * RelevanceSkidIVB
+ SkidderHourlyCost * RelevanceSkidIVC + SkidderHourlyCost * RelevanceSkidIVD
+ SkidderHourlyCost * RelevanceSkidIVE + SkidderHourlyCost * RelevanceSkidIVF
+ SkidderHourlyCost * RelevanceSkidIVG + SkidderHourlyCost * RelevanceSkidIVH)
/ (RelevanceSkidIVA * VolPerPMHskidIVA + RelevanceSkidIVB * VolPerPMHskidIVB
+ RelevanceSkidIVC * VolPerPMHskidIVC + RelevanceSkidIVD * VolPerPMHskidIVD
+ RelevanceSkidIVE * VolPerPMHskidIVE + RelevanceSkidIVF * VolPerPMHskidIVF
+ RelevanceSkidIVG * VolPerPMHskidIVG + RelevanceSkidIVH * VolPerPMHskidIVH);

return CostSkidBun;
}

export { Skidding };
