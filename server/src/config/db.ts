// Configure postgreSQL using sequelize
import { Sequelize } from "sequelize";
import  dotenv  from "dotenv";

dotenv.config();

const database_url = process.env.DATABASE_URL;

if (!database_url) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sequelize = new Sequelize(database_url,{
    dialect: "postgres",
    dialectOptions: {},
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});
