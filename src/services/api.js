
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const FIXED_SOURCE = "cbm";

const toNumberOrNull = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
};

const normalizeAssetPath = (value) => {
    if (!value || typeof value !== "string") return null;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    const normalized = value.replace(/\\/g, "/");
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const normalizePathMap = (value) => {
    if (!value || typeof value !== "object") return {};
    return Object.fromEntries(
        Object.entries(value).map(([key, path]) => [key, normalizeAssetPath(path)])
    );
};

const normalizeConcepts = (payload) => {
    if (payload?.concepts && typeof payload.concepts === "object") {
        return payload.concepts;
    }

    const fallbackConcepts = {};
    ["NO", "NC", "CO", "PSC"].forEach((name) => {
        const score = toNumberOrNull(payload?.[name]);
        if (score !== null) {
            fallbackConcepts[name] = {
                score,
                severity: "N/A",
                confidence: null,
            };
        }
    });

    return fallbackConcepts;
};

const normalizeExplanation = (payload) => {
    if (Array.isArray(payload?.explanation)) {
        return payload.explanation.map((item) => String(item)).filter(Boolean);
    }

    if (typeof payload?.explanation === "string" && payload.explanation.trim()) {
        return [payload.explanation.trim()];
    }

    return [];
};

const normalizeAnalyzeResponse = (payload = {}) => {
    const concepts = normalizeConcepts(payload);
    const hasConcepts = Object.keys(concepts).length > 0;
    const explanation = normalizeExplanation(payload);
    const conceptConfidences =
        payload?.concept_confidences && typeof payload.concept_confidences === "object"
            ? payload.concept_confidences
            : {};
    const dominantConceptFromConfidence = Object.entries(conceptConfidences).reduce(
        (best, [name, value]) => {
            const numeric = Number(value);
            if (!Number.isFinite(numeric)) return best;
            if (!best || numeric > best.value) {
                return { name, value: numeric };
            }
            return best;
        },
        null
    );

    if (!payload?.prediction) {
        console.warn("[analyzeImage] Missing `prediction` in backend response.");
    }
    if (!hasConcepts) {
        console.warn("[analyzeImage] Missing concept data (`concepts` and NO/NC/CO/PSC).");
    }
    if (!payload?.overall_severity) {
        console.warn("[analyzeImage] Missing `overall_severity` in backend response.");
    }
    if (!payload?.cataract_type) {
        console.warn("[analyzeImage] Missing `cataract_type` in backend response.");
    }

    const presenceScore = toNumberOrNull(payload?.presence_score);
    const legacyConfidence = toNumberOrNull(payload?.confidence);
    const normalizedConfidence = legacyConfidence ?? presenceScore;

    return {
        ...payload,
        prediction: payload?.prediction || "Analysis completed",
        is_cataract: typeof payload?.is_cataract === "boolean"
            ? payload.is_cataract
            : String(payload?.prediction || "").toLowerCase().includes("cataract") &&
              !String(payload?.prediction || "").toLowerCase().includes("no"),
        presence_score: presenceScore,
        presence_confidence: toNumberOrNull(payload?.presence_confidence),
        overall_score: toNumberOrNull(payload?.overall_score),
        overall_severity: payload?.overall_severity || payload?.severity || "N/A",
        cataract_type: payload?.cataract_type || "N/A",
        cataract_type_all_scores:
            payload?.cataract_type_all_scores && typeof payload.cataract_type_all_scores === "object"
                ? payload.cataract_type_all_scores
                : {},
        dominant_concept: payload?.dominant_concept || dominantConceptFromConfidence?.name || "N/A",
        concept_confidences: conceptConfidences,
        concepts,
        explanation,
        visual_explanations: Array.isArray(payload?.visual_explanations) ? payload.visual_explanations : [],
        treatment_action: payload?.treatment_action || "N/A",
        treatment_recommendation: payload?.treatment_recommendation || "No recommendation provided.",
        gradcam_url: normalizeAssetPath(payload?.gradcam_url || payload?.gradcam || payload?.gradcam_path),
        gradcam_paths: normalizePathMap(payload?.gradcam_paths),
        heatmap_url: normalizeAssetPath(payload?.heatmap_url || payload?.heatmap || payload?.heatmap_path),
        confidence: normalizedConfidence,
        confidence_level: payload?.confidence_level || payload?.overall_severity || "N/A",
    };
};

export const analyzeImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("source", FIXED_SOURCE);

    const response = await axios.post(
        `${API_BASE}/analyze?source=${FIXED_SOURCE}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    if (!response?.data || typeof response.data !== "object") {
        throw new Error("Invalid response from server. Please try again.");
    }

    const normalized = normalizeAnalyzeResponse(response.data);

    // Temporary debugging logs to compare backend payload vs frontend mapping.
    if (import.meta.env.DEV) {
        console.group("[analyzeImage] Backend vs Frontend payload");
        console.log("Raw response.data:", response.data);
        console.log("Normalized result:", normalized);
        console.log("Raw treatment fields:", {
            treatment_action: response.data?.treatment_action,
            treatment_recommendation: response.data?.treatment_recommendation,
        });
        console.log("Normalized treatment fields:", {
            treatment_action: normalized?.treatment_action,
            treatment_recommendation: normalized?.treatment_recommendation,
        });
        console.groupEnd();
    }

    return normalized;
};
