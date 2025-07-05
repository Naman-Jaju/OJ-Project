import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import bcrypt from 'bcryptjs';

// Define the attributes for the User model
interface UserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  role: 'Admin' | 'User';
  createdAt?: Date;
  updatedAt?: Date;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public isActive!: boolean;
  public role!: 'Admin' | 'User';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to check password
  public async validPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.ENUM('Admin', 'User'),
      allowNull: false,
      defaultValue: 'User',
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);


export default User;