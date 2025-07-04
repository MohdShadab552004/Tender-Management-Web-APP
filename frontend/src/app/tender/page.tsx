import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TenderCard from '../components/TenderCard';
import CompanyFilter from '../components/CompanyFilter';


interface Tender {
  id: number;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  companyname: string;
  companylogourl: string;
}

interface Company {
  id: string;
  name: string;
}

interface ApiResponse {
  tenders: Tender[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default async function TendersPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string; companyId?: string; search?: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const currentPage = await Number(searchParams.page) || 1;
  const itemsPerPage = await Number(searchParams.limit) || 10;
  const selectedCompanyId = await searchParams.companyId || '';
  const search = await searchParams.search || '';

  let data: ApiResponse = {
    tenders: [],
    total: 0,
    page: currentPage,
    limit: itemsPerPage,
    totalPages: 1,
  };

  let companies: Company[] = [];

  try {
    // Fetch companies
    const companiesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/all`, {
      cache: 'no-store',
    });
    companies = await companiesRes.json();
    console.log(companies);
    // Fetch tenders
    const tenderRes = await fetch(
      `http://localhost:8080/tender/list?page=${currentPage}&limit=${itemsPerPage}&companyId=${selectedCompanyId}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (!tenderRes.ok) throw new Error('Failed to fetch tenders');
    data = await tenderRes.json();
    console.log(data)
  } catch (err) {
    console.error('Fetch error:', err);
  }

  return (
    <main className="max-w-[1280px] min-h-[calc(100dvh_-_60px)] mx-auto p-6 flex flex-col gap-8">
      {/* Company Filter Form */}
      <CompanyFilter companies={companies} selectedCompanyId={selectedCompanyId} />

      {/* Tenders List */}
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:place-items-center mb-8">
        {data.tenders.length > 0 ? (
          data.tenders.map((tender) => (
            <TenderCard key={tender.id} {...tender} />
          ))
        ) : (
          <p className="text-center text-zinc-500 col-span-2">No tenders found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 items-center">
        {/* Prev Button */}
        {data.page > 1 && (
          <a
            href={`/tender?page=${data.page - 1}&limit=${itemsPerPage}&companyId=${selectedCompanyId}&search=${search}`}
            className="px-4 py-2 border rounded bg-[#ffffff] hover:bg-gray-200"
          >
            Prev
          </a>
        )}

        {/* Page Numbers */}
        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
          <a
            key={page}
            href={`/tender?page=${page}&limit=${itemsPerPage}&companyId=${selectedCompanyId}&search=${search}`}
            className={`px-4 py-2 border rounded ${data.page === page ? 'bg-black text-white' : 'bg-white text-black'
              }`}
          >
            {page}
          </a>
        ))}

        {/* Next Button */}
        {data.page < data.totalPages && (
          <a
            href={`/tender?page=${data.page + 1}&limit=${itemsPerPage}&companyId=${selectedCompanyId}&search=${search}`}
            className="px-4 py-2 border rounded bg-[#ffffff] hover:bg-gray-200"
          >
            Next
          </a>
        )}
      </div>

    </main>
  );
}
