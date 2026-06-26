import React from 'react';

export default function CalendarGrid({ currentMonth, currentYear, entries, onDayClick }) {
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startingDay = new Date(currentYear, currentMonth, 1).getDay();

  const calendarCells = [];
  for (let i = 0; i < startingDay; i++) {
    calendarCells.push(null); 
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    // FIX: Added pb-6 here to ensure an even gap at the bottom matching the top padding!
    <div className="w-full h-full flex flex-col pb-6">
      <div className="grid grid-cols-7 gap-4 mb-4 text-center text-white/50 font-medium">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-4 flex-1 content-start overflow-y-auto custom-scrollbar">
        {calendarCells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="opacity-0"></div>;

          const dateKey = `${currentYear}-${currentMonth}-${day}`;
          const entryData = entries ? entries[dateKey] : null;
          const hasEntry = entryData && (entryData.text || entryData.audioUrl);
          const isLocked = entryData && entryData.isLocked;

          return (
            <button
              key={day}
              onClick={() => onDayClick(day)}
              className={`
                relative h-24 rounded-2xl flex flex-col items-center justify-center p-2 text-lg font-semibold transition-all
                ${hasEntry 
                  ? 'bg-white/20 border-2 border-white/40 shadow-lg text-white' 
                  : 'bg-white/5 border border-transparent hover:bg-white/10 text-white/70 hover:text-white'}
              `}
            >
              <span>{day}</span>
              
              {isLocked && (
                <span className="absolute bottom-2 text-sm drop-shadow-md">🔒</span>
              )}
              
              {entryData?.audioUrl && !isLocked && (
                <span className="absolute bottom-2 text-xs drop-shadow-md">🎙️</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}