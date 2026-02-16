import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateInvoice.css';

const CreateInvoice = () => {
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState({
        fromName: 'moeez',
        fromEmail: 'moeez@example.com',
        fromAddress: '',
        toName: '',
        toEmail: '',
        toAddress: '',
        invoiceNumber: `INV-${String(Date.now()).slice(-6)}`,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        currency: 'USD',
        notes: '',
        terms: 'Payment is due within 30 days of invoice date.',
        taxRate: 0,
        discount: 0,
    });

    const [items, setItems] = useState([
        { description: '', quantity: 1, rate: 0 },
    ]);

    const updateInvoice = (field, value) => {
        setInvoice((prev) => ({ ...prev, [field]: value }));
    };

    const updateItem = (index, field, value) => {
        setItems((prev) => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };
            return newItems;
        });
    };

    const addItem = () => {
        setItems((prev) => [...prev, { description: '', quantity: 1, rate: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount - invoice.discount;

    const handlePreview = () => {
        const invoiceData = {
            ...invoice,
            items,
            subtotal,
            taxAmount,
            total,
        };
        localStorage.setItem('invoicePreview', JSON.stringify(invoiceData));
        navigate('/preview');
    };

    return (
        <div className="create-invoice">
            <div className="create-invoice-header">
                <div>
                    <h1>Create Invoice</h1>
                    <p>Fill in the details below to generate your invoice</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                        Back
                    </button>
                </div>
            </div>

            <div className="invoice-form">
                {/* From / To Row */}
                <div className="form-row">
                    <div className="form-section">
                        <div className="form-section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            From (Your Details)
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={invoice.fromName} onChange={(e) => updateInvoice('fromName', e.target.value)} placeholder="Your name" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={invoice.fromEmail} onChange={(e) => updateInvoice('fromEmail', e.target.value)} placeholder="your@email.com" />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea value={invoice.fromAddress} onChange={(e) => updateInvoice('fromAddress', e.target.value)} placeholder="Street, City, Country" rows={2} />
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            Bill To (Client)
                        </div>
                        <div className="form-group">
                            <label>Client Name</label>
                            <input type="text" value={invoice.toName} onChange={(e) => updateInvoice('toName', e.target.value)} placeholder="Client name" />
                        </div>
                        <div className="form-group">
                            <label>Client Email</label>
                            <input type="email" value={invoice.toEmail} onChange={(e) => updateInvoice('toEmail', e.target.value)} placeholder="client@email.com" />
                        </div>
                        <div className="form-group">
                            <label>Client Address</label>
                            <textarea value={invoice.toAddress} onChange={(e) => updateInvoice('toAddress', e.target.value)} placeholder="Street, City, Country" rows={2} />
                        </div>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="form-section">
                    <div className="form-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        Invoice Details
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Invoice Number</label>
                            <input type="text" value={invoice.invoiceNumber} onChange={(e) => updateInvoice('invoiceNumber', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Currency</label>
                            <select value={invoice.currency} onChange={(e) => updateInvoice('currency', e.target.value)}>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="CAD">CAD ($)</option>
                                <option value="AUD">AUD ($)</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Invoice Date</label>
                            <input type="date" value={invoice.invoiceDate} onChange={(e) => updateInvoice('invoiceDate', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" value={invoice.dueDate} onChange={(e) => updateInvoice('dueDate', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="form-section line-items-section">
                    <div className="form-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                        Line Items
                    </div>
                    <table className="line-items-table">
                        <thead>
                            <tr>
                                <th style={{ width: '45%' }}>Description</th>
                                <th style={{ width: '15%' }}>Qty</th>
                                <th style={{ width: '20%' }}>Rate</th>
                                <th style={{ width: '15%' }}>Amount</th>
                                <th style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                            placeholder="Service description"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.rate}
                                            onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="amount-cell">
                                        {getCurrencySymbol(invoice.currency)}{(item.quantity * item.rate).toFixed(2)}
                                    </td>
                                    <td>
                                        <button className="remove-row-btn" onClick={() => removeItem(index)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button className="add-row-btn" onClick={addItem}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add Line Item
                    </button>

                    <div className="invoice-summary">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{getCurrencySymbol(invoice.currency)}{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (%)</span>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={invoice.taxRate}
                                onChange={(e) => updateInvoice('taxRate', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div className="summary-row">
                            <span>Tax Amount</span>
                            <span>{getCurrencySymbol(invoice.currency)}{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Discount</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={invoice.discount}
                                onChange={(e) => updateInvoice('discount', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{getCurrencySymbol(invoice.currency)}{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="form-section">
                    <div className="form-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Notes & Terms
                    </div>
                    <div className="form-group">
                        <label>Notes (visible on invoice)</label>
                        <textarea value={invoice.notes} onChange={(e) => updateInvoice('notes', e.target.value)} placeholder="Thank you for your business!" rows={2} />
                    </div>
                    <div className="form-group">
                        <label>Payment Terms</label>
                        <textarea value={invoice.terms} onChange={(e) => updateInvoice('terms', e.target.value)} rows={2} />
                    </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                    <button className="btn btn-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                        Save Draft
                    </button>
                    <button className="btn btn-primary" onClick={handlePreview}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        Preview Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

function getCurrencySymbol(currency) {
    const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: 'C$', AUD: 'A$' };
    return symbols[currency] || '$';
}

export default CreateInvoice;
