import React from 'react';
import { cookies } from 'next/headers';
import TenderCard from '../components/TenderCard';

interface TenderCard {
  id:number;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  companyname: string;
  companylogourl: string;
}

const TendersPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <div>Please login to view tenders</div>;
  }

  const response = await fetch("http://localhost:8080/tender/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  const tenders= await response.json();
  console.log(tenders);

  return (
    <>
      <main className="max-w-[1280px] mx-auto p-6">
        {/* Search & Filter */}
        {/* <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search tenders..."
            className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            value={}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <select
            className="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
          >
            {uniqueCompanies.map(company => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div> */}

        {/* Tenders */}
        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:place-items-center">
          {tenders.tenders && tenders.tenders.length > 0 ? (
            tenders.tenders.map((tender, index) => (
              <TenderCard key={index} {...tender} />
            ))
          ) : (
            <p className="text-center text-zinc-500 col-span-2">No tenders found.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default TendersPage;
