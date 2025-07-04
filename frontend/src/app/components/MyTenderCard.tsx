'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface TenderType {
  id: number;
  title: string;
  description: string;
  deadline: string;
  budget: string;
  applicationCount?: number;
}

interface MyTenderCardProps {
  tender: TenderType;
  onDelete?: (id: number) => Promise<void>;
  setTender: (updatedTender: TenderType) => void;
}

const MyTenderCard: React.FC<MyTenderCardProps> = ({ tender, onDelete, setTender }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: tender.title,
    description: tender.description,
    deadline: tender.deadline,
    budget: tender.budget,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tender/edit/${tender.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update tender');

      const updated = await res.json();
      setTender(updated);
      setIsEditing(false);
      toast.success('Tender updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error updating tender');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tender/delete/${tender.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to delete tender');

      const deleted = await res.json();
      await onDelete(deleted?.deletedTender?.id);
      toast.success('Tender deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error deleting tender');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-4 border border-gray-200 relative">
      <h5 className="font-bold text-xl text-black">{`#${tender.id}`}</h5>
      <h2 className="text-xl font-bold text-black">{tender.title}</h2>
      <p className="text-gray-700 mt-2">{tender.description}</p>

      <div className="mt-4 text-sm text-gray-500 space-y-1">
        <p>
          <span className="font-medium">Deadline:</span>{' '}
          {new Date(tender.deadline).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Budget:</span> ₹{tender.budget}
        </p>
        {tender.applicationCount !== undefined && (
          <p>
            <span className="font-medium">Applications:</span> {tender.applicationCount}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/tender/${tender.id}/application`}
          className="bg-zinc-900 text-white px-4 py-2 rounded hover:bg-zinc-800 transition-colors"
        >
          View Applications
        </Link>

        <button
          onClick={() => setIsEditing(true)}
          className="bg-zinc-900 text-white px-4 py-2 rounded hover:bg-zinc-800 transition-colors"
        >
          Edit
        </button>

        {showDeleteConfirm ? (
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-white text-black px-4 py-2 rounded border hover:bg-black hover:text-white transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg border border-zinc-300">
            <h2 className="text-xl font-bold mb-4">Edit Tender #{tender.id}</h2>
            <div className="space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Tender Title"
                className="w-full p-2 border border-zinc-300 rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tender Description"
                className="w-full p-2 border border-zinc-300 rounded"
              />
              <input
                name="deadline"
                type="date"
                value={formData.deadline.split('T')[0]}
                onChange={handleChange}
                className="w-full p-2 border border-zinc-300 rounded"
              />
              <input
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Budget"
                className="w-full p-2 border border-zinc-300 rounded"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-zinc-300 rounded hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTenderCard;
