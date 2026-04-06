import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full px-4 py-2.5 
            bg-white border-2 
            ${error ? "border-red-500" : "border-gray-200"} 
            rounded-lg 
            text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all duration-200
            shadow-sm
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
            ${className}
          `}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" aria-live="polite" className="mt-1.5 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
