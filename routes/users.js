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

router.post('/login', (req, res, next) => {

  db.User.findOne({where: {username: req.body.username, password: req.body.password}})
  .then( user => {

    if (user) {
      console.log(`find user ${user.username}`);
      //set session
      req.session.user = user;
      res.redirect('/home');
    }
    else {
      // res.redirect('/');
      res.render('./pages/login', { title: 'Login', user: req.session.user, message: ``, error: 'Invalid Username or Password.' });
    }

  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy( () => {
    console.log("user logged out.")
  })
  // res.redirect('/');
  // res.render('./pages/index', { title: 'JR Food',  user: undefined, message: "You have logged out.", error: "" });

  res.render('./pages/login', { title: 'Login', user: undefined, message: "You have logged out.", error: '' });


})


router.post('/order', (req, res, next) => {
  var menu_id = req.body.menu_id;
  console.log(`user order menu_id = ${menu_id}`)

  // create order
  console.log(req.session.user);



  // user needs to login first
  if(!req.session.user) {
    res.render('./pages/login', { title: 'Login', user: undefined, message: "Please Login to order food.", error: '' });
  }
  else {
    console.log(req.session.user);
    // res.redirect('/');

    //if user has NOT created order, create order
    if(!req.session.id_order) {
      db.Order.create({id_user: req.session.user.id, is_checkout: false, total: 0})
      .then ( order => {
        db.Detail.create({id_order:order.id, id_menu: menu_id, quantity: 1, notes: "" })
        .then ( menu => {
          var message = `Created order ${order.id} with menu ${menu_id}.`
          console.log(message);

          res.redirect('/');

        })
      })
    }
    else {
      console.log(`req.session.id_order=${req.session.id_order} exists. Create detail now.`)
      db.Detail.create({id_order:req.session.id_order, id_menu: menu_id, quantity: 1, notes: "" })
      .then ( menu => {
        var message = `Created order ${order.id} with menu ${menu_id}.`
        console.log(message);

        res.redirect('/');
      })
    }

  }


})


module.exports = router;
