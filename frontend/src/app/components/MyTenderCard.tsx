'use client';

import Link from 'next/link';
import React from 'react';

interface MyTenderCardProps {
    tender: {
        id: number;
        title: string;
        description: string;
        deadline: string;
        budget: string;
        applicationCount?: number; // optional
    };
}

const MyTenderCard: React.FC<MyTenderCardProps> = ({ tender }) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 mb-4 border border-gray-200">
            <h2 className="text-xl font-bold text-[#000000]">{tender.title}</h2>
            <p className="text-gray-700 mt-2">{tender.description}</p>

            <div className="mt-4 text-sm text-gray-500 space-y-1">
                <p><span className="font-medium">Deadline:</span> {new Date(tender.deadline).toLocaleDateString()}</p>
                <p><span className="font-medium">Budget:</span> ₹{tender.budget}</p>
                <p><span className="font-medium">Applications:</span> {tender.applicationCount ?? 0}</p>
            </div>

            <Link href={`/tender/${tender.id}/application`} className="mt-4 inline-block bg-zinc-900 text-white px-4 py-2 rounded">
                View Applications
            </Link>
        </div>
    );
};

export default MyTenderCard;
