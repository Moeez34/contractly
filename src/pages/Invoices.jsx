import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import './EmptyPage.css';

const STATUS_TABS = ['all', 'draft', 'sent', 'paid', 'overdue'];

const statusColors = {
    draft: { bg: '#f3f4f6', color: '#6b7280' },
    sent: { bg: '#dbeafe', color: '#2563eb' },
    paid: { bg: '#dcfce7', color: '#16a34a' },
    overdue: { bg: '#fee2e2', color: '#dc2626' },
};

const getCurrencySymbol = (currency) => {
    const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: 'C$', AUD: 'A$' };
    return symbols[currency] || '$';
};

const Invoices = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const toast = useToast();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    const fetchInvoices = async () => {
        try {
            const url = activeTab === 'all'
                ? 'http://localhost:5000/api/invoices'
                : `http://localhost:5000/api/invoices?status=${activeTab}`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setInvoices(data.invoices);
        } catch (err) {
            toast.error(err.message || 'Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            setLoading(true);
            fetchInvoices();
        }
    }, [token, activeTab]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Delete this invoice?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/invoices/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }
            toast.success('Invoice deleted');
            setInvoices((prev) => prev.filter((inv) => inv._id !== id));
        } catch (err) {
            toast.error(err.message || 'Failed to delete');
        }
    };

    if (loading) {
        return (
            <div className="empty-page">
                <div className="empty-state">
                    <div className="empty-icon">⏳</div>
                    <h2>Loading invoices...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '30px 40px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Invoices</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '0.9rem' }}>
                        {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <button
                    onClick={() => navigate('/create')}
                    style={{
                        padding: '10px 22px',
                        background: 'var(--accent)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseOver={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)'; }}
                    onMouseOut={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
                >
                    + New Invoice
                </button>
            </div>

            {/* Status Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px' }}>
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 18px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: activeTab === tab ? '600' : '500',
                            fontSize: '0.85rem',
                            textTransform: 'capitalize',
                            background: activeTab === tab ? '#fff' : 'transparent',
                            color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                            boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {invoices.length === 0 ? (
                <div className="empty-page">
                    <div className="empty-state">
                        <div className="empty-icon">📄</div>
                        <h2>No {activeTab !== 'all' ? activeTab : ''} Invoices</h2>
                        <p>
                            {activeTab === 'all'
                                ? 'Your invoices will appear here once you create them.'
                                : `No invoices with status "${activeTab}" found.`}
                        </p>
                    </div>
                </div>
            ) : (
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
                            <div style={{ flex: 1 }}>
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
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                    <span>{inv.toName || 'No client'}</span>
                                    <span>•</span>
                                    <span>{inv.invoiceDate || 'No date'}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                                    {getCurrencySymbol(inv.currency)}{inv.total.toFixed(2)}
                                </span>
                                <button
                                    onClick={(e) => handleDelete(inv._id, e)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '6px',
                                        borderRadius: '6px',
                                        color: 'var(--text-secondary)',
                                        transition: 'color 0.2s, background 0.2s',
                                    }}
                                    onMouseOver={(e) => { e.target.style.color = '#dc2626'; e.target.style.background = '#fee2e2'; }}
                                    onMouseOut={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'none'; }}
                                    title="Delete invoice"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Invoices;
