import express from "express";
import * as exploreController from "../controllers/exploreController.js";

const router = express.Router();

router.get("/", exploreController.getListings);
router.get("/ebay-listings", exploreController.getEbayListings);

export default router;
