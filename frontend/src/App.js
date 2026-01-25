import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import CurrencyConvertor from './CurrencyConvertor';
import Expenses from './Expenses';
import TripComparison from './TripComparison';
import './App.css';

function App() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Router>
            <div className="App">
                <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                <div className={`content ${isCollapsed ? 'collapsed' : ''}`}>
                    <Routes>
                        <Route path="/" element={<CurrencyConvertor />} />
                        <Route path="/expenses" element={<Expenses />} />
                        <Route path="/trip-comparison" element={<TripComparison />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;