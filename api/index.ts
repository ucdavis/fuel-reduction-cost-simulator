import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { InputVar, InputVarMod, SystemTypes } from './systems/frcs.model';
import { calculate } from './systems/frcsrun';

// tslint:disable-next-line: no-var-requires
const swaggerDocument = require('../swagger.json');

dotenv.config();

const app = express();

app.use(bodyParser.json());

const port = 3000;

// api endpoint for running frcs
app.post('/frcsrun', async (req, res) => {
  const params: InputVarMod = req.body;
  const message = createErrorMessages(params);
  if (message !== '') {
    res.status(400).send(message);
    return;
  }
  try {
    const result = await calculate(params);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send('ERROR: Invalid parameters supplied');
  }
});

// serve swagger docs
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Listening on port ${port}!`));

function createErrorMessages(params: InputVarMod) {
  const exampleObj = new InputVar();
  let message = '';
  const exampleDesc = Object.getOwnPropertyDescriptors(exampleObj);
  const paramDesc = Object.getOwnPropertyDescriptors(params);

  // check that each param exists (even if it is null)
  for (const key in exampleDesc) {
    if (!params.hasOwnProperty(key)) {
      message += 'missing param ' + key + '\n';
    }
  }

  // check that each param that exists has the correct type
  for (const key in paramDesc) {
    if (
      !key.includes('User') &&
      typeof paramDesc[key].value !== typeof exampleDesc[key].value
    ) {
      message += `wrong type for ${key} (should be ${typeof exampleDesc[key]
        .value}, was ${typeof paramDesc[key].value}) \n`;
    }
  }

  // check specific requirements
  if (params.System && !Object.values(SystemTypes).includes(params.System)) {
    message += 'unidentified System type\n';
  } else if (
    (params.System === SystemTypes.helicopterCtl ||
      params.System === SystemTypes.helicopterManualWt) &&
    params.Elevation < 0
  ) {
    message +=
      'elevation is required to be a valid number for the system you have selected\n';
  }

  return message;
}
