function InLimits(TreeVolCT: number, TreeVolSLT: number, TreeVolLLT: number,
                  TreeVolALT: number, TreeVol: number, Slope: number) {
// Mech WT
const MaxLLTperAcre = 0;
const MaxLLTasPercentALT = 0;
const ExceededMaxLLT = (MaxLLTperAcre === 0 && MaxLLTasPercentALT === 0) ? 0 : 1; // todo: else
const AvgTreeSizeLimit4Chipping = 80;
const AvgTreeSizeLimit4Processing = 80;
const AvgTreeSizeLimit4ManualFellLimbBuck = 250;
const AvgTreeSizeLimit4loading = 250;
const AvgTreeSize4GrappleSkidding = 250;
const ExceededMaxTreeVol
= (TreeVolCT > AvgTreeSizeLimit4Chipping || TreeVolSLT > AvgTreeSizeLimit4Processing
|| TreeVolLLT > AvgTreeSizeLimit4ManualFellLimbBuck || TreeVolALT > AvgTreeSizeLimit4loading
|| TreeVol > AvgTreeSize4GrappleSkidding) ? 1 : 0;
// Slope, %
const SkiddingLimit = 40; // Slope
const ExceededMaxSkidLimit = Slope > SkiddingLimit ? 1 : 0;
// Yarding distance, ft
const YardingDistLimit = 0;
const ExceededMaxYardingDist = YardingDistLimit === 0 ? 0 : 1; // todo: else
const InLimits1 = (ExceededMaxLLT === 1 || ExceededMaxTreeVol === 1
|| ExceededMaxSkidLimit === 1 || ExceededMaxYardingDist === 1) ? 0 : 1;

return InLimits1;
}

export { InLimits };
