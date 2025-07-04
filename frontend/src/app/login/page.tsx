'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InputField from '../components/InputField'; 

const LoginPage = () => {
  // 🔐 State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🧠 Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  console.log(1)
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      window.location.href = '/';
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
    }
  };

  return (
    <>
      <main className="max-w-[1280px] mx-auto min-h-[calc(100dvh_-_60px)] flex items-center py-23 px-6 max-lg:flex-col max-lg:gap-10  ">
        <section className="w-1/2 flex flex-col justify-center gap-5 max-md:w-full">
          <h2 className="text-4xl font-bold text-center">Login</h2>
          <p className="text-zinc-500 text-center text-xl">Sign in to your account</p>

          <form className="w-full flex flex-col gap-6" onSubmit={handleLogin}>
            <InputField
              id="email"
              label="Enter Email"
              type="email"
              value={email}
              isRequired={true}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              id="password"
              label="Enter Password"
              type="password"
              value={password}
              isRequired={true}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full h-[50px] rounded-xl bg-black text-white"
            >
              Sign In
            </button>

            <p className="text-center">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-500 underline">
                Signup
              </Link>
            </p>
          </form>
        </section>

        <section className="w-1/2 h-[500px] flex items-center justify-center max-md:w-full">
          <img src='/images/login-image.png' alt='login photo' className='w-full h-full object-center'/>
        </section>
      </main>
    </>
  );
};

export default LoginPage;
