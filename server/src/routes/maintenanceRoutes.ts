import { Router } from "express";
import * as maintenanceController from "../controllers/maintenanceController.js";

const router = Router();

router.post("/refresh", maintenanceController.refreshMaintenance);

router.post("/reset-sessions", maintenanceController.resetSessions);

export default router;
