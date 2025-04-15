import React, { useState } from 'react';
import { Form, Input, Switch, Button, Space, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const FormateurForm = ({ initialValues, onFinish, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await onFinish(values);
        } finally {
            setLoading(false);
        }
    };

    const specialites = [
        'Développement Web',
        'Développement Mobile',
        'DevOps',
        'Base de données',
        'Cloud Computing',
        'Intelligence Artificielle',
        'Cybersécurité',
        'UX/UI Design',
        'Gestion de Projet',
        'Agilité',
    ];

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                ...initialValues,
                disponible: initialValues?.disponible ?? true,
                specialites: initialValues?.specialites ?? [],
            }}
        >
            <Space size="large" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                    name="prenom"
                    label="Prénom"
                    rules={[{ required: true, message: 'Le prénom est requis' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="nom"
                    label="Nom"
                    rules={[{ required: true, message: 'Le nom est requis' }]}
                >
                    <Input />
                </Form.Item>
            </Space>

            <Space size="large" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'L\'email est requis' },
                        { type: 'email', message: 'Email invalide' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="telephone"
                    label="Téléphone"
                    rules={[{ required: true, message: 'Le téléphone est requis' }]}
                >
                    <Input />
                </Form.Item>
            </Space>

            <Form.Item
                name="specialites"
                label="Spécialités"
                rules={[{ required: true, message: 'Au moins une spécialité est requise' }]}
            >
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Sélectionnez les spécialités"
                    optionLabelProp="label"
                    allowClear
                >
                    {specialites.map(specialite => (
                        <Select.Option key={specialite} value={specialite} label={specialite}>
                            {specialite}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="bio"
                label="Biographie"
                rules={[{ required: true, message: 'La biographie est requise' }]}
            >
                <TextArea rows={4} />
            </Form.Item>

            <Space size="large" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                    name="photo"
                    label="Photo (URL)"
                >
                    <Input placeholder="http://..." />
                </Form.Item>

                <Form.Item
                    name="linkedin"
                    label="LinkedIn"
                >
                    <Input placeholder="https://linkedin.com/in/..." />
                </Form.Item>
            </Space>

            <Form.Item
                name="disponible"
                label="Disponible"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {initialValues ? 'Mettre à jour' : 'Créer'}
                    </Button>
                    <Button onClick={onCancel}>Annuler</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default FormateurForm; 