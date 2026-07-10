import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Styling from './pages/Styling';
import Tracker from './pages/Tracker';
import Resume from './pages/Resume';
import Settings from './pages/Settings';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-paper flex h-screen flex-col overflow-hidden">
        <Navbar />
        <main className="scrollbar-hide w-full flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/styling" element={<Styling />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
