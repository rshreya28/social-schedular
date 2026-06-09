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
import activityRouter from './routes/activityRoutes.js';
import { initScheduler } from './services/schedulerService.js';

const app = express();
const port = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();


    app.use(cors({
    origin: function(origin, callback) {
        const allowed = ["http://localhost:3000", "http://127.0.0.1:3000"];
        if(!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    app.get('/', (_req: Request, res: Response) => {
        res.send('Server is Live!');
    });

    app.use("/api/auth", authRouter);
    app.use("/api/oauth", socialAuthRouter);
    app.use("/api/accounts", accountRouter);
    app.use("/api/posts", postRouter);
    app.use("/api/activity", activityRouter);

    // 404 handler
    app.use((_req: Request, res: Response) => {
        res.status(404).json({ message: "Route not found" });
    });

    // Global error handler
    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
        console.error(err);
        res.status(500).json({
            message: err?.response?.data?.message || err?.message || "Internal server error"
        });
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        initScheduler();
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
});