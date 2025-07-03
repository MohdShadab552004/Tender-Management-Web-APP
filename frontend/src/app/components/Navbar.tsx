'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ProfileDropdown from './ProfileDropDown';

const Navbar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    <header className="w-full h-15 mt-2 px-4">
      <nav className="max-w-[1280px] mx-auto h-full flex justify-between items-center py-4">
        <div className="h-full flex items-center gap-16">
          <Link href="/">
            <h1 className="font-bold text-2xl">TenderHub</h1>
          </Link>
          <ul className="h-full flex items-center gap-6 max-md:hidden">
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

        <ul className="h-full flex items-center gap-5">
          {!isLoggedIn ? (
            <>
              <li className="cursor-pointer text-zinc-600 hover:text-black">
                <Link href="/login">Log in</Link>
              </li>
              <li className="bg-black rounded-2xl py-2 px-5 text-white cursor-pointer hover:opacity-90">
                <Link href="/signup">Sign up</Link>
              </li>
            </>
          ) : (
            user && <ProfileDropdown user={user} />
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
