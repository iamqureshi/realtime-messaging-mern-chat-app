import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Shield, Zap, Globe } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-purple-500 selection:text-white">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
           </div>
           <span className="text-xl font-bold tracking-tight">ChatApp</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/chat"
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              Chat Room
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Connect with friends,<br /> effortlessly.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Experience real-time messaging with a focus on speed, security, and simplicity. 
            Join millions of users connecting everyday.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            {user ? (
               <Link
                to="/chat"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1"
               >
                Go to Chat
               </Link>
            ) : (
               <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Get Started for Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white font-semibold text-lg hover:bg-gray-750 hover:border-gray-600 transition-all duration-300"
                >
                  Live Demo
                </Link>
               </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-32 text-left">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Lightning Fast"
              description="Real-time message delivery with minimal latency using cutting-edge WebSocket technology."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-green-400" />}
              title="Secure by Default"
              description="End-to-end encryption ensures your conversations stay private and secure."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-blue-400" />}
              title="Global Connectivity"
              description="Connect with anyone, anywhere in the world. Break down barriers with instant translation."
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 ChatApp Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800 transition-colors">
    <div className="mb-4 p-3 bg-gray-900 rounded-lg w-fit">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);
