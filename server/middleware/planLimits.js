import User from '../models/User.js';

const PLAN_LIMITS = {
    free: { invoicesPerMonth: 5, clients: 3 },
    pro: { invoicesPerMonth: Infinity, clients: Infinity },
};

export const checkInvoiceLimit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;

        // Reset count if billing cycle has passed
        const now = new Date();
        if (now >= user.billingCycleReset) {
            user.invoiceCount = 0;
            user.billingCycleReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            await user.save();
        }

        if (user.invoiceCount >= limits.invoicesPerMonth) {
            return res.status(403).json({
                error: 'Invoice limit reached',
                message: `Free plan allows ${limits.invoicesPerMonth} invoices/month. Upgrade to Pro for unlimited invoices.`,
                limit: limits.invoicesPerMonth,
                used: user.invoiceCount,
                plan: user.plan,
            });
        }

        req.planUser = user;
        next();
    } catch (err) {
        console.error('Plan check error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const checkClientLimit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;

        const { default: Client } = await import('../models/Client.js');
        const clientCount = await Client.countDocuments({ userId: req.user.id });

        if (clientCount >= limits.clients) {
            return res.status(403).json({
                error: 'Client limit reached',
                message: `Free plan allows ${limits.clients} clients. Upgrade to Pro for unlimited clients.`,
                limit: limits.clients,
                used: clientCount,
                plan: user.plan,
            });
        }

        next();
    } catch (err) {
        console.error('Plan check error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export { PLAN_LIMITS };
