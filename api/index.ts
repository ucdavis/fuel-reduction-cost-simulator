import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { InputVarMod } from './systems/frcs.model';
import { calculate } from './systems/frcsrun';

// tslint:disable-next-line: no-var-requires
const swaggerDocument = require('./swagger.json');

dotenv.config();

const app = express();

app.use(bodyParser.json());

const port = 3000;

app.get('/frcsrun', async (req, res) => {
  const params: InputVarMod = req.body;
  console.log(req.body);
  const result = await calculate(params);
  console.log(result);
  res.status(200).json(result);
  res.status(400).send('Invalid parameters supplied');
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Listening on port ${port}!`));
