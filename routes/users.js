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

router.get('/profile',(req,res,next) => {
  res.render('./pages/profile',{title: "Profile", user: req.session.user, message: ``, error: ``});

})

router.post('/profile/edit',(req,res,next) => {

  db.User.update({name:req.body.name,email:req.body.email,phone:req.body.phone},{where:{username:req.session.user.username}})
  .then (user =>{
    req.session.user.name=req.body.name;
    req.session.user.email=req.body.email;
    req.session.user.body=req.body.body;
    console.log(user);
    res.redirect('/home');
  })
  .catch(err =>{
    res.send(err)
  })
})

router.get('/list',(req,res,next) => {
  db.User.findAll()
  .then (users =>{
    res.render('./pages/list',{title: "List",users,user: req.session.user, message: ``, error: ``});
  })
  .catch(err =>{
    res.send(err)
  })

})


router.get('/list/edit/:id',(req,res,next) => {

  var user_id = req.params.id

  db.User.findById(user_id).
  then (user => {
    res.render('./pages/edit_user', {title:"Edit User",user: user});
  })
})


router.post('/list/edit/:id',(req,res,next) => {

  db.User.update({name:req.body.name,email:req.body.email,phone:req.body.phone},{where:{id:req.params.id}})
  .then (user =>{
    console.log(user);
    res.redirect('/users/list',{title: "List",users,user: req.session.user, message: ``, error: ``});
  })
  .catch(err =>{
    res.send(err)
  })
})

router.get('/list/delete/:id', (req, res, next) => {

  var id = req.params.id
  db.User.destroy({where: {id: id}})
  .then ( (user) => {
      if(user === 1)
          res.redirect('/users/list');
      })

  .catch ( err => {
      console.log(err.message);
  })
});


router.get('/logout', (req, res, next) => {
  req.session.destroy( () => {
    console.log("user logged out.")
  })
  // res.redirect('/');
  res.render('./pages/index', { title: 'JR Food',  user: undefined, message: "You have logged out.", error: "" });

})



module.exports = router;
