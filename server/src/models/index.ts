// src/models/index.ts
import { sequelize } from '../config/db';
import User from './user';
import Token from './token';
import Problem from './problem';
import TestCase from './testcase';
import Submission from './submission';
import TestcaseResult from './testcase-result';

// Define associations
User.hasMany(Token, { 
  foreignKey: 'userId',
  as: 'tokens'
});

Token.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

Problem.hasMany(TestCase, {
  foreignKey: 'problemId',
  as: 'testcases'
});
TestCase.belongsTo(Problem, {
  foreignKey: 'problemId',
  as: 'problem'
});

User.hasMany(Submission, { 
  foreignKey: "userId", 
  as: "submissions" 
});
Submission.belongsTo(User, { 
  foreignKey: "userId", 
  as: "user" 
});
Problem.hasMany(Submission, { 
  foreignKey: "problemId", 
  as: "submissions" 
});
Submission.belongsTo(Problem, { 
  foreignKey: "problemId", 
  as: "problem" 
});

Submission.hasMany(TestcaseResult, {
  foreignKey: "submissionId",
  as: "testcaseResults",
});
TestcaseResult.belongsTo(Submission, {
  foreignKey: "submissionId",
  as: "submission",
});
TestCase.hasMany(TestcaseResult, {
  foreignKey: "testcaseId",
  as: "testcaseResults",
});
TestcaseResult.belongsTo(TestCase, {
  foreignKey: "testcaseId",
  as: "testcase",
});

User.hasMany(Problem, {
  foreignKey: 'createdBy',
  as: 'createdProblems', // user.getCreatedProblems()
});

// Each Problem belongs to a User who created it
Problem.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator', // problem.getCreator()
});

// Initialize associations
const models = { User, Token, Problem, TestCase, Submission, TestcaseResult };

// Export models
export { User, Token, Problem, TestCase, Submission, TestcaseResult, sequelize };
export default models;