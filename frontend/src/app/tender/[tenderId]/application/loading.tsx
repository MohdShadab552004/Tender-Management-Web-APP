import React from 'react';

const ApplicationsLoading = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-pulse">
      {/* Title */}
      <div className="w-2/3 h-8 bg-zinc-200 rounded mb-6" />

      {/* Placeholder Cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-3 mb-4"
        >
          <div className="w-1/2 h-5 bg-zinc-200 rounded" /> {/* Name */}
          <div className="w-1/3 h-4 bg-zinc-100 rounded" /> {/* Email */}
          <div className="w-1/4 h-4 bg-zinc-100 rounded" /> {/* Bid Amount */}
          <div className="w-full h-4 bg-zinc-100 rounded" /> {/* Proposal */}
          <div className="w-1/3 h-3 bg-zinc-100 rounded mt-2" /> {/* Timestamp */}
        </div>
      ))}
    </div>
  );
};

export default ApplicationsLoading;
