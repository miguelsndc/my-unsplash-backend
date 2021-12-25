import express from 'express';
import 'express-async-errors';

import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { router } from './routes';
import { errorHandler } from './middlewares/error-handler';

config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(router);
app.use(errorHandler);

app.get('/', (_, res) => res.send('Running'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at port ${PORT}`);
});
