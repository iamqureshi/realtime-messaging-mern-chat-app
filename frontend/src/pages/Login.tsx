import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    loginIdentifier: "", // Can be email or username
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        // Backend expects { userName, email, password }
        // We will send loginIdentifier as both email and userName if we don't distinguish on client
        // Or better, let's just guess if it has @ then it's email.
        const isEmail = formData.loginIdentifier.includes('@');
        
        await login({
            email: isEmail ? formData.loginIdentifier : undefined,
            userName: !isEmail ? formData.loginIdentifier : undefined,
            password: formData.password
        });
        
        // On success, redirect to home/dashboard
        navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back!">
      <div className="max-w-md w-full mx-auto space-y-8 animate-slide-up">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Log in</h2>
            <p className="text-gray-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors underline-offset-4 hover:underline">
                    Create an account
                </Link>
            </p>
        </div>

        {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                name="loginIdentifier"
                placeholder="Email or Username"
                value={formData.loginIdentifier}
                onChange={handleChange}
                required
            />

            <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <div className="flex justify-end">
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Forgot password?
                </a>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
            </Button>
        </form>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#404058]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1c1c2e] px-2 text-gray-500">Or log in with</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
            </Button>
            <Button variant="outline" type="button">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.56-2.06-.48-3.08.08-1.04.55-1.72.31-2.18-.75-.68-1.55-1.22-3.11-.8-4.9.41-1.76 1.55-2.84 3.19-2.9 1.02-.04 1.77.38 2.34.61.64.24 1.45.1 2.04-.64 1.4-1.74 3.65-1.63 3.82-1.6-.13.85-.45 1.66-1.02 2.3-.61.68-1.48 1.15-2.29 1.12-.13 1.87 1.47 2.76 1.52 2.79-.01.03-.78 2.62-2.45 5.06-.55.8-1.12 1.61-2.08 1.61zM13.03 5c-.68 1.17-1.67 1.83-2.61 1.83-.24 0-.48-.02-.71-.06.27-1.14 1.03-2.03 1.85-2.5 1.05-.6 2.15-.6 2.15-.6.04.45.03.9-.68 1.33z" />
                </svg>
                Apple
            </Button>
        </div>
      </div>
    </AuthLayout>
  );
};
