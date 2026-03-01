import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './EmptyPage.css';

const statusColors = {
    sent: { bg: '#dbeafe', color: '#2563eb' },
    paid: { bg: '#dcfce7', color: '#16a34a' },
};

const getCurrencySymbol = (currency) => {
    const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: 'C$', AUD: 'A$' };
    return symbols[currency] || '$';
};

const History = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [sentRes, paidRes] = await Promise.all([
                    fetch('http://localhost:5000/api/invoices?status=sent', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch('http://localhost:5000/api/invoices?status=paid', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                const sentData = await sentRes.json();
                const paidData = await paidRes.json();
                const all = [...(sentData.invoices || []), ...(paidData.invoices || [])];
                all.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setInvoices(all);
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchHistory();
        else setLoading(false);
    }, [token]);

    if (loading) {
        return (
            <div className="empty-page">
                <div className="empty-state">
                    <div className="empty-icon">⏳</div>
                    <h2>Loading history...</h2>
                </div>
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <div className="empty-page">
                <div className="empty-state">
                    <div className="empty-icon">🕓</div>
                    <h2>No History</h2>
                    <p>Your sent and paid invoices will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '30px 40px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>History</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '0.9rem' }}>
                    Invoices you've sent or have been paid
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {invoices.map((inv) => (
                    <div
                        key={inv._id}
                        onClick={() => navigate(`/preview/${inv._id}`)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '18px 22px',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                    {inv.invoiceNumber}
                                </span>
                                <span style={{
                                    padding: '3px 10px',
                                    borderRadius: '20px',
                                    fontSize: '0.72rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    background: statusColors[inv.status]?.bg || '#f3f4f6',
                                    color: statusColors[inv.status]?.color || '#6b7280',
                                }}>
                                    {inv.status}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                {inv.toName || 'No client'} • {inv.invoiceDate || 'No date'}
                            </div>
                        </div>
                        <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {getCurrencySymbol(inv.currency)}{inv.total.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
