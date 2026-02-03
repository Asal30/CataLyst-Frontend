export default function HeatmapView({ imageSrc, overlaySrc }) {
  if (!imageSrc) return null;

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Analysis Visualization</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative rounded-lg overflow-hidden shadow-lg border border-slate-700 group">
          <img src={imageSrc} alt="Original" className="w-full h-40 object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-white text-center translate-y-full group-hover:translate-y-0 transition-transform">
            Original Image
          </div>
        </div>
        
        {overlaySrc ? (
          <div className="relative rounded-lg overflow-hidden shadow-lg border border-slate-700 group">
            <img src={imageSrc} alt="Base" className="absolute inset-0 w-full h-full object-cover" />
            <img src={overlaySrc} alt="Grad-CAM" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" />
            <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-white text-center translate-y-full group-hover:translate-y-0 transition-transform">
              Saliency Map (Grad-CAM)
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 bg-slate-800 rounded-lg border border-dashed border-slate-700 text-xs text-slate-500">
            Processing visualization...
          </div>
        )}
      </div>
    </div>
  );
}
