import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isCollapsed, toggleSidebar }) {
    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button onClick={toggleSidebar} className="toggle-btn">
                {isCollapsed ? '☰' : '✕'}
            </button>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Currency Convertor</Link>
                    </li>
                    <li>
                        <Link to="/expenses">Expenses</Link>
                    </li>
                    <li>
                        <Link to="/trip-comparison">Trip Comparison</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
