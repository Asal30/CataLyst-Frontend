export default function PredictionHistory({ items = [] }) {
  return (
    <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Recent Predictions</h3>
        <span className="text-xs text-slate-400">{items.length} saved</span>
      </div>

      {!items.length ? (
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/20 px-4 py-4 text-sm text-slate-400">
          No predictions yet. Run an analysis to see history here.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-slate-700/60 bg-slate-800/30 p-3"
            >
              <div className="h-14 w-14 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-900/60 shrink-0">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt="Prediction thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p className="text-slate-300 truncate">
                  Severity: <span className="text-slate-100 font-medium">{item.severity || "N/A"}</span>
                </p>
                <p className="text-slate-300 truncate">
                  Type: <span className="text-slate-100 font-medium">{item.cataractType || "N/A"}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
