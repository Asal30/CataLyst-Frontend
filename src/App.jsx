// import { useState } from 'react';
// import ImageUploader from './components/ImageUploader';
// import SourceSelector from './components/SourceSelector';
// import AnalyzeButton from './components/AnalyzeButton';
// import ResultCard from './components/ResultCard';
// import HeatmapView from './components/HeatmapView';
// import Disclaimer from './components/Disclaimer';
// // eslint-disable-next-line no-unused-vars
// import { analyzeImage } from './services/api';
// import './App.css';

// function App() {
//   const [source, setSource] = useState('upload'); // 'upload' or 'camera'
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   const handleImageSelect = (file, url) => {
//     setSelectedFile(file);
//     setPreviewUrl(url);
//     setResult(null); // Reset result when new image is selected
//     setError(null);
//   };

//   const handleAnalyze = async () => {
//     if (!selectedFile) return;

//     setIsAnalyzing(true);
//     setError(null);
//     setResult(null);

//     try {
//       // TODO: Replace with actual API call once backend is ready
//       // const data = await analyzeImage(selectedFile);
      
//       // Mock result for demonstration
//       await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
//       const mockResult = {
//         prediction: Math.random() > 0.5 ? 'Cataract Detected' : 'Normal Eye',
//         confidence: 0.85 + Math.random() * 0.14,
//         details: 'Analysis based on opacity patterns and lens clarity markers.',
//         // In a real app, the backend would return a heatmap URL or base64
//         // heatmapUrl: '...' 
//       };
      
//       setResult(mockResult);
//     } catch (err) {
//       setError(err.message || 'Failed to analyze image. Please try again.');
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
//       <div className="max-w-3xl mx-auto">
        
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
//             CataLyst
//           </h1>
//           <p className="text-slate-400 text-lg">
//             Advanced AI-Powered Cataract Screening
//           </p>
//         </div>

//         {/* Main Card */}
//         <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-slate-700/50 p-6 sm:p-8">
          
//           <SourceSelector 
//             selectedSource={source} 
//             onSourceChange={setSource} 
//           />

//           {source === 'upload' ? (
//             <ImageUploader onImageSelect={handleImageSelect} />
//           ) : (
//             <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/50">
//               <p className="text-slate-400">Camera capture coming soon</p>
//             </div>
//           )}

//           {error && (
//             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
//               {error}
//             </div>
//           )}

//           <div className="mt-8">
//             <AnalyzeButton 
//               onClick={handleAnalyze} 
//               isLoading={isAnalyzing} 
//               disabled={!selectedFile}
//             />
//           </div>

//           {result && (
//             <div className="mt-8 pt-8 border-t border-slate-700/50">
//               <ResultCard result={result} />
//               <HeatmapView 
//                 imageSrc={previewUrl} 
//                 overlaySrc={null} // Pass heatmap URL here when available
//               />
//             </div>
//           )}

//         </div>

//         <Disclaimer />
        
//       </div>
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import SourceSelector from "./components/SourceSelector";
import AnalyzeButton from "./components/AnalyzeButton";
import { analyzeImage } from "./services/api";
import ResultCard from "./components/ResultCard";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [source, setSource] = useState("mobile");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageSelect = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const data = await analyzeImage(image, source);
      setResult(data);
    } catch (err) {
      alert("Error analyzing image");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl p-6">

        <h1 className="text-2xl font-bold text-center mb-2">CataLyst</h1>
        <p className="text-center text-slate-400 text-sm mb-6">
          AI-assisted cataract screening
        </p>

        <ImageUploader onImageSelect={handleImageSelect} />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-4 rounded-xl border border-slate-700"
          />
        )}

        <SourceSelector source={source} setSource={setSource} />

        <AnalyzeButton onClick={handleAnalyze} loading={loading} />
        <ResultCard result={result} />

      </div>
    </div>
  );
}

export default App;
