import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Styling from './pages/Styling';

function Navigation() {
  const location = useLocation();
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-6">
        <Link to="/" className="font-serif text-lg font-bold text-neutral-900">
          HF.
        </Link>
        <div className="ml-8 flex gap-6">
          <Link
            to="/"
            className={`text-sm ${location.pathname === '/' ? 'font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>
            Home
          </Link>
          <Link
            to="/styling"
            className={`text-sm ${location.pathname === '/styling' ? 'font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>
            Styling
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-paper flex min-h-screen flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/styling" element={<Styling />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
