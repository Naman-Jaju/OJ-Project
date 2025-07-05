// src/models/index.ts
import { sequelize } from '../config/db.js';
import User from './user';
import Token from './token';
import Problem from './problem';

// Define associations
User.hasMany(Token, { 
  foreignKey: 'userId',
  as: 'tokens'
});

Token.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

// Initialize associations
const models = { User, Token, Problem };

// Export models
export { User, Token, Problem, sequelize };
export default models;