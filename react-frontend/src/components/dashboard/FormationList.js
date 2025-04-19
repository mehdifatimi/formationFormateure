import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, message, Tag, Popover, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FormationForm from './forms/FormationForm';
import DataTable from '../common/DataTable';
import api from '../../services/api';

const FormationList = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingFormation, setEditingFormation] = useState(null);
    const [absences, setAbsences] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchFormations();
        fetchAbsences();
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

    const fetchAbsences = async () => {
        try {
            const response = await api.get('/absences');
            const absencesMap = {};
            response.data.forEach(absence => {
                if (!absencesMap[absence.formation_id]) {
                    absencesMap[absence.formation_id] = [];
                }
                absencesMap[absence.formation_id].push(absence);
            });
            setAbsences(absencesMap);
        } catch (error) {
            message.error('Erreur lors du chargement des absences');
        }
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
            const { participants, ...formationData } = values;
            
            if (editingFormation) {
                // Mise à jour de la formation
                await api.put(`/formations/${editingFormation.id}`, formationData);
                
                // Mise à jour des participants
                if (participants && participants.length > 0) {
                    // Récupérer les participants actuels
                    const currentParticipants = editingFormation.participants || [];
                    const currentParticipantIds = currentParticipants.map(p => p.id);
                    
                    // Ajouter les nouveaux participants
                    for (const participantId of participants) {
                        if (!currentParticipantIds.includes(participantId)) {
                            try {
                                await api.post(`/formations/${editingFormation.id}/participants/${participantId}`);
                            } catch (error) {
                                console.error(`Erreur lors de l'ajout du participant ${participantId}:`, error);
                            }
                        }
                    }
                    
                    // Supprimer les participants qui ne sont plus dans la liste
                    for (const participantId of currentParticipantIds) {
                        if (!participants.includes(participantId)) {
                            try {
                                await api.delete(`/participants/${participantId}/formations/${editingFormation.id}`);
                            } catch (error) {
                                console.error(`Erreur lors de la suppression du participant ${participantId}:`, error);
                            }
                        }
                    }
                }
                
                message.success('Formation mise à jour avec succès');
            } else {
                // Création de la formation
                const response = await api.post('/formations', formationData);
                const newFormationId = response.data.id;
                
                // Ajouter les participants
                if (participants && participants.length > 0) {
                    for (const participantId of participants) {
                        try {
                            await api.post(`/formations/${newFormationId}/participants/${participantId}`);
                        } catch (error) {
                            console.error(`Erreur lors de l'ajout du participant ${participantId}:`, error);
                        }
                    }
                }
                
                message.success('Formation créée avec succès');
            }
            
            setModalVisible(false);
            fetchFormations();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            message.error('Erreur lors de la sauvegarde de la formation');
        }
    };

    const handleManageAbsences = (formationId) => {
        navigate(`/absences?formation_id=${formationId}`);
    };

    const renderParticipants = (record) => {
        const participants = record.participants || [];
        if (participants.length === 0) {
            return <Tag color="warning">Aucun participant inscrit</Tag>;
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

    const renderAbsences = (record) => {
        const absences = record.absences || [];
        if (absences.length === 0) {
            return <Tag color="success">Aucune absence</Tag>;
        }

        return (
            <Popover
                content={
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {absences.map((absence) => (
                            <div key={absence.id}>
                                {absence.participant ? 
                                    `${absence.participant.nom} ${absence.participant.prenom}` : 
                                    'Participant supprimé'} - {absence.date}
                            </div>
                        ))}
                    </div>
                }
                title="Liste des absences"
                trigger="hover"
            >
                <Badge count={absences.length} style={{ backgroundColor: '#52c41a' }}>
                    <Button type="link" icon={<ClockCircleOutlined />}>
                        Absences
                    </Button>
                </Badge>
            </Popover>
        );
    };

    const columns = [
        {
            title: 'Titre',
            dataIndex: 'titre',
            key: 'titre',
            sorter: (a, b) => a.titre.localeCompare(b.titre),
        },
        {
            title: 'Dates',
            key: 'dates',
            render: (_, record) => (
                <Space direction="vertical">
                    <div>Début: {new Date(record.date_debut).toLocaleDateString()}</div>
                    <div>Fin: {new Date(record.date_fin).toLocaleDateString()}</div>
                </Space>
            ),
        },
        {
            title: 'Formateur',
            dataIndex: ['formateur', 'nom'],
            key: 'formateur',
            render: (_, record) => (
                <span>
                    {record.formateur?.nom} {record.formateur?.prenom}
                </span>
            ),
        },
        {
            title: 'Places',
            dataIndex: 'places_disponibles',
            key: 'places_disponibles',
            sorter: (a, b) => a.places_disponibles - b.places_disponibles,
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => (
                <Tag color={
                    statut === 'terminee' ? 'green' :
                    statut === 'en_cours' ? 'blue' :
                    statut === 'annulee' ? 'red' :
                    'orange'
                }>
                    {statut === 'terminee' ? 'Terminée' :
                     statut === 'en_cours' ? 'En cours' :
                     statut === 'annulee' ? 'Annulée' :
                     'Planifiée'}
                </Tag>
            ),
        },
        {
            title: 'Participants',
            key: 'participants',
            render: (_, record) => renderParticipants(record),
        },
        {
            title: 'Absences',
            key: 'absences',
            render: (_, record) => renderAbsences(record),
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
                        onClick={() => {
                            Modal.confirm({
                                title: 'Êtes-vous sûr de vouloir supprimer cette formation ?',
                                content: 'Cette action est irréversible.',
                                okText: 'Oui',
                                okType: 'danger',
                                cancelText: 'Non',
                                onOk: () => handleDelete(record.id),
                            });
                        }}
                    >
                        Supprimer
                    </Button>
                    <Button
                        onClick={() => handleManageAbsences(record.id)}
                    >
                        Gérer les absences
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
                destroyOnClose
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