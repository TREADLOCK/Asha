import React, { useEffect, useState, useRef } from 'react';
import Scene from './components/3d/Scene';
import Content from './components/Content';
import Preloader from './components/Preloader';
import Climax from './components/Climax';
import Lenis from 'lenis';
import { Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); 
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false); // New state to track if recovery is needed
  const audioRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Snap to top on mount
    window.scrollTo(0, 0);
  }, []);

  // Lenis Smooth Scrolling - Only if loaded
  useEffect(() => {
    if (!isLoaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isLoaded]);

  // Global Scroll Lock Event Listeners
  useEffect(() => {
    const handleLock = () => {
      if (lenisRef.current) {
        lenisRef.current.stop();
        window.scrollTo(0, document.body.scrollHeight);
        document.body.style.overflow = 'hidden';
      }
    };
    const handleUnlock = () => {
      if (lenisRef.current) {
        lenisRef.current.start();
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('lock-scroll', handleLock);
    window.addEventListener('unlock-scroll', handleUnlock);

    return () => {
      window.removeEventListener('lock-scroll', handleLock);
      window.removeEventListener('unlock-scroll', handleUnlock);
    };
  }, []);

  // Audio Autoplay Recovery: ONLY runs if audio is blocked by browser
  useEffect(() => {
    if (!isLoaded || !audioBlocked) return;

    const resumeAudio = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioBlocked(false); // Successfully recovered!
          })
          .catch(e => console.log("Still blocked", e));
      }
    };

    window.addEventListener('click', resumeAudio);
    window.addEventListener('touchstart', resumeAudio);

    return () => {
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
    };
  }, [isLoaded, audioBlocked]);

  const toggleAudio = (e) => {
    if (e) e.stopPropagation(); // Prevent bubbling to the recovery listener
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setAudioBlocked(false); // Stop trying to recover if user explicitly pauses
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioBlocked(false);
          })
          .catch(e => {
            console.log("Audio play blocked", e);
            setAudioBlocked(true);
          });
      }
    }
  };

  const handleEnter = () => {
    setIsLoaded(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAudioBlocked(false);
        })
        .catch(e => {
          console.log("Autoplay blocked, waiting for gesture", e);
          setIsPlaying(false);
          setAudioBlocked(true); // Mark as blocked to enable recovery listener
        });
    }
  };

  const isReady = audioLoaded && sceneLoaded;

  return (
    <div className="bg-black text-brand-white min-h-screen w-full font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <Preloader 
            isReady={isReady} 
            onEnter={handleEnter} 
            key="preloader" 
          />
        )}
      </AnimatePresence>

      {/* Audio Controller */}
      <button 
        onClick={toggleAudio}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group"
        aria-label="Toggle Sound"
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-brand-white group-hover:scale-110 transition-transform" />
        ) : (
          <VolumeX className={`w-6 h-6 text-brand-white group-hover:scale-110 transition-transform ${audioBlocked ? 'animate-pulse' : ''}`} />
        )}
      </button>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        loop
        src="/audio/bgm.mp3" 
        onCanPlayThrough={() => setAudioLoaded(true)}
      />

      {/* Scroll Overlay Content */}
      <Content isLoaded={isLoaded} />

      {/* 3D Scene */}
      <div className="fixed inset-0 z-0 h-screen w-full">
        <Scene isEntering={!isLoaded} onLoaded={() => setSceneLoaded(true)} />
      </div>
      
      {/* Scrollable Spacer for Particle Morphing */}
      <div style={{ height: '975vh' }} className="relative z-0" />

      {/* Final 100vh Climax Section */}
      <Climax />
    </div>
  );
}

export default App;
