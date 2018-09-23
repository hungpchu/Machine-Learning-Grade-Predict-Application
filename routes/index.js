// express 
var express = require('express');
// expose function call router to get acces to router object in Express

// get the express function which is Router 
var router = express.Router();




/* GET home page. */
// (1st argument) '/' = root of the site or the home page.
// (2nd argument) = route handler with (request object, response object, next handler)
// no need to use req and next here 
router.get('/', function(req, res, next) {

  // name title for all page to be Express 
  // 1st argue: render the index view, which is defined in views > index.jade.
  // 
console.log("req.body.name = ",req.body.name);
  res.render('index', { title: 'Your Future You' });

  

});

// return router object -> the constructor model
module.exports = router;
