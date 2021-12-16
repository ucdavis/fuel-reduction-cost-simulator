import bodyParser from 'body-parser';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { FrcsInputs, MoveInInputs } from './model';
import { calculateMoveIn } from './movein';
import { calculateFrcsOutputs } from './runfrcs';

// tslint:disable-next-line: no-var-requires
const swaggerDocument = require('../swagger.json');

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// api endpoint for getting frcs outputs
app.post('/frcs', async (req, res) => {
  const params: FrcsInputs = req.body;
  try {
    const result = await calculateFrcsOutputs(params);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
});

// api endpoint for getting move-in outputs
app.post('/movein', async (req, res) => {
  const params: MoveInInputs = req.body;
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
