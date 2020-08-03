import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { InputVarMod, MoveInInputVarMod } from './systems/frcs.model';
import { calculate } from './systems/frcsrun';
import { calculateMoveIn } from './systems/movein';

// tslint:disable-next-line: no-var-requires
const swaggerDocument = require('../swagger.json');

dotenv.config();

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// api endpoint for running frcs
app.post('/frcsrun', async (req, res) => {
  const params: InputVarMod = req.body;
  try {
    const result = await calculate(params);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
});

// api endpoint for calculating move-in costs
app.post('/movein', async (req, res) => {
  const params: MoveInInputVarMod = req.body;
  try {
    const result = await calculateMoveIn(params);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
});

// serve swagger docs
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Listening on port ${port}!`));
