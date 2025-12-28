import { useState, useRef, useEffect } from 'react';
import { Button, Card, message, Typography, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { activateAccountRequest, resendVerificationCodeRequest } from '../services/accountActivation.service';

const { Title, Text } = Typography;

const EmailVerification: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const [code, setCode] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const inputRefs = [
        useRef<any>(null),
        useRef<any>(null),
        useRef<any>(null),
        useRef<any>(null),
    ];

    useEffect(() => {
        if (!email) {
            message.warning('No email provided. Redirecting to registration.');
            navigate('/register');
        }
    }, [email, navigate]);

    const handleChange = (index: number, value: string) => {
        // Only allow single digit
        if (value.length > 1) {
            value = value.slice(-1);
        }

        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            return;
        }

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs[index + 1]?.current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs[index - 1]?.current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, 4).split('');

        const newCode = [...code];
        digits.forEach((digit, index) => {
            if (index < 4) {
                newCode[index] = digit;
            }
        });
        setCode(newCode);

        // Focus the next empty input or last input
        const nextEmptyIndex = newCode.findIndex(c => !c);
        const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
        inputRefs[focusIndex]?.current?.focus();
    };

    const handleVerify = async () => {
        const verificationCode = code.join('');

        if (verificationCode.length !== 4) {
            message.error('Please enter a 4-digit code');
            return;
        }

        setLoading(true);
        try {
            await activateAccountRequest({ code: verificationCode });
            message.success('Account activated successfully! Please login.');
            navigate('/login');
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Verification failed. Please check your code.');
            console.error('Verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            message.error('Email not found. Please register again.');
            return;
        }

        setResendLoading(true);
        try {
            await resendVerificationCodeRequest({ email });
            message.success('Verification code resent to your email');
            setCode(['', '', '', '']);
            inputRefs[0]?.current?.focus();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to resend code. Please try again.');
            console.error('Resend code error:', error);
        } finally {
            setResendLoading(false);
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}
            >
                <div style={{ marginBottom: '24px' }}>
                    <MailOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '16px' }} />
                    <Title level={3} style={{ marginBottom: '8px' }}>Verify Your Email</Title>
                    <Text type="secondary">
                        We've sent a 4-digit verification code to
                    </Text>
                    <div>
                        <Text strong>{email}</Text>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    {code.map((digit, index) => (
                        <Input
                            key={index}
                            ref={inputRefs[index]}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            maxLength={1}
                            style={{
                                width: '60px',
                                height: '60px',
                                fontSize: '24px',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}
                        />
                    ))}
                </div>

                <Button
                    type="primary"
                    size="large"
                    block
                    loading={loading}
                    onClick={handleVerify}
                    style={{
                        height: '48px',
                        fontSize: '16px',
                        fontWeight: 500,
                        marginBottom: '16px'
                    }}
                >
                    Verify Email
                </Button>

                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">Didn't receive the code? </Text>
                    <Button
                        type="link"
                        onClick={handleResendCode}
                        loading={resendLoading}
                        style={{ padding: 0, fontWeight: 500 }}
                    >
                        Resend Code
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default EmailVerification;
