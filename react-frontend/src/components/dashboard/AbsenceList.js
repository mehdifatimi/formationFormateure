import React, { useState, useEffect } from 'react';
import { Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import DataTable from '../common/DataTable';
import { getAbsences, deleteAbsence } from '../../services/absenceService';
import { getParticipants } from '../../services/participantService';
import { getFormations } from '../../services/formationService';
import AbsenceForm from './forms/AbsenceForm';

const AbsenceList = () => {
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [editingAbsence, setEditingAbsence] = useState(null);
    const [filters, setFilters] = useState({});
    const [participants, setParticipants] = useState([]);
    const [formations, setFormations] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [absencesData, participantsData, formationsData] = await Promise.all([
                getAbsences(filters),
                getParticipants(),
                getFormations()
            ]);
            setAbsences(absencesData);
            setParticipants(participantsData);
            setFormations(formationsData);
        } catch (error) {
            message.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const handleEdit = (record) => {
        setEditingAbsence(record);
        setVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            await deleteAbsence(record.id);
            message.success('Absence deleted successfully');
            fetchData();
        } catch (error) {
            message.error('Failed to delete absence');
        }
    };

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
    };

    const handleAdd = () => {
        setEditingAbsence(null);
        setVisible(true);
    };

    const columns = [
        {
            title: 'Participant',
            dataIndex: ['participant', 'name'],
            key: 'participant',
        },
        {
            title: 'Formation',
            dataIndex: ['formation', 'title'],
            key: 'formation',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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
                    <Popconfirm
                        title="Are you sure you want to delete this absence?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filterConfig = [
        {
            name: 'participant_id',
            label: 'Participant',
            type: 'select',
            options: participants.map(p => ({
                label: `${p.first_name} ${p.last_name}`,
                value: p.id
            })),
        },
        {
            name: 'formation_id',
            label: 'Formation',
            type: 'select',
            options: formations.map(f => ({
                label: f.title,
                value: f.id
            })),
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
            ],
        },
    ];

    return (
        <>
            <DataTable
                title="Absences"
                columns={columns}
                dataSource={absences}
                loading={loading}
                filters={filterConfig}
                onFilter={handleFilter}
                searchPlaceholder="Search absences..."
                showDateRange
                dateRangeField="date"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add Absence
                    </Button>
                }
            />
            <AbsenceForm
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    setEditingAbsence(null);
                }}
                onSuccess={() => {
                    setVisible(false);
                    setEditingAbsence(null);
                    fetchData();
                }}
                initialValues={editingAbsence}
                participants={participants}
                formations={formations}
            />
        </>
    );
};

export default AbsenceList; 