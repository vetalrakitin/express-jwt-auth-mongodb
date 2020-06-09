const controller = require("../controllers/auth");
const express = require('express');
const router = express.Router();

router.post('/', controller.signin);

module.exports = router;