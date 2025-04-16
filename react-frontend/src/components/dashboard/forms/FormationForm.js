import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Space } from 'antd';
import api from '../../../services/api';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const FormationForm = ({ initialValues, onFinish, onCancel }) => {
    const [form] = Form.useForm();
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFormateurs();
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                dates: [initialValues.date_debut, initialValues.date_fin],
            });
        }
    }, [initialValues, form]);

    const fetchFormateurs = async () => {
        try {
            const response = await api.get('/formateurs');
            setFormateurs(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des formateurs:', error);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const [date_debut, date_fin] = values.dates;
            const formationData = {
                ...values,
                date_debut: date_debut.format('YYYY-MM-DD'),
                date_fin: date_fin.format('YYYY-MM-DD'),
            };
            delete formationData.dates;
            await onFinish(formationData);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
        setLoading(false);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                statut: 'planifiee',
            }}
        >
            <Form.Item
                name="titre"
                label="Titre"
                rules={[{ required: true, message: 'Veuillez saisir le titre' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Veuillez saisir la description' }]}
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="dates"
                label="Dates"
                rules={[{ required: true, message: 'Veuillez sélectionner les dates' }]}
            >
                <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="prix"
                label="Prix"
                rules={[{ required: true, message: 'Veuillez saisir le prix' }]}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
            </Form.Item>

            <Form.Item
                name="places_disponibles"
                label="Places disponibles"
                rules={[{ required: true, message: 'Veuillez saisir le nombre de places' }]}
            >
                <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
                name="formateur_id"
                label="Formateur"
                rules={[{ required: true, message: 'Veuillez sélectionner un formateur' }]}
            >
                <Select>
                    {formateurs.map(formateur => (
                        <Select.Option key={formateur.id} value={formateur.id}>
                            {formateur.nom} {formateur.prenom}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="statut"
                label="Statut"
                rules={[{ required: true, message: 'Veuillez sélectionner le statut' }]}
            >
                <Select>
                    <Select.Option value="planifiee">Planifiée</Select.Option>
                    <Select.Option value="en_cours">En cours</Select.Option>
                    <Select.Option value="terminee">Terminée</Select.Option>
                    <Select.Option value="annulee">Annulée</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
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

export default FormationForm; 