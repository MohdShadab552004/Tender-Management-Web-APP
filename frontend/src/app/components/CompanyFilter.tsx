'use client';

import React, { useEffect, useState } from 'react';
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

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery); // 🌀 debounced value

  // ⏱ Debounce effect: delay updating the URL until user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(handler); // Cleanup timeout on change
  }, [searchQuery]);

  // 🌐 Update URL when debounced search value changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }

    params.set('page', '1');
    router.push(`/tender?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set('companyId', value);
    } else {
      params.delete('companyId');
    }

    params.set('page', '1');
    router.push(`/tender?${params.toString()}`);
  };

  return (
    <section className="w-full mx-auto py-6 flex justify-between items-center max-md:flex-col gap-4">
      <input
        type="search"
        placeholder="Enter keyword or company name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border w-[350px] h-[50px] shadow rounded px-3 max-[400px]:w-full"
      />

      <div className="w-full max-w-xs">
        <label className="block mb-1 text-sm font-medium">Filter by Company</label>
        <select
          value={selectedCompanyId}
          onChange={handleCompanyChange}
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
