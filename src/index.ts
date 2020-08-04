import { InputVarMod, MoveInInputVarMod } from './systems/frcs.model';

import { calculate } from './systems/frcsrun';
import { calculateMoveIn } from './systems/movein';

export const runFrcs = (params: InputVarMod) => {
  return calculate(params);
};

export const getMoveInCosts = (params: MoveInInputVarMod) => {
  return calculateMoveIn(params);
};
