import React, { useState } from 'react';
import { ArtStyle, GeneratedSlide, GenerationStatus } from './types';
import { STYLE_CONFIGS } from './constants';
import { StyleCard } from './components/StyleCard';
import { SlideshowPlayer } from './components/SlideshowPlayer';
import { generateSlideshowContent } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'style' | 'generating' | 'playing'>('upload');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | null>(null);
  const [status, setStatus] = useState<GenerationStatus>({ step: 'idle', progress: 0, total: 0, message: '' });
  const [slides, setSlides] = useState<GeneratedSlide[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setStep('style');
      } else {
        alert("Please upload a valid audio MP3 file!");
      }
    }
  };

  const startGeneration = async () => {
    if (!audioFile || !selectedStyle) return;

    setStep('generating');
    setStatus({ step: 'analyzing', progress: 0, total: 0, message: 'Listening to vibes...' });

    try {
      // Pass the filename (minus extension) as the song title for context
      const songTitle = audioFile.name.replace(/\.[^/.]+$/, "");
      
      setStatus({ step: 'generating_images', progress: 0, total: 6, message: 'Dreaming up visuals...' });
      
      const generatedSlides = await generateSlideshowContent(
        songTitle,
        selectedStyle,
        (completed, total) => {
           setStatus({ 
             step: 'generating_images', 
             progress: completed, 
             total: total, 
             message: `Painting slide ${completed} of ${total}...` 
            });
        }
      );

      if (generatedSlides.length > 0) {
        setSlides(generatedSlides);
        setStep('playing');
      } else {
        alert("Oh no! The AI couldn't generate images. Try a different style!");
        setStep('style');
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong with the sparkle magic. Please check your API key.");
      setStep('style');
    }
  };

  const reset = () => {
    setStep('upload');
    setAudioFile(null);
    setSelectedStyle(null);
    setSlides([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      {/* Header / Title */}
      <header className="mb-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-sm pb-2">
          MP3 To Art
        </h1>
        <p className="text-xl font-bold text-indigo-700 opacity-80 mt-2">
          ✨ The Ultimate Kidcore Visualizer ✨
        </p>
      </header>

      {/* STEP 1: UPLOAD */}
      {step === 'upload' && (
        <div className="bg-white/50 backdrop-blur-md p-10 rounded-3xl shadow-xl border-4 border-white max-w-lg w-full text-center">
          <div className="mb-6">
            <i className="fas fa-music text-6xl text-pink-400 animate-bounce-slow"></i>
          </div>
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">Drop that beat!</h2>
          <p className="text-indigo-600 mb-8">Upload an MP3 to start the magic show.</p>
          
          <label className="cursor-pointer inline-block">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition hover:scale-105 active:scale-95 border-4 border-white">
              <i className="fas fa-cloud-upload-alt mr-2"></i> Choose MP3
            </span>
            <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      )}

      {/* STEP 2: SELECT STYLE */}
      {step === 'style' && (
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-3xl font-bold text-indigo-900 bg-white/40 px-4 py-2 rounded-xl backdrop-blur-sm">
              Pick your aesthetic! 🎨
            </h2>
            <button 
              onClick={startGeneration}
              disabled={!selectedStyle}
              className={`
                text-xl font-bold py-3 px-8 rounded-full shadow-xl border-4 border-white transition-all transform
                ${selectedStyle 
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-110 cursor-pointer animate-pulse' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              GO! 🚀
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 overflow-y-auto max-h-[70vh] rounded-3xl custom-scrollbar">
            {Object.values(ArtStyle).map((style) => (
              <StyleCard 
                key={style}
                style={style}
                isSelected={selectedStyle === style}
                onSelect={setSelectedStyle}
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: GENERATING */}
      {step === 'generating' && (
        <div className="bg-white/60 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl text-center max-w-md w-full border-8 border-pink-200">
           <div className="mb-8 relative">
             <div className="absolute inset-0 bg-pink-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
             <i className="fas fa-magic text-8xl text-purple-600 relative z-10 animate-spin-slow" style={{ animationDuration: '3s' }}></i>
           </div>
           
           <h3 className="text-3xl font-extrabold text-indigo-800 mb-2">Creating Magic...</h3>
           <p className="text-pink-600 font-bold text-lg mb-6">{status.message}</p>
           
           {/* Progress Bar */}
           <div className="w-full bg-white h-6 rounded-full overflow-hidden border-2 border-indigo-200">
             <div 
                className="h-full bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${status.total > 0 ? (status.progress / status.total) * 100 : 5}%` }}
             ></div>
           </div>
           <p className="mt-2 text-indigo-400 text-sm font-bold">
             {status.progress} / {status.total} Slides Ready
           </p>
        </div>
      )}

      {/* STEP 4: PLAYING */}
      {step === 'playing' && audioFile && (
        <SlideshowPlayer 
          audioFile={audioFile}
          slides={slides}
          onBack={reset}
        />
      )}

    </div>
  );
};

export default App;
