const express = require("express");
const router = express.Router();

const userController = require('../controllers/user');






router.get('/watches/category/:slug', userController.wacth_list);


router.get('/watches/:slug', userController.watches_details);

router.get('/watches', userController.wacth_list);

router.get('/', userController.index);



module.exports = router;


