import { useState, useCallback } from 'react';
import clsx from 'clsx';

export default function ImageUploader({ onImageSelect, preview }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  return (
    <div className="w-full group">
      <div 
        className={clsx(
          "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 overflow-hidden",
          dragActive 
            ? "border-blue-500 bg-blue-500/10 scale-[1.02]" 
            : "border-slate-700 hover:border-blue-400 bg-slate-900/50 hover:bg-slate-800",
          preview ? "p-0 border-none" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative group/preview h-64 w-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover/preview:scale-105" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm rounded-2xl">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onImageSelect(null);
                }}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full hover:bg-white/20 hover:scale-105 transition-all text-sm font-semibold shadow-xl"
              >
                Change Image
              </button>
            </div>
            
            {/* Scan Effect Overlay */}
            <div className="absolute inset-x-0 h-1 bg-blue-500/50 shadow-[0_0_20px_#3b82f6] animate-scan pointer-events-none opacity-50"></div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer h-64 relative z-10">
            <div className={clsx(
                "p-4 rounded-full bg-slate-800 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500/20",
                dragActive ? "animate-bounce" : ""
            )}>
                <svg className={clsx("w-8 h-8 transition-colors", dragActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </div>
            <p className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
              {dragActive ? "Drop to Upload" : "Upload Eye Image"}
            </p>
            <p className="text-sm text-slate-500 mt-2">
                Drag & drop or click to browse
            </p>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleChange} 
            />
          </label>
        )}
      </div>
    </div>
  );
}
