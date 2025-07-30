import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import Problem from '../models/problem';
import { ApiError} from '../utils/ApiError';
import { ApiErrorResponse, ApiResponse } from '../utils/ApiResponse';
import { any } from 'zod';

// Get all problems 
export const getProblems = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const { difficulty, page = 1, limit = 10 } = req.query;
    const where: {difficulty?: string} = {};

    if(difficulty && ["Easy", "Medium", "Hard"].includes(difficulty as string)) {
        where.difficulty = difficulty as string;
    }

    const offset = (Number(page) - 1) * Number(limit);
    
    // The database query
     const { rows, count } = await Problem.findAndCountAll({
      where,                                  // Apply filters
      offset,                                 // Apply pagination offset
      limit: Number(limit),                   // Apply pagination limit
      order: [["createdAt", "DESC"]],         // Order results, newest first
      attributes: { exclude: ["description", "examples", "constraints"] },
     });

     // send the success response data

    const responseData = {
      problems: rows,
      currentPage: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
      totalProblems: count,
    };
    new ApiResponse(200, "Problems fetched successfully", responseData).send(res);
  }
  catch(error: any){
    console.log("Error in getProblems", error);
    new ApiErrorResponse(500, "Failed to fetch problems", [error.message]).send(res);
  }
}

// get problems by id

export const getProblemById = async (req: Request, res: Response) => {
  try{
    const { id } =  req.params;
    const problem = await Problem.findByPk(id);

    if(!problem){
      throw new ApiError(404, "Problem not found");
    }

    new ApiResponse(200, "Problem fetched successfully", problem).send(res);
  }catch(error: any){
    console.log("Error in getProblemById", error);
    new ApiErrorResponse(500, "Failed to fetch problem", [error.message]).send(res);
  }
}


// ADMIN FUNCTIONS

// create problem
export const createProblem = async (req: Request, res: Response) => {
  try {
    const { title, description, difficulty, tags, examples, constraints, timeLimit, memoryLimit} = req.body;
    if(
      !title ||
      !description ||
      !difficulty ||
      !Array.isArray(tags) ||
      !Array.isArray(examples) || examples.length == 0 ||
      !Array.isArray(constraints) || constraints.length == 0 
    ){
      new ApiErrorResponse(400, "Missing required fields. Ensure title, description, difficulty, tags, examples, and constraints are provided.").send(res); 
    }

    if(!["Easy", "Medium", "Hard"].includes(difficulty)){
      new ApiErrorResponse(400, "Invalid difficulty. Difficulty must be 'Easy', 'Medium', or 'Hard'.").send(res);
    }

    const areExamplesValid = examples.every((ex: {input: string, output: string}) => ex.input && ex.output);
    if(!areExamplesValid){
      new ApiErrorResponse(400, "Invalid examples format. Each object in the 'examples' array must have 'input' and 'output' properties.").send(res);
    }
    const userId = (req as any).user.id;
    
    const problem = await Problem.create({ 
      title, 
      description, 
      difficulty, 
      tags, 
      examples, 
      constraints, 
      timeLimit, 
      memoryLimit ,
      createdBy: userId
    });

    new ApiResponse(201, "Problem created successfully", problem).send(res);
  } catch (error: any) {
    console.log("Error in createProblem", error);
    new ApiErrorResponse(500, "Failed to create problem", [error.message]).send(res);
  }
}

// update problem

export const updateProblem = async (req: Request, res: Response) => {
  try{
    const { id } = req.params;
    const { title, description, difficulty, tags, examples, constraints, timeLimit, memoryLimit } = req.body;
    const problem = await Problem.findByPk(id);

    if(!problem){
      throw new ApiError(404, "Problem not found");
    }
    // {* TODO: add validations *}
    if(problem){
      await problem.update({
        title: title ?? problem.title,
        description: description ?? problem.description,
        difficulty: difficulty ?? problem.difficulty,
        tags: tags ?? problem.tags,
        examples: examples ?? problem.examples,
        constraints: constraints ?? problem.constraints,
        timeLimit: timeLimit ?? problem.timeLimit,
        memoryLimit: memoryLimit ?? problem.memoryLimit
      });
    }
    new ApiResponse(200, "Problem updated successfully", problem).send(res);
  } catch(error : any){
    console.log("Error in updateProblem", error);
    new ApiErrorResponse(500, "Failed to update problem", [error.message]).send(res);
  }
}

// delete problem

export const deleteProblem = async (req: Request, res: Response) => {
  try{
    const { id } = req.params;
    const problem = await Problem.findByPk(id);
    if(!problem){
      throw new ApiError(404, "Problem not found");
    }

    await problem.destroy();
    new ApiResponse(200, "Problem deleted successfully", problem).send(res);
  } catch( error: any){
    console.log("Error in deleteProblem", error);
    new ApiErrorResponse(500, "Failed to delete problem", [error.message]).send(res);
  }
}
