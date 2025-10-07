
import React from 'react';

const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M12 2L9.16 8.91L2 9.27L7.5 14.14L5.82 21L12 17.27L18.18 21L16.5 14.14L22 9.27L14.84 8.91L12 2Z" />
    </svg>
);

export default CrownIcon;
