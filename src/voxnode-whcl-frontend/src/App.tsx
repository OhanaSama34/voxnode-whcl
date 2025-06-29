// src/App.tsx
import { Routes, Route } from 'react-router';
import Home from './pages/landing_page/Home';
import { Feed } from './pages/feeds/Feed';
// import About from './pages/About';

export default function App() {
  return (
    <>
      <main className="max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feeds" element={<Feed />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </main>
    </>
  );
}
