import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-500 dark:text-neutral-500 mb-1.5 uppercase tracking-wide"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-11 px-3 bg-white dark:bg-neutral-950 border rounded-lg text-sm focus:outline-none transition-colors ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 dark:border-neutral-700 focus:border-brand"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
