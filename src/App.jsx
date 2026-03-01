import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import PageTransition from './components/PageTransition';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import InvoicePreview from './pages/InvoicePreview';
import Invoices from './pages/Invoices';
import Templates from './pages/Templates';
import History from './pages/History';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create" element={<CreateInvoice />} />
      <Route path="/preview/:id" element={<InvoicePreview />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/history" element={<History />} />
      <Route path="/pricing" element={<Pricing />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Auth pages — full screen, no TopBar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main app — with TopBar + page transitions */}
            <Route
              path="*"
              element={
                <div className="app-layout">
                  <TopBar />
                  <main className="app-main">
                    <PageTransition>
                      <AppRoutes />
                    </PageTransition>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
