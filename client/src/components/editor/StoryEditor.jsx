import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import AudioRecorder from './AudioRecorder'; 

const QUESTIONS = [
  "What is one small victory you had today?",
  "Did you encounter any frustrating obstacles? How did you handle them?",
  "What are you most grateful for right now?",
  "Describe a moment that made you smile today.",
  "What is something you learned today?",
  "How are you feeling right now, really?",
  "What is a goal you are working towards?",
  "Who made a positive impact on your day?",
  "What is a habit you want to build or break?",
  "Write about a memory that keeps coming back to you.",
  "What is a fear you'd like to overcome?",
  "Describe your perfect day from morning to night.",
  "What are three things you love about yourself?",
  "What was the most challenging part of your day?",
  "How did you show kindness to yourself today?",
  "What is a dream you've been putting off?",
  "If you could talk to your younger self, what would you say?",
  "What is something you need to let go of?",
  "Who are you missing right now?",
  "What inspired you today?",
  "What is a boundary you need to set?",
  "How do you handle stress, and can you improve it?",
  "What is your favorite way to spend free time?",
  "Write about a recent mistake and what it taught you.",
  "What does success look like to you?",
  "What is a compliment you received that you'll never forget?",
  "How has your perspective changed recently?",
  "What is something you are looking forward to?",
  "Describe a place where you feel completely at peace.",
  "What is a passion you want to explore more?",
  "Write about someone who challenges you to be better.",
  "What is the best advice you've ever received?",
  "How do you define love?",
  "What is a risk you took that paid off?",
  "What are you procrastinating on, and why?",
  "What makes you feel most alive?",
  "How do you want to be remembered?"
];

export default function StoryEditor({ isOpen, onClose, selectedDate, entries, setEntries, user }) {
  const [content, setContent] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isTimeCapsule, setIsTimeCapsule] = useState(false);
  const [unlockDate, setUnlockDate] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const dateKey = selectedDate 
    ? `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}` 
    : null;

  useEffect(() => {
    if (isOpen) {
      setCurrentPromptIndex(Math.floor(Math.random() * QUESTIONS.length));

      const intervalId = setInterval(() => {
        setCurrentPromptIndex(prev => (prev + 1) % QUESTIONS.length);
      }, 60000);

      if (dateKey && entries[dateKey]) {
        const savedData = entries[dateKey];
        setContent(savedData.text || '');
        setIsTimeCapsule(savedData.isLocked || false);
        setUnlockDate(savedData.unlockDate || '');
        setAudioUrl(savedData.audioUrl || null);
      } else {
        setContent('');
        setIsTimeCapsule(false);
        setUnlockDate('');
        setAudioUrl(null);
      }

      return () => clearInterval(intervalId); 
    }
  }, [isOpen, dateKey, entries]);

  const handleSave = async () => {
    if (!user) {
      alert("Error: Your session was lost. Please log out and back in to save.");
      return;
    }
    if (!dateKey) return;

    setIsSaving(true);
    let finalAudioUrl = audioUrl;

    try {
      if (audioUrl && audioUrl.startsWith('blob:')) {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', 'dear_mind_audio'); 
        const cloudName = 'ddim1mrvc'; 
        
        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: formData
        });

        const cloudData = await cloudinaryRes.json();
        
        if (!cloudinaryRes.ok) {
          throw new Error(`Cloudinary Upload Failed: ${cloudData.error?.message}`);
        }
        
        if (cloudData.secure_url) {
          finalAudioUrl = cloudData.secure_url;
        }
      }

      const entryData = {
        text: content,
        isLocked: isTimeCapsule,
        unlockDate: isTimeCapsule ? unlockDate : null,
        audioUrl: finalAudioUrl 
      };

      await setDoc(doc(db, "users", user.uid, "journalEntries", dateKey), entryData);
      
      setEntries(prev => ({
        ...prev,
        [dateKey]: entryData
      }));

      onClose();

    } catch (error) {
      console.error("Save failed:", error);
      alert(error.message || "Failed to save journal. Check your internet connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const isCurrentlyLocked = () => {
    if (!isTimeCapsule || !unlockDate) return false;
    const today = new Date();
    const unlock = new Date(unlockDate);
    return today < unlock;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={!isSaving ? onClose : undefined}></div>

          <div className="relative w-full max-w-5xl h-[85vh] glass-panel border border-[var(--accent-start)]/30 rounded-3xl p-8 sm:p-12 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <div>
                {/* FIXED: The Date Title now exactly matches the background gradient of the selected theme */}
                <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-transparent bg-clip-text drop-shadow-md">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
                </h2>
              </div>
              <button onClick={onClose} disabled={isSaving} className="text-white/50 hover:text-white text-3xl disabled:opacity-30">✕</button>
            </div>

            {isCurrentlyLocked() ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 py-12">
                <span className="text-6xl drop-shadow-[0_0_15px_var(--accent-start)]">⏳</span>
                <h3 className="text-2xl font-bold text-white">Time Capsule Locked</h3>
                <p className="text-white/60">This memory is sealed until {new Date(unlockDate).toLocaleDateString()}.</p>
              </div>
            ) : (
              <>
                <p className="text-white/60 italic mb-6 text-lg font-medium transition-opacity duration-500">
                  Question : "{QUESTIONS[currentPromptIndex]}"
                </p>
                <textarea
                  className="flex-grow w-full bg-transparent text-white/95 text-xl resize-none outline-none placeholder:text-white/20 custom-scrollbar mb-4 leading-relaxed"
                  placeholder="Start writing your story..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  autoFocus
                  disabled={isSaving}
                />
                
                <div className="mb-4">
                  <AudioRecorder onAudioReady={(url) => setAudioUrl(url)} initialAudio={audioUrl} />
                </div>
              </>
            )}

            <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-4">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="accent-accentStart w-5 h-5 rounded"
                    checked={isTimeCapsule}
                    onChange={() => setIsTimeCapsule(!isTimeCapsule)}
                    disabled={isSaving}
                  />
                  <span className="text-white/70 group-hover:text-white text-lg">Lock as Time Capsule 🔒</span>
                </label>
                
                {isTimeCapsule && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <input 
                      type="date" 
                      className="bg-black/40 text-white border border-white/20 rounded px-4 py-2 mt-2 outline-none focus:border-[var(--accent-start)]"
                      value={unlockDate}
                      onChange={(e) => setUnlockDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]} 
                      disabled={isSaving}
                    />
                  </motion.div>
                )}
              </div>

              {!isCurrentlyLocked() && (
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex items-center px-10 py-4 text-lg rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-white font-bold shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isSaving && (
                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="15 15" strokeLinecap="round" className="opacity-90" />
                    </svg>
                  )}
                  {isSaving ? 'Uploading...' : 'Save Journal'}
                </button>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}