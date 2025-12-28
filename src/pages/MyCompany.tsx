import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Avatar, message, Spin, Upload } from 'antd';
import { BankOutlined, EditOutlined, CheckOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd';
import RecruiterNav from '../components/RecruiterNav';
import { useAuth } from '../contexts/AuthContext';
import { getUserFirm, createFirm, editFirm, uploadFirmLogo } from '../services/firm.service';
import type { FirmResponse } from '../types/firm';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const MyCompany: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [existingCompany, setExistingCompany] = useState<FirmResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setFetchLoading(true);
      const response = await getUserFirm();

      if (response.data) {
        setExistingCompany(response.data);
        form.setFieldsValue({
          name: response.data.name,
          location: response.data.location,
          description: response.data.description,
        });
        setIsEditing(false);
      } else {
        // No company exists, go to edit mode
        setExistingCompany(null);
        setIsEditing(true);
      }
    } catch (error: any) {
      console.error('Error fetching company:', error);
      // If 404 or no company found, enable create mode
      if (error?.response?.status === 404 || error?.response?.status === 400) {
        setExistingCompany(null);
        setIsEditing(true);
      } else {
        message.error('Failed to load company data');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      const firmData = {
        name: values.name,
        location: values.location,
        description: values.description,
      };

      if (existingCompany) {
        // Update existing company
        await editFirm(firmData);
        message.success('Company profile updated successfully!');
      } else {
        // Create new company
        await createFirm(firmData);
        message.success('Company created successfully!');
      }

      // Upload logo if provided
      if (logoFile) {
        try {
          await uploadFirmLogo(logoFile);
          message.success('Company logo uploaded successfully!');
        } catch (error) {
          console.error('Error uploading logo:', error);
          message.warning('Company saved but logo upload failed');
        }
      }

      // Refresh company data
      await fetchCompanyData();
      setLogoFile(null);
      setFileList([]);
    } catch (error: any) {
      console.error('Error saving company:', error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          'Failed to save company profile';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (existingCompany) {
      // Reset form to existing values
      form.setFieldsValue({
        name: existingCompany.name,
        location: existingCompany.location,
        description: existingCompany.description,
      });
      setIsEditing(false);
      setLogoFile(null);
      setFileList([]);
    } else {
      navigate('/recruiter-dashboard');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleLogoChange = (info: any) => {
    const { fileList: newFileList } = info;
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      if (file) {
        setLogoFile(file);
      }
    } else {
      setLogoFile(null);
    }
  };

  // Loading state
  if (fetchLoading) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <RecruiterNav />
        <Content style={{ padding: '40px 24px', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  // View mode - display company profile with edit button
  if (existingCompany && !isEditing) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <RecruiterNav />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 40 }}>
                <Title level={4} style={{ margin: 0, fontWeight: 500 }}>
                  Company Profile
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
                {existingCompany.logo ? (
                  <Avatar
                    size={80}
                    src={existingCompany.logo}
                    style={{ flexShrink: 0 }}
                  />
                ) : (
                  <Avatar
                    size={80}
                    icon={<BankOutlined />}
                    style={{ backgroundColor: '#1890ff', color: '#fff', flexShrink: 0 }}
                  />
                )}
                <div>
                  <Title level={4} style={{ margin: 0, marginBottom: 4, fontWeight: 500 }}>
                    {existingCompany.name}
                  </Title>
                  <Text style={{ fontSize: 15, color: '#666' }}>
                    {existingCompany.location || 'No location specified'}
                  </Text>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 32 }}>
                <Title level={5} style={{ marginBottom: 16, fontWeight: 500 }}>
                  About Us
                </Title>
                <Text style={{ fontSize: 15, color: '#666', display: 'block', lineHeight: 1.6 }}>
                  {existingCompany.description || 'No description provided'}
                </Text>
              </div>
            </Card>
          </div>
        </Content>
      </Layout>
    );
  }

  // Edit mode - show form
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <RecruiterNav />
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
              {existingCompany ? 'Edit Company Profile' : 'Create Company Profile'}
            </Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <div style={{ display: 'flex', gap: '24px', marginBottom: 32, alignItems: 'start' }}>
                <div style={{ flexShrink: 0 }}>
                  {existingCompany?.logo ? (
                    <Avatar
                      size={80}
                      src={existingCompany.logo}
                    />
                  ) : (
                    <Avatar
                      size={80}
                      icon={<BankOutlined />}
                      style={{ backgroundColor: '#1890ff', color: '#fff' }}
                    />
                  )}
                  <Upload
                    beforeUpload={() => false}
                    onChange={handleLogoChange}
                    fileList={fileList}
                    maxCount={1}
                    accept="image/*"
                    style={{ marginTop: 12 }}
                  >
                    <Button
                      size="small"
                      icon={<UploadOutlined />}
                      style={{ marginTop: 8, width: '80px' }}
                    >
                      {existingCompany ? 'Change' : 'Upload'}
                    </Button>
                  </Upload>
                </div>
                <div style={{ flex: 1 }}>
                  <Form.Item
                    label="Company Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter company name' }]}
                    style={{ marginBottom: 16 }}
                  >
                    <Input
                      placeholder="Commarch"
                      size="large"
                      style={{ borderRadius: 6 }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Location"
                    name="location"
                    rules={[{ required: true, message: 'Please enter company location' }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      placeholder="Lodz, Poland"
                      size="large"
                      style={{ borderRadius: 6 }}
                    />
                  </Form.Item>
                </div>
              </div>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter company description' }]}
              >
                <TextArea
                  placeholder="Tell us about your company..."
                  rows={6}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<CheckOutlined />}
                    size="large"
                    loading={loading}
                    style={{ borderRadius: 6, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  >
                    {existingCompany ? 'Save Changes' : 'Create Company'}
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

export default MyCompany;
