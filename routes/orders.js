var express = require('express');
var router = express.Router();
const db = require('../models');

router.get("/checkout", (req, res, next) => {
  let msg = "You have successfully checkout your order. Thank you! Come Again!";
  res.render('./pages/order_checkout', { title: 'Checkout',  user: req.session.user, message: msg, error: "" });
})

module.exports = router;
