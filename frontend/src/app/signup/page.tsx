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

  const router = useRouter();

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("hitting api")
    const response = await fetch("http://localhost:8080/auth/register", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials:'include',
      body: JSON.stringify({ email, password })
    })
    const data = await response.json();

    setIsSignUp(true);
  }

  const handleCompanySubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", companyName);
    formData.append("industry", industry);
    formData.append("description", description);
    if (logo) {
      formData.append("logo", logo);
    }

    const response = await fetch("http://localhost:8080/companies/create", {
      method: 'POST',
      credentials:'include',
      body: formData,
    });
    const data = await response.json();

    console.log("hello",data);
    if(data){
      router.push('/');
    }
  }

  return (
    <>
      <main className="max-w-[1280px] mx-auto h-[calc(100dvh_-_60px)] flex py-28 max-lg:flex-col">
        {/* SIGNUP FORM */}
        <section className={`w-1/2 ${!isSignUp ? 'flex' : 'hidden'} flex-col gap-5 justify-center`}>
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
              className="w-full h-[50px] rounded-xl bg-black text-white"
            >
              Continue
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
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="file"
              className="border border-zinc-300 py-3 px-4 rounded-xl"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
            />

            <button className="w-full h-[50px] rounded-xl bg-black text-white">Submit</button>

            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-blue-500 underline">
                Sign In
              </Link>
            </p>
          </form>
        </section>

        {/* Just Placeholder */}
        <section className="w-1/2">
        <img src="/images/signup-image.png" alt="signup photo" className='w-full h-full object-center'/>
        </section>
      </main>
    </>
  );
};

export default Page;
