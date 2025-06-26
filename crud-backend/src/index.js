
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/auth.js';


console.log('--- Environment Variables Check ---');
console.log('PG_USER:', process.env.PG_USER);
console.log('PG_HOST:', process.env.PG_HOST);
console.log('PG_DATABASE:', process.env.PG_DATABASE);
console.log('PG_PASSWORD:', process.env.PG_PASSWORD ? '******' : 'NOT SET'); 
console.log('PG_PORT:', process.env.PG_PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '******' : 'NOT SET');
console.log('--- End Environment Variables Check ---');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use('/api', userRoutes);
app.use('/api', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('CRUD Backend API is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});