export default function ResultCard({ result }) {
  if (!result) return null;

  const isCataract =
    result.prediction.toLowerCase().includes("cataract") &&
    !result.prediction.toLowerCase().includes("no");

  return (
    <div className="animate-fade-in duration-700 bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-700/50 relative overflow-hidden group">
      {/* Glow Effect */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/2 ${isCataract ? "bg-red-500" : "bg-emerald-500"}`}
      ></div>

      <div className="relative z-10 space-y-8">
        {/* Header & Confidence Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Diagnosis */}
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-2 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${isCataract ? "bg-red-500" : "bg-emerald-500"} animate-pulse`}
              ></span>
              Diagnosis
            </p>
            <h2
              className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-none ${isCataract ? "text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]" : "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"}`}
            >
              {result.prediction}
            </h2>
          </div>

          {/* Confidence Bar */}
          <div className="w-full md:w-64 bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                Confidence
              </span>
              <span className="text-2xl font-bold text-white">
                {result.confidence}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden relative">
              {/* Progress Fill */}
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${isCataract ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gradient-to-r from-emerald-600 to-emerald-400"}`}
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>

            <p className="text-right mt-1 text-[10px] text-slate-500 font-medium">
              Level:{" "}
              <span className="text-slate-300">{result.confidence_level}</span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

        {/* Analysis Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Insight */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01"
                  ></path>
                </svg>
              </div>
              AI Analysis
            </h3>
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 text-sm leading-relaxed text-slate-300 shadow-inner">
              {result.explanation}
            </div>
          </div>

          {/* Heatmap Visualization */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              Attention Map
            </h3>

            <p className="text-xs text-slate-400">
              Highlighted areas show regions the AI focused on while making its
              decision.
            </p>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg group">
              <img
                src={`http://127.0.0.1:8000${result.gradcam_url}`}
                alt="Grad-CAM Analysis"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-xs text-white font-medium bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  Visualizing affected regions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500 bg-slate-800/30 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-4 md:px-8 border-t border-slate-700/50">
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              Source:{" "}
              <span className="text-slate-400 font-medium">
                {result.image_source}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Time:{" "}
              <span className="text-slate-400 font-medium">
                {result.inference_time_sec}s
              </span>
            </span>
          </div>
          <div className="flex items-start gap-2 text-amber-500/90 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 max-w-sm">
            <svg
              className="w-4 h-4 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <span className="leading-tight">{result.medical_disclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
