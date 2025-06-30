import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.ts';
import User from './user.model.ts'

interface TokenAttributes {
  id: string;
  userId: string;
  refreshToken: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TokenCreationAttributes extends Optional<TokenAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Token extends Model<TokenAttributes, TokenCreationAttributes> implements TokenAttributes {
  public id!: string;
  public userId!: string;
  public refreshToken!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Token.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
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
    tableName: 'tokens',
    modelName: 'Token',
  }
);

export default Token;