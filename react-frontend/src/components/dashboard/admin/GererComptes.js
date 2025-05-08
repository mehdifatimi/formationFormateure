import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Card } from 'antd';
import api from '../../../services/api';

const { Option } = Select;

const GererComptes = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/users', {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      if (response.data) {
        message.success('Utilisateur créé avec succès !');
        form.resetFields(); // Réinitialiser le formulaire après succès
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response) {
        // Erreur avec réponse du serveur
        message.error(error.response.data.message || "Erreur lors de la création de l'utilisateur");
      } else if (error.request) {
        // Erreur sans réponse du serveur
        message.error("Impossible de contacter le serveur");
      } else {
        // Autre type d'erreur
        message.error("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Créer un compte utilisateur" style={{ maxWidth: 400, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ role: 'participant' }}
      >
        <Form.Item
          label="Nom"
          name="name"
          rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Veuillez saisir un email' },
            { type: 'email', message: 'Email invalide' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[
            { required: true, message: 'Veuillez saisir un mot de passe' },
            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Rôle"
          name="role"
          rules={[{ required: true, message: 'Veuillez sélectionner un rôle' }]}
        >
          <Select placeholder="Sélectionner un rôle">
            <Option value="admin">Admin</Option>
            <Option value="formateur">Formateur</Option>
            <Option value="participant">Participant</Option>
            <Option value="cdc">CDC</Option>
            <Option value="drf">DRF</Option>
            <Option value="animateur">Animateur</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Créer le compte
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default GererComptes;
