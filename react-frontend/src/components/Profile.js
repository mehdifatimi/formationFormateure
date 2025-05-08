import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: '',
        department: '',
        lastLogin: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Simuler la récupération des données utilisateur
        // À remplacer par un appel API réel
        const fetchUserData = async () => {
            try {
                // Exemple de données (à remplacer par l'appel API)
                setUserData({
                    name: 'John Doe',
                    email: 'john.doe@ofppt.ma',
                    role: 'Formateur',
                    department: 'Informatique',
                    lastLogin: new Date().toLocaleString()
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchUserData();
    }, [navigate]);

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>Profil Utilisateur</h2>
                </div>
                <div className="profile-content">
                    <div className="profile-info">
                        <div className="info-group">
                            <label>Nom complet:</label>
                            <p>{userData.name}</p>
                        </div>
                        <div className="info-group">
                            <label>Email:</label>
                            <p>{userData.email}</p>
                        </div>
                        <div className="info-group">
                            <label>Rôle:</label>
                            <p>{userData.role}</p>
                        </div>
                        <div className="info-group">
                            <label>Département:</label>
                            <p>{userData.department}</p>
                        </div>
                        <div className="info-group">
                            <label>Dernière connexion:</label>
                            <p>{userData.lastLogin}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 