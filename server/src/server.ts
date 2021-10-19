import express from 'express';
import cors from 'cors';

import { router } from "./controllers/run";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("JustRuntIt end points");
});

app.post("/run", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
