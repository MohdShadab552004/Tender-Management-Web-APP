// components/ShimmerCards.tsx
import React from 'react';

const ShimmerCard = () => (
  <div className="w-full h-60 bg-zinc-200 animate-pulse rounded-xl" />
);

const ShimmerCards = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, idx) => (
        <ShimmerCard key={idx} />
      ))}
    </>
  );
};

export default ShimmerCards;
