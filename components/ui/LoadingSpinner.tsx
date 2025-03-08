import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }[size];

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
    </div>
  );
}
