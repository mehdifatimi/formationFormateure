import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Update with your Laravel backend URL

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Response error:', error.response.data);
            if (error.response.status === 401) {
                // Handle unauthorized access
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } else if (error.request) {
            console.error('Request error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/login', { 
                email, 
                password 
            }, {
                withCredentials: true
            });
            
            if (response.data && response.data.user && response.data.token) {
                const { user, token } = response.data;
                
                // Store token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                return { user, token };
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            if (error.response) {
                throw new Error(error.response.data.message || 'Login failed');
            } else if (error.request) {
                throw new Error('No response from server. Please check if the server is running.');
            } else {
                throw new Error('Error setting up request');
            }
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Add method to refresh token if needed
    refreshToken: async () => {
        try {
            const response = await api.post('/refresh-token', {}, {
                withCredentials: true
            });
            const { token } = response.data;
            localStorage.setItem('token', token);
            return token;
        } catch (error) {
            authService.logout();
            throw error;
        }
    }
};

export default authService; 