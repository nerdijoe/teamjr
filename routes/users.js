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
    if(!req.session.user.id_order) {
      db.Order.create({id_user: req.session.user.id, is_checkout: false, total: 0})
      .then ( order => {
        db.Detail.create({id_order:order.id, id_menu: menu_id, quantity: 1, notes: "" })
        .then ( detail => {
          req.session.user.id_order = order.id;
          var message = `Created order ${order.id} with menu ${menu_id}.`
          console.log(message);

          res.redirect('/?status=1');

        })
      })
    }
    else {
      // user already has id_order
      console.log(`req.session.id_order=${req.session.user.id_order} exists. Create detail now.`)
      db.Detail.create({id_order:req.session.user.id_order, id_menu: menu_id, quantity: 1, notes: "" })
      .then ( detail => {
        var message = `Created order ${req.session.user.id_order} with menu ${menu_id}.`
        console.log(message);

        res.redirect('/?status=1');


      })
    }

  }


})

router.get('/user_order', (req, res, next) => {

  if(!req.session.user) {
    res.render('./pages/login', { title: 'Login', user: undefined, message: "Please Login to order food.", error: '' });
  }
  else {
    // if id_order exists
    if(req.session.user.id_order) {
      console.log(`users/order`)
      console.log(req.session.user);


      // query based on the id_order
      db.Order.findById(req.session.user.id_order)
      .then ( order => {
        order.getMenus()
        .then ( menus => {

          function isExist(a, b) {
            if (a.id == b.id )
            return true;
          }

          // format the ordered menus
          let ordered_menus = [];
          menus.forEach( m => {

            let isFound = false;
            let i = 0;
            for ( ; i < ordered_menus.length ; i++ ) {
              if( ordered_menus[i].id == m.id) {
                isFound = true;
                break;
              }
            }

            if (isFound) {
              ordered_menus[i].quantity += 1;
            } else {
              let new_item = {};
              new_item.id = m.id;
              new_item.name = m.name;
              new_item.price = m.price;
              new_item.quantity = 1;
              ordered_menus.push(new_item);
            }


          })

          // calculate subtotal and total
          let order_total = 0;
          ordered_menus.forEach( o => {
            o.subtotal = o.price * o.quantity;
            order_total += o.subtotal;
          })

          // update order row
          db.Order.update({total: order_total}, {fields: ['total'], where: {id: req.session.user.id_order}})
          .then ( row => {

            console.log(`Updated order total`);
            req.session.user.order_total = order_total;
            res.render('./pages/order', { title: 'My Order',  user: req.session.user, message: "", error: "", menus: ordered_menus, order_total: order_total });

          })



        })
      })

    }
    // if id_order does not exists
    else {
      res.render('./pages/order', { title: 'My Order',  user: req.session.user, message: "You have not added any menu yet. Please add one.", error: "", menus: undefined, order_total: 0 });


    }


  }

})


module.exports = router;
