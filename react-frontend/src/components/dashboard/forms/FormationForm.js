import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Space } from 'antd';
import api from '../../../services/api';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const FormationForm = ({ initialValues, onFinish, onCancel }) => {
    const [form] = Form.useForm();
    const [formateurs, setFormateurs] = useState([]);
    const [villes, setVilles] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFormateurs();
        fetchVilles();
        fetchFilieres();
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                date_debut: moment(initialValues.date_debut),
                date_fin: moment(initialValues.date_fin),
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

    const fetchVilles = async () => {
        try {
            const response = await api.get('/villes');
            setVilles(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des villes:', error);
        }
    };

    const fetchFilieres = async () => {
        try {
            const response = await api.get('/filieres');
            setFilieres(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des filières:', error);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await onFinish({
                ...values,
                date_debut: values.date_debut.format('YYYY-MM-DD'),
                date_fin: values.date_fin.format('YYYY-MM-DD'),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                statut: 'à venir',
                niveau: 'débutant'
            }}
        >
            <Form.Item
                name="titre"
                label="Titre"
                rules={[{ required: true, message: 'Le titre est requis' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'La description est requise' }]}
            >
                <TextArea rows={4} />
            </Form.Item>

            <Space size="large" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                    name="date_debut"
                    label="Date de début"
                    rules={[{ required: true, message: 'La date de début est requise' }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    name="date_fin"
                    label="Date de fin"
                    rules={[{ required: true, message: 'La date de fin est requise' }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    name="duree"
                    label="Durée (heures)"
                    rules={[{ required: true, message: 'La durée est requise' }]}
                >
                    <InputNumber min={1} />
                </Form.Item>
            </Space>

            <Space size="large" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                    name="niveau"
                    label="Niveau"
                    rules={[{ required: true, message: 'Le niveau est requis' }]}
                >
                    <Select style={{ width: 200 }}>
                        <Option value="débutant">Débutant</Option>
                        <Option value="intermédiaire">Intermédiaire</Option>
                        <Option value="avancé">Avancé</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="prix"
                    label="Prix (€)"
                    rules={[{ required: true, message: 'Le prix est requis' }]}
                >
                    <InputNumber
                        min={0}
                        step={0.01}
                        formatter={value => `${value}€`}
                        parser={value => value.replace('€', '')}
                    />
                </Form.Item>

                <Form.Item
                    name="places_disponibles"
                    label="Places disponibles"
                    rules={[{ required: true, message: 'Le nombre de places est requis' }]}
                >
                    <InputNumber min={1} />
                </Form.Item>
            </Space>

            <Space size="large" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                    name="formateur_id"
                    label="Formateur"
                    rules={[{ required: true, message: 'Le formateur est requis' }]}
                >
                    <Select style={{ width: 200 }}>
                        {formateurs.map(formateur => (
                            <Option key={formateur.id} value={formateur.id}>
                                {formateur.prenom} {formateur.nom}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="ville_id"
                    label="Ville"
                    rules={[{ required: true, message: 'La ville est requise' }]}
                >
                    <Select style={{ width: 200 }}>
                        {villes.map(ville => (
                            <Option key={ville.id} value={ville.id}>
                                {ville.nom}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="filiere_id"
                    label="Filière"
                    rules={[{ required: true, message: 'La filière est requise' }]}
                >
                    <Select style={{ width: 200 }}>
                        {filieres.map(filiere => (
                            <Option key={filiere.id} value={filiere.id}>
                                {filiere.nom}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Space>

            <Form.Item
                name="statut"
                label="Statut"
                rules={[{ required: true, message: 'Le statut est requis' }]}
            >
                <Select style={{ width: 200 }}>
                    <Option value="à venir">À venir</Option>
                    <Option value="en cours">En cours</Option>
                    <Option value="terminé">Terminé</Option>
                    <Option value="annulé">Annulé</Option>
                </Select>
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

export default FormationForm; 