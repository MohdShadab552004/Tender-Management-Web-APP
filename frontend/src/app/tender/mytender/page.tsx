'use client';

import React, { useEffect, useState } from 'react';
import MyTenderCard from '@/app/components/MyTenderCard';

const MyTenderPage = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.log(data.tenders)
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


  return (
    <div className="max-w-[1280px] mx-auto grid grid-cols-3 gap-6 max-md:grid-cols-2 max-md:place-items-center py-10">
      {loading ? (
        <p className="text-center text-zinc-500 col-span-2">Loading...</p>
      ) : tenders.length > 0 ? (
        tenders.map((tender: any, index: number) => (
          <MyTenderCard
            key={index}
            tender={tender}
            onDelete={async (id) => {
              setTenders(prev => prev.filter(t => t.id !== id));
            }}
            setTender={(updatedTender) => {
              setTenders(prev =>
                prev.map(t => t.id === updatedTender.id ? updatedTender : t)
              );
            }} />
        ))
      ) : (
        <p className="text-center text-zinc-500 col-span-2">No tenders found.</p>
      )}
    </div>
  );
};

export default MyTenderPage;
