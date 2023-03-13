const Router = require('express').Router;
const { listAction } = require('./controller');
const router = Router(); 

router.get('/', listAction);
console.log("Router-SFRClasses is exported");

module.exports = router;