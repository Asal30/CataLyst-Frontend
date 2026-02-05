import clsx from 'clsx';

export default function SourceSelector({ source, setSource }) {
  const options = [
    { id: 'mobile', label: 'Mobile Image', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'slitlamp', label: 'Slit Lamp Image', icon: 'M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3m4 8h-6a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2zm2 4h1a7 7 0 1 0 0-14h-1m-7 14h8m-11 4h18' }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-1 bg-slate-900/50 rounded-2xl border border-slate-800">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setSource(opt.id)}
          className={clsx(
            "relative flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all duration-300",
            source === opt.id 
              ? "bg-slate-700 text-white shadow-lg shadow-black/20" 
              : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
          )}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={opt.icon} />
          </svg>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
