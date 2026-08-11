// backend/middleware/authMiddleware.ts       
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface to include the user payload
export interface AuthRequest extends Request {
  user?: any;
}

// backend/middleware/authMiddleware.ts
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  
  const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  // 👇 ADD THESE TWO LOGS
  console.log("🛠️ TOKEN RECEIVED:", token.substring(0, 20) + "..."); 
  console.log("🔑 SECRET USED:", JWT_SECRET);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // 👇 ADD THIS LOG TO SEE THE EXACT ERROR
      console.log("❌ JWT ERROR:", err.message);
      res.status(403).json({ error: 'Invalid or expired token.' });
      return;
    }
    req.user = user as any;
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Check if the user object exists and the role is ADMIN
  // Note: Adjust 'ADMIN' to 'admin' if your database saved it as lowercase during seeding
  if (req.user && req.user.role.toUpperCase() === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};