// components/TenderCardSkeleton.tsx
import React from 'react';

const TenderCardSkeleton = () => {
  return (
    <div className="animate-pulse w-full max-w-md p-4 border rounded-lg shadow-sm bg-white">
      <div className="h-6 bg-zinc-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-zinc-200 rounded w-1/2 mb-4"></div>
      <div className="h-20 bg-zinc-100 rounded mb-4"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-zinc-200 rounded w-1/3"></div>
        <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default TenderCardSkeleton;
