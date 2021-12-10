// Processing sheet
import { FrcsInputs, IntermediateVariables, MachineCosts } from '../../model';

function Processing(
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  machineCost: MachineCosts
) {
  const PMH_ProcessorS = machineCost.PMH_ProcessorS;
  const PMH_ProcessorB = machineCost.PMH_ProcessorB;

  // Processing Calculated Values
  const ProcessorHourlyCost =
    PMH_ProcessorS * (1 - intermediate.mechMachineSize) +
    PMH_ProcessorB * intermediate.mechMachineSize;
  // A) Hahn Stroke Processor (Gonsier&Mandzak, 87)
  const TimePerTreeProcessA = 1.26 * (0.232 + 0.0494 * intermediate.dbhSLT);
  const VolPerPMHProcessA = input.volumeSLT / (TimePerTreeProcessA / 60);
  const CostPerCCFprocessA = (100 * ProcessorHourlyCost) / VolPerPMHProcessA;
  const RelevanceProcessA =
    intermediate.dbhSLT < 15 ? 1 : intermediate.dbhSLT < 20 ? 4 - intermediate.dbhSLT / 5 : 0;
  // B) Stroke Processor (MacDonald, 90)
  const TimePerTreeProcessB = 0.153 + 0.0145 * intermediate.buttDiamSLT;
  const VolPerPMHprocessB = input.volumeSLT / (TimePerTreeProcessB / 60);
  const CostPerCCFprocessB = (100 * ProcessorHourlyCost) / VolPerPMHprocessB;
  const RelevanceProcessB =
    intermediate.buttDiamSLT < 20
      ? 1
      : intermediate.buttDiamSLT < 30
      ? 3 - intermediate.buttDiamSLT / 10
      : 0;
  // C) Roger Stroke Processor (Johnson, 88)
  const TimePerTreeProcessC =
    -0.05 +
    0.6844 * intermediate.logsPerTreeSLT +
    5 * Math.pow(10, -8) * Math.pow(input.volumeSLT, 2);
  const VolPerPMHprocessC = input.volumeSLT / (TimePerTreeProcessC / 60);
  const CostPerCCFprocessC = (100 * ProcessorHourlyCost) / VolPerPMHprocessC;
  const RelevanceProcessC = 1;
  // D) Harricana Stroke Processor (Johnson, 88)
  const TimePerTreeProcessD =
    -0.13 + 0.001 * Math.pow(intermediate.buttDiamSLT, 2) + 0.5942 * intermediate.logsPerTreeSLT;
  const VolPerPMHprocessD = input.volumeSLT / (TimePerTreeProcessD / 60);
  const CostPerCCFprocessD = (100 * ProcessorHourlyCost) / VolPerPMHprocessD;
  const RelevanceProcessD = 1;
  // E) Hitachi EX150/Keto 500 (Schroder&Johnson, 97)
  const TimePerTreeProcessE = Math.pow(0.67 + 0.0116 * input.volumeSLT, 2);
  const VolPerPMHprocessE = input.volumeSLT / (TimePerTreeProcessE / 60);
  const CostPerCCFprocessE = (100 * ProcessorHourlyCost) / VolPerPMHprocessE;
  const RelevanceProcessE =
    input.volumeSLT < 50 ? 1 : input.volumeSLT < 100 ? 2 - input.volumeSLT / 50 : 0;
  // F) FERIC Generic (Gingras, J.F. 96. The cost of product sorting during harvesting. FERIC Technical Note TN-245)
  const VolPerPMHprocessF = (41.16 / 0.02832) * Math.pow(input.volumeSLT / 35.31, 0.4902);
  const CostPerCCFprocessF = (100 * ProcessorHourlyCost) / VolPerPMHprocessF;
  const RelevanceProcessF = 1;
  // G) Valmet 546 Woodstar Processor (Holtzscher, M. and B. Lanford 1997 Tree diameter effects
  // on costs and productivity of cut-to-length systems. For. Prod. J. 47(3):25-30)
  const TimePerTreeProcessG = -0.341 + 0.1243 * intermediate.dbhSLT;
  const VolPerPMHprocessG = input.volumeSLT / (TimePerTreeProcessG / 60);
  const CostPerCCFprocessG = (100 * ProcessorHourlyCost) / VolPerPMHprocessG;
  const RelevanceProcessG =
    input.volumeSLT < 20 ? 1 : input.volumeSLT < 40 ? 2 - input.volumeSLT / 20 : 0;
  // H) User-Defined
  const VolPerPMHprocessH = 0.001;
  const CostPerCCFprocessH = (100 * ProcessorHourlyCost) / VolPerPMHprocessH;
  const RelevanceProcessH = 0;
  // Processing Summary
  // CostProcess
  const CostProcess =
    input.volumeSLT > 0
      ? (intermediate.cHardwoodSLT *
          100 *
          (ProcessorHourlyCost * RelevanceProcessA +
            ProcessorHourlyCost * RelevanceProcessB +
            ProcessorHourlyCost * RelevanceProcessC +
            ProcessorHourlyCost * RelevanceProcessD +
            ProcessorHourlyCost * RelevanceProcessE +
            ProcessorHourlyCost * RelevanceProcessF +
            ProcessorHourlyCost * RelevanceProcessG +
            ProcessorHourlyCost * RelevanceProcessH)) /
        (RelevanceProcessA * VolPerPMHProcessA +
          RelevanceProcessB * VolPerPMHprocessB +
          RelevanceProcessC * VolPerPMHprocessC +
          RelevanceProcessD * VolPerPMHprocessD +
          RelevanceProcessE * VolPerPMHprocessE +
          RelevanceProcessF * VolPerPMHprocessF +
          RelevanceProcessG * VolPerPMHprocessG +
          RelevanceProcessH * VolPerPMHprocessH)
      : 0;
  // GalProcess
  const HorsepowerProcessorS = 120;
  const HorsepowerProcessorB = 200;
  const fcrProcessor = 0.022;
  const WeightedGalPMH =
    HorsepowerProcessorS * fcrProcessor * (1 - intermediate.mechMachineSize) +
    HorsepowerProcessorB * fcrProcessor * intermediate.mechMachineSize;
  const WeightedCostPMH = ProcessorHourlyCost;
  const GalProcess = (WeightedGalPMH * CostProcess) / WeightedCostPMH;

  return { CostProcess: CostProcess, GalProcess: GalProcess };
}

export { Processing };
