import React from 'react';

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  step?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, prefix, step = "0.01" }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type="number"
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${prefix ? 'pl-8' : ''}`}
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
        />
      </div>
    </div>
  );
};
