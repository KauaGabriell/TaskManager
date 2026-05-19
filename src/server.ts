import type { Request, Response } from 'express';
import express from 'express';
import 'dotenv/config';
import { errorHandling } from './middlewares/errorHandling.js';
import { routes } from './routes/index.js';

const app = express();
app.use(express.json());

app.get('/health', (_request: Request, response: Response) => {
  return response.json({ message: 'API ONLINE' });
});

app.use(routes);
app.use(errorHandling);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor Rodando em: http://localhost:${PORT}`);
});
