var express = require('express');
var router = express.Router();
const db = require('../models')

router.get('/new', (req, res , next) => {
  res.render('./menus/new', { title: 'Create New Menu',  user: req.session.user, message: "", error: "" })
})

router.post('/new', (req, res, next) => {
  var name = req.body.name;
  var price = req.body.price;

  db.Menu.create(({name: name, price: price}))
  .then ( menu => {
    let message = `Menu ${menu.name} with price=${menu.price} has been created.`;
    console.log(message);
    res.render('./pages/home', { title: 'Home',  user: req.session.user, message: message, error: "" })    
  })

})

module.exports = router;
