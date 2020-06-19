import express from "express";

import AuthController from "../controller/AuthController";

const router = express.Router();

router.post("/login", AuthController.login);

router.get("/protected", AuthController.protected);

module.exports = router;
