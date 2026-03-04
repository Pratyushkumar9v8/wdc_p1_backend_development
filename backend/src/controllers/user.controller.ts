import {createUser, findUserByEmail, deleteUserById, updateUserById, findUserById} from '../repositories/user.repository.js'
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Please Provide email ans Password!" });
    }
    try {
        let user = await findUserByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let isCorrectPass = await bcrypt.compare(password, user.password);

        if (isCorrectPass) {
            const token = jwt.sign({email:user.email }, process.env.JWT_SECRET as string, {expiresIn: '7d' });
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie("token", token, {
                httpOnly: true, 
                secure: isProduction, // Only secure in production
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 7*24*60*60*1000
            });
            
            // Return user data without password
            const { password: _, ...userWithoutPassword } = user;
            return res.status(httpStatus.OK).json({ 
                message: "Login Successful",
                user: userWithoutPassword
            });
        }
        else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Password is incorrect" });
        }
    }
    catch (e) {
        return res.status(500).json({ message: `Something went wrong during Login! ${e}` });
    }
};

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Name, email and password required" });
    } 

    try {
        let isUniqueEmail = await findUserByEmail( email );
        if (!isUniqueEmail) {
            let hashPassword = await bcrypt.hash(password, 10);
            let id = await createUser({
                    name: name,
                    email: email,
                    password: hashPassword,
                    contact :'',
                    bio:''
                });
            return res.status(httpStatus.CREATED).json({
                message: "User Created",
                user: id
            });
        }
        else {
            return res.status(403).json({ message: "This email already exits!" });
        }
    }
    catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Internal Server Error ${e}` });
    }
};

export const deleteUser = async (req:Request, res:Response) =>{
    const { id } = req.params || {};
    
    if (!id) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "User ID required" });
    }

    try{
        let result = await deleteUserById(Number(id));
        if (result === 0) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }
        return res.status(httpStatus.OK).json({ message: "User deleted successfully" });
    }
    catch(e){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Internal Server Error ${e}` });
    }
};

export const updateUser = async (req:Request, res:Response) =>{
    const {name,bio,contact} = req.body || {};
    const { id } = req.params || {};
    
    if (!id) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "User ID required" });
    }

    if (!name) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Name is required" });
    }

    try{
        const result = await updateUserById(Number(id),name,bio,contact);
        if (result === 0) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }
        return res.status(httpStatus.OK).json({ message: "User Updated successfully" });
    }
    catch(e){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Internal Server Error ${e}` });
    }
};  

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userEmail = (req as any).user?.email;
        if (!userEmail) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const user = await findUserByEmail(userEmail);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        return res.status(httpStatus.OK).json({ user: userWithoutPassword });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Internal Server Error ${e}` });
    }
};