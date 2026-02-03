// import { useState, useCallback } from 'react';

// export default function ImageUploader({ onImageSelect }) {
//   const [dragActive, setDragActive] = useState(false);
//   const [preview, setPreview] = useState(null);

//   const handleDrag = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   }, []);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0]);
//     }
//   }, []);

//   const handleChange = (e) => {
//     e.preventDefault();
//     if (e.target.files && e.target.files[0]) {
//       handleFile(e.target.files[0]);
//     }
//   };

//   const handleFile = (file) => {
//     if (file.type.startsWith('image/')) {
//       const url = URL.createObjectURL(file);
//       setPreview(url);
//       onImageSelect(file, url);
//     }
//   };

//   return (
//     <div className="w-full mb-6">
//       <div 
//         className={`
//           relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
//           ${dragActive 
//             ? 'border-blue-500 bg-blue-500/10' 
//             : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
//           }
//           ${preview ? 'border-none p-0 overflow-hidden' : ''}
//         `}
//         onDragEnter={handleDrag}
//         onDragLeave={handleDrag}
//         onDragOver={handleDrag}
//         onDrop={handleDrop}
//       >
//         {preview ? (
//           <div className="relative group">
//             <img 
//               src={preview} 
//               alt="Preview" 
//               className="w-full h-64 object-cover rounded-xl shadow-lg" 
//             />
//             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
//               <button 
//                 onClick={(e) => {
//                   e.stopPropagation(); // prevent triggering label click
//                   setPreview(null);
//                   onImageSelect(null, null);
//                 }}
//                 className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/20 transition"
//               >
//                 Change Image
//               </button>
//             </div>
//           </div>
//         ) : (
//           <label className="flex flex-col items-center justify-center cursor-pointer h-64">
//             <svg className="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//             </svg>
//             <p className="text-lg font-medium text-slate-200">Drag & Drop or Click to Upload</p>
//             <p className="text-sm text-slate-500 mt-2">Supports JPG, PNG</p>
//             <input 
//               type="file" 
//               className="hidden" 
//               accept="image/*" 
//               onChange={handleChange} 
//             />
//           </label>
//         )}
//       </div>
//     </div>
//   );
// }

export default function ImageUploader({ onImageSelect }) {
  return (
    <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center cursor-pointer">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        id="imageInput"
        onChange={(e) => onImageSelect(e.target.files[0])}
      />

      <label htmlFor="imageInput" className="cursor-pointer">
        <p className="text-slate-300 font-medium mb-1">
          Capture or Upload Eye Image
        </p>
        <p className="text-slate-500 text-sm">
          Use your mobile camera or choose a file
        </p>
      </label>
    </div>
  );
}
