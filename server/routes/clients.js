import { Router } from 'express';
import Client from '../models/Client.js';
import authenticate from '../middleware/auth.js';
import { checkClientLimit } from '../middleware/planLimits.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create client (with plan limit check)
router.post('/', checkClientLimit, async (req, res) => {
    try {
        const { name, email, address } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Client name is required' });
        }
        const client = await Client.create({
            userId: req.user.id,
            name,
            email: email || '',
            address: address || '',
        });
        res.status(201).json({ client });
    } catch (err) {
        console.error('Create client error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// List user's clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ clients });
    } catch (err) {
        console.error('List clients error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update client
router.put('/:id', async (req, res) => {
    try {
        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json({ client });
    } catch (err) {
        console.error('Update client error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete client
router.delete('/:id', async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json({ message: 'Client deleted' });
    } catch (err) {
        console.error('Delete client error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
