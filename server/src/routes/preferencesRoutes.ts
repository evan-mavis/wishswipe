import express from "express";
import * as preferencesController from "../controllers/preferencesController.js";

const router = express.Router();

router.get("/", preferencesController.getUserPreferences);

router.patch("/", preferencesController.upsertUserPreferences);

export default router;
