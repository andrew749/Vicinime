var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
mongoose.connect('mongodb://localhost')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload',function(req,res){});
module.exports = router;
