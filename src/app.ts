import type { Request, Response } from "express";
import express from "express";
import { errorHandling } from "./middlewares/errorHandling.js";
import { routes } from "./routes/index.js";

const app = express();

app.use(express.json());

app.get("/health", (_request: Request, response: Response) => {
  return response.json({ message: "API ONLINE" });
});

app.use(routes);
app.use(errorHandling);

export { app };
