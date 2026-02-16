import { useRef, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const ROUTE_ORDER = ['/', '/create', '/preview', '/invoices', '/templates', '/history'];

const getRouteIndex = (path) => {
    const idx = ROUTE_ORDER.indexOf(path);
    return idx >= 0 ? idx : ROUTE_ORDER.length;
};

const PageTransition = ({ children }) => {
    const location = useLocation();
    const [current, setCurrent] = useState({ children, key: location.pathname });
    const [animClass, setAnimClass] = useState('page-active');
    const prevPath = useRef(location.pathname);
    const isAnimating = useRef(false);

    const handleTransition = useCallback(() => {
        if (location.pathname === prevPath.current || isAnimating.current) return;
        isAnimating.current = true;

        const dir = getRouteIndex(location.pathname) > getRouteIndex(prevPath.current) ? 'fwd' : 'back';
        prevPath.current = location.pathname;

        // Instantly swap content with enter animation (no exit delay)
        setAnimClass(`page-slide-${dir}`);
        setCurrent({ children, key: location.pathname });

        // Clean up class after animation
        const t = setTimeout(() => {
            setAnimClass('page-active');
            isAnimating.current = false;
        }, 250);

        return () => clearTimeout(t);
    }, [location.pathname, children]);

    useEffect(() => {
        handleTransition();
    }, [handleTransition]);

    // Update children if same route (e.g. state change)
    useEffect(() => {
        if (location.pathname === prevPath.current && !isAnimating.current) {
            setCurrent({ children, key: location.pathname });
        }
    }, [children, location.pathname]);

    return (
        <div className={`page-transition ${animClass}`} key={current.key}>
            {current.children}
        </div>
    );
};

export default PageTransition;
