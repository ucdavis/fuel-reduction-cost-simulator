import { InputVarMod } from './systems/frcs.model';

import { calculate } from './systems/frcsrun';

exports.runFrcs = (params: InputVarMod) => {
  calculate(params);
};
