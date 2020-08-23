const express = require('express')
const router = express.Router()

router.use(function timeLog(req, res, next){
  console.log('Time:',Date.now())
  next()
})

router.post('/run', function(req, res){
  console.log(req.body)
  res.send('hello')
})

module.exports = router
