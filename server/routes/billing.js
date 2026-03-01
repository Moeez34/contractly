import { Router } from 'express';
import User from '../models/User.js';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import authenticate from '../middleware/auth.js';
import { PLAN_LIMITS } from '../middleware/planLimits.js';

const router = Router();

router.use(authenticate);

// Get billing status
router.get('/status', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
        const clientCount = await Client.countDocuments({ userId: req.user.id });

        // Reset count if billing cycle has passed
        const now = new Date();
        if (now >= user.billingCycleReset) {
            user.invoiceCount = 0;
            user.billingCycleReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            await user.save();
        }

        res.json({
            plan: user.plan,
            invoicesUsed: user.invoiceCount,
            invoicesLimit: limits.invoicesPerMonth,
            clientsUsed: clientCount,
            clientsLimit: limits.clients,
            billingCycleReset: user.billingCycleReset,
        });
    } catch (err) {
        console.error('Billing status error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
