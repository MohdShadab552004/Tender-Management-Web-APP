import express from 'express'
const app = express();
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors'
import cookieParser from 'cookie-parser';
import {connectDB} from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import companiesRoutes from './routes/companiesRoutes.js'
import tenderRoutes from './routes/tenderRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

//middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(cookieParser());

//routes
app.get('/',(req,res) => {
    res.send("hello");
})
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);
app.use('/companies',companiesRoutes);
app.use('/tender',tenderRoutes);
app.use('/application',applicationRoutes);

//connecting DB and start the server
connectDB();
const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log(`server is running PORT ${port}`);
})