import React from 'react';
import { Form, Input, Select, DatePicker, Button, Space } from 'antd';
import moment from 'moment';

const { TextArea } = Input;

const AbsenceForm = ({ initialValues, onSubmit, onCancel, participants, formations }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            date: values.date.format('YYYY-MM-DD')
        };
        await onSubmit(formattedValues);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues ? {
                ...initialValues,
                date: moment(initialValues.date)
            } : undefined}
        >
            <Form.Item
                name="participant_id"
                label="Participant"
                rules={[{ required: true, message: 'Veuillez sélectionner un participant' }]}
            >
                <Select
                    placeholder="Sélectionner un participant"
                    showSearch
                    optionFilterProp="children"
                >
                    {participants.map(participant => (
                        <Select.Option key={participant.id} value={participant.id}>
                            {participant.prenom} {participant.nom}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="formation_id"
                label="Formation"
                rules={[{ required: true, message: 'Veuillez sélectionner une formation' }]}
            >
                <Select
                    placeholder="Sélectionner une formation"
                    showSearch
                    optionFilterProp="children"
                >
                    {formations.map(formation => (
                        <Select.Option key={formation.id} value={formation.id}>
                            {formation.titre}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
            >
                <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                />
            </Form.Item>

            <Form.Item
                name="reason"
                label="Raison"
                rules={[{ required: true, message: 'Veuillez saisir la raison de l\'absence' }]}
            >
                <TextArea
                    rows={4}
                    placeholder="Décrivez la raison de l'absence"
                />
            </Form.Item>

            <Form.Item
                name="status"
                label="Statut"
                rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
            >
                <Select placeholder="Sélectionner un statut">
                    <Select.Option value="justified">Justifiée</Select.Option>
                    <Select.Option value="unjustified">Non justifiée</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {initialValues ? 'Modifier' : 'Ajouter'}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default AbsenceForm; 