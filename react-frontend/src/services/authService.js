import api from './api';

const authService = {
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} Promise object with user data and token
     */
    login: async (email, password) => {
        try {
            // Get CSRF cookie first
            await api.get('/sanctum/csrf-cookie');
            
            console.log('Tentative de connexion avec:', { email });
            console.log('Configuration de l\'API:', {
                baseURL: api.defaults.baseURL,
                headers: api.defaults.headers,
                withCredentials: api.defaults.withCredentials
            });

            const response = await api.post('/login', { email, password });
            
            console.log('Réponse de connexion:', {
                status: response.status,
                headers: response.headers,
                data: response.data
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log('Token et données utilisateur stockés avec succès');
            }
            return response.data;
        } catch (error) {
            console.error('Erreur de connexion détaillée:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                } : null,
                request: error.request ? {
                    method: error.request.method,
                    url: error.request.url,
                    headers: error.request.headers
                } : null
            });
            throw error;
        }
    },

    /**
     * Register user
     * @param {Object} userData - User data
     * @returns {Promise} Promise object with user data
     */
    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     * @returns {Promise} Promise object
     */
    logout: async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    /**
     * Get current user
     * @returns {Object|null} Current user data or null
     */
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if user is authenticated
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Get auth token
     * @returns {string|null} Auth token or null
     */
    getToken: () => {
        return localStorage.getItem('token');
    },

    /**
     * Refresh auth token
     * @returns {Promise} Promise object with new token
     */
    refreshToken: async () => {
        try {
            const response = await api.post('/refresh');
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    }
};

export default authService;