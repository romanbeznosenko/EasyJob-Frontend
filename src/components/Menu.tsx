import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, LoginOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import './Menu.css';

type MenuItem = Required<MenuProps>['items'][number];

interface NavigationMenuProps {
    mode?: 'horizontal' | 'vertical' | 'inline';
    theme?: 'light' | 'dark';
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ mode = 'horizontal', theme = 'light' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location.pathname]);

    const items: MenuItem[] = [
        {
            label: 'Home',
            key: '/',
            icon: <HomeOutlined />,
        },
        {
            label: 'About',
            key: '/about',
            icon: <InfoCircleOutlined />,
        },
        {
            label: 'Login',
            key: '/login',
            icon: <LoginOutlined />,
        },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        navigate(e.key);
    };

    return (
        <div className="navigation-menu">
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode={mode}
                theme={theme}
                items={items}
            />
        </div>
    );
};

export default NavigationMenu;