// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import registrationRoutes from './routes/registrationRoutes';
// import reminderRoutes from './routes/reminderRoutes';
import categoryRoutes from './routes/categoryRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
// app.use('/api/reminders', reminderRoutes);
app.use('/api/categories', categoryRoutes);

// Root
app.get('/', (_req, res) => {
    res.send('Event Planner API is running');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
