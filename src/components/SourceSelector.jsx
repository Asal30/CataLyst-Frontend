// export default function SourceSelector({ selectedSource, onSourceChange }) {
//   return (
//     <div className="flex bg-slate-800 p-1 rounded-lg mb-6">
//       <button
//         onClick={() => onSourceChange('upload')}
//         className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
//           selectedSource === 'upload'
//             ? 'bg-slate-700 text-white shadow-sm'
//             : 'text-slate-400 hover:text-slate-200'
//         }`}
//       >
//         Upload Image
//       </button>
//       <button
//         onClick={() => onSourceChange('camera')}
//         className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
//           selectedSource === 'camera'
//             ? 'bg-slate-700 text-white shadow-sm'
//             : 'text-slate-400 hover:text-slate-200'
//         }`}
//       >
//         Camera Capture
//       </button>
//     </div>
//   );
// }


export default function SourceSelector({ source, setSource }) {
  return (
    <div className="mt-4">
      <label className="text-slate-400 text-sm mb-2 block">
        Image Source
      </label>

      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white"
      >
        <option value="mobile">Mobile Phone</option>
        <option value="slitlamp">Slit-Lamp</option>
      </select>
    </div>
  );
}
