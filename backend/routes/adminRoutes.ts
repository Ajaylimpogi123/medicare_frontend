// backend/routes/adminRoutes.ts
import { Router } from 'express';
import { createStaffUser } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Route: POST /api/admin/create-staff
// Protected by token verification AND admin role check
router.post('/create-staff', authenticateToken, requireAdmin, createStaffUser);

export default router;