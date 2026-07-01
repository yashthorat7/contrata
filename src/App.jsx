import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Styling from './pages/Styling';
import Tracker from './pages/Tracker';
import Resume from './pages/Resume';
import Outreach from './pages/Outreach';
import Settings from './pages/Settings';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-paper flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-4xl flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/styling" element={<Styling />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
