import React from 'react';
import { Form, Input, Button, Switch, Select, Space } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const specialites = [
    'Développement Web',
    'Design UX/UI',
    'Marketing Digital',
    'Gestion de Projet',
    'Data Science',
    'DevOps',
    'Cybersécurité',
    'Intelligence Artificielle'
];

const FormateurForm = ({ initialValues, onFinish, onCancel }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        // S'assurer que les spécialités sont envoyées comme un tableau
        const formData = {
            ...values,
            specialites: Array.isArray(values.specialites) ? values.specialites : []
        };
        
        // Ajouter des valeurs par défaut pour les champs manquants
        if (!formData.disponible) {
            formData.disponible = true;
        }
        
        console.log('Données envoyées au serveur:', formData);
        await onFinish(formData);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                ...initialValues,
                specialites: initialValues?.specialites ? 
                    (typeof initialValues.specialites === 'string' ? 
                        JSON.parse(initialValues.specialites) : 
                        initialValues.specialites) : 
                    [],
                disponible: initialValues?.disponible !== undefined ? initialValues.disponible : true
            }}
            onFinish={handleSubmit}
        >
            <Form.Item
                name="nom"
                label="Nom"
                rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="prenom"
                label="Prénom"
                rules={[{ required: true, message: 'Veuillez entrer le prénom' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Veuillez entrer l\'email' },
                    { type: 'email', message: 'Email invalide' }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="telephone"
                label="Téléphone"
                rules={[{ required: true, message: 'Veuillez entrer le numéro de téléphone' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="specialites"
                label="Spécialités"
                rules={[{ required: true, message: 'Veuillez sélectionner au moins une spécialité' }]}
            >
                <Select
                    mode="multiple"
                    placeholder="Sélectionnez les spécialités"
                    style={{ width: '100%' }}
                >
                    {specialites.map(spec => (
                        <Option key={spec} value={spec}>{spec}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="bio"
                label="Biographie"
                rules={[{ required: true, message: 'Veuillez entrer la biographie' }]}
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="linkedin"
                label="LinkedIn"
                rules={[
                    { type: 'url', message: 'Veuillez entrer une URL LinkedIn valide' }
                ]}
            >
                <Input placeholder="https://www.linkedin.com/in/votre-profil" />
            </Form.Item>

            <Form.Item
                name="disponible"
                label="Disponible"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">
                        {initialValues ? 'Mettre à jour' : 'Créer'}
                    </Button>
                    <Button onClick={onCancel}>
                        Annuler
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default FormateurForm; 