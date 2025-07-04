'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import InputField from '../../components/InputField';

interface Tender {
    id: string;
    title: string;
    description: string;
    deadline: string;
    budget: number;
    companyname: string;
    companylogourl: string;
}

const ApplyTenderPage = () => {
    const router = useRouter();
    const params = useParams();
    const tenderId = typeof params.tenderId === 'string' ? params.tenderId : '';

    const [tender, setTender] = useState<Tender | null>(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [coverLetter, setCoverLetter] = useState('');

    useEffect(() => {
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/tender/list/${tenderId}`)
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tender/list/${tenderId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const data = await response.json();

                if (response.ok && data.tender) {
                    setTender(data.tender);
                } else {
                    console.error('Tender fetch failed:', data.message);
                }
            } catch (error) {
                console.error('Error fetching tender:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tenderId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const application = {
            tenderId,
            name,
            email,
            bidAmount: parseFloat(bidAmount),
            coverLetter,
        };
        const response = await fetch(`http://localhost:8080/application/send`, {
            method:'POST',    
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(application),
        });

        const data = await response.json();
        console.log(data,"completed");


    };

    if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
    if (!tender) return <p className="text-center mt-20 text-red-500">Tender not found</p>;

    return (
        <main className="max-w-xl mx-auto px-6 py-10">
            <div className="flex items-center gap-4 mb-6">
                <img src={tender.companylogourl} alt="logo" className="w-12 h-12" />
                <div>
                    <h1 className="text-xl font-bold">{tender.companyname}</h1>
                    <p className="text-gray-600">{tender.title}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    id="1"
                    type="text"
                    label="Full Name"
                    value={name}
                    isRequired={true}
                    onChange={(e) => setName(e.target.value)}
                />
                <InputField
                    id="2"
                    label="Email"
                    type="email"
                    value={email}
                    isRequired={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                    id="3"
                    label="Bid Amount (INR)"
                    type="number"
                    value={bidAmount}
                    isRequired={true}
                    onChange={(e) => setBidAmount(e.target.value)}
                />
                <InputField
                    id="4"
                    label="Cover Letter"
                    value={coverLetter}
                    isRequired={true}
                    textarea={true}
                    onChange={(e) => setCoverLetter(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800"
                >
                    Submit Application
                </button>
            </form>
        </main>
    );
};

export default ApplyTenderPage;
