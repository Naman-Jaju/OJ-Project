import express, { Router } from "express";
import { signupUser, loginUser } from "../controllers/auth.ts";

const router:Router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

export default router;