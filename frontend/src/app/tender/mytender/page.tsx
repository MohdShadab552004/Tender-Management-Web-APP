'use client';

import React, { useEffect, useState } from 'react';
import MyTenderCard from '../../components/MyTenderCard';
import ShimmerCards from '../../components/ShimmerCards';

interface TenderType {
  id: number;
  title: string;
  description: string;
  deadline: string;
  budget: string;
  applicationCount?: number;
}

const MyTenderPage = () => {
  const [tenders, setTenders] = useState<TenderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const tendersPerPage = 6;

  const indexOfLast = currentPage * tendersPerPage;
  const indexOfFirst = indexOfLast - tendersPerPage;
  const currentTenders = tenders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(tenders.length / tendersPerPage);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          console.warn('Token not found in cookies');
          setTenders([]);
          setLoading(false);
          return;
        }
        

        const res = await fetch('http://localhost:8080/tender/mytender', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setTenders(data.tenders || []);
      } catch (err) {
        console.error('Error fetching tenders:', err);
        setTenders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [tenders.length]);

  return (
    <div className="max-w-[1280px] min-h-[calc(100dvh_-_60px)] flex flex-col justify-between mx-auto py-10 ">
      <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-lg:place-items-center max-md:grid-cols-1">
        {loading ? (
            <ShimmerCards />
        ) : currentTenders.length > 0 ? (
          currentTenders.map((tender) => (
            <MyTenderCard
              key={tender.id}
              tender={tender}
              onDelete={async (id) => {
                setTenders(prev => prev.filter(t => t.id !== id));
              }}
              setTender={(updatedTender) => {
                setTenders(prev =>
                  prev.map(t => t.id === updatedTender.id ? updatedTender : t)
                );
              }}
            />
          ))
        ) : (
          <p className="text-center text-zinc-500 col-span-full">No tenders found.</p>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border rounded bg-white hover:bg-zinc-100 disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded border 
                ${page === currentPage
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-zinc-100'}`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border rounded bg-white hover:bg-zinc-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyTenderPage;
