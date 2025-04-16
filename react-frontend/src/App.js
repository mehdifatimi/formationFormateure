import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import Home from './components/Home';
import Layout from './components/Layout';
import PlanTraining from './components/dashboard/PlanTraining';
import TrackTrainers from './components/dashboard/TrackTrainers';
import './App.css';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route
                        path="dashboard/*"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="dashboard/plan"
                        element={
                            <PrivateRoute>
                                <PlanTraining />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="dashboard/trainers"
                        element={
                            <PrivateRoute>
                                <TrackTrainers />
                            </PrivateRoute>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
