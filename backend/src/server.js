import express, { json } from 'express';
import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import ratelimiter from './middleware/rateLimiter.js';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: "http://localhost:5173", // Allow requests from the frontend
}));

app.use(express.json());// Middleware to parse JSON bodies
app.use(ratelimiter);


app.use("/api/notes", notesRoutes);


app.post('/api/questions', async(req,res) =>{
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({apiKey:OPENAI_API_KEY})

    const aiModel = "gpt-3.5-turbo"

    const note = req.body.note;
    if(!note) return res.status(400).json({error:'NO content'}); //檢查筆記內容是否為空
    const messages = [
    { /*prompt*/
        role: "system",
        content: `You are a quiz master. Generate exactly 3 single-choice questions based on the note content.
        Rules: 1.Each question should show the English word as the question.
               2.Choose only ONE correct Chinese meaning from the word's meanings as the answer.
               3.Provide 3 incorrect Chinese options,either from other words or made-up.
               4.Shuffle the 4 options order.

        Format the output as:
         Question 1: [英文單字]
        A. [中文選項1]
        B. [中文選項2]
        C. [中文選項3]
        D. [中文選項4]
        Answer: [正確選項字母]

         Do not add extra explanation or text.`
    },
    { /*筆記內容*/
        role: "user",
        content: note
    }
    ];

    
    try{
        const completion = await openai.chat.completions.create({
        model:aiModel,
        messages
        });

    const aiResponse = completion.choices[0].message.content;

    res.json({ questions: aiResponse });
    } catch(error){
        console.error(error);
        res.status(500).json({error:'伺服器錯誤'});
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port ', PORT);
    });
});

