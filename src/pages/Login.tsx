import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input, Layout, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserTypeEnum } from '../types/auth';

const { Header, Content } = Layout;
const { Title } = Typography;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Login and get user data
            const userData = await loginUser({
                email: values['e-mail'],
                password: values.password,
                staySignedIn: values.remember
            });

            message.success('Login successful!');

            // Redirect based on user type
            const dashboardPath = userData.userType === UserTypeEnum.RECRUITER
                ? '/recruiter-dashboard'
                : '/dashboard';

            navigate(dashboardPath, { replace: true });
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error?.response?.data?.message ||
                                error?.message ||
                                'Login failed. Please check your credentials.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const headerStyle: React.CSSProperties = {
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 00px',
        display: 'flex',
    };

    const contentStyle: React.CSSProperties = {
        display: 'flex',
        padding: '40px 100px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        minWidth: 'calc(100vw - 200px)',
        backgroundColor: '#F5F5F5',
    };

    const formContainerStyle: React.CSSProperties = {
        backgroundColor: '#fff',
        border: '1px solid #f0f0f0',
        padding: '40px',
        borderRadius: '25px',
        width: '400px',
        minWidth: '200px',
        maxWidth: '500px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        alignContent: 'center',
    };

    return (
        <Layout>
            <Header style={headerStyle}>
                <Title level={3} style={{ color: '#1890ff', marginLeft: '20px' }}>
                    EasyJob
                </Title>
            </Header>
            <Content style={contentStyle}>
                <div style={formContainerStyle}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
                        Welcome Back
                    </Title>
                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="e-mail"
                            rules={[
                                { required: true, message: 'Please input your E-mail!' },
                                { type: 'email', message: 'Please enter a valid E-mail address!' }
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="E-mail" size="large" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Password"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Flex justify="space-between" align="center">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                                <a href="">Forgot password</a>
                            </Flex>
                        </Form.Item>

                        <Form.Item>
                            <Button block type="primary" htmlType="submit" size="large" loading={loading}>
                                Log in
                            </Button>
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                or <a href="/register">Register now!</a>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
};

export default Login;
