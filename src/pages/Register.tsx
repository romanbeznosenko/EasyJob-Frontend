import { useState } from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    message
} from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../services/auth.service';
import { UserTypeEnum } from '../types/auth';

const Register: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState<'jobseeker' | 'recruiter'>('jobseeker');
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await registerRequest({
                name: values.first_name,
                surname: values.last_name,
                email: values.email,
                password: values.password,
                userType: accountType === 'recruiter' ? UserTypeEnum.RECRUITER : UserTypeEnum.APPLIER
            });
            message.success('Registration successful! Please check your email for the verification code.');
            navigate('/verify-email', { state: { email: values.email } });
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Registration failed. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f5f5f5',
            padding: '20px'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 480,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    scrollToFirstError
                    requiredMark={false}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="first_name"
                                label="First Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your first name!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="John"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="last_name"
                                label="Last Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your last name!',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Doe"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="your.email@example.com"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="••••••••"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="••••••••"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item label="Account Type">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Button
                                    size="large"
                                    style={{
                                        width: '100%',
                                        height: '80px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: accountType === 'jobseeker' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                        background: accountType === 'jobseeker' ? '#e6f7ff' : 'white',
                                        color: accountType === 'jobseeker' ? '#1890ff' : 'inherit'
                                    }}
                                    onClick={() => setAccountType('jobseeker')}
                                >
                                    <UserOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                                    <span>Job Seeker</span>
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    size="large"
                                    style={{
                                        width: '100%',
                                        height: '80px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: accountType === 'recruiter' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                        background: accountType === 'recruiter' ? '#e6f7ff' : 'white',
                                        color: accountType === 'recruiter' ? '#1890ff' : 'inherit'
                                    }}
                                    onClick={() => setAccountType('recruiter')}
                                >
                                    <TeamOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                                    <span>Recruiter</span>
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '16px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={loading}
                            style={{ height: '48px', fontSize: '16px', fontWeight: 500 }}
                        >
                            Create Account
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        Already have an account? <Link to="/login" style={{ color: '#1890ff', fontWeight: 500 }}>Sign in here</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;