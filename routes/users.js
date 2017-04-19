var express = require('express');
var router = express.Router();
const db = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/new', (req, res, next) => {
  res.render('./pages/new', {title: "Sign Up", user: req.session.user, message: ``, error: ``});
})

router.post('/new', (req, res, next) => {
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var role = req.body.role;

  db.User.create({name: name, username: username, email: email, password: password, role: role})
  .then ( user => {
    console.log(`created user ${user.username}.`);
    res.render('./pages/login', {title: "Login", user: req.session.user, message: `You have registered as ${user.username}, please login.`, error: ``});

    // check for duplicate user --> user findOrCreate

  })
})

router.get('/login', (req, res, next) => {
  res.render('./pages/login', {title: "Login", user: req.session.user, message: "", error: ""})
})



module.exports = router;
