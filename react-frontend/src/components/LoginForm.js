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
            console.log('Tentative de connexion avec:', { email: values.email });
            
            const response = await api.post('/login', {
                email: values.email,
                password: values.password
            });
            
            console.log('Réponse de connexion:', response.data);
            
            const { token, user } = response.data;
            
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
                console.error('Détails de l\'erreur:', error.response.data);
                
                // Gestion plus détaillée des erreurs HTTP
                switch (error.response.status) {
                    case 405:
                        message.error('Méthode non autorisée. Veuillez réessayer.');
                        break;
                    case 422:
                        // Afficher les messages d'erreur spécifiques du serveur
                        if (error.response.data.errors) {
                            const errorMessages = Object.values(error.response.data.errors).flat();
                            message.error(errorMessages.join(', '));
                        } else {
                            message.error(error.response.data.message || 'Données invalides. Vérifiez vos informations.');
                        }
                        break;
                    case 401:
                        message.error('Identifiants incorrects.');
                        break;
                    default:
                        message.error(error.response.data.message || 'Erreur de connexion');
                }
            } else if (error.request) {
                console.error('Erreur de requête:', error.request);
                message.error('Impossible de joindre le serveur. Veuillez réessayer plus tard.');
            } else {
                console.error('Erreur:', error.message);
                message.error('Une erreur est survenue. Veuillez réessayer.');
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