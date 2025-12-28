import React, { useState } from 'react';
import { Layout, Card, Avatar, Typography, Button, Input, Row, Col, Space, message } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import JobSeekerNav from '../components/JobSeekerNav';
import RecruiterNav from '../components/RecruiterNav';
import { useAuth } from '../contexts/AuthContext';
import { UserTypeEnum } from '../types/auth';

const { Content } = Layout;
const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      surname: user?.surname || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    // Update user data in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = {
      ...currentUser,
      name: formData.name,
      surname: formData.surname,
      email: formData.email
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update all users in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) =>
      u.id === currentUser.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    message.success('Profile updated successfully!');
    setIsEditing(false);

    // Reload page to update context
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      await logoutUser();
      message.success('Account deleted successfully');
      window.location.href = '/';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Determine which navigation to use based on user type
  const NavComponent = user?.userType === UserTypeEnum.RECRUITER ? RecruiterNav : JobSeekerNav;

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavComponent />
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', paddingTop: 40, paddingBottom: 48 }}>
          {/* Profile Card */}
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
              marginBottom: 24
            }}
            styles={{
              body: { padding: 32 }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Title level={4} style={{ margin: 0 }}>User Profile</Title>
              {!isEditing && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {!isEditing ? (
              // View Mode
              <Space direction="horizontal" size={24} align="start" style={{ width: '100%' }}>
                <Avatar
                  size={96}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
                    {user?.name} {user?.surname}
                  </Title>
                  <Text style={{ display: 'block', marginBottom: 4, color: '#666' }}>
                    {user?.email}
                  </Text>
                  <Text style={{ display: 'block', color: '#666' }}>
                    Account Type: <Text strong>{user?.userType}</Text>
                  </Text>
                </div>
              </Space>
            ) : (
              // Edit Mode
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <div>
                      <Text style={{ display: 'block', marginBottom: 8 }}>Name</Text>
                      <Input
                        size="large"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Name"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text style={{ display: 'block', marginBottom: 8 }}>Surname</Text>
                      <Input
                        size="large"
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        placeholder="Surname"
                      />
                    </div>
                  </Col>
                </Row>

                <div>
                  <Text style={{ display: 'block', marginBottom: 8 }}>Email</Text>
                  <Input
                    size="large"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email"
                    type="email"
                  />
                </div>

                <Space size={12}>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleSave}
                    size="large"
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                    size="large"
                    style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: '#fff' }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Space>
            )}
          </Card>

          {/* Danger Zone */}
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              boxShadow: 'none'
            }}
            styles={{
              body: { padding: 32 }
            }}
          >
            <Title level={5} style={{ marginTop: 0, marginBottom: 16, color: '#ff4d4f' }}>
              Danger Zone
            </Title>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteAccount}
              size="large"
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Profile;
