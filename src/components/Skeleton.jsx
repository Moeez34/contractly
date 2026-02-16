import './Skeleton.css';

// Base shimmer block
export const Skeleton = ({ width, height, radius, style, className = '' }) => (
    <div
        className={`skeleton ${className}`}
        style={{
            width: width || '100%',
            height: height || '16px',
            borderRadius: radius || '8px',
            ...style,
        }}
    />
);

// Circle skeleton (avatars, icons)
export const SkeletonCircle = ({ size = 40 }) => (
    <div
        className="skeleton"
        style={{
            width: size,
            height: size,
            borderRadius: '50%',
            flexShrink: 0,
        }}
    />
);

// Dashboard skeleton layout
export const DashboardSkeleton = () => (
    <div className="dashboard-skeleton">
        {/* Greeting */}
        <div className="skel-greeting">
            <Skeleton width="55%" height="32px" radius="10px" />
            <Skeleton width="35%" height="32px" radius="10px" style={{ marginTop: 6 }} />
            <Skeleton width="45%" height="14px" style={{ marginTop: 14 }} />
        </div>

        {/* Stats */}
        <div className="skel-stats">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="skel-stat-card">
                    <SkeletonCircle size={32} />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="60%" height="16px" />
                        <Skeleton width="40%" height="10px" style={{ marginTop: 6 }} />
                    </div>
                </div>
            ))}
        </div>

        {/* Feature Cards */}
        <div className="skel-cards">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="skel-feature-card">
                    <Skeleton width="46px" height="46px" radius="12px" />
                    <Skeleton width="65%" height="14px" style={{ marginTop: 16 }} />
                    <Skeleton width="90%" height="10px" style={{ marginTop: 8 }} />
                    <Skeleton width="75%" height="10px" style={{ marginTop: 4 }} />
                    <Skeleton width="35%" height="10px" style={{ marginTop: 14 }} />
                </div>
            ))}
        </div>

        {/* Action Bar */}
        <div className="skel-actions">
            <Skeleton width="200px" height="14px" />
            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
                <Skeleton width="100px" height="34px" radius="999px" />
                <Skeleton width="90px" height="34px" radius="999px" />
                <Skeleton width="80px" height="34px" radius="999px" />
            </div>
        </div>
    </div>
);
