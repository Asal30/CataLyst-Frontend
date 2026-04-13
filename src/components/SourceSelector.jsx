export default function SourceSelector() {
  return (
    <div className="grid grid-cols-1 gap-3 p-1 bg-slate-900/50 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl bg-slate-700 text-white shadow-lg shadow-black/20">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        CBM Analysis
      </div>
    </div>
  );
}