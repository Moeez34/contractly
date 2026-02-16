import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardSkeleton } from '../components/Skeleton';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    if (loading) return <DashboardSkeleton />;

    const displayName = user ? user.name : 'there';

    const features = [
        {
            icon: '⚡',
            title: 'Quick Invoice',
            description: 'Create professional invoices in seconds. Add line items, taxes, and discounts with ease.',
            label: 'Fast Start',
        },
        {
            icon: '📊',
            title: 'Track Payments',
            description: 'Stay connected with your finances. Monitor payment statuses and boost your cash flow.',
            label: 'Payment Tracking',
        },
        {
            icon: '👥',
            title: 'Client Manager',
            description: 'Organize your clients efficiently, set clear payment terms, and stay focused.',
            label: 'Client Management',
        },
    ];

    return (
        <div className="dashboard">
            {/* Greeting Section */}
            <div className="dashboard-greeting">
                <div className="dashboard-greeting-text">
                    <h1>
                        Hi <span>{displayName}</span>, Ready to<br />
                        Create Invoices?
                    </h1>
                    <p>Manage your freelance billing like a pro.</p>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="dashboard-cards">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="feature-card"
                        onClick={() => index === 0 && navigate('/create')}
                    >
                        <div className="feature-card-icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                        <div className="feature-card-label">{feature.label}</div>
                    </div>
                ))}
            </div>




            {/* Action Bar */}
            <div className="dashboard-actions">
                <div className="dashboard-actions-hint">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    What would you like to do today?
                </div>
                <div className="action-buttons">
                    <button className="action-btn primary" onClick={() => navigate('/create')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        New Invoice
                    </button>
                    <button className="action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Templates
                    </button>
                    <button className="action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                        </svg>
                        Clients
                    </button>
                    <button className="action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        Reports
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
