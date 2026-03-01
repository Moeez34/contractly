import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
    description: { type: String, default: '' },
    quantity: { type: Number, default: 1 },
    rate: { type: Number, default: 0 },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    invoiceNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'overdue'],
        default: 'draft',
    },
    // From (sender)
    fromName: { type: String, default: '' },
    fromEmail: { type: String, default: '' },
    fromAddress: { type: String, default: '' },
    // To (client)
    toName: { type: String, default: '' },
    toEmail: { type: String, default: '' },
    toAddress: { type: String, default: '' },
    // Details
    invoiceDate: { type: String, default: '' },
    dueDate: { type: String, default: '' },
    currency: { type: String, default: 'USD' },
    // Line items
    items: [lineItemSchema],
    // Financials
    subtotal: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    // Notes
    notes: { type: String, default: '' },
    terms: { type: String, default: '' },
}, {
    timestamps: true,
});

export default mongoose.model('Invoice', invoiceSchema);
