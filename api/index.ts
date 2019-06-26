import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';

import { calculate } from './methods/frcs';
import { InputVarMod } from './methods/frcs.model';

dotenv.config();

const app = express();

app.use(bodyParser.json());

const port = 3000;

app.get('/frcsrun', async (req, res) => {
  const params: InputVarMod = req.body;
  console.log(req.body);
  const result = await calculate(params);
  console.log(result);
  res.json(result);
});

app.get('/', (req, res) => res.send('Hello World!!!'));

app.listen(port, () => console.log(`Listening on port ${port}!`));
