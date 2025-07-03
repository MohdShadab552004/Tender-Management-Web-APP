'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Company {
  id: string;
  name: string;
}

export default function CompanyFilter({
  companies,
  selectedCompanyId,
}: {
  companies: Company[];
  selectedCompanyId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;

    if (value) {
      params.set('companyId', value);
    } else {
      params.delete('companyId');
    }

    params.set('page', '1');

    router.push(`/tender?${params.toString()}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
  const params = new URLSearchParams(searchParams.toString());
  const value = e.target.value;

  if (value) {
    params.set('search', value); // update the selected company
  } else {
    params.delete('search'); // remove filter if nothing selected
  }

  params.set('page', '1'); // reset to page 1 on search/filter

  router.push(`/tender?${params.toString()}`);
};

  return (
    <section className='w-full mx-auto py-6 flex justify-between items-center'>
    <input 
    type='search' 
    placeholder='enter company name' 
    onChange={handleSearch} 
    className='border w-[350px] h-[50px] shadow rounded px-2'
    />
    <div className="w-full max-w-xs">
      <label className="block mb-1 text-sm font-medium">Filter by Company</label>
      <select
        value={selectedCompanyId}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="">All Companies</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>
    </section>
  );
}
