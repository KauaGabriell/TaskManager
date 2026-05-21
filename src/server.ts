import 'dotenv/config';
import { app } from './app.js';
import { env } from './configs/env.js';

const PORT = Number(env.PORT);

app.listen(PORT, () => {
  console.log(`Servidor Rodando em: http://localhost:${PORT}`);
});
