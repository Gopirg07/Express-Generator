var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 res.send({
    Approved:10,
    Pending:5,
    Declined:3
 })
});

module.exports = router;
