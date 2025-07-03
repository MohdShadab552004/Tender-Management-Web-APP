'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface ProfileClientProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const ProfileClient: React.FC<ProfileClientProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user.email || '',
    company: {
      name: user.company?.name || '',
      industry: user.company?.industry || '',
      description: user.company?.description || '',
    },
    totalBidding: user.totalBidding || 0
  });

  const handleEdit = () => setIsEditing(true);
  const handleClose = () => setIsEditing(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('company.')) {
      const field = name.split('.')[1];
      setFormData((prev: any) => ({
        ...prev,
        company: {
          ...prev.company,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:8080/profile/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const updated = await res.json();
      setUser(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save changes');
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 px-4 py-10 flex justify-center font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg border border-zinc-200 relative">
        {/* Edit Button */}
        <button
          onClick={handleEdit}
          className="absolute top-6 right-6 bg-zinc-900 text-white px-4 py-2 text-sm rounded hover:bg-zinc-800"
        >
          Edit Profile
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Image
            src={user.company.logo_url || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className="rounded-full border border-zinc-300"
          />
          <div>
            <p className="text-zinc-600 text-lg font-semibold">{user.email}</p>
            <p className="text-sm text-zinc-500 mt-1">Joined on {user.joined}</p>
          </div>
        </div>

        {/* Company Info */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Company Details</h2>
          <p><span className="font-medium">Name:</span> {user.company.name}</p>
          <p><span className="font-medium">Industry:</span> {user.company.industry}</p>
          <p className="mt-2 text-zinc-700">{user.company.description}</p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-zinc-100 p-4 rounded-lg border border-zinc-200">
            <h3 className="text-lg font-bold">{user.company.tendersPosted}</h3>
            <p className="text-sm text-zinc-500">Tenders Posted</p>
          </div>
          <div className="bg-zinc-100 p-4 rounded-lg border border-zinc-200">
            <h3 className="text-lg font-bold">{user.company.applicationsSent}</h3>
            <p className="text-sm text-zinc-500">Applications Sent</p>
          </div>
          <div className="bg-zinc-100 p-4 rounded-lg border border-zinc-200">
            <h3 className="text-lg font-bold">₹{user.totalBidding}</h3>
            <p className="text-sm text-zinc-500">Total Bids</p>
          </div>
          
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg border border-zinc-300">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="w-full p-2 border border-zinc-300 rounded"
              />
              <input
                name="company.name"
                value={formData.company.name}
                onChange={handleChange}
                placeholder="Company name"
                className="w-full p-2 border border-zinc-300 rounded"
              />
              <input
                name="company.industry"
                value={formData.company.industry}
                onChange={handleChange}
                placeholder="Industry"
                className="w-full p-2 border border-zinc-300 rounded"
              />
              <textarea
                name="company.description"
                value={formData.company.description}
                onChange={handleChange}
                placeholder="Company Description"
                className="w-full p-2 border border-zinc-300 rounded"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-zinc-300 rounded hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfileClient;
