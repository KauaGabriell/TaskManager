import type { Request, Response } from 'express';
import express from 'express';
import 'dotenv/config';

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor Rodando em: http://localhost:${PORT}`);
});

// biome-ignore lint/correctness/noUnusedFunctionParameters: <explanation>
app.get('/health', (request: Request, response: Response) => {
  return response.json({ message: 'API ONLINE' });
});
