import express from "express";
import * as wishlistItemController from "../controllers/wishlistItemController.js";

const router = express.Router();

router.post("/", wishlistItemController.addItemToWishlist);

router.delete("/", wishlistItemController.removeItemsFromWishlist);

export default router;
