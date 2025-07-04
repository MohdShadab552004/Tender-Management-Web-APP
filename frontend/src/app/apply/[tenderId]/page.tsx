'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import InputField from '../../components/InputField';
import Image from 'next/image';

interface Tender {
  id: string;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  companyname: string;
  companylogourl: string;
}

type Params = {
  tenderId: string;
};

const ApplyTenderPage = () => {
  const router = useRouter();
  const { tenderId } = useParams() as Params;

  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // ⏳ New

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tender/list/${tenderId}`, {
          headers: { 'Content-Type': 'application/json' },
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

    const parsedBid = parseFloat(bidAmount);
    if (isNaN(parsedBid) || parsedBid <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    const application = {
      tenderId,
      name,
      email,
      bidAmount: parsedBid,
      coverLetter,
    };

    setSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/application/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(application),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Application submitted successfully!');
        router.push('/');
      } else {
        alert(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!tender) return <p className="text-center mt-20 text-red-500">Tender not found</p>;

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={tender.companylogourl || '/images/default.png'}
          alt="logo"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <h1 className="text-xl font-bold">{tender.companyname}</h1>
          <p className="text-gray-600">{tender.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="name"
          type="text"
          label="Full Name"
          value={name}
          isRequired
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          id="email"
          type="email"
          label="Email"
          value={email}
          isRequired
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          id="bidAmount"
          type="number"
          label="Bid Amount (INR)"
          value={bidAmount}
          isRequired
          onChange={(e) => setBidAmount(e.target.value)}
        />
        <InputField
          id="coverLetter"
          label="Cover Letter"
          value={coverLetter}
          isRequired
          textarea
          onChange={(e) => setCoverLetter(e.target.value)}
        />

        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition ${
            submitting ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>
    </main>
  );
};

export default ApplyTenderPage;
