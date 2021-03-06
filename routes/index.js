var express = require('express');
var router = express.Router();
const db = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {

  // query for menu
  db.Menu.findAll()
  .then ( menus => {

    let msg = "";
    console.log(req.query.status);
    if(req.query.status) {
      if(req.query.status == "1")
        msg = "Your item has been added to your order.";
    }

    res.render('./pages/index', { title: 'JR Food',  user: req.session.user, message: msg, error: "", menus: menus });

  })

});

//middleware to authenticate user, before going to the home page
function checkSignIn(req, res, next){
    if(req.session.user){
        next();     //If session exists, proceed to page
    } else {
        // var err = new Error("Not logged in!");
        // console.log(req.session.user);
        // next(err);  //Error, trying to access unauthorized page!

        // do not throw error, instead render to login page
        res.render('./pages/login', { title: 'Login', user: req.session.user, message: ``, error: 'You need to login to access this page.' });
    }
}


router.get('/home', checkSignIn, (req, res, next) => {
  res.render('./pages/home', {title: "Home", user: req.session.user, message: "", error: ""})

})



module.exports = router;
