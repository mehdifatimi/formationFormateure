import api from './api';

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Promise object with user data and token
 */
export const login = async (email, password) => {
    try {
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
};

/**
 * Register user
 * @param {Object} userData - User data
 * @returns {Promise} Promise object with user data
 */
export const register = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

/**
 * Logout user
 * @returns {Promise} Promise object
 */
export const logout = async () => {
    try {
        await api.post('/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

/**
 * Get current user
 * @returns {Object|null} Current user data or null
 */
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

/**
 * Get auth token
 * @returns {string|null} Auth token or null
 */
export const getToken = () => {
    return localStorage.getItem('token');
};

// Add method to refresh token if needed
export const refreshToken = async () => {
    try {
        const response = await api.post('/refresh-token', {}, {
            withCredentials: true
        });
        const { token } = response.data;
        localStorage.setItem('token', token);
        return token;
    } catch (error) {
        logout();
        throw error;
    }
}; 