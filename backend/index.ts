// backend/index.ts
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { authenticateToken, AuthRequest } from './middleware/authMiddleware';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
dotenv.config();



const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Essential for parsing req.body in your controllers
// 🚦 ADD THIS LOGGER MIDDLEWARE
app.use((req, res, next) => {
  console.log(`[TRAFFIC] ${req.method} request to: ${req.url}`);
  next();
});
// Mount the authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Medicare App Backend is running!');
});

app.get('/api/profile', authenticateToken, (req: AuthRequest, res) => {
  // req.user is available here because the middleware verified the token!
  res.json({ 
    message: 'Welcome to your private profile', 
    user: req.user 
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});