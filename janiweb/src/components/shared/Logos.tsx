import React from 'react';

interface LogoProps {
    className?: string;
}

export const JaniboxLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M50 50L50 20C50 10 35 5 25 15C15 25 20 40 30 50L50 50Z" fill="#CC6677" fillOpacity="0.8" />
        <path d="M50 50L80 50C90 50 95 35 85 25C75 15 60 20 50 30L50 50Z" fill="#CC6677" fillOpacity="0.6" />
        <path d="M50 50L50 80C50 90 65 95 75 85C85 75 80 60 70 50L50 50Z" fill="#CC6677" fillOpacity="0.8" />
        <path d="M50 50L20 50C10 50 5 65 15 75C25 85 40 80 50 70L50 50Z" fill="#CC6677" fillOpacity="1" />
    </svg>
);

