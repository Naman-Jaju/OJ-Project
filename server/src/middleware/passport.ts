import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GitHubStrategy,  Profile as GitHubProfile } from 'passport-github2';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, } from "passport-google-oauth20"
import User from "../models/user";
import { ApiError } from "../utils/ApiError";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET as string,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.userId);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// using github

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: process.env.GITHUB_CALLBACK_URL as string,
    scope: ['user:email']
}, async (accessToken:string, refreshToken: string, profile:GitHubProfile, done:any) => {
    try{
      let email = profile.emails && profile.emails[0].value;
      if(!email){
        return done(new ApiError(400, "No email found in GitHub profile"), false);
      }

      let user = await User.findOne({where: {email}});
      if(!user){
        user = await User.create({
          username: profile.username ?? email.split('@')[0],
          email,
          isActive: true,
          password: Math.random().toString(36).slice(-8), // Not used, just for schema
          role: "User",
        });
      }
      return done(null,user);
    }
    catch (err){
      return done(err, false);
    }
}))

// using google 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      scope: ['profile','email']
    },
    async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: any) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new ApiError(400, "No email found in Google profile"), false);
        }

        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create({
            username: profile.displayName ?? email.split('@')[0],
            email,
            password: Math.random().toString(36).slice(-8), // Not used, just for schema
            role: "User",
            isActive: true,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;