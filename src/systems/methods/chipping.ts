// Chipping sheet
import { Assumptions, FrcsInputs, IntermediateVariables, MachineCosts } from '../../model';

function Chipping(
  assumption: Assumptions,
  input: FrcsInputs,
  intermediate: IntermediateVariables,
  machineCost: MachineCosts
) {
  const ExchangeVans = 5.3;

  // Chipping Calculated Values
  const PMH_LoaderS = machineCost.PMH_LoaderS;
  const PMH_ChipperS = machineCost.PMH_ChipperS;
  const PMH_ChipperB = machineCost.PMH_ChipperB;
  const LoadWeightDry = assumption.LoadWeightChip * (1 - assumption.MoistureContent);
  const TreeWeightDry =
    input.volumeCT * intermediate.woodDensityCT * (1 - assumption.MoistureContent);
  const CTLLogWeight = intermediate.ctlLogVolCT * intermediate.woodDensityCT;
  const CTLLogWeightDry = CTLLogWeight * (1 - assumption.MoistureContent);
  const ChipperHourlyCost =
    PMH_ChipperS * (1 - intermediate.chipperSize) + PMH_ChipperB * intermediate.chipperSize;

  // I. Chip Whole Trees
  // A) (Johnson, 89)
  const ChipperHP1A = Math.min(700, Math.max(200, 100 + 100 * Math.sqrt(input.volumeCT)));
  const GTperPMHchippingIA = -17 + ChipperHP1A / 6;
  const VolPerPMHchippingIA = (GTperPMHchippingIA * 2000) / intermediate.woodDensityCT;
  const CostPerCCFchippingIA = (100 * ChipperHourlyCost) / VolPerPMHchippingIA;
  const RelevanceChippingIA = 1;
  // B) Morbark 22 (Hartsough, unpublished)
  const VolPerPMHchippingIB = Math.min(4000, 463 * Math.pow(input.volumeCT, 0.668));
  const CostPerCCFchippingIB = (100 * ChipperHourlyCost) / VolPerPMHchippingIB;
  const RelevanceChippingIB = 1;
  // C) Morbark 60/36 (Hartsough et al, 97)
  const ProbDelayFractionIC = 0.038;
  const LogsPerSwingIC = 1.2 + 338 / TreeWeightDry;
  const ChipTimePerSwingIC = 0.25 + 0.0264 * LogsPerSwingIC + 0.000498 * TreeWeightDry;
  const SlashIC = 0.93;
  const TimePerVanIC =
    ((ChipTimePerSwingIC * (1 + ProbDelayFractionIC)) / (TreeWeightDry * LogsPerSwingIC)) *
      2000 *
      LoadWeightDry +
    (SlashIC + ExchangeVans);
  const VolPerPMHchippingIC =
    assumption.LoadWeightChip / (intermediate.woodDensityCT / 2000) / (TimePerVanIC / 60);
  const CostPerCCFchippingIC = (100 * ChipperHourlyCost) / VolPerPMHchippingIC;
  const RelevanceChippingIC =
    TreeWeightDry < 400 ? 1 : TreeWeightDry < 800 ? 2 - TreeWeightDry / 400 : 0;
  // D) User-Defined Chip Whole Trees
  const VolPerPMHchippingID = 0.001;
  const CostPerCCFchippingID = (100 * ChipperHourlyCost) / VolPerPMHchippingID;
  const RelevanceChippingID = 0;

  // II. Chain Flail DDC Whole Trees

  // B) User-Defined Chain Flail DDC WT
  const VolPerPMHchippingIIB = 0.001;
  const CostPerCCFchippingIIB = (100 * ChipperHourlyCost) / VolPerPMHchippingIIB;
  const RelevanceChippingIIB = 0;

  // III. Chip CTL Logs
  // A) Morbark 27 (Drews et al, 98)
  const ProbDelayFractionIIIA = 0.111;
  const TimePerGTchippingIIIA = Math.max(
    0.8,
    (2.05 - 0.00541 * CTLLogWeight) * (1 + ProbDelayFractionIIIA)
  );
  const TimePerVanIIIA = TimePerGTchippingIIIA * assumption.LoadWeightChip + ExchangeVans;
  const VolPerPMHchippingIIIA =
    assumption.LoadWeightChip / (intermediate.woodDensityCT / 2000) / (TimePerVanIIIA / 60);
  const CostPerCCFchippingIIIA = (100 * ChipperHourlyCost) / VolPerPMHchippingIIIA;
  const RelevanceChippingIIIA = Math.max(
    0.1,
    CTLLogWeight < 100 ? 1 : CTLLogWeight < 200 ? 2 - CTLLogWeight / 100 : 0
  );
  // B) Morbark 60/36 (Hartsough et al, 97)
  const ProdDelayFractionIIIB = 0.038;
  const LogsPerSwingIIIB = 1.2 + 338 / CTLLogWeightDry;
  const ChipTimePerSwingIIIB = 0.25 + 0.0264 * LogsPerSwingIIIB + 0.000498 * CTLLogWeightDry;
  const SlashIIIB = 0.93;
  const TimePerVanIIIB =
    ((ChipTimePerSwingIIIB * (1 + ProdDelayFractionIIIB)) / (CTLLogWeightDry * LogsPerSwingIIIB)) *
      2000 *
      LoadWeightDry +
    (SlashIIIB + ExchangeVans);
  const VolPerPMHchippingIIIB =
    assumption.LoadWeightChip / (intermediate.woodDensityCT / 2000) / (TimePerVanIIIB / 60);
  const CostPerCCFchippingIIIB = (100 * ChipperHourlyCost) / VolPerPMHchippingIIIB;
  const RelevanceChippingIIIB =
    CTLLogWeightDry < 400 ? 1 : CTLLogWeightDry < 800 ? 2 - CTLLogWeightDry / 400 : 0;
  // C) User-Defined Chip CTL Logs
  const VolPerPMHchippingIIIC = 0.001;
  const CostPerCCFchippingIIIC = (100 * ChipperHourlyCost) / VolPerPMHchippingIIIC;
  const RelevanceChippingIIIC = 0;

  // IV. Chip Piled Loose Residues at Landing
  // A) Drum chippers (Desrochers, L., D. Puttock and M. Ryans. 95.
  // Recovery of roadside residues using drum chippers. FERIC Technical Report TR-111)
  const BDTperPMHchippingIVA = 13.5;
  const BDTperPMHchippingIVA2 = 31;
  const BDTperPMHchippingIVAavg = (BDTperPMHchippingIVA + BDTperPMHchippingIVA2) / 2;
  const GTperPMHchippingIVA = BDTperPMHchippingIVAavg / assumption.MoistureContent;
  const CostPerPMHchippingIVA = ChipperHourlyCost + PMH_LoaderS;
  const CostPerGTchippingIVA = CostPerPMHchippingIVA / GTperPMHchippingIVA;
  const RelevanceChippingIVA = 1;
  // B) User-Defined Chip Piled Loose Residues at Landing
  const GTperPMHchippingIVB = 0.001;
  const CostPerGTchippingIVB = CostPerPMHchippingIVA / GTperPMHchippingIVB;
  const RelevanceChippingIVB = 0;

  // V. Chip Bundles of Residue at Landing
  // A) Assume 50% faster than chipping loose residues
  const GTperPMHchippingVA = 1.5 * GTperPMHchippingIVA;
  const CostPerGTchippingVA = CostPerPMHchippingIVA / GTperPMHchippingVA;
  const RelevanceChippingVA = 1;
  // B) User-Defined Chip Bundles of Residue at Landing
  const GTperPMHchippingVB = 0.0001;
  const CostPerGTchippingVB = CostPerPMHchippingIVA / GTperPMHchippingVB;
  const RelevanceChippingVB = 0;

  // Chipping Summary
  // I. Chip Whole Trees
  const CostChipWT =
    input.volumeCT > 0
      ? (intermediate.cHardwoodCT *
          100 *
          (ChipperHourlyCost * RelevanceChippingIA +
            ChipperHourlyCost * RelevanceChippingIB +
            ChipperHourlyCost * RelevanceChippingIC +
            ChipperHourlyCost * RelevanceChippingID)) /
        (RelevanceChippingIA * VolPerPMHchippingIA +
          RelevanceChippingIB * VolPerPMHchippingIB +
          RelevanceChippingIC * VolPerPMHchippingIC +
          RelevanceChippingID * VolPerPMHchippingID)
      : 0;
  // GalChipWT
  const HorsepowerChipperS = 350;
  const HorsepowerChipperB = 700;
  const fcrChipper = 0.023;
  const WeightedGalPMH =
    HorsepowerChipperS * fcrChipper * (1 - intermediate.chipperSize) +
    HorsepowerChipperB * fcrChipper * intermediate.chipperSize;
  const GalChipWT = (WeightedGalPMH * CostChipWT) / ChipperHourlyCost;
  // II. Chain Flail DDC WT
  // A) adjusted from Chip Whole Trees
  const FlailProdAdjustmentIIA = 0.9;
  const FlailHrlyCostAdjustmentIIA = 1.1;
  const CostPerPMHchippingIIA = FlailHrlyCostAdjustmentIIA * ChipperHourlyCost;
  // need CostChipWT to calculate CostPerCCFchippingIIA
  const CostPerCCFchippingIIA = (FlailHrlyCostAdjustmentIIA / FlailProdAdjustmentIIA) * CostChipWT;
  const VolPerPMHchippingIIA = (100 * CostPerPMHchippingIIA) / CostPerCCFchippingIIA;
  const RelevanceChippingIIA = Math.max(
    RelevanceChippingIA,
    RelevanceChippingIB,
    RelevanceChippingIC
  );
  // result
  const CostDDChipWT =
    input.volumeCT > 0
      ? (intermediate.cHardwoodCT *
          100 *
          (CostPerPMHchippingIIA * RelevanceChippingIIA +
            ChipperHourlyCost * RelevanceChippingIIB)) /
        (RelevanceChippingIIA * VolPerPMHchippingIIA + RelevanceChippingIIB * VolPerPMHchippingIIB)
      : 0;
  // GalDDChipWT
  const GalDDChipWT = (WeightedGalPMH * CostDDChipWT) / ChipperHourlyCost;
  // III. Chip CTL Logs
  const CostChipCTL =
    input.volumeCT > 0
      ? (intermediate.cHardwoodCT *
          100 *
          (ChipperHourlyCost * RelevanceChippingIIIA +
            ChipperHourlyCost * RelevanceChippingIIIB +
            ChipperHourlyCost * RelevanceChippingIIIC)) /
        (RelevanceChippingIIIA * VolPerPMHchippingIIIA +
          RelevanceChippingIIIB * VolPerPMHchippingIIIB +
          RelevanceChippingIIIC * VolPerPMHchippingIIIC)
      : 0;
  // GalChipCTL
  const GalChipCTL = (WeightedGalPMH * CostChipCTL) / ChipperHourlyCost;
  // IV. Chip Piled Loose Residues at Landing
  const CostChipLooseRes =
    (CostPerPMHchippingIVA * RelevanceChippingIVA + CostPerPMHchippingIVA * RelevanceChippingIVB) /
    (RelevanceChippingIVA * GTperPMHchippingIVA + RelevanceChippingIVB * GTperPMHchippingIVB);
  // GalChipLooseRes
  const HorsepowerLoaderS = 120;
  const fcrLoader = 0.022;
  const WeightedGalPMH2 =
    HorsepowerChipperS * fcrChipper * (1 - intermediate.chipperSize) +
    HorsepowerChipperB * fcrChipper * intermediate.chipperSize +
    HorsepowerLoaderS * fcrLoader;
  const WeightedCostPMH2 =
    PMH_ChipperS * (1 - intermediate.chipperSize) +
    PMH_ChipperB * intermediate.chipperSize +
    PMH_LoaderS;
  const GalChipLooseRes = (WeightedGalPMH2 * CostChipLooseRes) / WeightedCostPMH2;
  // V. Chip Bundles of Residue at Landing
  const CostChipBundledRes =
    (CostPerPMHchippingIVA * RelevanceChippingVA + CostPerPMHchippingIVA * RelevanceChippingVB) /
    (RelevanceChippingVA * GTperPMHchippingVA + RelevanceChippingVB * GTperPMHchippingVB);
  // GalChipBundledRes
  const GalChipBundledRes = (WeightedGalPMH2 * CostChipBundledRes) / WeightedCostPMH2;

  const results = {
    CostChipWT: CostChipWT,
    CostDDChipWT: CostDDChipWT,
    CostChipCTL: CostChipCTL,
    CostChipLooseRes: CostChipLooseRes,
    CostChipBundledRes: CostChipBundledRes,
    GalChipWT: GalChipWT,
    GalDDChipWT: GalDDChipWT,
    GalChipCTL: GalChipCTL,
    GalChipLooseRes: GalChipLooseRes,
    GalChipBundledRes: GalChipBundledRes,
  };

  return results;
}

export { Chipping };
