import React, { useState, useEffect } from 'react';
import { Table, Tag, message, Button, Modal, List, Empty, Popover, Form, Input } from 'antd';
import { UserOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import api from '../../../services/api';
import moment from 'moment';

const FormationAnimateur = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isAbsenceModalVisible, setIsAbsenceModalVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vous devez être connecté pour accéder à cette page');
        return;
      }

      const response = await api.get('/trainer/formations');
      const formationsWithValidation = response.data.map(formation => ({
        ...formation,
        validation: formation.formation_valider && formation.formation_valider.length > 0 
          ? formation.formation_valider[0] 
          : null
      }));
      setFormations(formationsWithValidation);
    } catch (error) {
      console.error('Erreur API:', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            message.error('Session expirée. Veuillez vous reconnecter.');
            break;
          case 500:
            message.error('Erreur serveur. Veuillez réessayer plus tard.');
            break;
          default:
            message.error('Erreur lors du chargement des formations');
        }
      } else {
        message.error('Erreur de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManageAbsences = async (formation) => {
    setSelectedFormation(formation);
    try {
      const response = await api.get(`/formations/${formation.id}`);
      setParticipants(response.data.participants || []);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Erreur API:', error);
      message.error('Erreur lors du chargement des participants');
    }
  };

  const handleMarkAbsence = (participant) => {
    setSelectedParticipant(participant);
    setIsAbsenceModalVisible(true);
  };

  const handleAbsenceSubmit = async (values) => {
    try {
      await api.post(`/formations/${selectedFormation.id}/absences`, {
        participant_id: selectedParticipant.id,
        date: moment().format('YYYY-MM-DD'),
        reason: values.reason,
        status: 'unjustified',
        commentaire: values.commentaire
      });

      message.success(`L'absence de ${selectedParticipant.prenom} ${selectedParticipant.nom} a été enregistrée`);
      setIsAbsenceModalVisible(false);
      form.resetFields();
      handleManageAbsences(selectedFormation); // Recharger les participants
    } catch (error) {
      console.error('Erreur API:', error);
      message.error('Erreur lors de l\'enregistrement de l\'absence');
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedFormation(null);
    setParticipants([]);
  };

  const handleAbsenceModalClose = () => {
    setIsAbsenceModalVisible(false);
    setSelectedParticipant(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Titre',
      dataIndex: 'titre',
      key: 'titre',
    },
    {
      title: 'Formateur',
      dataIndex: 'formateur',
      key: 'formateur',
      render: (formateur) => formateur?.nom || 'Non assigné',
    },
    {
      title: 'Date de début',
      dataIndex: 'date_debut',
      key: 'date_debut',
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Date de fin',
      dataIndex: 'date_fin',
      key: 'date_fin',
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut) => (
        <Tag color={statut === 'planifiée' ? 'blue' : statut === 'en_cours' ? 'green' : 'red'}>
          {statut}
        </Tag>
      ),
    },
    {
      title: 'Validation',
      key: 'validation',
      render: (_, record) => {
        if (!record.validation) {
          return <Tag color="orange">En attente de validation</Tag>;
        }
        return (
          <div>
            <Tag color="green">Validée</Tag>
            <div style={{ marginTop: '5px' }}>
              <small>
                Validé le: {moment(record.validation.date_validation).format('DD/MM/YYYY HH:mm')}
              </small>
            </div>
            {record.validation.commentaire && (
              <div style={{ marginTop: '5px' }}>
                <small>Commentaire: {record.validation.commentaire}</small>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Liste des participants',
      key: 'participants_list',
      render: (_, record) => {
        const participants = record.participants || [];
        const content = (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {participants.length > 0 ? (
              <List
                size="small"
                dataSource={participants}
                renderItem={participant => (
                  <List.Item>
                    <div>
                      <div>{`${participant.prenom} ${participant.nom}`}</div>
                      <Tag color={participant.pivot?.statut === 'present' ? 'green' : 'red'}>
                        {participant.pivot?.statut || 'en_attente'}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Aucun participant" />
            )}
          </div>
        );

        return (
          <Popover content={content} title="Participants" trigger="click">
            <Button type="link" icon={<TeamOutlined />}>
              {participants.length} participant(s)
            </Button>
          </Popover>
        );
      },
    },
    {
      title: 'Liste des absences',
      key: 'absences_list',
      render: (_, record) => {
        const absences = record.absences || [];
        const content = (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {absences.length > 0 ? (
              <List
                size="small"
                dataSource={absences}
                renderItem={absence => (
                  <List.Item>
                    <div>
                      <div>
                        <strong>{absence.participant?.prenom} {absence.participant?.nom}</strong>
                      </div>
                      <div>
                        <CalendarOutlined /> {moment(absence.date).format('DD/MM/YYYY')}
                      </div>
                      <div>
                        <Tag color={absence.status === 'justified' ? 'blue' : 'red'}>
                          {absence.status === 'justified' ? 'Justifiée' : 'Non justifiée'}
                        </Tag>
                      </div>
                      {absence.reason && (
                        <div style={{ marginTop: '5px' }}>
                          <small><strong>Motif:</strong> {absence.reason}</small>
                        </div>
                      )}
                      {absence.commentaire && (
                        <div style={{ marginTop: '5px' }}>
                          <small><strong>Commentaire:</strong> {absence.commentaire}</small>
                        </div>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Aucune absence enregistrée" />
            )}
          </div>
        );

        return (
          <Popover content={content} title="Historique des absences" trigger="click">
            <Button type="link" icon={<CalendarOutlined />}>
              {absences.length} absence(s)
            </Button>
          </Popover>
        );
      },
    },
    {
      title: 'Gérer les absences',
      key: 'participants',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<TeamOutlined />}
          onClick={() => handleManageAbsences(record)}
        >
          Gérer les absences
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={formations}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={`Gestion des absences - ${selectedFormation?.titre}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {participants.length > 0 ? (
          <List
            dataSource={participants}
            renderItem={participant => (
              <List.Item
                actions={[
                  <Button 
                    type="primary" 
                    icon={<UserOutlined />}
                    onClick={() => handleMarkAbsence(participant)}
                  >
                    Marquer absent
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={`${participant.prenom} ${participant.nom}`}
                  description={`Email: ${participant.email}`}
                />
                <div>
                  <Tag color={participant.pivot?.statut === 'present' ? 'green' : 'red'}>
                    {participant.pivot?.statut || 'en_attente'}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="Aucun participant dans cette formation" />
        )}
      </Modal>

      <Modal
        title={`Marquer l'absence de ${selectedParticipant?.prenom} ${selectedParticipant?.nom}`}
        open={isAbsenceModalVisible}
        onCancel={handleAbsenceModalClose}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAbsenceSubmit}
          layout="vertical"
        >
          <Form.Item
            name="reason"
            label="Motif de l'absence"
            rules={[{ required: true, message: 'Veuillez indiquer le motif de l\'absence' }]}
          >
            <Input.TextArea rows={4} placeholder="Entrez le motif de l'absence" />
          </Form.Item>

          <Form.Item
            name="commentaire"
            label="Commentaire"
          >
            <Input.TextArea rows={4} placeholder="Entrez un commentaire (optionnel)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Confirmer l'absence
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormationAnimateur; 