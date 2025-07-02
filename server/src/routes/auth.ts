import express, { Router } from "express";
import { signupUser, loginUser } from "../controllers/auth.ts";
import passport from "passport";
import dotenv from "dotenv";
import "../middleware/passport.ts"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.ts";

dotenv.config();

const router:Router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

//console.log(passport._strategies);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);


router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  function(req, res) {
    const user = req.user;
    if (!user) {
      // Handle the case where user is undefined
      console.error('User is not defined');
      res.status(401).send('Unauthorized');
      return;
    }
    console.log("✅ Google login successful");
    console.log("Logged in user:", user);

    const rawUser = user.toJSON();

    if (!rawUser.email) {
      console.error('User missing email:', rawUser);
      return res.status(400).send('Invalid user data');
    }

    const token = jwt.sign(
      {
        id: rawUser.id,
        email: rawUser.email,
        name: rawUser.username,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1h' }
    );
    // Successful authentication, redirect to your frontend
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  }
);

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub callback
router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);
export default router;