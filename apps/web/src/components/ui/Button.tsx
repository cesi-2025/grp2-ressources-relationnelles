import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-dark active:scale-95 shadow-md hover:shadow-lg",
    secondary:
      "bg-secondary text-white hover:bg-secondary-dark active:scale-95 shadow-md hover:shadow-lg",
    accent:
      "bg-accent text-gray-900 hover:bg-accent-dark active:scale-95 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white active:scale-95",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-5 py-2.5 text-base rounded-lg",
    lg: "px-7 py-3.5 text-lg rounded-xl",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
