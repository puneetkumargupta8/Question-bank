import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    const [status, setStatus] = useState('Checking...');

    useEffect(() => {
        fetch('http://localhost:3000/')
            .then(res => res.text())
            .then(data => setStatus(data === 'Examination Cell API is running' ? 'Online' : 'Error'))
            .catch(() => setStatus('Offline'));
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4 text-blue-600">Examination Cell System</h1>
                    <p className="text-gray-700">Welcome to the Question Bank & Exam Management System.</p>
                    <p className="mt-2 text-sm text-gray-500">Backend status: <span className={status === 'Online' ? 'text-green-600 font-semibold' : 'text-red-600'}>{status}</span></p>
                </div>
            </div>
        </Router>
    );
}

export default App;
