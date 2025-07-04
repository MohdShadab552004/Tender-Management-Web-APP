'use client';

import React, { FormEvent, useState } from 'react';
import InputField from '../components/InputField';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Page = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // 🔄 Common loading state

  const router = useRouter();

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      setIsSignUp(true);
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!companyName || !industry || !description) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', companyName);
      formData.append('industry', industry);
      formData.append('description', description);
      if (logo) formData.append('logo', logo);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Company creation failed');

      router.push('/');
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[1280px] mx-auto min-h-[calc(100dvh_-_60px)] flex py-28 max-lg:flex-col gap-10 items-center px-6">
      {/* SIGNUP FORM */}
      <section className={`w-1/2 ${!isSignUp ? 'flex' : 'hidden'} flex-col gap-5 justify-center max-md:w-full`}>
        <h2 className="text-4xl font-bold text-center">Sign Up</h2>
        <p className="text-zinc-500 text-center text-xl">Create your new account</p>

        <form className="w-full flex flex-col gap-6" onSubmit={handleSignupSubmit}>
          <InputField
            id="email"
            type="email"
            label="Enter Email"
            value={email}
            isRequired={true}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            id="password"
            type="password"
            label="Enter Password"
            value={password}
            isRequired={true}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className={`w-full h-[50px] rounded-xl bg-black text-white flex items-center justify-center gap-2 ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Creating account...
              </>
            ) : (
              'Continue'
            )}
          </button>

          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 underline">
              Sign In
            </Link>
          </p>
        </form>
      </section>

      {/* COMPANY FORM */}
      <section className={`w-1/2 ${isSignUp ? 'flex' : 'hidden'} flex-col gap-5 justify-center`}>
        <h2 className="text-4xl font-bold text-center">Company Details</h2>
        <p className="text-zinc-500 text-center text-xl">Almost Done! Please fill company info.</p>

        <form className="w-full flex flex-col gap-6" onSubmit={handleCompanySubmit}>
          <InputField
            id="name"
            label="Enter Company Name"
            value={companyName}
            isRequired={true}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <InputField
            id="industry"
            label="Industrial Field"
            value={industry}
            isRequired={true}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <InputField
            id="description"
            label="Description"
            value={description}
            isRequired={true}
            textarea={true}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            className="border border-zinc-300 py-3 px-4 rounded-xl"
            onChange={(e) => setLogo(e.target.files?.[0] || null)}
          />

          <button
            className={`w-full h-[50px] rounded-xl bg-black text-white flex items-center justify-center gap-2 ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>

          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 underline">
              Sign In
            </Link>
          </p>
        </form>
      </section>

      {/* Image Section */}
      <section className="w-1/2 h-[500px] max-md:w-full">
        <img src="/images/signup-image.png" alt="signup photo" className="w-full h-full object-center" />
      </section>
    </main>
  );
};

export default Page;
