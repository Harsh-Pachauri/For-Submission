import express from "express";
import { createRoast, getRoasts } from "../controllers/RoastController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// POST /api/roasts
router.post("/", upload.single("image"), createRoast);

// GET /api/roasts
router.get("/", getRoasts);

// // PATCH /api/roasts/:id/upvote  → Toggle/Increment upvote
// router.patch("/:id/upvote", toggleUpvote);

export default router;
