import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Select = forwardRef(({ className, label, options, error, onChange, ...props }, ref) => {
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50",
          error && "border-danger-500 focus:border-danger-500 focus:ring-danger-500",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";

export default Select;