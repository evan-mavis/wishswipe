import express from "express";
import { loginOrCreateUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginOrCreateUser);

export default router;
