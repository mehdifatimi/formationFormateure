import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../../../services/api';

const FormateurCDC = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFormateur, setEditingFormateur] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    loadFormateurs();
    loadSpecialites();
  }, []);

  const loadSpecialites = async () => {
    try {
      const response = await api.get('/specialites');
      setSpecialites(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement des spécialités');
    }
  };

  const loadFormateurs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/formateurs');
      setFormateurs(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement des formateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      
      // Gestion des spécialités
      if (values.specialites) {
        formData.append('specialites', JSON.stringify(values.specialites));
      }

      // Gestion de la photo
      if (fileList.length > 0) {
        formData.append('photo', fileList[0].originFileObj);
      }

      // Ajout des autres champs
      Object.keys(values).forEach(key => {
        if (key !== 'specialites' && key !== 'photo' && values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      if (editingFormateur) {
        await api.post(`/formateurs/${editingFormateur.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Formateur mis à jour avec succès');
      } else {
        await api.post('/formateurs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Formateur créé avec succès');
      }

      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      loadFormateurs();
    } catch (error) {
      message.error('Erreur lors de la sauvegarde du formateur');
    }
  };

  const handleEdit = (formateur) => {
    setEditingFormateur(formateur);
    // Préparation des spécialités pour le Select
    const specialitesIds = formateur.specialites ? 
      formateur.specialites.map(spec => spec.id) : 
      [];

    form.setFieldsValue({
      ...formateur,
      specialites: specialitesIds,
      disponible: formateur.disponible || false
    });

    // Préparation de la photo pour l'Upload
    if (formateur.photo) {
      setFileList([{
        uid: '-1',
        name: 'photo.jpg',
        status: 'done',
        url: formateur.photo
      }]);
    } else {
      setFileList([]);
    }

    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/formateurs/${id}`);
      message.success('Formateur supprimé avec succès');
      loadFormateurs();
    } catch (error) {
      message.error('Erreur lors de la suppression du formateur');
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
      title: 'Spécialités',
      dataIndex: 'specialites',
      key: 'specialites',
      render: (specialites) => {
        if (!specialites || !Array.isArray(specialites)) {
          return <span>Aucune spécialité</span>;
        }
        return (
          <Space>
            {specialites.map((spec, index) => {
              if (!spec) return null;
              const key = spec.id ? `${spec.id}-${spec.nom || ''}` : `speciality-${index}`;
              return (
                <Tag key={key} color="blue">
                  {spec.nom || 'Spécialité sans nom'}
                </Tag>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: 'Disponible',
      dataIndex: 'disponible',
      key: 'disponible',
      render: (disponible) => (
        <Tag color={disponible ? 'green' : 'red'}>
          {disponible ? 'Disponible' : 'Indisponible'}
        </Tag>
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
            danger
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
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingFormateur(null);
          form.resetFields();
          setFileList([]);
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Ajouter un formateur
      </Button>

      <Table
        columns={columns}
        dataSource={formateurs}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingFormateur ? 'Modifier le formateur' : 'Nouveau formateur'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFileList([]);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="nom"
            label="Nom"
            rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="prenom"
            label="Prénom"
            rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Veuillez saisir l\'email' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="telephone"
            label="Téléphone"
            rules={[{ required: true, message: 'Veuillez saisir le téléphone' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="specialites"
            label="Spécialités"
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Sélectionner des spécialités"
              options={specialites.map(spec => ({
                label: spec.nom,
                value: spec.id
              }))}
            />
          </Form.Item>

          <Form.Item
            name="bio"
            label="Biographie"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Photo"
          >
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Sélectionner une photo</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="linkedin"
            label="LinkedIn"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="disponible"
            label="Disponibilité"
          >
            <Select>
              <Select.Option value={true}>Disponible</Select.Option>
              <Select.Option value={false}>Indisponible</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingFormateur ? 'Modifier' : 'Créer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormateurCDC; 