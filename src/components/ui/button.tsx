import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg text-sm h-11 px-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand hover:bg-brand-hover text-menu-text shadow-sm",
    outline:
      "border border-slate-300 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300",
    ghost:
      "hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
