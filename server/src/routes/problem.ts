import { Router } from 'express';
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/problem';

const problemRouter = Router();

// GET /api/problems - Get all problems with pagination and filtering
problemRouter.get('/', getProblems);

// GET /api/problems/:id - Get a specific problem by ID
problemRouter.get('/:id', getProblemById);

// POST /api/problems - Create a new problem (admin only)
problemRouter.post('/', createProblem);

// PUT /api/problems/:id - Update a problem (admin only)
problemRouter.put('/:id', updateProblem);

// DELETE /api/problems/:id - Delete a problem (admin only)
problemRouter.delete('/:id', deleteProblem);

export default problemRouter;