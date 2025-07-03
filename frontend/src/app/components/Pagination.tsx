'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  page: number;
  totalPages: number;
}

const Pagination: React.FC<Props> = ({ page, totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/tenders?${params.toString()}`);
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
      >
        Next
      </button>
    </>
  );
};

export default Pagination;
