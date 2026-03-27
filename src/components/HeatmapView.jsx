import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Shared image loader helper
// ─────────────────────────────────────────────────────────────────────────────
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// GradCamOverlay (canvas-based, jet colormap aware)
//
// heatmapSrc  MUST be the raw jet-colormap PNG from heatmap_paths[concept].
// Do NOT pass a pre-blended overlay — that would double-blend the colours.
// ─────────────────────────────────────────────────────────────────────────────
function GradCamOverlay({ originalSrc, heatmapSrc, className = "" }) {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const processOverlay = async () => {
      if (!heatmapSrc || !canvasRef.current) return;

      try {
        const canvas = canvasRef.current;
        const ctx    = canvas.getContext("2d");

        const [heatmap, original] = await Promise.all([
          loadImage(heatmapSrc),
          originalSrc ? loadImage(originalSrc) : Promise.resolve(null),
        ]);

        // Size canvas to original image resolution (may be larger than 224×224)
        const W = original ? (original.naturalWidth  || original.width)
                           : (heatmap.naturalWidth   || heatmap.width);
        const H = original ? (original.naturalHeight || original.height)
                           : (heatmap.naturalHeight  || heatmap.height);
        canvas.width  = W;
        canvas.height = H;

        // Scale heatmap up to original size on a temp canvas
        const tmp    = document.createElement("canvas");
        tmp.width    = W;
        tmp.height   = H;
        const tmpCtx = tmp.getContext("2d");
        tmpCtx.drawImage(heatmap, 0, 0, W, H);

        const imgData = tmpCtx.getImageData(0, 0, W, H);
        const pixels  = imgData.data;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i]     / 255;
          const g = pixels[i + 1] / 255;
          const b = pixels[i + 2] / 255;

          // Jet colormap decode: red/yellow = high activation, blue/green = low
          const heat    = r * 0.7 + g * 0.2 - b * 0.4 + 0.4;
          const clamped = Math.max(0, Math.min(1, heat));

          // Suppress low-activation background
          const threshold = 0.45;
          const alpha =
            clamped < threshold
              ? 0
              : Math.pow((clamped - threshold) / (1 - threshold), 1.2);

          pixels[i + 3] = Math.round(alpha * 210);
        }

        tmpCtx.putImageData(imgData, 0, 0);

        if (original) ctx.drawImage(original, 0, 0, W, H);
        else ctx.clearRect(0, 0, W, H);

        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(tmp, 0, 0);
        ctx.globalCompositeOperation = "source-over";

        if (!cancelled) setIsReady(true);
      } catch (err) {
        console.error("GradCAM overlay failed:", err);
        if (!cancelled) setIsReady(true);
      }
    };

    setIsReady(false);
    processOverlay();
    return () => { cancelled = true; };
  }, [heatmapSrc, originalSrc]);

  if (!heatmapSrc) return null;

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg border border-slate-700 group ${className}`}>
      {/* CSS fallback while canvas processes */}
      {!isReady && originalSrc && (
        <img src={originalSrc} alt="Base"
          className="absolute inset-0 w-full h-full object-cover" />
      )}
      {!isReady && (
        <img src={heatmapSrc} alt="Heatmap loading"
          className="absolute inset-0 w-full h-full object-cover opacity-50" />
      )}

      {/* Final composited canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ imageRendering: "auto", display: "block" }}
      />

      {/* Hover label */}
      <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-white text-center translate-y-full group-hover:translate-y-0 transition-transform">
        Saliency Map (Grad-CAM)
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeatmapView
//
// Props:
//   imageSrc    — URL of the original uploaded eye image  (/uploads/...)
//   overlaySrc  — URL of the RAW jet heatmap PNG          (/outputs/..._heatmap.jpg)
//                 Pass heatmap_paths[dominant_concept], NOT gradcam_paths.
// ─────────────────────────────────────────────────────────────────────────────
export default function HeatmapView({ imageSrc, overlaySrc }) {
  if (!imageSrc) return null;

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
        Analysis Visualization
      </h3>

      <div className="grid grid-cols-2 gap-4">

        {/* Original image */}
        <div className="relative rounded-lg overflow-hidden shadow-lg border border-slate-700 group">
          <img src={imageSrc} alt="Original" className="w-full h-40 object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-white text-center translate-y-full group-hover:translate-y-0 transition-transform">
            Original Image
          </div>
        </div>

        {/* Grad-CAM overlay — canvas-based, no CSS blend mode issues */}
        {overlaySrc ? (
          <GradCamOverlay
            originalSrc={imageSrc}
            heatmapSrc={overlaySrc}
            className="h-40"
          />
        ) : (
          <div className="flex items-center justify-center h-40 bg-slate-800 rounded-lg border border-dashed border-slate-700 text-xs text-slate-500">
            Processing visualization...
          </div>
        )}

      </div>
    </div>
  );
}