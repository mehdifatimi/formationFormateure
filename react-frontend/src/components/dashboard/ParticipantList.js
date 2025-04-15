import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ParticipantForm from './forms/ParticipantForm';
import api from '../../services/api';

const ParticipantList = () => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState(null);

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const response = await api.get('/participants');
            setParticipants(response.data);
        } catch (error) {
            message.error('Erreur lors du chargement des participants');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingParticipant(null);
        setModalVisible(true);
    };

    const handleEdit = (participant) => {
        setEditingParticipant(participant);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/participants/${id}`);
            message.success('Participant supprimé avec succès');
            fetchParticipants();
        } catch (error) {
            message.error('Erreur lors de la suppression du participant');
        }
    };

    const handleSave = async (values) => {
        try {
            if (editingParticipant) {
                await api.put(`/participants/${editingParticipant.id}`, values);
                message.success('Participant mis à jour avec succès');
            } else {
                await api.post('/participants', values);
                message.success('Participant créé avec succès');
            }
            setModalVisible(false);
            fetchParticipants();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde du participant');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'en attente':
                return 'orange';
            case 'payé':
                return 'green';
            case 'annulé':
                return 'red';
            case 'remboursé':
                return 'blue';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Prénom',
            dataIndex: 'prenom',
            key: 'prenom',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Téléphone',
            dataIndex: 'telephone',
            key: 'telephone',
        },
        {
            title: 'Formation',
            dataIndex: ['formation', 'titre'],
            key: 'formation',
        },
        {
            title: 'Niveau d\'étude',
            dataIndex: 'niveau_etude',
            key: 'niveau_etude',
        },
        {
            title: 'Statut du paiement',
            dataIndex: 'statut_paiement',
            key: 'statut_paiement',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Tag>
            ),
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
                        danger
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
        <div className="dashboard-content">
            <div className="content-header">
                <h2>Gestion des Participants</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Ajouter un participant
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={participants}
                loading={loading}
                rowKey="id"
            />

            <Modal
                title={editingParticipant ? 'Modifier le participant' : 'Nouveau participant'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <ParticipantForm
                    initialValues={editingParticipant}
                    onFinish={handleSave}
                    onCancel={() => setModalVisible(false)}
                />
            </Modal>
        </div>
    );
};

export default ParticipantList; 