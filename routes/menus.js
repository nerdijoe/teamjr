var express = require('express');
var router = express.Router();
const db = require('../models')


router.get('/', (req, res, next) => {

  db.Menu.findAll()
  .then ( menus => {
    res.render('./menus/list', {title: 'Menu List', user: req.session.user, message: "", error: "", menus: menus})
  })

})


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

    // res.render('./pages/home', { title: 'Home',  user: req.session.user, message: message, error: "" })

    res.redirect('/menus');

  })

})


router.get('/edit/:id', (req, res, next) => {
  var menu_id = req.params.id;

  db.Menu.findById(menu_id)
  .then ( menu => {
    res.render('./menus/edit', {title: 'Edit Menu', user: req.session.user, message: "", error: "", menu: menu})

  })

})


router.post('/edit/:id', (req, res, next) => {
  var menu_id = req.params.id;
  var name = req.body.name;
  var price = req.body.price;

  db.Menu.update({name: name, price: price}, { fields: ['name', 'price'], where: {id: menu_id}})
  .then ( row => {
    console.log(`Menu ${menu_id} has been updated.`)
    res.redirect('/menus');
  })

})

router.get('/delete/:id', (req, res, next) => {
  var menu_id = req.params.id;

  db.Menu.destroy({where: {id: menu_id}})
  .then ( row => {
    console.log(`Deleted menu ${menu_id}.`)
    res.redirect('/menus');
  })

})



module.exports = router;
