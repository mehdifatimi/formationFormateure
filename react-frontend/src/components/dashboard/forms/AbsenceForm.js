import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { createAbsence, updateAbsence } from '../../../services/absenceService';
import moment from 'moment';

const { TextArea } = Input;

const AbsenceForm = ({ visible, onCancel, onSuccess, initialValues, participants, formations }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    date: initialValues.date ? moment(initialValues.date) : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                date: values.date.format('YYYY-MM-DD'),
            };

            if (initialValues) {
                await updateAbsence(initialValues.id, formattedValues);
                message.success('Absence updated successfully');
            } else {
                await createAbsence(formattedValues);
                message.success('Absence created successfully');
            }
            onSuccess();
        } catch (error) {
            message.error('Failed to save absence');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={initialValues ? 'Edit Absence' : 'Add Absence'}
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="participant_id"
                    label="Participant"
                    rules={[{ required: true, message: 'Please select a participant' }]}
                >
                    <Select
                        placeholder="Select a participant"
                        options={participants.map(p => ({
                            label: `${p.first_name} ${p.last_name}`,
                            value: p.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="formation_id"
                    label="Formation"
                    rules={[{ required: true, message: 'Please select a formation' }]}
                >
                    <Select
                        placeholder="Select a formation"
                        options={formations.map(f => ({
                            label: f.title,
                            value: f.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Date"
                    rules={[{ required: true, message: 'Please select a date' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="reason"
                    label="Reason"
                    rules={[{ required: true, message: 'Please enter a reason' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select a status' }]}
                >
                    <Select
                        placeholder="Select a status"
                        options={[
                            { label: 'Pending', value: 'pending' },
                            { label: 'Approved', value: 'approved' },
                            { label: 'Rejected', value: 'rejected' },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AbsenceForm; 