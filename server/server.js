import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import farmRouter from './routes/farmRoutes.js';
import mlRouter from './routes/mlRoutes.js';

const app = express();
const port = process.env.PORT || 3000;
connectDB();

// Security and Middleware
app.use(helmet());
app.set('trust proxy', 1); // Trust Azure's proxy for secure cookies

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173', // Local development
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.indexOf(origin) !== -1 ||
            origin.includes('localhost') ||
            process.env.NODE_ENV === 'development';

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// API Endpoints
app.get('/', (req, res) => {
    res.send('API working');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/farms', farmRouter);
app.use('/api/ai', mlRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});