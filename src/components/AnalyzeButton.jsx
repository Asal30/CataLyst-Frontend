// export default function AnalyzeButton({ onClick, isLoading, disabled }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled || isLoading}
//       className={`
//         w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform
//         ${disabled 
//           ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
//           : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]'
//         }
//       `}
//     >
//       {isLoading ? (
//         <span className="flex items-center justify-center gap-2">
//           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           Analyzing...
//         </span>
//       ) : (
//         'Analyze Image'
//       )}
//     </button>
//   );
// }

export default function AnalyzeButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full mt-6 bg-blue-600 hover:bg-blue-500 transition rounded-xl py-3 font-semibold disabled:opacity-50"
    >
      {loading ? "Analyzing..." : "Analyze Image"}
    </button>
  );
}
