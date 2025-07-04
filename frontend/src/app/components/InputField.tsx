'use client';
import React from 'react';

type InputFieldProps = {
  type?: string;
  id: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  textarea?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} & React.RefAttributes<HTMLInputElement | HTMLTextAreaElement> &
  React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

const InputField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputFieldProps
>(
  (
    {
      type = 'text',
      id,
      label,
      isRequired = false,
      placeholder = ' ',
      textarea = false,
      value,
      onChange,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="relative w-full">
        {textarea ? (
          <textarea
            id={id}
            placeholder={placeholder}
            required={isRequired}
            value={value}
            onChange={onChange}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className="peer w-full border border-zinc-300 py-3 px-4 rounded-xl min-h-[120px]
              focus:outline-none focus:border-black placeholder-transparent resize-none"
            {...rest}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            required={isRequired}
            value={value}
            onChange={onChange}
            ref={ref as React.Ref<HTMLInputElement>}
            className="peer w-full border border-zinc-300 py-3 px-4 rounded-xl
              focus:outline-none focus:border-black placeholder-transparent"
            {...rest}
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
  }
);

InputField.displayName = 'InputField';
export default InputField;
