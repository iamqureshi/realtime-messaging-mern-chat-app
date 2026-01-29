import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#6b46c1] hover:bg-[#5a3aa5] text-white shadow-lg shadow-purple-900/20 active:scale-[0.98]",
    outline: "bg-transparent border border-[#404058] text-white hover:bg-[#2d2d3f] active:scale-[0.98]",
    ghost: "bg-transparent text-gray-400 hover:text-white",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
