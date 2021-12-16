import { FrcsInputs, MoveInInputs } from './model';

import { calculateMoveIn } from './movein';
import { calculateFrcsOutputs } from './runfrcs';

export const getFrcsOutputs = (params: FrcsInputs) => {
  return calculateFrcsOutputs(params);
};

export const getMoveInOutputs = (params: MoveInInputs) => {
  return calculateMoveIn(params);
};
