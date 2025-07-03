'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../../components/InputField';

const CreateTenderPage = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tenderData = {
      title,
      description,
      deadline,
      budget: parseFloat(budget),
    };

    try {
      const res = await fetch('http://localhost:8080/tender/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(tenderData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Tender created successfully!');
        router.push('/');
      } else {
        alert(data.message || 'Failed to create tender.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Create New Tender</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-2xl space-y-6 border border-gray-200">
        <InputField
          id="title"
          label="Tender Title"
          value={title}
          isRequired
          onChange={(e) => setTitle(e.target.value)}
        />

        <InputField
          id="description"
          label="Description"
          value={description}
          isRequired
          textarea
          onChange={(e) => setDescription(e.target.value)}
        />

        <InputField
          id="deadline"
          label="Deadline"
          type="date"
          value={deadline}
          isRequired
          onChange={(e) => setDeadline(e.target.value)}
        />

        <InputField
          id="budget"
          label="Budget (INR)"
          type="number"
          value={budget}
          isRequired
          onChange={(e) => setBudget(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-3 text-white bg-black rounded-xl hover:bg-gray-800 transition"
        >
          Create Tender
        </button>
      </form>
    </main>
  );
};

export default CreateTenderPage;
