import { Request, Response} from "express";
import { User, Token } from "../models/index";
import { signupSchema, LoginSchema } from "../utils/schema";
import { ApiError } from "../utils/ApiError";
import  jwt  from "jsonwebtoken";


// Signup User
export const signupUser = async (req:Request, res:Response): Promise<void> => {
    const result = signupSchema.safeParse(req.body);
    if(!result.success){
        throw new ApiError(400, result.error.issues[0].message);
    }
    const {username, email, password} = result.data;
    
    const existingUsername = await User.findOne({where: {username}});
    if(existingUsername){
        throw new ApiError(400, "Username already exists");
    }
    const existingEmail = await User.findOne({where: {email}});
    if(existingEmail){
        throw new ApiError(400, "Email already exists");
    }

    const user = await User.create({
        username,
        email,
        password,
        isActive: true,
        role: "User"
    });

     res.send({
        success: true,
        statusCode: 201,
        message: "User created successfully",
        data: user
    });
}

// Login User
// Req->data from body
// email and password
// find the user
// access token and refresh token
// send cookie

export const loginUser = async (req:Request, res:Response): Promise<void> => {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
        throw new ApiError(400, result.error.issues[0].message);
    }
    const {email, password} = result.data;

    const user = await User.findOne({where: {email}});

    if(!user){
        throw new ApiError(404, "User not found");
    }
     
    const isPasswordMatch = await user.validPassword(password);
    if(!isPasswordMatch){
        throw new ApiError(401, "Invalid password");
    }
    
    const accessToken = jwt.sign(
        {userId: user.id},
        process.env.ACCESS_TOKEN_SECRET as string,
        {expiresIn: "15m"}
    );

    const refreshToken = jwt.sign(
        {userId: user.id},
        process.env.REFRESH_TOKEN_SECRET as string,
        {expiresIn: "7d"}
    );

    await Token.create({
        userId: user.id,
        refreshToken
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.send({
        accessToken,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        message: "Login successful"
    });
}

export const logOutUser = async (req:Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        throw new ApiError(404, "Unauthorized");
    }

    const token = await Token.findOne({where: {refreshToken}});
    if(token){
        await token.destroy();
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.send({
        success: true,
        statusCode: 200,
        message: "Logged out successful"
    });
}

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    const username = req.params.username;
    const user = await User.findOne({where: {username}});
    if(!user){
        throw new ApiError(404, "User not found");
    }
    res.send({
        success: true,
        statusCode: 200,
        message: "User found",
        data: user
    });
}

export const updateProfile = async (req : Request, res: Response): Promise<void> => {
    const username = req.params.username;
    const user = await User.findOne({where: {username}});
    if(!user){
        throw new ApiError(404, "User not found");
    }    

    const { email, password} = req.body;

    if(email){

        const existingEmail = await User.findOne({where: {email}});
        if(existingEmail){
            throw new ApiError(400, "Email already exists");
        }

        user.email = email;
    }

    if (password) {
        user.password = password
    }
    await user.save();

    res.send({
        success: true,
        statusCode: 200,
        message: "User updated successfully",
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,   
        }
    })
}

export const getMe = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    const user = await User.findByPk(userId,{
        attributes: ["id", "username", "email", "role"]
    });

    if(!user){
        throw new ApiError(404, "User not found");
    }
    res.send({
        success: true,
        statusCode: 200,
        message: "User found",
        data: user
    });
}

export const issueNewTokens = async (req: Request, res: Response) =>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new ApiError(401, "Unauthorized");
    }

    // check if refresh token is exists in database
    const tokenInstance = await Token.findOne({where: {refreshToken}});
    if(!tokenInstance){
        throw new ApiError(403, "Invalid refresh token");
    }

    try{
        // verify the refresh token
        const payload = jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET as string
        ) as { userId: string };

        const user = await User.findByPk(payload.userId);
        if(!user){
            throw new ApiError(404, "User not found");
        }

        // Issue new tokens

        const newAccessToken = jwt.sign(
            {userId: user.id},
            process.env.ACCESS_TOKEN_SECRET as string,
            {expiresIn: "15m"}
        );

        const newRefreshToken = jwt.sign(
            {userId: user.id},
            process.env.REFRESH_TOKEN_SECRET as string,
            {expiresIn: "7d"}
        );

        // Update the refresh token in database
        tokenInstance.refreshToken = newRefreshToken;
        await tokenInstance.save();

        // Set the new refresh token in cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
         res.send({
            accessToken: newAccessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            message: "New tokens issued"
        });
    } catch (err) {
        throw new ApiError(403, "Invalid or expired refresh token");
    }
};







