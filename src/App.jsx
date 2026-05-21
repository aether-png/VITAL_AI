import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import IntraView from './views/IntraView';
import PostView from './views/PostView';
import { useTheme } from './hooks/useTheme';
import './index.css';

// Pre-load voices on first user gesture
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  window.speechSynthesis.getVoices();
}

export default function App() {
  const [view, setView] = useState('intra');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={view} onSwitch={setView} />
        {view === 'intra' ? <IntraView /> : <PostView />}
      </div>
    </div>
  );
}
