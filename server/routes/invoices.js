import { Router } from 'express';
import Invoice from '../models/Invoice.js';
import authenticate from '../middleware/auth.js';
import { checkInvoiceLimit } from '../middleware/planLimits.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create invoice (with plan limit check)
router.post('/', checkInvoiceLimit, async (req, res) => {
    try {
        const invoice = await Invoice.create({
            ...req.body,
            userId: req.user.id,
        });

        // Increment user's invoice count
        if (req.planUser) {
            req.planUser.invoiceCount += 1;
            await req.planUser.save();
        }

        res.status(201).json({ invoice });
    } catch (err) {
        console.error('Create invoice error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// List user's invoices (optional ?status=draft filter)
router.get('/', async (req, res) => {
    try {
        const filter = { userId: req.user.id };
        if (req.query.status) {
            filter.status = req.query.status;
        }
        const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
        res.json({ invoices });
    } catch (err) {
        console.error('List invoices error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single invoice
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json({ invoice });
    } catch (err) {
        console.error('Get invoice error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update invoice
router.put('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json({ invoice });
    } catch (err) {
        console.error('Update invoice error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update invoice status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['draft', 'sent', 'paid', 'overdue'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { status },
            { new: true }
        );
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json({ invoice });
    } catch (err) {
        console.error('Update status error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json({ message: 'Invoice deleted' });
    } catch (err) {
        console.error('Delete invoice error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
