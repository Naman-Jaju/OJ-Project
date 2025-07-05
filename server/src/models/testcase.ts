import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from '../config/db';

interface TestCaseAttributes {
    id: string;
    problemId: string;
    input: string;
    output: string;
    isSample: boolean;
}

interface TestCaseCreationAttributes extends Optional<TestCaseAttributes, 'id'> {}

class TestCase extends Model<TestCaseAttributes, TestCaseCreationAttributes> implements TestCaseAttributes {
    public id!: string;
    public problemId!: string;
    public input!: string;
    public output!: string;
    public isSample!: boolean;
}

TestCase.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        }, 
        problemId:{
            type: DataTypes.UUID,
            allowNull: false,
        },
        input: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        output: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isSample: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'testcases',
        modelName: 'TestCase',
        timestamps: true,
    }
);

export default TestCase;