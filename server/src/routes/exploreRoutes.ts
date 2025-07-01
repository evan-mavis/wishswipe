import express from "express";
import * as exploreController from "../controllers/exploreController.js";

const router = express.Router();

router.get("/", exploreController.getEbayListings);

export default router;
