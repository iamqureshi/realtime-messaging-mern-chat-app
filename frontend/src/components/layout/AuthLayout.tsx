import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  backgroundImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", // Abstract dark purple fluid
  title = "Capturing Moments,\nCreating Memories",
  subtitle
}) => {
  return (
    <div className="min-h-screen bg-[#13131f] flex items-center justify-center p-4">
      <div className="w-full max-w-[1200px] h-[800px] bg-[#1c1c2e] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-fade-in">
        
        {/* Left Side - Image Board */}
        <div className="hidden md:flex flex-col justify-between w-1/2 relative overflow-hidden p-12 text-white">
            <div className="absolute inset-0">
                <img 
                    src={backgroundImage} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>

            {/* Logo area */}
            <div className="relative z-10">
                <h1 className="text-2xl font-bold tracking-wider">AMU</h1>
            </div>

            {/* Bottom Text */}
            <div className="relative z-10 space-y-4 mb-8">
                <h2 className="text-4xl font-semibold leading-tight whitespace-pre-line">
                    {title}
                </h2>
                {subtitle && <p className="text-gray-300">{subtitle}</p>}
                
                {/* Carousel dots mockup */}
                <div className="flex gap-2 mt-6">
                    <div className="w-8 h-1 bg-white rounded-full"></div>
                    <div className="w-2 h-1 bg-white/50 rounded-full"></div>
                    <div className="w-2 h-1 bg-white/50 rounded-full"></div>
                </div>
            </div>
            
            <a href="/" className="absolute top-12 right-12 z-10 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm hover:bg-white/20 transition-all border border-white/20">
                Back to website →
            </a>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto flex flex-col justify-center bg-[#1c1c2e] text-white">
            {children}
        </div>
      </div>
    </div>
  );
};
