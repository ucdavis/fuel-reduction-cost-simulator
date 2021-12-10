import { FrcsInputs, MoveInInputs } from './model';

import { calculate } from './frcsrun';
import { calculateMoveIn } from './movein';

export const runFrcs = (params: FrcsInputs) => {
  return calculate(params);
};

export const getMoveInCosts = (params: MoveInInputs) => {
  return calculateMoveIn(params);
};
