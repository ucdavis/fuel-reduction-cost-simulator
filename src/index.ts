import { FrcsInputs, MoveInInputs } from './systems/model';

import { calculate } from './systems/frcsrun';
import { calculateMoveIn } from './systems/movein';

export const runFrcs = (params: FrcsInputs) => {
  return calculate(params);
};

export const getMoveInCosts = (params: MoveInInputs) => {
  return calculateMoveIn(params);
};
