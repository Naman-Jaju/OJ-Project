import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.ts';

interface ProblemAttributes {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  timeLimit: number;
  memoryLimit: number;
  acceptedSubmissions: number;
  totalSubmissions: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProblemCreationAttributes extends Optional<ProblemAttributes, 'id' | 'acceptedSubmissions' | 'totalSubmissions' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Problem extends Model<ProblemAttributes, ProblemCreationAttributes> implements ProblemAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public difficulty!: 'easy' | 'medium' | 'hard';
  public tags!: string[];
  public examples!: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  public constraints!: string[];
  public timeLimit!: number;
  public memoryLimit!: number;
  public acceptedSubmissions!: number;
  public totalSubmissions!: number;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Problem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    examples: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    constraints: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: [],
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 10,
      },
    },
    memoryLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 256,
      validate: {
        min: 64,
        max: 1024,
      },
    },
    acceptedSubmissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    totalSubmissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Problem',
    tableName: 'problems',
    timestamps: true,
    indexes: [
      {
        fields: ['difficulty'],
      },
      {
        fields: ['tags'],
        using: 'gin',
      },
      {
        fields: ['isActive'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

export default Problem;