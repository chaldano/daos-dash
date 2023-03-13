const Router = require('express').Router;
const { listAction } = require('./controller');
const router = Router(); 

router.get('/', listAction);
console.log("Router-Matric-CC is exported");

module.exports = router;