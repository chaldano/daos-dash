const Router = require('express').Router;
const { listAction } = require('./controller');
const router = Router(); 

router.get('/', listAction);

module.exports = router;