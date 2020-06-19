import express from "express";

import UserController from "../controller/UserController";

const router = express.Router();

router.get("/users/", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);

router.post("/users/", UserController.signup);

router.put("/users/:id", UserController.updateUser);

router.delete("/users/:id", UserController.deleteUser);

module.exports = router;
