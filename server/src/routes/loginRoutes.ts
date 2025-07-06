import express from "express";
import { loginOrCreateUser } from "../controllers/loginController.js";

const router = express.Router();

router.post("/", loginOrCreateUser);

export default router;
