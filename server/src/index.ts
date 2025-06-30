import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/db.ts";
import cookieParser from "cookie-parser";
import router from "./routes/auth.ts";
import passport from "passport";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true })); // Add client URL in the future instead of *
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', router);

app.get('/api/v1', (req, res) => {
  res.send('Hello There!');
});

// Connect to the database
sequelize.authenticate()
  .then( async () => {
    await sequelize.sync();
    console.log("Database connected successfully.");
    // Start server only after DB connection
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("Unable to connect to the database:", err);
  });