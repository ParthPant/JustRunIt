const express = require('express')
const bodyParser = require('body-parser')

const run = require('./controllers/run')
const cors = require('cors')

const app = express()
const port = 3000
const router = express.Router()

const jsonParser = bodyParser.json()
const urlencodedParsed =  bodyParser.urlencoded({extended: false})

app.use(cors())
//app.use(function (req, res, next) {
//res.setHeader('Access-Control-Allow-Origin', '*');
//res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//res.setHeader('Access-Control-Allow-Credentials', true);
//next();
//});

app.post('/run',jsonParser, run)

app.listen (port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
