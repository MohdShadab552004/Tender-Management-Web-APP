'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProfileDropdownProps {
  user: {
    email: string;
    joined: string;
    company: {
      name: string;
      logo_url?: string;
    };
  };
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, setIsLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0';
    setIsLoggedIn(false);
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <li
        className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer border"
        onClick={toggleDropdown}
      >
        <Image
          src={user.company?.logo_url || '/images/hero-images.png'}
          alt="avatar"
          width={50}
          height={50}
          className="rounded-full object-cover"
        />
      </li>

      {isOpen && (
        <div className="absolute top-14 right-0 bg-white rounded-xl shadow-lg w-[280px] z-50">

          <div className="flex gap-4 items-center p-4 border-b">
            <Image
              width={48}
              height={48}
              src={user.company?.logo_url || '/images/hero-images.png'}
              alt="Profile"
              className="rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold">{user.company?.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>


          <div className="p-4 border-b">
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="hover:underline cursor-pointer" onClick={() => {
                router.push('/profile')
                setIsOpen(false);
              }}>My Profile</li>
              <li className="hover:underline cursor-pointer" onClick={() => {
                router.push('/tender/mytender')
                setIsOpen(false);
              }}>
                My Tenders
              </li>
              <li className="hover:underline cursor-pointer" onClick={() => {
                router.push('/tender/create')
                setIsOpen(false);
              }}>Create Tender</li>
            </ul>
          </div>

          <div className="p-4">
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="hover:underline cursor-pointer">Help</li>
              <li
                className="hover:underline text-red-500 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
