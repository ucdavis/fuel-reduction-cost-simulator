// Outputs sheet - Limits part
import { Limit } from './frcs.model';

function InLimits(system: string, TreeVolCT: number, TreeVolSLT: number, TreeVolLLT: number,
                  TreeVolALT: number, TreeVol: number, Slope: number, RemovalsLLT: number, RemovalsALT: number) {
    const limit: Limit = { MaxLLTperAcre: 0, MaxLLTasPercentALT: 0, AvgTreeSizeLimit4Chipping: 0,
                           AvgTreeSizeLimit4Processing: 0, AvgTreeSizeLimit4ManualFellLimbBuck: 0,
                           AvgTreeSizeLimit4loading: 0, AvgTreeSize4GrappleSkidding: 0, SlopeLimit: 0,
                           YardingDistLimit: 0 };
    switch (system) {
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
    }
    const ExceededMaxLLT = (limit.MaxLLTperAcre === 0 && limit.MaxLLTasPercentALT === 0) ? 0
        : ((RemovalsLLT > limit.MaxLLTperAcre
            || 100 * RemovalsLLT / (RemovalsALT > 0 ? RemovalsALT : 1) > limit.MaxLLTasPercentALT)
            ? 1 : 0);
    const ExceededMaxTreeVol
    = (TreeVolCT > limit.AvgTreeSizeLimit4Chipping || TreeVolSLT > limit.AvgTreeSizeLimit4Processing
    || TreeVolLLT > limit.AvgTreeSizeLimit4ManualFellLimbBuck || TreeVolALT > limit.AvgTreeSizeLimit4loading
    || TreeVol > limit.AvgTreeSize4GrappleSkidding) ? 1 : 0;
    // Slope, %
    const ExceededMaxSkidLimit = Slope > limit.SlopeLimit ? 1 : 0;
    // Yarding distance, ft
    const ExceededMaxYardingDist = limit.YardingDistLimit === 0 ? 0 : 1; // todo: else
    const InLimits1 = (ExceededMaxLLT === 1 || ExceededMaxTreeVol === 1
    || ExceededMaxSkidLimit === 1 || ExceededMaxYardingDist === 1) ? 0 : 1;

    return InLimits1;
}

export { InLimits };
