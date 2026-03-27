import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import ImageUploader from "./components/ImageUploader";
import AnalyzeButton from "./components/AnalyzeButton";
import ResultCard from "./components/ResultCard";
import PredictionHistory from "./components/PredictionHistory";
import Disclaimer from "./components/Disclaimer";
import { analyzeImage } from "./services/api";
import { useMessage } from "./components/MessageContext";

const HISTORY_STORAGE_KEY = "catalyst_prediction_history";

const fileToDataUrl = (file) =>
  new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

function App() {
  const [view, setView] = useState("landing"); // 'landing' | 'app'
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState("");
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const { showMessage } = useMessage();

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage errors (private mode / storage quota).
    }
  }, [history]);

  const handleStart = () => {
    setView("app");
  };

  const handleImageSelect = (file) => {
    setImage(file);
    setApiError("");
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!image) {
      showMessage("Please select an image first.", "warning");
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const data = await analyzeImage(image);
      setResult({
        ...data,
        uploaded_image_url: data?.uploaded_image_url || preview || null,
      });
      const thumbnail = (await fileToDataUrl(image)) || preview;
      const historyEntry = {
        id: `${Date.now()}`,
        thumbnail,
        severity: data?.overall_severity || "N/A",
        cataractType: data?.cataract_type || "N/A",
        createdAt: new Date().toISOString(),
      };
      setHistory((prev) => [historyEntry, ...prev].slice(0, 8));
      showMessage("Image analyzed successfully.", "success");
    } catch (err) {
      setResult(null);
      setApiError(err?.message || "Unable to analyze image. Please try again.");
      showMessage(
        err?.message || "Unable to analyze image. Please try a clearer eye image.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500/30">
      {view === "landing" ? (
        <LandingPage onStart={handleStart} />
      ) : (
        <div className="animate-fade-in min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="w-full max-w-2xl relative z-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div 
                onClick={() => setView('landing')}
                className="cursor-pointer inline-block"
              >
                  <h1 className="text-4xl font-extrabold tracking-tight">
                    <span className="text-white">Cata</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Lyst</span>
                  </h1>
              </div>
              <p className="text-slate-400">AI-Powered Cataract Screening</p>
            </div>

            {/* Main Application Card */}
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-8 animate-slide-up">
              <div className="space-y-6">
                <ImageUploader onImageSelect={handleImageSelect} preview={preview} />
                <AnalyzeButton 
                  onClick={handleAnalyze} 
                  loading={loading} 
                  disabled={!image || loading}
                />
              </div>

              {apiError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <p className="font-semibold mb-1">Prediction failed</p>
                  <p className="text-red-100/90">{apiError}</p>
                </div>
              )}

              {loading && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-4">
                  <div className="flex items-center gap-3 text-sm text-blue-100">
                    <svg className="animate-spin h-4 w-4 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Analyzing image and generating prediction...</span>
                  </div>
                </div>
              )}

              {!loading && !result && !image && (
                <div className="rounded-xl border border-slate-700/70 bg-slate-800/30 px-4 py-4 text-sm text-slate-300">
                  <p className="font-semibold text-slate-200 mb-1">No image selected yet</p>
                  <p className="text-slate-400">
                    Upload an eye image to start analysis and view clinical results.
                  </p>
                </div>
              )}

              {result && (
                <div className="animate-fade-in pt-6 border-t border-slate-700/50">
                   <ResultCard result={result} />
                </div>
              )}
            </div>
            <PredictionHistory items={history} />
             <Disclaimer />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
