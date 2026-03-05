import express from 'express';
import pool from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from "express-rate-limit";
import userRoutes from './routes/user.route.js';
import cookieParser from 'cookie-parser';
dotenv.config()

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:`${process.env.FRONT_URI}`,
    credentials:true
}))

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use("/",userRoutes);

const PORT = process.env.PORT || 3000 ;

const start = async () => {
    try {
        const [rows] = await pool.query("select 1");
        console.log("DB connected success");

        app.listen(PORT, () => {
            console.log(`Server Started on port ${PORT}`);
        });
    }
    catch (e) {
        console.log(e);
    }
};

start();