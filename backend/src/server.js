import expresss from 'express';
import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import ratelimiter from './middleware/rateLimiter.js';

import cors from 'cors';

dotenv.config();


const app = expresss();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: "http://localhost:5173", // Allow requests from the frontend
}));

app.use(expresss.json());// Middleware to parse JSON bodies
app.use(ratelimiter);


app.use("/api/notes", notesRoutes);


connectDB().then(() => {
app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
    });
});

    