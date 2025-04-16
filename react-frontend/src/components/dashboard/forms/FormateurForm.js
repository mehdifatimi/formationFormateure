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
        try {
            await onFinish(values);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues}
        >
            <Form.Item
                name="nom"
                label="Nom"
                rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="prenom"
                label="Prénom"
                rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Veuillez saisir l\'email' },
                    { type: 'email', message: 'Email invalide' }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="telephone"
                label="Téléphone"
                rules={[{ required: true, message: 'Veuillez saisir le numéro de téléphone' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="specialite"
                label="Spécialité"
                rules={[{ required: true, message: 'Veuillez sélectionner la spécialité' }]}
            >
                <Select>
                    <Select.Option value="developpement_web">Développement Web</Select.Option>
                    <Select.Option value="design">Design</Select.Option>
                    <Select.Option value="marketing_digital">Marketing Digital</Select.Option>
                    <Select.Option value="gestion_projet">Gestion de Projet</Select.Option>
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
                        {initialValues ? 'Modifier' : 'Créer'}
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