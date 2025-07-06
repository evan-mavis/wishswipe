import express from "express";
import * as preferencesController from "../controllers/preferencesController.js";

const router = express.Router();

router.get("/", preferencesController.getUserPreferences);

router.patch("/", preferencesController.upsertUserPreferences);

router.delete("/", preferencesController.deleteUserPreferences);

export default router;
