import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');


import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from './routes/authRoutes.js';
import socialAuthRouter from './routes/socialAuthRoutes.js';



const app = express();

// database connection 
await connectDB()

// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is Live!');
});


app.use("/api/auth",authRouter)
app.use("/api/oauth", socialAuthRouter)


// Global error handler
app.use((err: any, _req:Request, _res:Response,_next:NextFunction)=>
{
    console.error(err);
    _res.status(500).send(err?.response?.data?.message || err?.message)
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});