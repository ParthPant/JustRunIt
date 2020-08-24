const express = require("express");
const bodyParser = require("body-parser");

const run = require("./controllers/run");
const cors = require("cors");

const app = express();
const port = 3000;
const router = express.Router();

const jsonParser = bodyParser.json();
const urlencodedParsed = bodyParser.urlencoded({ extended: false });

app.use(cors());

app.post("/run", jsonParser, run);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
