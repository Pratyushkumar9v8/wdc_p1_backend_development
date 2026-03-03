import type {Request, Response, NextFunction} from "express";
import  httpStatus  from "http-status";
import  jwt  from "jsonwebtoken";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction)=>{
    const token = req.cookies.token || null;
    if(!token){
        return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid Token"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    }
    catch (e) {
        return res.redirect('/login');
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Token" });
    }
};

// export const isLoggedIn = (req:Request, res:Response, next:NextFunction) => {
//     // console.log(req.originalUrl);
//         if(!req.isAuthenticated()){
//             req.session.redirectUrl = req.originalUrl; // redirect to the page the user was trying to access
//             // console.log(req.session.redirectUrl);
//             req.flash('error', 'You must be logged in!');
//             return res.redirect('/user/login');
//         }
//    next();
// };