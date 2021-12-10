import { FrcsInputs, MoveInInputs } from './model';

import { calculateMoveIn } from './movein';
import { calculateHarvestCostsUnlimit } from './runfrcs';

export const runFrcs = (params: FrcsInputs) => {
  return calculateHarvestCostsUnlimit(params);
};

export const getMoveInCosts = (params: MoveInInputs) => {
  return calculateMoveIn(params);
};
