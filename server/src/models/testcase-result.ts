import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";


interface TestcaseResultAttributes {
  id: string;
  submissionId: string;
  testcaseId: string;
  passed: boolean;
  runtime: number;
  memory: number;
}

interface TestcaseResultCreationAttributes extends Optional<TestcaseResultAttributes, "id"> {}

class TestcaseResult extends Model<TestcaseResultAttributes, TestcaseResultCreationAttributes> implements TestcaseResultAttributes
{
  public id!: string;
  public submissionId!: string;
  public testcaseId!: string;
  public passed!: boolean;
  public runtime!: number;
  public memory!: number;
}

TestcaseResult.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    submissionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    testcaseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    passed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    runtime: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    memory: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "testcase_results",
    modelName: "TestcaseResult",
  }
);


export default TestcaseResult;