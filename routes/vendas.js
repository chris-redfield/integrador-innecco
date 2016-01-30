var express = require('express');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    // req = request
    //res = response
    res.send('Hello World!');
  })
  .post(function(req, res) {
  });

module.exports = router;
