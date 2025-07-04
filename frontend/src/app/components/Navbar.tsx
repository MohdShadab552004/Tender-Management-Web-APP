'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ProfileDropdown from './ProfileDropDown';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tender', label: 'Tenders' },
];

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

        if (!res.ok) throw new Error('Failed to fetch user profile');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('❌ Error fetching user profile:', err);
      }
    };

    if (isLoggedIn) fetchUserProfile();
  }, [isLoggedIn]);

  const isActive = (route: string) => pathname === route;

  return (
    <header className="w-full border-b bg-white z-50">
      <nav className="max-w-[1280px] mx-auto flex justify-between items-center px-4 py-4">
        {/* LEFT: Logo + Nav */}
        <div className="flex items-center gap-12">
          <Link href="/">
            <h1 className="font-bold text-2xl">TenderHub</h1>
          </Link>

          <ul className="hidden md:flex gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={
                    isActive(href)
                      ? 'font-bold text-black'
                      : 'text-zinc-600 hover:text-black'
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: Auth or Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
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

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden text-2xl text-black"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          {/* Mobile Profile (if logged in) */}
          {isLoggedIn && user && (
            <div className="md:hidden">
              <ProfileDropdown user={user} />
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t py-4 px-6 space-y-4">
          <ul className="space-y-2">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={
                    isActive(href)
                      ? 'font-bold text-black'
                      : 'text-zinc-600 hover:text-black'
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {!isLoggedIn && (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" className="text-zinc-600 hover:text-black">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-black rounded-2xl py-2 px-5 text-white hover:opacity-90 w-fit"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
