import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './InvoicePreview.css';

const InvoicePreview = () => {
    const navigate = useNavigate();
    const invoiceRef = useRef(null);
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('invoicePreview');
        if (data) {
            setInvoice(JSON.parse(data));
        }
    }, []);

    const getCurrencySymbol = (currency) => {
        const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: 'C$', AUD: 'A$' };
        return symbols[currency] || '$';
    };

    const handleDownloadPDF = async () => {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = invoiceRef.current;
        const opt = {
            margin: 0.5,
            filename: `${invoice.invoiceNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };
        html2pdf().set(opt).from(element).save();
    };

    if (!invoice) {
        return (
            <div className="invoice-preview-page">
                <div className="preview-header">
                    <h1>No Invoice Data</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '60px' }}>
                    Please create an invoice first.
                </p>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/create')}>Create Invoice</button>
                </div>
            </div>
        );
    }

    const sym = getCurrencySymbol(invoice.currency);

    return (
        <div className="invoice-preview-page">
            <div className="preview-header">
                <h1>Invoice Preview</h1>
                <div className="preview-actions">
                    <button className="btn btn-secondary" onClick={() => navigate('/create')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Edit
                    </button>
                    <button className="btn btn-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        Send
                    </button>
                    <button className="btn btn-primary" onClick={handleDownloadPDF}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Download PDF
                    </button>
                </div>
            </div>

            <div className="invoice-document" ref={invoiceRef}>
                {/* Header */}
                <div className="invoice-doc-header">
                    <div className="invoice-doc-brand">
                        <h2>Contractly</h2>
                        <p>Professional Invoice</p>
                    </div>
                    <div className="invoice-doc-badge">
                        <h3>Invoice</h3>
                        <span>{invoice.invoiceNumber}</span>
                    </div>
                </div>

                {/* Meta */}
                <div className="invoice-doc-meta">
                    <div className="meta-block">
                        <h4>From</h4>
                        <p className="highlight">{invoice.fromName}</p>
                        <p>{invoice.fromEmail}</p>
                        {invoice.fromAddress && <p>{invoice.fromAddress}</p>}
                    </div>
                    <div className="meta-block">
                        <h4>Bill To</h4>
                        <p className="highlight">{invoice.toName || 'Client Name'}</p>
                        <p>{invoice.toEmail || 'client@email.com'}</p>
                        {invoice.toAddress && <p>{invoice.toAddress}</p>}
                    </div>
                    <div className="meta-block" style={{ textAlign: 'right' }}>
                        <h4>Details</h4>
                        <p>Date: <span className="highlight">{invoice.invoiceDate}</span></p>
                        {invoice.dueDate && <p>Due: <span className="highlight">{invoice.dueDate}</span></p>}
                        <p>Currency: <span className="highlight">{invoice.currency}</span></p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="invoice-doc-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.description || 'Service item'}</td>
                                <td>{item.quantity}</td>
                                <td>{sym}{Number(item.rate).toFixed(2)}</td>
                                <td>{sym}{(item.quantity * item.rate).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="invoice-doc-totals">
                    <div className="totals-box">
                        <div className="totals-row">
                            <span>Subtotal</span>
                            <span>{sym}{invoice.subtotal.toFixed(2)}</span>
                        </div>
                        {invoice.taxRate > 0 && (
                            <div className="totals-row">
                                <span>Tax ({invoice.taxRate}%)</span>
                                <span>{sym}{invoice.taxAmount.toFixed(2)}</span>
                            </div>
                        )}
                        {invoice.discount > 0 && (
                            <div className="totals-row">
                                <span>Discount</span>
                                <span>-{sym}{invoice.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="totals-row grand-total">
                            <span>Total</span>
                            <span>{sym}{invoice.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="invoice-doc-footer">
                    {invoice.notes && (
                        <>
                            <h4>Notes</h4>
                            <p>{invoice.notes}</p>
                        </>
                    )}
                    {invoice.terms && (
                        <>
                            <h4>Terms & Conditions</h4>
                            <p>{invoice.terms}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;
