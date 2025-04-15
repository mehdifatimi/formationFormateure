import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginForm.css';

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            console.log('Attempting login with:', values);
            const response = await api.post('/login', {
                email: values.email,
                password: values.password
            });
            
            const { token, user } = response.data;
            console.log('Login successful, user:', user);
            
            // Stocker le token et les informations utilisateur
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Mettre à jour l'en-tête d'autorisation pour les futures requêtes
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            message.success('Connexion réussie !');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                // Le serveur a répondu avec un code d'erreur
                console.error('Error response:', error.response.data);
                message.error(error.response.data.message || 'Erreur de connexion');
            } else if (error.request) {
                // La requête a été faite mais aucune réponse n'a été reçue
                console.error('No response received:', error.request);
                message.error('Pas de réponse du serveur');
            } else {
                // Une erreur s'est produite lors de la configuration de la requête
                console.error('Request setup error:', error.message);
                message.error('Erreur lors de la connexion');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Connexion</h2>
                <Form
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Veuillez entrer votre email' },
                            { type: 'email', message: 'Email invalide' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Veuillez entrer votre mot de passe' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mot de passe"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="login-button"
                            size="large"
                            block
                        >
                            Se connecter
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm; 