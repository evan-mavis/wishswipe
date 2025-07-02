import express from "express";
import * as wishlistController from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/", wishlistController.getWishlists);

router.post("/", wishlistController.createWishlist);

router.patch("/:wishlistId", wishlistController.updateWishlist);
router.patch("/reorder", wishlistController.reorderWishlists);

router.delete("/", wishlistController.deleteWishlists);

export default router;
