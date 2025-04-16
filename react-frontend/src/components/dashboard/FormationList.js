import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag, Popover } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import FormationForm from './forms/FormationForm';
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
            message.error('Erreur lors de l\'enregistrement');
        }
    };

    const renderParticipants = (participants) => {
        if (!participants || participants.length === 0) {
            return <span style={{ color: '#999' }}>Aucun participant</span>;
        }

        const content = (
            <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto', 
                width: '250px',
                padding: '8px'
            }}>
                <div style={{ 
                    marginBottom: '8px', 
                    padding: '8px',
                    backgroundColor: '#f0f2f5',
                    borderRadius: '4px'
                }}>
                    <strong>Total: {participants.length} participant(s)</strong>
                </div>
                {participants.map(participant => (
                    <div 
                        key={participant.id} 
                        style={{ 
                            marginBottom: '8px',
                            padding: '8px',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <UserOutlined style={{ 
                            marginRight: '8px',
                            color: '#1890ff',
                            backgroundColor: '#e6f7ff',
                            padding: '4px',
                            borderRadius: '50%'
                        }} />
                        <span>{participant.prenom} {participant.nom}</span>
                    </div>
                ))}
            </div>
        );

        return (
            <Popover 
                content={content} 
                title={
                    <div style={{ 
                        borderBottom: '1px solid #f0f0f0',
                        padding: '4px 0'
                    }}>
                        Liste des participants
                    </div>
                } 
                trigger="click"
                placement="right"
            >
                <Button 
                    type="primary"
                    icon={<UserOutlined />}
                    style={{
                        backgroundColor: participants.length > 0 ? '#1890ff' : '#d9d9d9'
                    }}
                >
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
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Nouvelle Formation
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={formations}
                rowKey="id"
                loading={loading}
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
        </div>
    );
};

export default FormationList; 