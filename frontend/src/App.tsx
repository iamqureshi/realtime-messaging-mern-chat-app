import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState<string>('Loading status...')

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => {
        console.error(err);
        setMessage('Backend Disconnected');
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 text-slate-50">
      <div className="glass-card max-w-2xl w-full rounded-3xl p-12 text-center transform transition-all duration-500 hover:scale-[1.01]">
         <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-teal-400 text-transparent bg-clip-text">
            Development Ready.
         </h1>
         <p className="text-xl text-slate-400 font-light mb-12">
            Full Stack TypeScript Template + Tailwind CSS
         </p>
         
         <div className="max-w-md mx-auto p-6 bg-black/20 rounded-xl border border-white/5 mb-10 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-semibold">System Status</p>
            <code className="font-mono text-teal-400 text-lg">{message}</code>
         </div>

         <div className="flex gap-4 justify-center">
            <button 
              onClick={() => alert('Working Fine!')}
              className="px-8 py-3 rounded-xl font-semibold bg-slate-50 text-slate-900 hover:bg-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              Start Coding
            </button>
            <button 
              onClick={() => window.location.href = 'http://localhost:5000'}
              className="px-8 py-3 rounded-xl font-semibold bg-transparent border border-white/20 text-slate-50 hover:bg-white/5 transition-all duration-300"
            >
              Check API
            </button>
         </div>
      </div>
    </div>
  )
}

export default App
