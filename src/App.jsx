import { useState } from "react";
import LandingPage from "./components/LandingPage";
import ImageUploader from "./components/ImageUploader";
import SourceSelector from "./components/SourceSelector";
import AnalyzeButton from "./components/AnalyzeButton";
import ResultCard from "./components/ResultCard";
import Disclaimer from "./components/Disclaimer";
import { analyzeImage } from "./services/api";
import { useMessage } from "./components/MessageContext";

function App() {
  const [view, setView] = useState("landing"); // 'landing' | 'app'
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [source, setSource] = useState("mobile");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { showMessage } = useMessage();

  const handleStart = () => {
    setView("app");
  };

  const handleImageSelect = (file) => {
    setImage(file);
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
    try {
      const data = await analyzeImage(image, source);
      setResult(data);
      showMessage("Image analyzed successfully.", "success");
    } catch (err) {
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
              
              <SourceSelector source={source} setSource={setSource} />

              <div className="space-y-6">
                <ImageUploader onImageSelect={handleImageSelect} preview={preview} />
                
                <AnalyzeButton 
                  onClick={handleAnalyze} 
                  loading={loading} 
                  disabled={!image || loading}
                />
              </div>

              {result && (
                <div className="animate-fade-in pt-6 border-t border-slate-700/50">
                   <ResultCard result={result} />
                </div>
              )}

            </div>

             <Disclaimer />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
