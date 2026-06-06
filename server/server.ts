import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');


import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from './routes/authRoutes.js';
import socialAuthRouter from './routes/socialAuthRoutes.js';
import accountRouter from "./routes/accountRoutes.js";
import postRouter from './routes/PostRoutes.js';


const app = express();

const port = process.env.PORT || 5000;

const startServer = async () => {
    // database connection
    await connectDB();

    // Middleware
    app.use(cors());
    app.use(express.json());

    app.get('/', (_req: Request, res: Response) => {
        res.send('Server is Live!');
    });

    app.use("/api/auth", authRouter);
    app.use("/api/oauth", socialAuthRouter);
    app.use("/api/accounts", accountRouter);
    app.use("/api/posts", postRouter)

    // Global error handler
    app.use((err: any, _req: Request, _res: Response, _next: NextFunction) => {
        console.error(err);
        _res.status(500).send(err?.response?.data?.message || err?.message);
    });

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
});