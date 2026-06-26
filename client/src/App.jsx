import { useState, useContext, useEffect } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import AnimatedTitle from './components/ui/AnimatedTitle';
import CalendarGrid from './components/calendar/CalendarGrid';
import StoryEditor from './components/editor/StoryEditor';
import Sidebar from './components/ui/Sidebar';
import Login from './pages/Login';
import SplashScreen from './components/ui/SplashScreen'; 

import { db, auth } from './config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const { theme } = useContext(ThemeContext);
  
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [user, setUser] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [entries, setEntries] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        fetchCloudEntries(currentUser.uid); 
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setEntries({}); 
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCloudEntries = async (uid) => {
    try {
      const querySnapshot = await getDocs(collection(db, "users", uid, "journalEntries"));
      const cloudEntries = {};
      querySnapshot.forEach((doc) => { cloudEntries[doc.id] = doc.data(); });
      setEntries(cloudEntries);
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  };

  const handleDayClick = (day) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setIsEditorOpen(true);
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) { 
        setCurrentMonth(11); 
        setCurrentYear(prev => prev - 1); 
      } else { 
        setCurrentMonth(prev => prev - 1); 
      }
    } else {
      if (currentMonth === 11) { 
        setCurrentMonth(0); 
        setCurrentYear(prev => prev + 1); 
      } else { 
        setCurrentMonth(prev => prev + 1); 
      }
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const weekdayText = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDayText = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setEntries({});
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="relative min-h-screen text-white overflow-x-hidden">
        
        <div className="fixed inset-0 z-[-3] bg-gradient-to-br from-bgStart to-bgEnd transition-colors duration-700"></div>
        <div 
          className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat transition-all duration-700 mix-blend-overlay opacity-80" 
          style={{ backgroundImage: 'var(--bg-wallpaper)' }}
        ></div>
        <div className="fixed inset-0 z-[-1] bg-black/60 backdrop-blur-[12px] transition-all duration-700"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center py-6 lg:py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          
          {!isAuthenticated ? (
             <div className="flex flex-col items-center mt-[5vh]">
               <div className="mb-8"><AnimatedTitle variant="gradient" /></div>
               <Login onLoginSuccess={() => {
                 setUser({ ...auth.currentUser });
                 setIsAuthenticated(true);
               }} />
             </div>
          ) : (
            
            <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 lg:h-[85vh]">
              
              <aside className="w-full lg:w-1/3 glass-panel rounded-3xl p-6 lg:p-8 flex flex-col justify-between shadow-2xl shrink-0">
                <div>
                  <div className="hidden lg:block"><AnimatedTitle variant="glass" /></div>

                  <div className="mt-2 lg:mt-6 mb-2 border-b border-white/10 pb-6 text-center">
                    <p className="text-white/50 text-sm font-semibold tracking-wider uppercase">Welcome Dear,</p>
                    <h2 className="text-2xl font-bold mt-1 bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-transparent bg-clip-text truncate px-2">
                      {user?.displayName || "Friend"}
                    </h2>
                  </div>
                  
                  <div className="mt-6 lg:mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white/50 text-sm font-semibold tracking-wider uppercase mb-1">Today</h3>
                    
                    <h2 className="text-2xl lg:text-3xl font-bold flex flex-wrap gap-x-2">
                      <span>{weekdayText},</span>
                      <span className="whitespace-nowrap">{monthDayText}</span>
                    </h2>
                  </div>

                  <div className="mt-4 lg:mt-8 flex items-center justify-between bg-white/5 p-2 rounded-2xl border border-white/10">
                    <button onClick={() => changeMonth('prev')} className="p-3 hover:bg-white/10 rounded-xl transition-all">◀</button>
                    <span className="text-lg lg:text-xl font-semibold">{monthNames[currentMonth]} {currentYear}</span>
                    <button onClick={() => changeMonth('next')} className="p-3 hover:bg-white/10 rounded-xl transition-all">▶</button>
                  </div>
                </div>

                <div className="mt-6 lg:mt-0 space-y-4">
                  <button 
                    onClick={() => setIsSidebarOpen(true)} 
                    className="w-full bg-white/5 py-4 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all font-semibold border border-white/10 flex items-center justify-center gap-2"
                  >
                    ⚙️ Settings
                  </button>
                </div>
              </aside>

              <main className="w-full lg:w-2/3 glass-panel rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
                <CalendarGrid 
                  currentMonth={currentMonth} 
                  currentYear={currentYear} 
                  entries={entries}
                  onDayClick={handleDayClick} 
                />
              </main>

            </div>
          )}
        </div>

        <StoryEditor 
          isOpen={isEditorOpen} 
          onClose={() => setIsEditorOpen(false)} 
          selectedDate={selectedDate}
          entries={entries}          
          setEntries={setEntries}
          user={user}    
        />

        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onLogout={handleLogout}
        />
        
      </div>
    </>
  );
}

export default App;