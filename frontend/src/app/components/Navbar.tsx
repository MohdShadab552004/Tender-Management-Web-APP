'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const [loadingUser, setLoadingUser] = useState(false);

  // Check token from cookies in client-side only
  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='));
      setIsLoggedIn(!!token);
    };
    checkAuth();
  }, []);

  // Fetch user profile if logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingUser(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          credentials: 'include',
        });

        if (!res.ok) {
          setIsLoggedIn(false);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('❌ Error fetching user profile:', err);
        setIsLoggedIn(false);
      } finally {
        setLoadingUser(false);
      }
    };

    if (isLoggedIn) fetchUserProfile();
  }, [isLoggedIn]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
            {loadingUser ? (
              <span className="text-zinc-500">Loading...</span>
            ) : !isLoggedIn ? (
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
              user && <ProfileDropdown user={user} setIsLoggedIn={setIsLoggedIn} />
            )}
          </div>

          {/* Hamburger Icon (mobile) */}
          <button
            className="md:hidden text-2xl text-black"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
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

          {isLoggedIn && user && (
            <div className="pt-4 border-t mt-4">
              <ProfileDropdown user={user} setIsLoggedIn={setIsLoggedIn} />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
