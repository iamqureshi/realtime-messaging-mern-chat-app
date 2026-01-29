import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional label (though screenshot implies placeholders)
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  className = "",
  placeholder,
  error,
  fullWidth = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePassword = () => setShowPassword(!showPassword);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? "w-full" : ""}`}>
      <div className="relative">
        <input
          type={inputType}
          className={`
            w-full bg-[#2d2d3f] text-white border border-[#404058] rounded-lg px-4 py-3 
            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6b46c1] focus:border-transparent
            transition-all duration-200
            ${className}
          `}
          placeholder={placeholder}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span className="text-red-400 text-xs ml-1">{error}</span>}
    </div>
  );
};
