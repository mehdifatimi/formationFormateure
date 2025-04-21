import React, { useState } from 'react';
import { Layout, Menu, Card, Row, Col, Statistic } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    BookOutlined,
    ProfileOutlined,
    DashboardOutlined,
    BarChartOutlined,
    CalendarOutlined,
    LineChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FormationList from './FormationList';
import FormateurList from './FormateurList';
import ParticipantList from './ParticipantList';
import ProfileList from './ProfileList';
import './Dashboard.css';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
    const [selectedMenu, setSelectedMenu] = useState('dashboard');
    const navigate = useNavigate();

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Tableau de bord',
        },
        {
            key: 'formations',
            icon: <BookOutlined />,
            label: 'Formations',
        },
        {
            key: 'formateurs',
            icon: <UserOutlined />,
            label: 'Formateurs',
        },
        {
            key: 'participants',
            icon: <TeamOutlined />,
            label: 'Participants',
        },
        {
            key: 'profiles',
            icon: <ProfileOutlined />,
            label: 'Profils',
        },
        {
            key: 'plan',
            icon: <CalendarOutlined />,
            label: 'Plan Training',
        },
        {
            key: 'trainers',
            icon: <LineChartOutlined />,
            label: 'Track Trainers',
        }
    ];

    const handleMenuClick = ({ key }) => {
        setSelectedMenu(key);
        
        // Navigate to the appropriate route for special menu items
        if (key === 'plan') {
            navigate('/dashboard/plan');
        } else if (key === 'trainers') {
            navigate('/dashboard/trainers');
        }
    };

    const renderContent = () => {
        switch (selectedMenu) {
            case 'formations':
                return <FormationList />;
            case 'formateurs':
                return <FormateurList />;
            case 'participants':
                return <ParticipantList />;
            case 'profiles':
                return <ProfileList />;
            default:
                return (
                    <div className="dashboard-overview">
                        <h2>Bienvenue sur votre tableau de bord !</h2>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={6}>
                                <Card>
                                    <Statistic
                                        title="Formations actives"
                                        value={12}
                                        prefix={<BookOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card>
                                    <Statistic
                                        title="Formateurs"
                                        value={8}
                                        prefix={<UserOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card>
                                    <Statistic
                                        title="Participants"
                                        value={45}
                                        prefix={<TeamOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card>
                                    <Statistic
                                        title="Utilisateurs"
                                        value={15}
                                        prefix={<ProfileOutlined />}
                                    />
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                            <Col xs={24} md={12}>
                                <Card title="Dernières formations">
                                    {/* Ajouter un composant pour afficher les dernières formations */}
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card title="Derniers participants">
                                    {/* Ajouter un composant pour afficher les derniers participants */}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                );
        }
    };

    return (
        <Layout className="dashboard-layout">
            <Sider width={250} className="dashboard-sider">
                <div className="logo">
                    <h2>Formation Formateur</h2>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedMenu]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Header className="dashboard-header">
                    <div className="header-content">
                        <h1>Tableau de bord</h1>
                    </div>
                </Header>
                <Content className="dashboard-content">
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard; 