import { FrcsInputs, MoveInInputs } from './model';

import { calculateMoveIn } from './movein';
import { calculateHarvestCosts } from './runfrcs';

export const runFrcs = (params: FrcsInputs) => {
  return calculateHarvestCosts(params);
};

export const getMoveInOutputs = (params: MoveInInputs) => {
  return calculateMoveIn(params);
};
