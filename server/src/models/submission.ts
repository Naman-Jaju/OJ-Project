import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface SubmissionAttributes {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: "Pending" | "Running" | "Completed" | "Failed";
  verdict:
    | "Accepted"
    | "Wrong Answer"
    | "Time Limit Exceeded"
    | "Memory Limit Exceeded"
    | "Segmentation Fault"
    | "Runtime Error"
    | "Compilation Error"
    | "Internal Error"
    | "Unknown";
  createdAt?: Date;
  updatedAt?: Date;
}

interface SubmissionCreationAttributes extends Optional<SubmissionAttributes, "id" | "createdAt" | "updatedAt"> {}

class Submission extends Model<SubmissionAttributes, SubmissionCreationAttributes>  implements SubmissionAttributes
{
  public id!: string;
  public userId!: string;
  public problemId!: string;
  public code!: string;
  public language!: string;
  public status!: "Pending" | "Running" | "Completed" | "Failed";
  public verdict!:
    | "Accepted"
    | "Wrong Answer"
    | "Time Limit Exceeded"
    | "Memory Limit Exceeded"
    | "Segmentation Fault"
    | "Runtime Error"
    | "Compilation Error"
    | "Internal Error"
    | "Unknown";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Submission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    problemId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Running", "Completed", "Failed"),
      allowNull: false,
    },
    verdict: {
      type: DataTypes.ENUM(
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Segmentation Fault",
        "Runtime Error",
        "Compilation Error",
        "Internal Error",
        "Unknown"
      ),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "submissions",
    modelName: "Submission",
  }
);



export default Submission;