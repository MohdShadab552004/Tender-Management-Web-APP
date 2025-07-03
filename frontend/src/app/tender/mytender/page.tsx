import React from 'react'
import { cookies } from 'next/headers';
import TenderCard from '@/app/components/TenderCard';
import MyTenderCard from '@/app/components/MyTenderCard';

const page = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await fetch(`http://localhost:8080/tender/mytender`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    const tenders = await response.json();
    console.log(tenders)


    return (
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:place-items-center py-10">
            {tenders.tenders && tenders.tenders.length > 0 ? (
                tenders.tenders.map((tender, index) => (
                    <MyTenderCard
                        key={index}
                        tender={tender}
                        
                    />
                ))
            ) : (
                <p className="text-center text-zinc-500 col-span-2">No tenders found.</p>
            )}
        </div>

    )
}

export default page