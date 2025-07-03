'use client';
import React from 'react';

interface InputFieldProps {
  type?: string;
  id: string;
  label: string;
  value: string;
  isRequired: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  textarea?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  id,
  label,
  value,
  onChange,
  isRequired,
  placeholder = ' ',
  textarea = false,
}) => {
  return (
    <div className="relative w-full">
      {textarea ? (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={isRequired}
          className="peer w-full border border-zinc-300 py-3 px-4 rounded-xl min-h-[120px]
            focus:outline-none focus:border-black placeholder-transparent resize-none"
        />
      ) : (
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={isRequired}
          className="peer w-full border border-zinc-300 py-3 px-4 rounded-xl
            focus:outline-none focus:border-black placeholder-transparent"
        />
      )}
      <label
        htmlFor={id}
        className="absolute left-4 top-3 text-zinc-500 text-base transition-all bg-white px-1
        peer-placeholder-shown:top-3
        peer-placeholder-shown:text-base
        peer-placeholder-shown:text-zinc-400
        peer-focus:top-[-10px]
        peer-focus:text-sm
        peer-focus:text-black
        peer-[&:not(:placeholder-shown)]:top-[-10px]
        peer-[&:not(:placeholder-shown)]:text-sm
        peer-[&:not(:placeholder-shown)]:text-black"
      >
        {label}
      </label>
    </div>
  );
};

export default InputField;
