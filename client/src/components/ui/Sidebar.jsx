import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSelector from './ThemeSelector';

// NEW: We are passing 'entries' into the Sidebar so we can export them
export default function Sidebar({ isOpen, onClose, onLogout, entries }) {
  const [showLockPrompt, setShowLockPrompt] = useState(false);

  const handleConfirmLock = () => {
    setShowLockPrompt(false);
    onClose();
    onLogout();
  };

  // NEW: The Data Export Logic
  const handleExportData = () => {
    if (!entries || Object.keys(entries).length === 0) {
      alert("Your vault is currently empty!");
      return;
    }

    let fileContent = "DEAR MIND - VAULT EXPORT\n";
    fileContent += `Exported on: ${new Date().toLocaleDateString()}\n`;
    fileContent += "=========================================\n\n";

    // Loop through all saved dates and format them neatly
    Object.keys(entries).sort().forEach(dateKey => {
      const entry = entries[dateKey];
      fileContent += `DATE: ${dateKey}\n`;
      fileContent += `-----------------------------------------\n`;
      
      // If there's text content, add it. (Adjust 'entry.text' based on how you saved it in StoryEditor)
      if (entry.text || entry.content) {
        fileContent += `${entry.text || entry.content}\n`;
      } else {
        fileContent += `[No written text for this entry]\n`;
      }
      
      // If there's an audio log URL, include it
      if (entry.audioUrl) {
        fileContent += `\n[Audio Log Included: ${entry.audioUrl}]\n`;
      }
      
      fileContent += "\n=========================================\n\n";
    });

    // Create the downloadable text file
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    // Trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "Dear_Mind_Backup.txt";
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={onClose}
            />
            
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 glass-panel border-l border-white/10 z-50 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <button onClick={onClose} className="text-white/50 hover:text-white text-xl">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Appearance</h3>
                  <ThemeSelector />
                </div>
                
                {/* NEW: Data Export Section */}
                <div className="mb-8 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Your Data</h3>
                  <p className="text-xs text-white/40 mb-3 leading-relaxed">
                    Download a complete, offline text copy of all your journal entries. Your thoughts belong to you.
                  </p>
                  <button 
                    onClick={handleExportData}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    📥 Download My Diary
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <button 
                  onClick={() => setShowLockPrompt(true)}
                  className="w-full py-3 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/40 hover:text-white font-bold transition-all border border-red-500/30 shadow-lg"
                >
                  Logout
                </button>

                <div className="mt-8 flex flex-col items-center justify-center text-white/40 text-[11px] uppercase tracking-widest space-y-1">
                  <p>Version 3.42</p>
                  <p>Developed by</p>
                  <p className="font-bold text-white/60">Rakshan</p>
                  <p>2026</p>
                  
                  <a 
                    href="https://www.linkedin.com/in/rakshan-kumaraa" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-4 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/10 flex items-center gap-2 normal-case tracking-normal text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLockPrompt && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowLockPrompt(false)}></div>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm glass-panel rounded-3xl p-8 flex flex-col items-center shadow-2xl border-2 border-[var(--accent-start)]"
            >
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white text-center mb-8">
                Do you Want to Lock your Diary ??
              </h3>
              
              <div className="flex w-full gap-4">
                <button 
                  onClick={handleConfirmLock} 
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-white font-bold shadow-lg hover:opacity-90 transition-opacity"
                >
                  Yes
                </button>
                <button 
                  onClick={() => setShowLockPrompt(false)} 
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10 transition-colors"
                >
                  No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}