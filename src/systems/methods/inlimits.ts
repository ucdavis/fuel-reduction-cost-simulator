// Outputs sheet - Limits part
import { InputVarMod, LimitMod } from '../frcs.model';

function InLimits(input: InputVarMod) {
  const limit: LimitMod = {
    MaxLLTperAcre: 0,
    MaxLLTasPercentALT: 0,
    AvgTreeSizeLimit4Chipping: 0,
    AvgTreeSizeLimit4Processing: 0,
    AvgTreeSizeLimit4ManualFellLimbBuck: 0,
    AvgTreeSizeLimit4loading: 0,
    AvgTreeSize4GrappleSkidding: 0,
    SlopeLimit: 0,
    YardingDistLimit: 0,
  };
  switch (input.System) {
    case 'Ground-Based Mech WT':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 0;
      break;
    case 'Ground-Based Manual WT':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 0;
      break;
    case 'Ground-Based Manual Log':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 0;
      break;
    case 'Ground-Based CTL':
      limit.MaxLLTperAcre = 10;
      limit.MaxLLTasPercentALT = 10;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 0;
      break;
    case 'Cable Manual WT/Log':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.SlopeLimit = 100;
      limit.YardingDistLimit = 1300;
      break;
    case 'Cable Manual WT':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.SlopeLimit = 100;
      limit.YardingDistLimit = 1300;
      break;
    case 'Cable Manual Log':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.SlopeLimit = 100;
      limit.YardingDistLimit = 1300;
      break;
    case 'Cable CTL':
      limit.MaxLLTperAcre = 10;
      limit.MaxLLTasPercentALT = 10;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 1300;
      break;
    case 'Helicopter Manual Log':
      limit.MaxLLTperAcre = 0;
      limit.MaxLLTasPercentALT = 0;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.SlopeLimit = 100;
      limit.YardingDistLimit = 10000;
      break;
    case 'Helicopter CTL':
      limit.MaxLLTperAcre = 10;
      limit.MaxLLTasPercentALT = 10;
      limit.AvgTreeSizeLimit4Chipping = 80;
      limit.AvgTreeSizeLimit4Processing = 80;
      limit.AvgTreeSizeLimit4ManualFellLimbBuck = 250;
      limit.SlopeLimit = 40;
      limit.YardingDistLimit = 10000;
      break;
  }
  const RemovalsALT = input.RemovalsSLT + input.RemovalsLLT;

  const ExceededMaxLLT =
    limit.MaxLLTperAcre === 0 && limit.MaxLLTasPercentALT === 0
      ? 0
      : input.RemovalsLLT > limit.MaxLLTperAcre ||
        (100 * input.RemovalsLLT) / (RemovalsALT > 0 ? RemovalsALT : 1) >
          limit.MaxLLTasPercentALT
      ? 1
      : 0;
  const ExceededMaxTreeVol =
    input.TreeVolCT > limit.AvgTreeSizeLimit4Chipping ||
    input.TreeVolSLT > limit.AvgTreeSizeLimit4Processing ||
    input.TreeVolLLT > limit.AvgTreeSizeLimit4ManualFellLimbBuck
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
    let err = '';
    if (ExceededMaxLLT === 1) {
      if (input.RemovalsLLT > limit.MaxLLTperAcre) {
        err += `RemovalsLLT should not be greater than ${limit.MaxLLTperAcre}\n`;
      } else if (
        (100 * input.RemovalsLLT) / RemovalsALT >
        limit.MaxLLTasPercentALT
      ) {
        err +=
          `The ratio of RemovalsLLT and RemovalsALT should not be greater than ${limit.MaxLLTperAcre}%.\n
        Explanation:
        RemovalsLLT / RemovalsALT = ${input.RemovalsLLT} / ${RemovalsALT} = ` +
          `${Math.floor((input.RemovalsLLT / RemovalsALT) * 100)}%
        RemovalsALT = RemovalsSLT + RemovalsLLT = ${RemovalsALT}
        `;
      }
    }
    if (ExceededMaxTreeVol === 1) {
      if (input.TreeVolCT > limit.AvgTreeSizeLimit4Chipping) {
        err += `TreeVolCT should not be greater than ${limit.AvgTreeSizeLimit4Chipping}\n`;
      } else if (input.TreeVolSLT > limit.AvgTreeSizeLimit4Processing) {
        err += `TreeVolSLT should not be greater than ${limit.AvgTreeSizeLimit4Processing}\n`;
      } else {
        // input.TreeVolLLT > limit.AvgTreeSizeLimit4ManualFellLimbBuck
        err += `TreeVolLLT should not be greater than ${limit.AvgTreeSizeLimit4ManualFellLimbBuck}\n`;
      }
    }
    if (ExceededMaxSkidLimit === 1) {
      err += `Slope should not be greater than ${limit.SlopeLimit}\n`;
    }
    if (ExceededMaxYardingDist === 1) {
      err += `DeliverDist should not be greater than ${limit.YardingDistLimit}\n`;
    }
    return err;
  } else {
    return '';
  }
}

export { InLimits };
