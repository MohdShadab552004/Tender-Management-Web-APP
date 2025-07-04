'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ProfileDropdown from './ProfileDropDown';

const Navbar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='));
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:8080/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('❌ Error fetching user profile:', err);
      }
    };

    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const isActive = (route: string) => pathname === route;

  return (
    <header className="w-full h-15 mt-2 px-4 border-b bg-white z-50 relative">
      <nav className="max-w-[1280px] mx-auto h-full flex justify-between items-center py-4">
        {/* LOGO + DESKTOP NAV */}
        <div >
          <div className='flex items-center gap-16'>
            <Link href="/">
              <h1 className="font-bold text-2xl">TenderHub</h1>
            </Link>

            {/* Desktop Links */}
            <ul className="hidden md:flex gap-6">
              <li>
                <Link
                  href="/"
                  className={isActive('/') ? 'font-bold text-black' : 'text-zinc-600 hover:text-black'}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tender"
                  className={isActive('/tender') ? 'font-bold text-black' : 'text-zinc-600 hover:text-black'}
                >
                  Tenders
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className={isActive('/companies') ? 'font-bold text-black' : 'text-zinc-600 hover:text-black'}
                >
                  Companies
                </Link>
              </li>
            </ul>
          </div>
        </div>


        {/* Desktop Auth Buttons */}
        <section className='flex items-center gap-5'>
        <div className="">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-zinc-600 hover:text-black">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-black rounded-2xl py-2 px-5 text-white hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          ) : (
            user && <ProfileDropdown user={user} />
          )}
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden text-2xl text-black"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        </section>
      </nav>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t py-4 px-6 space-y-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={isActive('/') ? 'font-bold text-black' : 'text-zinc-600 hover:text-black'}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/tender"
                className={isActive('/tender') ? 'font-bold text-black' : 'text-zinc-600 hover:text-black'}
              >
                Tenders
              </Link>
            </li>
            <li>
              <Link
                href="/companies"
                className={isActive('/companies') ? 'font-bold text-black' : 'text-zinc-600 hover:text-black'}
              >
                Companies
              </Link>
            </li>
          </ul>


        </div>
      )}
    </header>
  );
};

export default Navbar;
