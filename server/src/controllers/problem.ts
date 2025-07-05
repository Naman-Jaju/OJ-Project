import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Problem from '../models/problem';

interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  difficulty?: string;
  tags?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const getProblems = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      search = '',
      difficulty,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 items per page
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {
      isActive: true,
    };

    // Search by title or ID
    if (search) {
      whereClause[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          id: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    // Filter by difficulty
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      whereClause.difficulty = difficulty;
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      whereClause.tags = {
        [Op.overlap]: tagArray,
      };
    }

    // Validate sortBy field
    const allowedSortFields = ['createdAt', 'title', 'difficulty', 'acceptedSubmissions', 'totalSubmissions'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const { count, rows: problems } = await Problem.findAndCountAll({
      where: whereClause,
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset,
      attributes: [
        'id',
        'title',
        'difficulty',
        'tags',
        'timeLimit',
        'memoryLimit',
        'acceptedSubmissions',
        'totalSubmissions',
        'createdAt',
      ],
    });

    const totalPages = Math.ceil(count / limitNum);

    res.json({
      success: true,
      data: {
        problems,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: count,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error:  error,
    });
  }
};

export const getProblemById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({
      where: {
        id,
        isActive: true,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    res.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

export const createProblem = async (req: Request, res: Response) => {
  try {
    const problemData = req.body;

    const problem = await Problem.create(problemData);

    res.status(201).json({
      success: true,
      data: problem,
      message: 'Problem created successfully',
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

export const updateProblem = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [updatedRowsCount] = await Problem.update(updateData, {
      where: { id },
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    const updatedProblem = await Problem.findByPk(id);

    res.json({
      success: true,
      data: updatedProblem,
      message: 'Problem updated successfully',
    });
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

export const deleteProblem = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete by setting isActive to false
    const [updatedRowsCount] = await Problem.update(
      { isActive: false },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    res.json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error:  error,
    });
  }
};