import { z } from "zod";

export const signupSchema = z.object({
    username: z.string().min(2, {message: "Name must be at least 2 characters"}),
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(6,{message: "Password must be at least 6 characters"}),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const LoginSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(6,{message: "Password must be at least 6 characters"}),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
