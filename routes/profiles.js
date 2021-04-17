import express from "express";
import multer from "multer";
const router = express.Router();

import {
  getProfiles,
  getProfileDetail,
  createProfile,
  updateProfile,
  deleteProfile
} from "../controllers/profile.js";
import auth from "../middleware/auth.js";

const storage = multer.memoryStorage();

router.get("/", getProfiles);
router.get("/:id", getProfileDetail);
router.post("/createProfile", auth, createProfile);
router.patch("/updateProfile/:id", auth, updateProfile);
router.delete("/deleteProfile/:id", auth, deleteProfile);

export default router;
