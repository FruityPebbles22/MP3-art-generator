import React, { useState, useEffect, useRef } from 'react';
import { GeneratedSlide } from '../types';

interface SlideshowPlayerProps {
  audioFile: File;
  slides: GeneratedSlide[];
  onBack: () => void;
}

export const SlideshowPlayer: React.FC<SlideshowPlayerProps> = ({ audioFile, slides, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(audioFile);
    setAudioUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioFile]);

  // Handle slide transitions based on audio progress or loop if no audio duration available yet
  useEffect(() => {
    if (!isPlaying) return;

    // Simple auto-rotate for slideshow logic
    // In a more complex app, we might analyze beats, but time-based rotation works for demo
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
      
      // Optional: Logic to sync specific slides to specific % timestamps could go here
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white/40 backdrop-blur-md rounded-3xl border-4 border-white shadow-2xl">
      {/* Visualizer Area */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner bg-black group">
        
        {/* The Slide Image */}
        {currentSlide && (
          <img 
            src={currentSlide.imageUrl} 
            alt={currentSlide.prompt} 
            className={`w-full h-full object-cover transition-all duration-1000 transform ${isPlaying ? 'scale-110' : 'scale-100'}`}
          />
        )}

        {/* Overlay Prompt Text (Kidcore style) */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-2 rounded-xl backdrop-blur-sm text-sm opacity-0 group-hover:opacity-100 transition-opacity text-center font-bold">
           ✨ {currentSlide?.prompt}
        </div>

        {/* Play Button Overlay (when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer" onClick={togglePlay}>
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform transition hover:scale-110">
              <i className="fas fa-play text-4xl text-pink-500 ml-2"></i>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full mt-6 px-4 pb-2">
        <h2 className="text-2xl font-black text-pink-600 mb-2 truncate text-center drop-shadow-sm">
          {audioFile.name}
        </h2>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-pink-100 rounded-full overflow-hidden border-2 border-pink-200 mb-4 cursor-pointer" onClick={(e) => {
            if(audioRef.current) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const pct = x / rect.width;
                audioRef.current.currentTime = pct * audioRef.current.duration;
            }
        }}>
          <div 
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-center items-center gap-6">
           <button onClick={() => {
             setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
           }} className="text-purple-600 hover:text-purple-800 transition">
             <i className="fas fa-step-backward text-2xl"></i>
           </button>

           <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-white shadow-lg border-4 border-white transform transition active:scale-95 hover:rotate-3"
           >
             <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-2xl`}></i>
           </button>

           <button onClick={() => {
             setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
           }} className="text-purple-600 hover:text-purple-800 transition">
             <i className="fas fa-step-forward text-2xl"></i>
           </button>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="mt-6 text-sm font-bold text-gray-500 hover:text-gray-800 underline decoration-wavy decoration-pink-400"
      >
        Make Another One
      </button>

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      )}
    </div>
  );
};
