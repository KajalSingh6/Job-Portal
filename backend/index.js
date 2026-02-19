import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db.js';
import userRouter from './routes/userRoute.js';
import jobRouter from './routes/jobRoute.js';
import companyRouter from './routes/companyRoute.js';
import applicationRouter from './routes/applicationRoute.js';

const app = express();

connectDB();
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API ....
app.use('/api/user', userRouter);
app.use('/api/job', jobRouter);
app.use('/api/application', applicationRouter);
app.use('/api/company', companyRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});