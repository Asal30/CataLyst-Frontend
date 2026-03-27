import { jsPDF } from "jspdf";

// ─────────────────────────────────────────────────────────────────────────────
// ResultCard
// ─────────────────────────────────────────────────────────────────────────────
export default function ResultCard({ result }) {
  if (!result) return null;

  const predictionText = result.prediction || (result.is_cataract ? "Cataract Detected" : "No Cataract");
  const isCataract =
    typeof result.is_cataract === "boolean"
      ? result.is_cataract
      : predictionText?.toLowerCase().includes("cataract") &&
        !predictionText?.toLowerCase().includes("no");

  const percentageFromFraction = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return null;
    const normalized = numeric <= 1 ? numeric * 100 : numeric;
    return Math.max(0, Math.min(100, normalized));
  };

  const presenceScoreConfidence = percentageFromFraction(result.presence_score);
  const fallbackConfidence      = percentageFromFraction(result.confidence);
  const diagnosisConfidence =
    (presenceScoreConfidence !== null && presenceScoreConfidence > 0
      ? presenceScoreConfidence
      : fallbackConfidence) ?? 0;

  const confidenceLevel = result.confidence_level || result.overall_severity || "N/A";

  const normalizeExplanationPoint = (text) => {
    if (!text) return "";
    return String(text).replace(/\s+/g, " ").trim()
      .replace(/\bAI\b/gi, "the model")
      .replace(/\bindicate\b/gi, "suggest")
      .replace(/\bconsistent with\b/gi, "in line with");
  };

  const explanationPoints = Array.isArray(result.explanation)
    ? result.explanation.map(normalizeExplanationPoint).filter(Boolean)
    : result.explanation
      ? [normalizeExplanationPoint(result.explanation)]
      : ["No additional clinical explanation is available for this result."];

  const conceptsFromObject = result.concepts
    ? Object.entries(result.concepts).map(([name, values]) => ({
        name, score: values?.score, severity: values?.severity, confidence: values?.confidence,
      }))
    : [];
  const fallbackConcepts = ["NO", "NC", "CO", "PSC"]
    .filter((name) => result[name] !== undefined)
    .map((name) => ({ name, score: result[name], severity: "N/A", confidence: null }));
  const conceptRows = conceptsFromObject.length ? conceptsFromObject : fallbackConcepts;

  // ── URL helpers ──────────────────────────────────────────────────────────────
  const toAbsoluteAssetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `http://127.0.0.1:8000${path}`;
  };

  const conceptConfidences = result.concept_confidences || {};
  const dominantConcept    = result.dominant_concept;

  const originalImageSrc = toAbsoluteAssetUrl(
    result.original_image_url || result.image_url ||
    result.input_image_url    || result.uploaded_image_url
  );

  // ── Heatmap resolution ───────────────────────────────────────────────────────
  const heatmapPaths = result.heatmap_paths || {};
  const gradcamPaths = result.gradcam_paths || {};

  const focusHeatmapSrc =
    toAbsoluteAssetUrl(dominantConcept ? heatmapPaths[dominantConcept] : null) ||
    toAbsoluteAssetUrl(Object.values(heatmapPaths)[0] || null) ||
    toAbsoluteAssetUrl(dominantConcept ? gradcamPaths[dominantConcept] : null) ||
    toAbsoluteAssetUrl(Object.values(gradcamPaths)[0] || null) ||
    toAbsoluteAssetUrl(
      result.heatmap_url ||
      result.heatmap ||
      result.heatmap_path ||
      result.gradcam_url ||
      result.gradcam ||
      result.gradcam_path ||
      null
    );

  // ── Severity / type ──────────────────────────────────────────────────────────
  const overallSeverityScoreRaw = Number.isFinite(Number(result.overall_score))
    ? Number(result.overall_score) : null;
  const derivedOverallSeverityScore = conceptRows.length > 0
    ? conceptRows.reduce((s, c) => s + (Number(c.score) || 0), 0) / conceptRows.length
    : null;
  const overallSeverityScore =
    overallSeverityScoreRaw !== null && overallSeverityScoreRaw > 0
      ? overallSeverityScoreRaw : derivedOverallSeverityScore;

  const cataractType      = result.cataract_type || "N/A";
  const typeScores        = result.cataract_type_all_scores || null;
  const typeToConceptKey  = { Nuclear: "NO", Cortical: "CO", PSC: "PSC" };
  const conceptKeyForType = typeToConceptKey[cataractType] || cataractType;
  const typeScoreValues   = typeScores ? Object.values(typeScores).map(Number) : [];
  const hasValidTypeScores =
    typeScoreValues.length > 0 && typeScoreValues.every(Number.isFinite);
  const dominantTypeScore =
    hasValidTypeScores && cataractType !== "N/A" &&
    Number.isFinite(Number(typeScores[cataractType]))
      ? Number(typeScores[cataractType]) : null;
  const typeScoreTotal = hasValidTypeScores
    ? typeScoreValues.reduce((s, v) => s + v, 0) : null;
  const typeConfidenceFromScores =
    dominantTypeScore !== null && typeScoreTotal && typeScoreTotal > 0
      ? (dominantTypeScore / typeScoreTotal) * 100 : null;
  const typeConfidenceFromConcept = percentageFromFraction(conceptConfidences?.[conceptKeyForType]);
  const typeConfidence = typeConfidenceFromScores ?? typeConfidenceFromConcept;

  // ── Export ───────────────────────────────────────────────────────────────────
  const reportPayload = {
    prediction: predictionText,
    concept_scores: conceptRows.map((c) => ({
      concept: c.name,
      score: Number.isFinite(Number(c.score)) ? Number(c.score) : null,
      severity: c.severity || "N/A",
      confidence: percentageFromFraction(c.confidence),
    })),
    overall_severity: { score: overallSeverityScore, label: result.overall_severity || "N/A" },
    cataract_type: { type: cataractType, confidence: typeConfidence },
    explanation: explanationPoints,
    treatment: {
      action:         result.treatment_action         || "N/A",
      recommendation: result.treatment_recommendation || "No recommendation available.",
    },
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: "application/json;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `prediction-report-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF(); let y = 16;
    const title = (t) => { doc.setFont("helvetica","bold");   doc.setFontSize(12); doc.text(t,14,y); y+=7; };
    const text  = (t) => { doc.setFont("helvetica","normal"); doc.setFontSize(10);
      const lines = doc.splitTextToSize(t,180); doc.text(lines,14,y); y += lines.length*5+2; };
    title("CataLyst Prediction Report");
    text(`Prediction: ${reportPayload.prediction}`);
    text(`Severity: ${reportPayload.overall_severity.label} (${reportPayload.overall_severity.score ?? "N/A"})`);
    text(`Cataract Type: ${reportPayload.cataract_type.type}`);
    text(`Type Confidence: ${reportPayload.cataract_type.confidence === null ? "N/A" : `${reportPayload.cataract_type.confidence.toFixed(1)}%`}`);
    title("Concept Scores");
    reportPayload.concept_scores.forEach((c) =>
      text(`${c.concept}: score ${c.score ?? "N/A"}, severity ${c.severity}, confidence ${c.confidence === null ? "N/A" : `${c.confidence.toFixed(1)}%`}`)
    );
    title("Clinical Explanation");
    reportPayload.explanation.forEach((p) => text(`- ${p}`));
    title("Treatment");
    text(`Action: ${reportPayload.treatment.action}`);
    text(`Recommendation: ${reportPayload.treatment.recommendation}`);
    doc.save(`prediction-report-${Date.now()}.pdf`);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in duration-700 bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-700/50 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/2 ${isCataract ? "bg-red-500" : "bg-emerald-500"}`} />

      <div className="relative z-10 space-y-8">

        {/* Clinical Summary */}
        <div className="bg-gradient-to-r from-indigo-600/20 via-blue-600/10 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">Clinical Summary</p>
            <div className="flex items-center gap-2">
              <button onClick={handleExportJson} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-blue-400/40 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 transition-colors">Export JSON</button>
              <button onClick={handleExportPdf}  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-purple-400/40 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 transition-colors">Export PDF</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl px-3 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Overall Severity</p>
              <p className="text-xl font-semibold text-white mt-1">{overallSeverityScore !== null ? overallSeverityScore.toFixed(2) : "N/A"}</p>
              <p className="text-xs text-slate-300 mt-0.5">{result.overall_severity || "N/A"}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl px-3 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Detected Type</p>
              <p className="text-xl font-semibold text-white mt-1">{cataractType}</p>
              <p className="text-xs text-slate-300 mt-0.5">Nuclear / Cortical / PSC</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl px-3 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Type Confidence</p>
              <p className="text-xl font-semibold text-white mt-1">{typeConfidence === null ? "N/A" : `${typeConfidence.toFixed(1)}%`}</p>
              <p className="text-xs text-slate-300 mt-0.5">
                {typeConfidenceFromScores !== null
                  ? dominantTypeScore === null ? "No type score data" : `Score ${dominantTypeScore.toFixed(2)}`
                  : conceptConfidences?.[conceptKeyForType] !== undefined
                    ? `Concept confidence ${Number(conceptConfidences[conceptKeyForType]).toFixed(3)}`
                    : "No type score data"}
              </p>
            </div>
          </div>
        </div>

        {/* Diagnosis + Confidence */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-2 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isCataract ? "bg-red-500" : "bg-emerald-500"} animate-pulse`} />
              Diagnosis
            </p>
            <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-none ${isCataract ? "text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]" : "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"}`}>
              {predictionText}
            </h2>
          </div>
          <div className="w-full md:w-64 bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Confidence</span>
              <span className="text-2xl font-bold text-white">{diagnosisConfidence.toFixed(2)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ease-out ${isCataract ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gradient-to-r from-emerald-600 to-emerald-400"}`}
                style={{ width: `${diagnosisConfidence.toFixed(2)}%` }} />
            </div>
            <p className="text-right mt-1 text-[10px] text-slate-400 font-medium">
              Level: <span className="text-slate-300">{confidenceLevel}</span>
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {/* Concept Breakdown */}
        {!!conceptRows.length && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Concept Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {conceptRows.map((concept) => {
                const cc = percentageFromFraction(concept.confidence);
                const ac = percentageFromFraction(conceptConfidences?.[concept.name]);
                return (
                  <div key={concept.name} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-100">{concept.name}</p>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-slate-700/70 text-slate-300">{concept.severity || "N/A"}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">Score</p>
                      <p className="text-2xl font-semibold text-blue-300">
                        {Number.isFinite(Number(concept.score)) ? Number(concept.score).toFixed(2) : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">Confidence</p>
                      <p className="text-sm text-slate-200">{cc === null ? "N/A" : `${cc.toFixed(1)}%`}</p>
                      {ac !== null && <p className="text-[11px] text-slate-400">Activation: {ac.toFixed(1)}%</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clinical Explanation — full width */}
        <div className="space-y-4 w-full">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
            </div>
            Clinical Explanation
          </h3>
          <div className="bg-slate-800/50 p-6 md:p-8 lg:p-10 rounded-2xl border border-slate-700/50 text-base md:text-lg leading-relaxed text-slate-300 shadow-inner">
            <ul className="space-y-3 md:space-y-4 list-disc pl-5 md:pl-6 marker:text-blue-400">
              {explanationPoints.map((point, i) => (
                <li key={`${i}-${point.slice(0,20)}`} className="text-slate-200/95 pl-1">{point}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Model Focus Area — full width row, large original | Grad-CAM */}
        <div className="space-y-4 w-full">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            Model Focus Area
          </h3>
          <p className="text-sm text-slate-400">
            Dominant concept: <span className="text-slate-200 font-semibold">{dominantConcept || "N/A"}</span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {originalImageSrc && (
              <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700/50 shadow-xl shadow-black/20 group">
                <img
                  src={originalImageSrc}
                  alt="Original input"
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5 md:p-6">
                  <p className="text-sm text-white font-medium bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    Original Image
                  </p>
                </div>
              </div>
            )}

            {focusHeatmapSrc && (
              <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700/50 shadow-xl shadow-black/20 group">
                <img
                  src={focusHeatmapSrc}
                  alt="Grad-CAM heatmap"
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5 md:p-6">
                  <p className="text-sm text-white font-medium bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    Grad-CAM Heatmap
                  </p>
                </div>
              </div>
            )}

            {!originalImageSrc && !focusHeatmapSrc && (
              <div className="lg:col-span-2 flex items-center justify-center min-h-[12rem] rounded-2xl border border-dashed border-slate-700 text-sm text-slate-500">
                Visual outputs are not available for this result.
              </div>
            )}
          </div>
        </div>

        {/* Visual Explanation Details */}
        {!!result.visual_explanations?.length && (
          <div className="space-y-3 w-full">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Visual Explanation Details</h3>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 md:p-6">
              <ul className="space-y-2 list-disc pl-5 text-sm text-slate-200/95">
                {result.visual_explanations.map((item, i) => (
                  <li key={`${item?.concept || "concept"}-${i}`}>
                    {item?.text || `${item?.concept || "Concept"} activation details are available.`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Treatment Recommendation */}
        {(result.treatment_action || result.treatment_recommendation) && (
          <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-emerald-500/15 rounded-lg text-emerald-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5-1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-sm font-semibold text-emerald-200 uppercase tracking-wide">Treatment Recommendation</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-900/55 border border-slate-700/60 rounded-xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Action</p>
                <p className="text-base font-semibold text-white mt-1">{result.treatment_action || "N/A"}</p>
              </div>
              <div className="bg-slate-900/55 border border-slate-700/60 rounded-xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Recommendation</p>
                <p className="text-sm leading-relaxed text-slate-200 mt-1">{result.treatment_recommendation || "No recommendation available."}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500 bg-slate-800/30 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-4 md:px-8 border-t border-slate-700/50">
          <div className="flex flex-wrap gap-4">
            {result.image_source && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Source: <span className="text-slate-400 font-medium">{result.image_source}</span>
              </span>
            )}
            {result.inference_time_sec !== undefined && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Time: <span className="text-slate-400 font-medium">{result.inference_time_sec}s</span>
              </span>
            )}
          </div>
          {result.medical_disclaimer && (
            <div className="flex items-start gap-2 text-amber-500/90 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 max-w-sm">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="leading-tight">{result.medical_disclaimer}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}