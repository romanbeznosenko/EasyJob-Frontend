import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Avatar, message, Spin } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RecruiterNav from '../components/RecruiterNav';
import { useAuth } from '../contexts/AuthContext';
import { getUserFirm } from '../services/firm.service';
import { createOffer } from '../services/offer.service';
import type { FirmResponse } from '../types/firm';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateJobOffer: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [company, setCompany] = useState<FirmResponse | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchCompany();
  }, [user, navigate]);

  const fetchCompany = async () => {
    try {
      setFetchLoading(true);
      const response = await getUserFirm();

      if (!response.data) {
        message.warning('Please create your company profile first');
        navigate('/my-company');
        return;
      }

      setCompany(response.data);
    } catch (error: any) {
      console.error('Error fetching company:', error);
      if (error?.response?.status === 404 || error?.response?.status === 400) {
        message.warning('Please create your company profile first');
        navigate('/my-company');
      } else {
        message.error('Failed to load company data');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!company) return;

    setLoading(true);

    try {
      await createOffer({
        name: values.title,
        description: values.description,
        responsibilities: values.responsibilities,
        requirements: values.requirements,
      });

      message.success('Job offer created successfully!');
      navigate('/my-offers');
    } catch (error: any) {
      console.error('Error creating offer:', error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          'Failed to create job offer';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/recruiter-dashboard');
  };

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

  if (!company) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <RecruiterNav />
      <Content style={{ padding: '40px 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Avatar
              size={80}
              icon={<ShopOutlined />}
              style={{ backgroundColor: '#e6f4ff', color: '#1890ff', marginBottom: 24 }}
            />
            <Title level={3} style={{ marginBottom: 8, fontWeight: 500 }}>
              Create Job Offer
            </Title>
            <Text style={{ fontSize: 15, color: '#666' }}>
              Post a new position for {company.name}
            </Text>
          </div>

          <Card
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
            }}
            styles={{
              body: { padding: '32px' }
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                label={<Text strong>Job Title *</Text>}
                name="title"
                rules={[{ required: true, message: 'Please enter job title' }]}
              >
                <Input
                  placeholder="Senior Software Engineer"
                  size="large"
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>

              <Form.Item
                label={<Text strong>Job Description *</Text>}
                name="description"
                rules={[{ required: true, message: 'Please enter job description' }]}
              >
                <TextArea
                  placeholder="Describe the role and what makes this position unique..."
                  rows={4}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>

              <Form.Item
                label={<Text strong>Responsibilities *</Text>}
                name="responsibilities"
                rules={[{ required: true, message: 'Please enter job responsibilities' }]}
              >
                <TextArea
                  placeholder="List the key responsibilities for this role..."
                  rows={4}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>

              <Form.Item
                label={<Text strong>Requirements *</Text>}
                name="requirements"
                rules={[{ required: true, message: 'Please enter job requirements' }]}
              >
                <TextArea
                  placeholder="List the required skills, experience, and qualifications..."
                  rows={4}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>

              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Company</Text>
                <Text style={{ fontSize: 15 }}>{company.name}</Text>
              </div>

              <div style={{ marginBottom: 32 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Location</Text>
                <Text style={{ fontSize: 15 }}>{company.location}</Text>
              </div>

              <Form.Item style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    style={{ borderRadius: 6, minWidth: 160 }}
                  >
                    Create Job Offer
                  </Button>
                  <Button
                    size="large"
                    onClick={handleCancel}
                    style={{ borderRadius: 6, minWidth: 100 }}
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

export default CreateJobOffer;
