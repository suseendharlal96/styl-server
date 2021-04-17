import express from "express";
import multer from "multer";
const router = express.Router();

import { signin, signup, signupWithoutFile } from "../controllers/user.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/signin", signin);
router.post("/signup", upload.single("file"), signup);
router.post("/signupWithoutFile", signupWithoutFile);

export default router;
