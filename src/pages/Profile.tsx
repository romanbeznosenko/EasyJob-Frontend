import React, { useState } from 'react';
import { Layout, Card, Avatar, Typography, Button, Form, Input, Row, Col, message, Modal } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import JobSeekerNav from '../components/JobSeekerNav';
import RecruiterNav from '../components/RecruiterNav';
import { useAuth } from '../contexts/AuthContext';
import { UserTypeEnum } from '../types/auth';
import { editUserDetails, deleteUser } from '../services/user.service';

const { Content } = Layout;
const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user, logoutUser, refreshUser } = useAuth();
  const [form] = Form.useForm();
  const [deleteForm] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEdit = () => {
    form.setFieldsValue({
      name: user?.name || '',
      surname: user?.surname || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const handleSave = async (values: { name: string; surname: string }) => {
    setLoading(true);
    try {
      await editUserDetails({
        name: values.name,
        surname: values.surname,
      });
      await refreshUser();
      message.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to update profile';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (values: { password: string }) => {
    setDeleteLoading(true);
    try {
      await deleteUser({ password: values.password });
      message.success('Account deleted successfully');
      await logoutUser();
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error deleting account:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to delete account';
      message.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = () => {
    deleteForm.resetFields();
    setDeleteModalVisible(true);
  };

  const NavComponent = user?.userType === UserTypeEnum.RECRUITER ? RecruiterNav : JobSeekerNav;

  // View mode
  if (!isEditing) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <NavComponent />
        <Content style={{ padding: '40px 24px', backgroundColor: '#fafafa' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {/* Profile Card */}
            <Card
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                marginBottom: 24,
              }}
              styles={{
                body: { padding: '40px' }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 40 }}>
                <Title level={4} style={{ margin: 0, fontWeight: 500 }}>
                  User Profile
                </Title>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  style={{ borderRadius: 6 }}
                >
                  Edit Profile
                </Button>
              </div>

              <div style={{ display: 'flex', gap: '24px', marginBottom: 40 }}>
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff', color: '#fff', flexShrink: 0 }}
                />
                <div>
                  <Title level={4} style={{ margin: 0, marginBottom: 4, fontWeight: 500 }}>
                    {user?.name} {user?.surname}
                  </Title>
                  <Text style={{ fontSize: 15, color: '#666', display: 'block', marginBottom: 4 }}>
                    {user?.email}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#999' }}>
                    {user?.userType === UserTypeEnum.RECRUITER ? 'Recruiter' : 'Job Seeker'}
                  </Text>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 32 }}>
                <Title level={5} style={{ marginBottom: 16, fontWeight: 500 }}>
                  Account Information
                </Title>
                <Row gutter={[24, 16]}>
                  <Col span={12}>
                    <Text style={{ fontSize: 13, color: '#999', display: 'block', marginBottom: 4 }}>
                      First Name
                    </Text>
                    <Text style={{ fontSize: 15 }}>{user?.name}</Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ fontSize: 13, color: '#999', display: 'block', marginBottom: 4 }}>
                      Last Name
                    </Text>
                    <Text style={{ fontSize: 15 }}>{user?.surname}</Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ fontSize: 13, color: '#999', display: 'block', marginBottom: 4 }}>
                      Email
                    </Text>
                    <Text style={{ fontSize: 15 }}>{user?.email}</Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ fontSize: 13, color: '#999', display: 'block', marginBottom: 4 }}>
                      Account Type
                    </Text>
                    <Text style={{ fontSize: 15 }}>
                      {user?.userType === UserTypeEnum.RECRUITER ? 'Recruiter' : 'Job Seeker'}
                    </Text>
                  </Col>
                </Row>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card
              style={{
                borderRadius: 8,
                border: '1px solid #ffccc7',
                boxShadow: 'none',
                backgroundColor: '#fff2f0',
              }}
              styles={{
                body: { padding: '32px 40px' }
              }}
            >
              <Title level={5} style={{ marginTop: 0, marginBottom: 8, color: '#ff4d4f', fontWeight: 500 }}>
                Danger Zone
              </Title>
              <Text style={{ display: 'block', marginBottom: 16, color: '#666' }}>
                Once you delete your account, there is no going back. Please be certain.
              </Text>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={openDeleteModal}
                style={{ borderRadius: 6 }}
              >
                Delete Account
              </Button>
            </Card>
          </div>
        </Content>

        {/* Delete Account Modal */}
        <Modal
          title="Delete Account"
          open={deleteModalVisible}
          onCancel={() => setDeleteModalVisible(false)}
          footer={null}
          destroyOnHidden
        >
          <Text style={{ display: 'block', marginBottom: 16, color: '#666' }}>
            This action cannot be undone. Please enter your password to confirm.
          </Text>
          <Form form={deleteForm} onFinish={handleDeleteAccount} layout="vertical">
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password size="large" placeholder="Enter your password" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button onClick={() => setDeleteModalVisible(false)}>
                  Cancel
                </Button>
                <Button
                  danger
                  type="primary"
                  htmlType="submit"
                  loading={deleteLoading}
                >
                  Delete Account
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    );
  }

  // Edit mode
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavComponent />
      <Content style={{ padding: '40px 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
            }}
            styles={{
              body: { padding: '40px' }
            }}
          >
            <Title level={4} style={{ marginBottom: 32, fontWeight: 500 }}>
              Edit Profile
            </Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              requiredMark={false}
              initialValues={{
                name: user?.name || '',
                surname: user?.surname || '',
              }}
            >
              <div style={{ display: 'flex', gap: '24px', marginBottom: 32, alignItems: 'start' }}>
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff', color: '#fff', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="First Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                        style={{ marginBottom: 16 }}
                      >
                        <Input
                          placeholder="John"
                          size="large"
                          style={{ borderRadius: 6 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Last Name"
                        name="surname"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                        style={{ marginBottom: 16 }}
                      >
                        <Input
                          placeholder="Doe"
                          size="large"
                          style={{ borderRadius: 6 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24, marginBottom: 32 }}>
                <Text style={{ fontSize: 13, color: '#999', display: 'block', marginBottom: 4 }}>
                  Email (cannot be changed)
                </Text>
                <Text style={{ fontSize: 15 }}>{user?.email}</Text>
              </div>

              <Form.Item style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<CheckOutlined />}
                    size="large"
                    loading={loading}
                    style={{ borderRadius: 6, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    size="large"
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                    style={{ borderRadius: 6, color: '#666' }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Profile;
