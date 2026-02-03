// export default function ResultCard({ result }) {
//   if (!result) return null;

//   const isCataract = result.prediction.toLowerCase().includes('cataract');
//   const confidencePercent = (result.confidence * 100).toFixed(1);

//   return (
//     <div className={`
//       mt-6 p-6 rounded-xl border-l-4 shadow-lg animate-fade-in
//       ${isCataract 
//         ? 'bg-red-500/10 border-red-500 shadow-red-500/10' 
//         : 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10'
//       }
//     `}>
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className={`text-xl font-bold mb-1 ${isCataract ? 'text-red-400' : 'text-emerald-400'}`}>
//             {isCataract ? 'Cataract Detected' : 'Normal Eye'}
//           </h3>
//           <p className="text-slate-400 text-sm">
//             Based on our AI analysis
//           </p>
//         </div>
//         <div className={`
//           px-3 py-1 rounded-full text-xs font-bold border
//           ${isCataract 
//             ? 'bg-red-500/20 text-red-300 border-red-500/30' 
//             : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
//           }
//         `}>
//           {confidencePercent}% CONFIDENCE
//         </div>
//       </div>
      
//       {result.details && (
//         <div className="mt-4 pt-4 border-t border-slate-700/50">
//           <p className="text-sm text-slate-300">
//             {result.details}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


export default function ResultCard({ result }) {
  if (!result) return null;

  const isCataract =
    result.prediction.toLowerCase().includes("cataract") &&
    !result.prediction.toLowerCase().includes("no");

  return (
    <div className="mt-6 bg-slate-800 rounded-2xl p-5 border border-slate-700">

      {/* Prediction */}
      <h2
        className={`text-xl font-bold mb-2 ${
          isCataract ? "text-red-400" : "text-green-400"
        }`}
      >
        {result.prediction}
      </h2>

      {/* Confidence */}
      <p className="text-slate-300 text-sm mb-3">
        Confidence:{" "}
        <span className="font-semibold">
          {result.confidence}% ({result.confidence_level})
        </span>
      </p>

      {/* Explanation */}
      <div className="bg-slate-900 rounded-xl p-3 mb-4">
        <p className="text-slate-300 text-sm">
          <span className="font-semibold text-slate-200">
            AI Explanation:
          </span>{" "}
          {result.explanation}
        </p>
      </div>

      {/* Grad-CAM */}
      <div className="mb-4">
        <p className="text-slate-400 text-sm mb-2">
          Regions influencing the decision
        </p>
        <img
          src={`http://127.0.0.1:8000${result.gradcam_url}`}
          alt="Grad-CAM"
          className="rounded-xl border border-slate-700"
        />
      </div>

      {/* Meta info */}
      <p className="text-xs text-slate-500 mb-2">
        Image source: {result.image_source} • Inference time:{" "}
        {result.inference_time_sec}s
      </p>

      {/* Disclaimer */}
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-3 mt-3">
        <p className="text-yellow-300 text-xs">
          ⚠️ {result.medical_disclaimer}
        </p>
      </div>
    </div>
  );
}
