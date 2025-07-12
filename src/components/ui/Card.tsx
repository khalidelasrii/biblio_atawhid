import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md ${
        hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};