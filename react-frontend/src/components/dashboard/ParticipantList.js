import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ParticipantForm from './forms/ParticipantForm';
import api from '../../services/api';

const ParticipantList = () => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const response = await api.get('/participants');
            setParticipants(response.data);
        } catch (error) {
            console.error('Error fetching participants:', error);
            message.error('Erreur lors du chargement des participants');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedParticipant(null);
        setModalVisible(true);
    };

    const handleEdit = (participant) => {
        setSelectedParticipant(participant);
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

    const handleSubmit = async (values) => {
        try {
            if (selectedParticipant) {
                await api.put(`/participants/${selectedParticipant.id}`, values);
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
            title: 'Niveau d\'étude',
            dataIndex: 'niveau_etude',
            key: 'niveau_etude',
        },
        {
            title: 'Statut du paiement',
            dataIndex: 'statut_paiement',
            key: 'statut_paiement',
            render: (status) => (
                <Tag color={
                    status === 'en attente' ? 'orange' :
                    status === 'payé' ? 'green' :
                    status === 'annulé' ? 'red' :
                    'blue'
                }>
                    {status}
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
                    />
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
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
                title={selectedParticipant ? 'Modifier le participant' : 'Ajouter un participant'}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <ParticipantForm
                    initialValues={selectedParticipant}
                    onFinish={handleSubmit}
                    onCancel={() => setModalVisible(false)}
                />
            </Modal>
        </div>
    );
};

export default ParticipantList; 