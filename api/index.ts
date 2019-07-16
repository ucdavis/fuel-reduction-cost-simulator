import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { InputVarMod } from './systems/frcs.model';
import { calculate } from './systems/frcsrun';

// tslint:disable-next-line: no-var-requires
const swaggerDocument = require('../swagger.json');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded());

const port = 3000;

// api endpoint for running frcs
app.post('/frcsrun', async (req, res) => {
  const params: InputVarMod = req.body;
  console.log(req.body);
  const result = await calculate(params);
  console.log(result);
  res.status(200).json(result);
});

// serve public static files
app.use(express.static('public'));

// serve swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.redirect('/docs');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
