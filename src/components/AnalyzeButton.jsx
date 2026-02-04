export default function AnalyzeButton({ onClick, loading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full py-4 px-6 rounded-2xl font-bold text-lg relative overflow-hidden group
        transition-all duration-300 transform
        ${disabled 
          ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
          : 'text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] active:scale-[0.98]'
        }
      `}
    >
      {/* Animated Gradient Background */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
      )}
      
      {/* Shine Effect */}
      {!disabled && !loading && (
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
      )}

      <div className="relative z-20 flex items-center justify-center gap-3">
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="tracking-wide">ANALYZING...</span>
          </>
        ) : (
          <>
            <span className="tracking-wide">{disabled ? 'SELECT IMAGE FIRST' : 'START ANALYSIS'}</span>
            {!disabled && (
                 <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                 </svg>
            )}
          </>
        )}
      </div>
    </button>
  );
}
