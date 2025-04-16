import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, message, Tag, Popover } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import FormationForm from './forms/FormationForm';
import DataTable from '../common/DataTable';
import api from '../../services/api';

const FormationList = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingFormation, setEditingFormation] = useState(null);

    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        setLoading(true);
        try {
            const response = await api.get('/formations');
            setFormations(response.data);
        } catch (error) {
            message.error('Erreur lors du chargement des formations');
        }
        setLoading(false);
    };

    const handleAdd = () => {
        setEditingFormation(null);
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingFormation(record);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/formations/${id}`);
            message.success('Formation supprimée avec succès');
            fetchFormations();
        } catch (error) {
            message.error('Erreur lors de la suppression');
        }
    };

    const handleSave = async (values) => {
        try {
            if (editingFormation) {
                await api.put(`/formations/${editingFormation.id}`, values);
                message.success('Formation mise à jour avec succès');
            } else {
                await api.post('/formations', values);
                message.success('Formation créée avec succès');
            }
            setModalVisible(false);
            fetchFormations();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde');
        }
    };

    const renderParticipants = (participants) => {
        if (!participants || participants.length === 0) {
            return <span>Aucun participant</span>;
        }

        return (
            <Popover
                content={
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {participants.map((participant) => (
                            <div key={participant.id}>
                                {participant.nom} {participant.prenom}
                            </div>
                        ))}
                    </div>
                }
                title="Liste des participants"
                trigger="hover"
            >
                <Button type="link" icon={<UserOutlined />}>
                    {participants.length} participant(s)
                </Button>
            </Popover>
        );
    };

    const columns = [
        {
            title: 'Titre',
            dataIndex: 'titre',
            key: 'titre',
        },
        {
            title: 'Date de début',
            dataIndex: 'date_debut',
            key: 'date_debut',
        },
        {
            title: 'Date de fin',
            dataIndex: 'date_fin',
            key: 'date_fin',
        },
        {
            title: 'Prix',
            dataIndex: 'prix',
            key: 'prix',
            render: (prix) => `${prix} €`,
        },
        {
            title: 'Places disponibles',
            dataIndex: 'places_disponibles',
            key: 'places_disponibles',
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => (
                <Tag color={
                    statut === 'en_cours' ? 'green' :
                    statut === 'terminee' ? 'blue' :
                    statut === 'annulee' ? 'red' :
                    'default'
                }>
                    {statut === 'en_cours' ? 'En cours' :
                     statut === 'terminee' ? 'Terminée' :
                     statut === 'annulee' ? 'Annulée' :
                     'Planifiée'}
                </Tag>
            ),
        },
        {
            title: 'Participants',
            key: 'participants',
            render: (_, record) => renderParticipants(record.participants),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Modifier
                    </Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Supprimer
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <DataTable
                title="Formations"
                columns={columns}
                dataSource={formations}
                loading={loading}
                searchPlaceholder="Rechercher une formation..."
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Nouvelle Formation
                    </Button>
                }
            />

            <Modal
                title={editingFormation ? "Modifier la formation" : "Nouvelle formation"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <FormationForm
                    initialValues={editingFormation}
                    onFinish={handleSave}
                    onCancel={() => setModalVisible(false)}
                />
            </Modal>
        </>
    );
};

export default FormationList; 