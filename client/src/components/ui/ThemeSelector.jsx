import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function ThemeSelector() {
  const { theme, setTheme } = useContext(ThemeContext);

  const themes = [
    { id: 'midnight-black', name: 'Midnight' },
    { id: 'bubblegum', name: 'Bubblegum' },
    { id: 'deep-forest', name: 'Forest' },
    { id: 'summer-beach', name: 'Summer' },
    { id: 'cosmic-nebula', name: 'Cosmic' }
  ];

  return (
    <select 
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="glass-panel text-white px-4 py-2 rounded-xl outline-none cursor-pointer appearance-none"
    >
      {themes.map((t) => (
        <option key={t.id} value={t.id} className="bg-black text-white">
          {t.name}
        </option>
      ))}
    </select>
  );
}