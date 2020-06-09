const express = require('express');
const router = express.Router();

const { verify } = require('../middlewares/auth/jwt');

const authRouter = require("./auth");
const restrictedAreaRouter = require("./restricted-area");

router.use('/auth', authRouter);
router.use('/restricted-area', verify,  restrictedAreaRouter)

module.exports = router;