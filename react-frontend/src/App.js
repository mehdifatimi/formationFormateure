import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import FormationList from './components/dashboard/FormationList';
import FormateurList from './components/dashboard/FormateurList';
import ParticipantList from './components/dashboard/ParticipantList';
import AbsenceList from './components/dashboard/AbsenceList';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Home from './components/Home';
import Layout from './components/Layout';
import PlanTraining from './components/dashboard/PlanTraining';
import TrackTrainers from './components/dashboard/TrackTrainers';
import Profile from './components/Profile';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="profile" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                        <Route path="dashboard" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }>
                            <Route index element={<Home />} />
                            <Route path="formations" element={<FormationList />} />
                            <Route path="formateurs" element={<FormateurList />} />
                            <Route path="participants" element={<ParticipantList />} />
                            <Route path="absences" element={<AbsenceList />} />
                            <Route path="plan" element={<PlanTraining />} />
                            <Route path="trainers" element={<TrackTrainers />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
