import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag, DatePicker, Select, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { getAbsences, deleteAbsence, getAbsenceStatistics, createAbsence, updateAbsence } from '../../services/absenceService';
import { getParticipants } from '../../services/participantService';
import { getFormations } from '../../services/formationService';
import AbsenceForm from './forms/AbsenceForm';
import './AbsenceList.css';

const { RangePicker } = DatePicker;

const AbsenceList = () => {
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAbsence, setSelectedAbsence] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [formations, setFormations] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [filters, setFilters] = useState({
        participant_id: null,
        formation_id: null,
        status: null,
        date_from: null,
        date_to: null
    });

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [absencesData, participantsData, formationsData, statsData] = await Promise.all([
                getAbsences(filters),
                getParticipants(),
                getFormations(),
                getAbsenceStatistics(filters)
            ]);
            setAbsences(absencesData);
            setParticipants(participantsData);
            setFormations(formationsData);
            setStatistics(statsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedAbsence(null);
        setModalVisible(true);
    };

    const handleEdit = (absence) => {
        setSelectedAbsence(absence);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteAbsence(id);
            message.success('Absence supprimée avec succès');
            fetchData();
        } catch (error) {
            message.error('Erreur lors de la suppression de l\'absence');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (selectedAbsence) {
                await updateAbsence(selectedAbsence.id, values);
                message.success('Absence mise à jour avec succès');
            } else {
                await createAbsence(values);
                message.success('Absence créée avec succès');
            }
            setModalVisible(false);
            fetchData();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde de l\'absence');
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateRangeChange = (dates) => {
        if (dates) {
            setFilters(prev => ({
                ...prev,
                date_from: dates[0].format('YYYY-MM-DD'),
                date_to: dates[1].format('YYYY-MM-DD')
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                date_from: null,
                date_to: null
            }));
        }
    };

    const columns = [
        {
            title: 'Participant',
            dataIndex: ['participant', 'nom'],
            key: 'participant',
            render: (text, record) => `${record.participant.prenom} ${record.participant.nom}`
        },
        {
            title: 'Formation',
            dataIndex: ['formation', 'titre'],
            key: 'formation'
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Raison',
            dataIndex: 'reason',
            key: 'reason'
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'justified' ? 'green' : 'red'}>
                    {status === 'justified' ? 'Justifiée' : 'Non justifiée'}
                </Tag>
            )
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
            )
        }
    ];

    return (
        <div className="absence-list-container">
            <div className="absence-list-header">
                <h1>Gestion des absences</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Ajouter une absence
                </Button>
            </div>

            {statistics && (
                <div className="statistics-container">
                    <div className="stat-card">
                        <h3>Total des absences</h3>
                        <p>{statistics.total}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Absences justifiées</h3>
                        <p>{statistics.justified}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Absences non justifiées</h3>
                        <p>{statistics.unjustified}</p>
                    </div>
                </div>
            )}

            <div className="filters-container">
                <Select
                    placeholder="Filtrer par participant"
                    allowClear
                    style={{ width: 200 }}
                    onChange={(value) => handleFilterChange('participant_id', value)}
                >
                    {participants.map(participant => (
                        <Select.Option key={participant.id} value={participant.id}>
                            {participant.prenom} {participant.nom}
                        </Select.Option>
                    ))}
                </Select>

                <Select
                    placeholder="Filtrer par formation"
                    allowClear
                    style={{ width: 200 }}
                    onChange={(value) => handleFilterChange('formation_id', value)}
                >
                    {formations.map(formation => (
                        <Select.Option key={formation.id} value={formation.id}>
                            {formation.titre}
                        </Select.Option>
                    ))}
                </Select>

                <Select
                    placeholder="Filtrer par statut"
                    allowClear
                    style={{ width: 200 }}
                    onChange={(value) => handleFilterChange('status', value)}
                >
                    <Select.Option value="justified">Justifiée</Select.Option>
                    <Select.Option value="unjustified">Non justifiée</Select.Option>
                </Select>

                <RangePicker
                    onChange={handleDateRangeChange}
                    style={{ width: 300 }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={absences}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} absences`
                }}
            />

            <Modal
                title={selectedAbsence ? 'Modifier l\'absence' : 'Ajouter une absence'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <AbsenceForm
                    initialValues={selectedAbsence}
                    onSubmit={handleSubmit}
                    onCancel={() => setModalVisible(false)}
                    participants={participants}
                    formations={formations}
                />
            </Modal>
        </div>
    );
};

export default AbsenceList; 