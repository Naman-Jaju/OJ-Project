import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

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
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'tokens',
    modelName: 'Token',
    timestamps: true,
  }
);

export default Token;