import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import './Pricing.css';

const plans = [
    {
        id: 'free',
        name: 'Starter',
        price: '0',
        period: 'free forever',
        tagline: 'Perfect for individuals who are just starting out and want the essentials.',
        cta: 'Get started',
        ctaStyle: 'outline',
        featuresTitle: 'Free, forever',
        features: [
            '5 invoices per month',
            '3 clients',
            'PDF export',
            'Basic invoice templates',
            'Email support',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '499',
        period: 'per month',
        tagline: 'Highly recommended for freelancers who seek to upgrade their billing & performance.',
        cta: 'Get started',
        ctaStyle: 'filled',
        popular: true,
        featuresTitle: 'Starter plan features, plus:',
        features: [
            'Unlimited invoices',
            'Unlimited clients',
            'Custom invoice templates',
            'Priority email support',
            'Advanced reporting',
        ],
    },
    {
        id: 'business',
        name: 'Business',
        price: '999',
        period: 'per month',
        tagline: 'Robust invoicing for agencies looking to have more control, privacy & scale.',
        cta: 'Contact us',
        ctaStyle: 'outline',
        featuresTitle: 'Pro plan features, plus:',
        features: [
            'Multiple team members',
            'Client portal access',
            'Automated payment reminders',
            'White-label branding',
            '24/7 chat & phone support',
        ],
    },
];

const Pricing = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const toast = useToast();
    const [billing, setBilling] = useState(null);

    useEffect(() => {
        const fetchBilling = async () => {
            if (!token) return;
            try {
                const res = await fetch('http://localhost:5000/api/billing/status', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) setBilling(data);
            } catch { /* silently fail */ }
        };
        fetchBilling();
    }, [token]);

    const currentPlan = billing?.plan || 'free';

    const handleCta = (plan) => {
        if (plan.id === 'free') {
            navigate('/');
        } else if (plan.id === 'business') {
            toast.info('Contact us at hello@contractly.app 📩');
        } else {
            toast.info('Stripe integration coming soon! Stay tuned 🚀');
        }
    };

    const invoicePercent = billing ? Math.min((billing.invoicesUsed / billing.invoicesLimit) * 100, 100) : 0;
    const clientPercent = billing ? Math.min((billing.clientsUsed / billing.clientsLimit) * 100, 100) : 0;

    return (
        <div className="pricing-page">
            {/* Split header */}
            <div className="pricing-top">
                <div className="pricing-top-left">
                    <h1><span style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Simple pricing</span> based<br />on your needs</h1>
                </div>
                <div className="pricing-top-right">
                    <p>Discover a variety of our advanced features. Unlimited invoicing and flexible plans for freelancers and agencies of all sizes.</p>
                </div>
            </div>

            {/* 3-column cards */}
            <div className="pricing-cards">
                {plans.map((plan) => (
                    <div key={plan.id} className={`pricing-card ${plan.id}`}>
                        {plan.popular && <div className="pricing-badge">30 days free trial</div>}

                        {currentPlan === plan.id && (
                            <div className="current-plan-badge">✓ Current Plan</div>
                        )}

                        <div className="pricing-plan-name">{plan.name}</div>
                        <div className="pricing-starts-at">Starts at</div>

                        <div className="pricing-price">
                            {plan.price !== '0' && <span className="currency">₹</span>}
                            <span className="amount">
                                {plan.price === '0' ? '$0' : plan.price}
                            </span>
                            <span className="period">{plan.period}</span>
                        </div>

                        <div className="pricing-tagline">{plan.tagline}</div>

                        <button
                            className={`pricing-cta ${currentPlan === plan.id ? 'outline' : plan.ctaStyle}`}
                            onClick={() => handleCta(plan)}
                            disabled={currentPlan === plan.id && plan.id === 'free'}
                        >
                            {currentPlan === plan.id ? 'Current Plan' : plan.cta}
                        </button>

                        <div className="pricing-divider" />
                        <div className="pricing-features-title">{plan.featuresTitle}</div>

                        <div className="pricing-features">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="pricing-feature">
                                    <span className="check">✓</span>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Usage bars for free users */}
            {billing && currentPlan === 'free' && (
                <div className="pricing-usage">
                    <h3>📊 Your Usage This Month</h3>
                    <div className="usage-bars">
                        <div className="usage-item">
                            <div className="usage-item-header">
                                <span className="usage-item-label">Invoices</span>
                                <span className="usage-item-count">{billing.invoicesUsed} / {billing.invoicesLimit}</span>
                            </div>
                            <div className="usage-bar">
                                <div
                                    className={`usage-bar-fill ${invoicePercent >= 100 ? 'full' : invoicePercent >= 80 ? 'warning' : ''}`}
                                    style={{ width: `${invoicePercent}%` }}
                                />
                            </div>
                        </div>
                        <div className="usage-item">
                            <div className="usage-item-header">
                                <span className="usage-item-label">Clients</span>
                                <span className="usage-item-count">{billing.clientsUsed} / {billing.clientsLimit}</span>
                            </div>
                            <div className="usage-bar">
                                <div
                                    className={`usage-bar-fill ${clientPercent >= 100 ? 'full' : clientPercent >= 80 ? 'warning' : ''}`}
                                    style={{ width: `${clientPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pricing;
