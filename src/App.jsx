import { Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import GeneratePage from './pages/GeneratePage';
import HistoryPage from './pages/HistoryPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<IntroPage />} />
                <Route path="/generate" element={<GeneratePage />} />
                <Route path="/history" element={<HistoryPage />} />
            </Routes>
        </>
    );
}

export default App;
