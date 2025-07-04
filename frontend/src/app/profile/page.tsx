'use client';

import React, { useEffect, useState } from 'react';
import ProfileClient from '../components/ProfileClient';
import ProfileShimmer from '../components/ProfileShimmer';
import { useRouter } from 'next/navigation';

export interface IUserProfile {
  email: string;
  joined?: string;
  totalBidding: number;
  company: {
    name: string;
    industry?: string;
    description?: string;
    logo_url?: string;
    tendersPosted?: number;
    applicationsSent?: number;
  };
}


const ProfilePage = () => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          credentials: 'include', // required if using cookies
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        console.log(data);
        setUser(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <div className="p-10 text-center"><ProfileShimmer /></div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!user) return null;

  return <ProfileClient user={user} setUser={setUser}/>;
};

export default ProfilePage;
