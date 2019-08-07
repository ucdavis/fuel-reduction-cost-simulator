// Outputs sheet - Limits part
import { InputVarMod, IntermediateVarMod, LimitMod } from '../frcs.model';

function InLimits(input: InputVarMod, intermediate: IntermediateVarMod) {
  const limit: LimitMod = {
    MaxLLTperAcre: 0,
    MaxLLTasPercentALT: 0,
    AvgTreeSizeLimit4Chipping: 0,
    AvgTreeSizeLimit4Processing: 0,
    AvgTreeSizeLimit4ManualFellLimbBuck: 0,
    AvgTreeSizeLimit4loading: 0,
    AvgTreeSize4GrappleSkidding: 0,
    SlopeLimit: 0,
    YardingDistLimit: 0
  };
  switch (input.System) {
    case 'Ground-Based Mech WT':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.AvgTreeSizeLimit4loading = 250;
      limit.AvgTreeSize4GrappleSkidding = 250;
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 0;
      break;
    case 'Ground-Based Manual WT':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 500;
      limit.AvgTreeSizeLimit4loading = 500;
      limit.AvgTreeSize4GrappleSkidding = 500;
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 0;
      break;
    case 'Ground-Based Manual Log':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSizeLimit4loading = 250;
      limit.AvgTreeSize4GrappleSkidding = 250;
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 0;
      break;
    case 'Ground-Based CTL':
      limit.MaxLLTperAcre = 10;
      limit.MaxLLTasPercentALT = 10;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 100;
      limit.AvgTreeSizeLimit4loading = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSize4GrappleSkidding = 9999; // assign a large number to indicate it has no upper limit
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 0;
      break;
    case 'Cable Manual WT/Log':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSizeLimit4loading = 250;
      limit.AvgTreeSize4GrappleSkidding = 250;
      limit.SlopeLimit = 100;
      limit.YardingDistLimit = 1300;
      break;
    case 'Cable Manual WT':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 500;
      limit.AvgTreeSizeLimit4loading = 500;
      limit.AvgTreeSize4GrappleSkidding = 500;
      limit.SlopeLimit = 100;
      limit.YardingDistLimit = 1300;
      break;
    case 'Cable Manual Log':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSizeLimit4loading = 250;
      limit.AvgTreeSize4GrappleSkidding = 250;
      limit.SlopeLimit = 100;
      limit.YardingDistLimit = 1300;
      break;
    case 'Cable CTL':
      limit.MaxLLTperAcre = 10;
      limit.MaxLLTasPercentALT = 10;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 100;
      limit.AvgTreeSizeLimit4loading = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSize4GrappleSkidding = 9999; // assign a large number to indicate it has no upper limit
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 1300;
      break;
    case 'Helicopter Manual WT':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSizeLimit4loading = 250;
      limit.AvgTreeSize4GrappleSkidding = 250;
      limit.SlopeLimit = 100;
      limit.YardingDistLimit = 10000;
      break;
    case 'Helicopter CTL':
      limit.MaxLLTperAcre = 10;
      limit.MaxLLTasPercentALT = 10;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 100;
      limit.AvgTreeSizeLimit4loading = 9999; // assign a large number to indicate it has no upper limit
      limit.AvgTreeSize4GrappleSkidding = 9999; // assign a large number to indicate it has no upper limit
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 10000;
      break;
  }
  const ExceededMaxLLT =
    limit.MaxLLTperAcre === 0 && limit.MaxLLTasPercentALT === 0
      ? 0
      : input.RemovalsLLT > limit.MaxLLTperAcre ||
        (100 * input.RemovalsLLT) /
          (intermediate.RemovalsALT > 0 ? intermediate.RemovalsALT : 1) >
          limit.MaxLLTasPercentALT
      ? 1
      : 0;
  const ExceededMaxTreeVol =
    input.TreeVolCT > limit.AvgTreeSizeLimit4Chipping ||
    input.TreeVolSLT > limit.AvgTreeSizeLimit4Processing ||
    input.TreeVolLLT > limit.AvgTreeSizeLimit4ManualFellLimbBuck ||
    intermediate.TreeVolALT > limit.AvgTreeSizeLimit4loading ||
    intermediate.TreeVol > limit.AvgTreeSize4GrappleSkidding
      ? 1
      : 0;
  // Slope, %
  const ExceededMaxSkidLimit = input.Slope > limit.SlopeLimit ? 1 : 0;
  // Yarding distance, ft
  const ExceededMaxYardingDist =
    limit.YardingDistLimit === 0
      ? 0
      : input.DeliverDist > limit.YardingDistLimit
      ? 1
      : 0;
  const InLimits1 =
    ExceededMaxLLT === 1 ||
    ExceededMaxTreeVol === 1 ||
    ExceededMaxSkidLimit === 1 ||
    ExceededMaxYardingDist === 1
      ? 0
      : 1;

  if (!InLimits1) {
    throw new Error('Invalid parameters supplied');
  }
  return InLimits1;
}

export { InLimits };
