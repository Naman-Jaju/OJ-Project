// src/config/db.ts (or db.js)

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false, // optional
});

sequelize.authenticate()
  .then(() => console.log("Connected to NeonDB! 🚀"))
  .catch(err => console.error("Connection error: ", err));