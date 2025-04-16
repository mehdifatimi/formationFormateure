import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ParticipantForm from './forms/ParticipantForm';
import DataTable from '../common/DataTable';
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
        }
        setLoading(false);
    };

    const handleAdd = () => {
        setEditingParticipant(null);
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingParticipant(record);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/participants/${id}`);
            message.success('Participant supprimé avec succès');
            fetchParticipants();
        } catch (error) {
            message.error('Erreur lors de la suppression');
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
            message.error('Erreur lors de la sauvegarde');
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
            title: 'Ville',
            dataIndex: 'ville',
            key: 'ville',
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => (
                <Tag color={
                    statut === 'actif' ? 'green' :
                    statut === 'inactif' ? 'red' :
                    'default'
                }>
                    {statut === 'actif' ? 'Actif' :
                     statut === 'inactif' ? 'Inactif' :
                     'En attente'}
                </Tag>
            ),
        },
        {
            title: 'Formations',
            key: 'formations',
            render: (_, record) => (
                <Space>
                    {record.formations?.map(formation => (
                        <Tag key={formation.id} color="blue">
                            {formation.titre}
                        </Tag>
                    ))}
                </Space>
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
                title="Participants"
                columns={columns}
                dataSource={participants}
                loading={loading}
                searchPlaceholder="Rechercher un participant..."
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Nouveau Participant
                    </Button>
                }
            />

            <Modal
                title={editingParticipant ? "Modifier le participant" : "Nouveau participant"}
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
        </>
    );
};

export default ParticipantList; 