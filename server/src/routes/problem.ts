import express, { Router } from "express";
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
} from "../controllers/problem";
import { authenticateJWT } from "../middleware/auth.middleware";

const problemRouter: Router = express.Router();

problemRouter.get("/", getProblems);
problemRouter.get("/:id", getProblemById);
problemRouter.post("/", authenticateJWT, createProblem);


export default problemRouter;