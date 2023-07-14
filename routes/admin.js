const express = require("express");
const router = express.Router();



const imageUpload = require("../helpers/image-upload");
const adminController = require('../controllers/admin');
const csrf = require("../middlewares/csrf");
const isAdmin = require("../middlewares/is-admin");
const isModerator = require("../middlewares/is-moderator");






router.get("/watch/delete/:watchid",isModerator,csrf, adminController.get_watch_delete );

router.post("/watch/delete/:watchid",isModerator, adminController.post_watch_delete);

// categories delete
router.get("/category/delete/:categoryid",isAdmin,csrf, adminController.get_category_delete);

router.post("/category/delete/:categoryid",isAdmin, adminController.post_category_delete);

router.get("/watch/create",isModerator,csrf, adminController.get_watch_create);

router.post("/categories/remove",isAdmin, adminController.get_category_remove);

router.post("/watch/create",isModerator, csrf, imageUpload.upload.single("sekil"), adminController.post_watch_create);

router.get("/category/create",isAdmin,csrf, adminController.get_category_create);

router.post("/category/create",isAdmin, adminController.post_category_create);

router.get("/watches/:watchid",isModerator,csrf, adminController.get_watch_edit);

router.post("/watches/:watchid",isModerator, imageUpload.upload.single("sekil"), adminController.post_watch_edit);

// categories edit
router.get("/categories/:categoryid",isAdmin,csrf, adminController.get_category_edit);

router.post("/categories/:categoryid",isAdmin, adminController.post_category_edit);

router.get("/watches", isModerator, adminController.get_watches);

router.get("/categories",isAdmin, adminController.get_categories);

router.get("/roles", isAdmin, adminController.get_roles);
router.get("/roles/:roleid", isAdmin, csrf, adminController.get_role_edit);
router.post("/roles/remove", isAdmin, adminController.roles_remove);
router.post("/roles/:roleid", isAdmin, adminController.post_role_edit);


router.get("/users", isAdmin, adminController.get_user);
router.get("/users/:userid", isAdmin, csrf, adminController.get_user_edit);
router.post("/users/:userid", isAdmin, adminController.post_user_edit);

module.exports = router;