import express from "express";
import * as wishlistController from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/", wishlistController.getWishlists);
router.get("/options", wishlistController.getWishlistOptions);

router.post("/", wishlistController.createWishlist);

router.patch("/reorder", wishlistController.reorderWishlists);
router.patch("/:wishlistId", wishlistController.updateWishlist);
router.patch("/items/move", wishlistController.moveItemsToWishlist);

router.delete("/", wishlistController.deleteWishlists);

export default router;
