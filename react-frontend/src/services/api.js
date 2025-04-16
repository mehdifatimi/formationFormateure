import axios from 'axios';

// Création d'une instance axios avec la configuration de base
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

// export default api;

// Intercepteur pour les requêtes
api.interceptors.request.use(
    async (config) => {
        // Log de la requête
        console.log(`Requête ${config.method.toUpperCase()} vers ${config.url}`, config.data);
        
        // Ajout du token d'authentification si disponible
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Erreur lors de la préparation de la requête:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
    (response) => {
        // Log de la réponse
        console.log(`Réponse de ${response.config.url}:`, response.status, response.data);
        return response;
    },
    async (error) => {
        // Log détaillé de l'erreur
        if (error.response) {
            console.error('Erreur de réponse:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
                url: error.config.url
            });

            // Si l'erreur est 401, essayer de rafraîchir le token
            if (error.response.status === 401) {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        // Essayer de rafraîchir le token
                        const response = await axios.post('http://127.0.0.1:8000/api/refresh-token', {}, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            withCredentials: true
                        });
                        
                        if (response.data.token) {
                            localStorage.setItem('token', response.data.token);
                            // Réessayer la requête originale
                            error.config.headers.Authorization = `Bearer ${response.data.token}`;
                            return axios(error.config);
                        }
                    }
                } catch (refreshError) {
                    console.error('Erreur lors du rafraîchissement du token:', refreshError);
                }
                
                // Si le rafraîchissement échoue, déconnecter l'utilisateur
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } else if (error.request) {
            console.error('Erreur de requête:', error.request);
        } else {
            console.error('Erreur:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default api;
