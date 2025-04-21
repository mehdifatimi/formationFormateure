import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, message, Tag, Popover, Badge, Checkbox, List } from 'antd';
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
    const [absenceModalVisible, setAbsenceModalVisible] = useState(false);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
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
                await api.put(`/formations/${editingFormation.id}`, formationData);
                message.success('Formation mise à jour avec succès');
            } else {
                const response = await api.post('/formations', formationData);
                if (participants && participants.length > 0) {
                    await Promise.all(
                        participants.map(participantId =>
                            api.post(`/formations/${response.data.id}/participants/${participantId}`)
                        )
                    );
                }
                message.success('Formation créée avec succès');
            }
            
            setModalVisible(false);
            fetchFormations();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde de la formation');
        }
    };

    const handleManageAbsences = (formation) => {
        setSelectedFormation(formation);
        setSelectedParticipants([]);
        setAbsenceModalVisible(true);
    };

    const handleAbsenceSubmit = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Vérifier si l'absence existe déjà pour cette date
            const existingAbsences = await api.get('/absences', {
                params: {
                    formation_id: selectedFormation.id,
                    date: today
                }
            });

            const existingParticipantIds = existingAbsences.data.map(absence => absence.participant_id);
            const newParticipants = selectedParticipants.filter(id => !existingParticipantIds.includes(id));

            if (newParticipants.length === 0) {
                message.warning('Tous les participants sélectionnés sont déjà marqués comme absents pour cette date');
                return;
            }

            await Promise.all(
                newParticipants.map(participantId =>
                    api.post('/absences', {
                        participant_id: participantId,
                        formation_id: selectedFormation.id,
                        date: today,
                        reason: 'Absence enregistrée',
                        status: 'unjustified'
                    })
                )
            );
            message.success('Absences enregistrées avec succès');
            setAbsenceModalVisible(false);
            fetchAbsences();
        } catch (error) {
            message.error('Erreur lors de l\'enregistrement des absences');
        }
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
        const formationAbsences = absences[record.id] || [];
        if (formationAbsences.length === 0) {
            return <Tag color="success">Aucune absence</Tag>;
        }

        // Regrouper les absences par participant
        const absencesByParticipant = {};
        formationAbsences.forEach(absence => {
            if (absence.participant) {
                const key = `${absence.participant.id}`;
                if (!absencesByParticipant[key]) {
                    absencesByParticipant[key] = {
                        participant: absence.participant,
                        dates: []
                    };
                }
                absencesByParticipant[key].dates.push(absence.date);
            }
        });

        return (
            <Popover
                content={
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {Object.values(absencesByParticipant).map((item) => (
                            <div key={item.participant.id} style={{ marginBottom: '10px' }}>
                                <strong>{item.participant.nom} {item.participant.prenom}</strong>
                                <div style={{ marginLeft: '15px' }}>
                                    {item.dates.map(date => (
                                        <div key={date}>
                                            {new Date(date).toLocaleDateString()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                }
                title="Liste des absences"
                trigger="hover"
            >
                <Badge count={Object.keys(absencesByParticipant).length} style={{ backgroundColor: '#52c41a' }}>
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
                        onClick={() => handleManageAbsences(record)}
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

            <Modal
                title={`Gérer les absences - ${selectedFormation?.titre}`}
                open={absenceModalVisible}
                onCancel={() => setAbsenceModalVisible(false)}
                onOk={handleAbsenceSubmit}
                width={600}
            >
                {selectedFormation && (
                    <List
                        dataSource={selectedFormation.participants || []}
                        renderItem={participant => (
                            <List.Item>
                                <Checkbox
                                    checked={selectedParticipants.includes(participant.id)}
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setSelectedParticipants([...selectedParticipants, participant.id]);
                                        } else {
                                            setSelectedParticipants(selectedParticipants.filter(id => id !== participant.id));
                                        }
                                    }}
                                >
                                    {participant.nom} {participant.prenom}
                                </Checkbox>
                            </List.Item>
                        )}
                    />
                )}
            </Modal>
        </>
    );
};

export default FormationList;