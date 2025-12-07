var express = require('express');
var router = express.Router();

var userController = require('../controllers/users');
var authController = require('../controllers/auth');

router.get('/', userController.getAll);
router.post('/', userController.create);

router.param('id', userController.userByID);

router.get('/:id', userController.getUser);
console.log(userController);
router.put('/:id', authController.requireSign, userController.hasAuthorization, userController.update);

router.delete('/:id', authController.requireSign, userController.hasAuthorization, userController.remove);

router.put('/setadmin/:id',authController.logtoken, authController.requireSign, userController.setAdmin);

module.exports = router;