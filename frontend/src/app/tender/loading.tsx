// app/tender/loading.tsx
import React from 'react';

const ShimmerCard = () => (
  <div className="w-full max-w-md h-48 bg-zinc-200 animate-pulse rounded-xl" />
);

export default function Loading() {
  return (
    <main className="max-w-[1280px] min-h-[calc(100dvh_-_60px)] mx-auto p-6 flex flex-col gap-8">
      {/* Filter Placeholder */}
      <div className="h-12 w-64 bg-zinc-200 animate-pulse rounded-md" />

      {/* Tenders Placeholder Grid */}
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:place-items-center mb-8">
        {Array.from({ length: 4 }).map((_, idx) => (
          <ShimmerCard key={idx} />
        ))}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex justify-center gap-2">
        <div className="w-20 h-10 bg-zinc-200 animate-pulse rounded-md" />
        <div className="w-10 h-10 bg-zinc-200 animate-pulse rounded-md" />
        <div className="w-20 h-10 bg-zinc-200 animate-pulse rounded-md" />
      </div>
    </main>
  );
}
