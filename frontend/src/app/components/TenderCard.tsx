import React from 'react';
import Link from 'next/link';

interface TenderCardProps {
  id:number;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  companyname: string;
  companylogourl: string;
}

const TenderCard: React.FC<TenderCardProps> = ({
  id,
  title,
  description,
  deadline,
  budget,
  companyname,
  companylogourl,
}) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 bg-white max-w-xl">
      
      {/* Company Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={companylogourl}
          alt={`${companyname} logo`}
          className="w-10 h-10 object-cover rounded-full border"
        />
        <div className="text-sm">
          <p className="font-semibold text-black">{companyname}</p>
          <p className="text-zinc-500">Posted a tender</p>
        </div>
      </div>

      {/* Tender Info */}
      <h2 className="text-xl font-bold text-black mb-2">{title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>
          Deadline: <strong>{new Date(deadline).toLocaleDateString()}</strong>
        </span>
        <span>
          Budget: ₹{budget.toLocaleString()}
        </span>
      </div>

      <Link href={`/apply/${id}`} className="mt-3 w-full flex justify-center items-center py-3 px-2 rounded-xl bg-black text-white hover:bg-gray-900 transition">
        Apply to Tender
      </Link>
    </div>
  );
};

export default TenderCard;
