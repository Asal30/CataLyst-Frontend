import { useState, useEffect } from 'react';

export default function LandingPage({ onStart }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className={`transition-all duration-1000 transform max-w-5xl mx-auto w-full z-10 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Logo/Icon */}
        <div className="mb-6 md:mb-8 relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative p-3 md:p-4 bg-black rounded-full border border-slate-800 shadow-2xl">
             <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
          </div>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight">
          <span className="block text-white">Cataract Screening</span>
          <span className="block text-gradient mt-1 md:mt-2 pb-2">Reimagined.</span>
        </h1>
        
        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
          Experience the future of eye health with our AI-powered detection system. 
          Instant analysis, medical-grade precision.
        </p>

        {/* CTA Button */}
        <div className="mt-8 md:mt-10 flex justify-center gap-4">
           <button 
             onClick={onStart}
             className="group relative px-8 py-4 bg-white text-slate-900 font-bold text-base md:text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] active:scale-95 touch-manipulation"
           >
             <span className="relative z-10 flex items-center gap-2">
               Start Screening
               <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
               </svg>
             </span>
           </button>
        </div>

        {/* Features Grid */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto px-4">
          {[
            { title: 'AI Analysis', desc: 'Deep learning powered detection', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
            { title: 'Instant Results', desc: 'Get feedback in seconds', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { title: 'Secure & Private', desc: 'Your data never leaves your device', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
          ].map((item, i) => (
            <div key={i} className="glass-card p-5 md:p-6 rounded-2xl text-left hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-3 md:mb-4 text-blue-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-base md:text-lg text-white mb-1 md:mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-4 sm:bottom-6 text-[10px] sm:text-xs text-slate-600 w-full text-center px-4">
        © 2026 CataLyst AI. Educational Purpose Only.
      </div>
    </div>
  );
}
