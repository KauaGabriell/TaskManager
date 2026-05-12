import type { Request, Response } from 'express';
import express from 'express';

const app = express();
app.use(express.json());

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`Servidor Rodando em: http://localhost:${PORT}`);
});

app.get('/health', (request: Request, reponse: Response) => {
  return reponse.json({ message: 'OK' });
});
