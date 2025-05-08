import React, { useState, useEffect } from 'react';
import { Table, Tag, message, Empty } from 'antd';
import api from '../../../services/api';
import moment from 'moment';

const FormationPartisipant = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/formations');
      // Filtrer et transformer les données pour inclure les informations de validation
      const validatedFormations = response.data
        .filter(formation => formation.formation_valider && formation.formation_valider.length > 0)
        .map(formation => ({
          ...formation,
          validation: formation.formation_valider[0]
        }));
      setFormations(validatedFormations);
    } catch (error) {
      console.error('Erreur API:', error);
      message.error('Erreur lors du chargement des formations');
    } finally {
      setLoading(false);
    }
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
        if (!record.validation) return null;
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
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={formations}
        loading={loading}
        rowKey="id"
        locale={{
          emptyText: (
            <Empty
              description="Aucune formation validée disponible"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        }}
      />
    </div>
  );
};

export default FormationPartisipant; 