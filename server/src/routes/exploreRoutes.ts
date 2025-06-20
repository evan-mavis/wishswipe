import express from "express";
import * as exploreController from "../controllers/exploreController.js";

const router = express.Router();

router.get("/", exploreController.getListings);

export default router;
