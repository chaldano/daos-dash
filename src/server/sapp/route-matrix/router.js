const Router = require('express').Router;
const { listAction } = require('./controller');
const router = Router(); 

router.get('/', listAction);
console.log("Router-Matrix is exported");
module.exports = router;