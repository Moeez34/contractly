import './EmptyPage.css';

const Invoices = () => (
    <div className="empty-page">
        <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h2>No Invoices</h2>
            <p>Your invoices will appear here once you create them.</p>
        </div>
    </div>
);

export default Invoices;
