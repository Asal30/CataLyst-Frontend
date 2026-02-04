import clsx from 'clsx';

export default function SourceSelector({ source, setSource }) {
  const options = [
    { id: 'upload', label: 'Upload Image', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { id: 'capture', label: 'Capture Image', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' }
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
