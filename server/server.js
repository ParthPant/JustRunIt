const express = require("express");
const bodyParser = require("body-parser");

const run = require("./controllers/run");
const cors = require("cors");

const app = express();
const port = 3000;

const jsonParser = bodyParser.json();

app.use(cors());

app.post("/run", jsonParser, run);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
