import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/db";
import cookieParser from "cookie-parser";
import router from "./routes/auth";
import passport from "passport";
import problemRouter from "./routes/problem";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Add client URL in the future instead of *
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', router);
app.use('/api/problems', problemRouter);

app.get('/api/v1', (req, res) => {
  res.send('Hello There!');
});

// Connect to the database
// sequelize.authenticate()
//   .then( async () => {
//     await sequelize.sync();
//     console.log("Database connected successfully.");
//     console.log("Seeding problems...");
//     // Start server only after DB connection
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   })
//   .catch((err: Error) => {
//     console.error("Unable to connect to the database:", err);
//   });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});