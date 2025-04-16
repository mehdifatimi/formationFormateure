import React, { useState, useEffect } from 'react';
import { getParticipantProgress } from '../../services/participantService';
import { FaUser, FaCalendarAlt, FaUserClock, FaChartBar, FaSearch, FaFilter } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './TrackTrainers.css';

const TrackTrainers = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [filteredTrainers, setFilteredTrainers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOptions, setFilterOptions] = useState({
        minFormations: 0,
        maxAbsenceRate: 100,
        minEvaluationScore: 0
    });

    // Fetch trainer progress data on component mount
    useEffect(() => {
        const fetchTrainerProgress = async () => {
            try {
                setLoading(true);
                const data = await getParticipantProgress();
                setTrainers(data);
                setFilteredTrainers(data);
            } catch (err) {
                setError('Erreur lors du chargement des données des formateurs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainerProgress();
    }, []);

    // Filter trainers based on search term and filter options
    useEffect(() => {
        let result = [...trainers];
        
        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(trainer => 
                trainer.nom.toLowerCase().includes(term) || 
                trainer.prenom.toLowerCase().includes(term) ||
                trainer.email.toLowerCase().includes(term)
            );
        }
        
        // Apply filter options
        result = result.filter(trainer => 
            trainer.total_formations >= filterOptions.minFormations &&
            trainer.absence_rate <= filterOptions.maxAbsenceRate &&
            trainer.evaluation_score >= filterOptions.minEvaluationScore
        );
        
        setFilteredTrainers(result);
    }, [searchTerm, filterOptions, trainers]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterOptions({
            minFormations: 0,
            maxAbsenceRate: 100,
            minEvaluationScore: 0
        });
    };

    // Prepare data for charts
    const prepareChartData = () => {
        return filteredTrainers.map(trainer => ({
            name: `${trainer.prenom} ${trainer.nom}`,
            formations: trainer.total_formations,
            completed: trainer.completed_formations,
            absences: trainer.absences,
            absenceRate: trainer.absence_rate,
            evaluationScore: trainer.evaluation_score
        }));
    };

    const chartData = prepareChartData();
    
    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) {
        return (
            <div className="track-trainers-container">
                <div className="loading">Chargement des données...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="track-trainers-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="track-trainers-container">
            <div className="track-trainers-header">
                <h2>Suivi des Formateurs</h2>
                <p>Visualisez la participation et la progression des formateurs</p>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Rechercher un formateur..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="filter-options">
                    <div className="filter-group">
                        <label htmlFor="minFormations">Formations min.</label>
                        <input
                            type="number"
                            id="minFormations"
                            name="minFormations"
                            value={filterOptions.minFormations}
                            onChange={handleFilterChange}
                            min="0"
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="maxAbsenceRate">Taux d'absence max. (%)</label>
                        <input
                            type="number"
                            id="maxAbsenceRate"
                            name="maxAbsenceRate"
                            value={filterOptions.maxAbsenceRate}
                            onChange={handleFilterChange}
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="minEvaluationScore">Score min.</label>
                        <input
                            type="number"
                            id="minEvaluationScore"
                            name="minEvaluationScore"
                            value={filterOptions.minEvaluationScore}
                            onChange={handleFilterChange}
                            min="0"
                            max="10"
                            step="0.1"
                        />
                    </div>

                    <button className="reset-filters" onClick={resetFilters}>
                        Réinitialiser les filtres
                    </button>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h3>Formations par Formateur</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="formations" name="Total Formations" fill="#8884d8" />
                            <Bar dataKey="completed" name="Formations Terminées" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <h3>Taux d'Absence par Formateur</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="absenceRate" name="Taux d'Absence (%)" fill="#ff8042" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="trainers-grid">
                {filteredTrainers.map(trainer => (
                    <div key={trainer.id} className="trainer-card">
                        <div className="trainer-header">
                            <div className="trainer-avatar">
                                <FaUser />
                            </div>
                            <div className="trainer-info">
                                <h3>{trainer.prenom} {trainer.nom}</h3>
                                <p>{trainer.email}</p>
                            </div>
                        </div>

                        <div className="trainer-stats">
                            <div className="stat-item">
                                <FaCalendarAlt />
                                <div className="stat-content">
                                    <span className="stat-value">{trainer.total_formations}</span>
                                    <span className="stat-label">Formations</span>
                                </div>
                            </div>

                            <div className="stat-item">
                                <FaUserClock />
                                <div className="stat-content">
                                    <span className="stat-value">{trainer.absence_rate}%</span>
                                    <span className="stat-label">Absences</span>
                                </div>
                            </div>

                            <div className="stat-item">
                                <FaChartBar />
                                <div className="stat-content">
                                    <span className="stat-value">{trainer.evaluation_score}</span>
                                    <span className="stat-label">Évaluation</span>
                                </div>
                            </div>
                        </div>

                        <div className="trainer-formations">
                            <h4>Formations Récentes</h4>
                            {trainer.formations && trainer.formations.length > 0 ? (
                                <ul>
                                    {trainer.formations.slice(0, 3).map(formation => (
                                        <li key={formation.id} className={`formation-item ${formation.statut}`}>
                                            <span className="formation-title">{formation.titre}</span>
                                            <span className="formation-date">
                                                {new Date(formation.date_debut).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-formations">Aucune formation</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredTrainers.length === 0 && (
                <div className="no-results">
                    <p>Aucun formateur ne correspond aux critères de recherche</p>
                </div>
            )}
        </div>
    );
};

export default TrackTrainers; 