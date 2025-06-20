import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);

export default router;
