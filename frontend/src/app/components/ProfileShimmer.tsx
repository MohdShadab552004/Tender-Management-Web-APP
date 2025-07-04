// app/profile/loading.tsx
import React from 'react';

const ProfileShimmer = () => {
  return (
    <main className="min-h-screen bg-white text-zinc-900 px-4 py-10 flex justify-center font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg border border-zinc-200 animate-pulse space-y-10">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-[120px] h-[120px] bg-zinc-200 rounded-full" />
          <div className="space-y-3 w-full">
            <div className="w-1/2 h-5 bg-zinc-200 rounded" />
            <div className="w-1/3 h-4 bg-zinc-100 rounded" />
          </div>
        </div>

        {/* Company Info */}
        <div className="space-y-3">
          <div className="w-1/3 h-5 bg-zinc-200 rounded" />
          <div className="w-full h-4 bg-zinc-100 rounded" />
          <div className="w-3/4 h-4 bg-zinc-100 rounded" />
          <div className="w-full h-16 bg-zinc-100 rounded" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-zinc-100 p-4 rounded-lg border border-zinc-200 space-y-2">
              <div className="w-1/2 h-6 bg-zinc-300 rounded mx-auto" />
              <div className="w-3/4 h-4 bg-zinc-200 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProfileShimmer;
