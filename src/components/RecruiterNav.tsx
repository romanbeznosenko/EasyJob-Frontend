import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, ShopOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const RecruiterNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname);
    const { logoutUser } = useAuth();

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location.pathname]);

    const menuItems: MenuItem[] = [
        {
            label: 'Dashboard',
            key: '/recruiter-dashboard',
        },
        {
            label: 'My Offers',
            key: '/my-offers',
        },
        {
            label: 'Applications',
            key: '/firm-applications',
        },
        {
            label: 'My Company',
            key: '/my-company',
        },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        navigate(e.key);
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0',
                padding: '0 24px',
                height: '64px',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '16px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                    onClick={() => navigate('/recruiter-dashboard')}
                >
                    <ShopOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <span>JobSeeker Platform</span>
                </div>
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={menuItems}
                    style={{
                        border: 'none',
                        flex: 1,
                    }}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <Avatar
                    icon={<UserOutlined />}
                    style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
                    onClick={() => navigate('/profile')}
                />
                <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    style={{ color: '#ff4d4f' }}
                >
                    Logout
                </Button>
            </div>
        </Header>
    );
};

export default RecruiterNav;
