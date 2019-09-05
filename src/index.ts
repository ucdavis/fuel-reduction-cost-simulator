import { InputVarMod } from './systems/frcs.model';

import { calculate } from './systems/frcsrun';

export const runFrcs = (params: InputVarMod) => {
  calculate(params);
};
