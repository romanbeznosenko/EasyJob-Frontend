import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Typography, Space, Spin, message, Modal, Form, Input, Tag } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, BankOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import RecruiterNav from '../components/RecruiterNav';
import { getOfferById, editOffer, deleteOffer } from '../services/offer.service';
import { getOfferApplications } from '../services/application.service';
import type { OfferResponse } from '../types/offer';
import type { OfferApplicationResponse, ApplicationStatus } from '../types/application';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const RecruiterJobOfferDetail: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<OfferResponse | null>(null);
  const [applications, setApplications] = useState<OfferApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!offerId) return;
    fetchOffer();
    fetchApplications();
  }, [offerId]);

  const fetchOffer = async () => {
    if (!offerId) return;

    try {
      setLoading(true);
      const response = await getOfferById(offerId);

      if (response.data) {
        setOffer(response.data);
        form.setFieldsValue({
          title: response.data.name,
          description: response.data.description,
          responsibilities: response.data.responsibilities,
          requirements: response.data.requirements,
        });
      }
    } catch (error) {
      console.error('Error fetching offer:', error);
      message.error('Failed to load job offer');
    } finally {
      setLoading(false);
    }
  };

  const sortApplications = (apps: OfferApplicationResponse[]): OfferApplicationResponse[] => {
    return [...apps].sort((a, b) => {
      // First, sort by isOpened (unopened first)
      if (a.isOpened !== b.isOpened) {
        return a.isOpened ? 1 : -1;
      }
      // Then sort by createdAt (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const fetchApplications = async () => {
    if (!offerId) return;

    try {
      setApplicationsLoading(true);
      const response = await getOfferApplications(offerId);

      if (response.data) {
        const sortedApplications = sortApplications(response.data.data);
        setApplications(sortedApplications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      message.error('Failed to load applications');
      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const getStatusColor = (status: ApplicationStatus): string => {
    switch (status) {
      case 'ACCEPTED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'REVIEWED':
        return 'blue';
      case 'PENDING':
      default:
        return 'orange';
    }
  };

  const handleBack = () => {
    navigate('/my-offers');
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!offerId) return;

    setEditLoading(true);

    try {
      await editOffer(offerId, {
        name: values.title,
        description: values.description,
        responsibilities: values.responsibilities,
        requirements: values.requirements,
      });

      message.success('Job offer updated successfully!');
      setEditModalVisible(false);
      fetchOffer();
    } catch (error: any) {
      console.error('Error updating offer:', error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          'Failed to update job offer';
      message.error(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleApplicationClick = (application: OfferApplicationResponse) => {
    navigate(`/applications/${application.offerApplicationId}`, { state: { application } });
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteConfirm = async () => {
    if (!offerId) return;

    setDeleteLoading(true);

    try {
      await deleteOffer(offerId);
      message.success('Job offer deleted successfully!');
      navigate('/my-offers');
    } catch (error: any) {
      console.error('Error deleting offer:', error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          'Failed to delete job offer';
      message.error(errorMessage);
    } finally {
      setDeleteLoading(false);
      setDeleteModalVisible(false);
    }
  };

  if (loading) {
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

  if (!offer) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <RecruiterNav />
        <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, width: '60%' }}>
            <Text>Job offer not found</Text>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <RecruiterNav />
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 48, width: '60%' }}>
          {/* Back Button */}
          <div style={{ textAlign: 'left' }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ padding: 0, marginBottom: 24, fontSize: 14 }}
            >
              Back to My Offers
            </Button>
          </div>

          {/* Job Offer Details Card */}
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              padding: 32,
              marginBottom: 24
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <Title level={3} style={{ marginTop: 0, marginBottom: 12, fontWeight: 500 }}>
                  {offer.name}
                </Title>
                <Space size={16}>
                  <Text style={{ fontSize: 14, color: '#666' }}>
                    <BankOutlined style={{ marginRight: 6 }} />
                    {offer.firm.name}
                  </Text>
                </Space>
              </div>
              <Space size={12}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  style={{ borderRadius: 6 }}
                >
                  Edit
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                  style={{ borderRadius: 6 }}
                >
                  Delete
                </Button>
              </Space>
            </div>

            <div style={{ marginTop: 32 }}>
              <Title level={5} style={{ marginBottom: 12, fontWeight: 500 }}>
                Description
              </Title>
              <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {offer.description}
              </Paragraph>
            </div>

            <div style={{ marginTop: 24 }}>
              <Title level={5} style={{ marginBottom: 12, fontWeight: 500 }}>
                Responsibilities
              </Title>
              <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {offer.responsibilities}
              </Paragraph>
            </div>

            <div style={{ marginTop: 24 }}>
              <Title level={5} style={{ marginBottom: 12, fontWeight: 500 }}>
                Requirements
              </Title>
              <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {offer.requirements}
              </Paragraph>
            </div>
          </div>

          {/* Applications Section */}
          <div style={{ marginTop: 24 }}>
            <Title level={4} style={{ marginBottom: 16, fontWeight: 500 }}>
              Applications ({applications.length})
            </Title>

            {applicationsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Spin />
              </div>
            ) : applications.length > 0 ? (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {applications.map((application) => (
                  <Card
                    key={application.offerApplicationId}
                    hoverable
                    onClick={() => handleApplicationClick(application)}
                    style={{
                      borderRadius: 8,
                      border: '1px solid #e0e0e0',
                      boxShadow: 'none',
                      cursor: 'pointer',
                      backgroundColor: application.isOpened ? '#ffffff' : '#f0f7ff'
                    }}
                    styles={{
                      body: { padding: '16px 20px' }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space size={16}>
                        <UserOutlined style={{ fontSize: 20, color: '#666' }} />
                        <div>
                          <div style={{ marginBottom: 2 }}>
                            <Text strong style={{ fontSize: 15 }}>
                              {application.applierProfile.user.name} {application.applierProfile.user.surname}
                            </Text>
                          </div>
                          <div style={{ marginBottom: 2 }}>
                            <Text style={{ fontSize: 13, color: '#666' }}>
                              {application.applierProfile.user.email}
                            </Text>
                          </div>
                          <div>
                            <Text style={{ fontSize: 12, color: '#bfbfbf' }}>
                              <ClockCircleOutlined style={{ marginRight: 6 }} />
                              {formatDateTime(application.createdAt)}
                            </Text>
                          </div>
                        </div>
                      </Space>
                      <Tag color={getStatusColor(application.status)} style={{ fontSize: 13, padding: '4px 12px' }}>
                        {application.status}
                      </Tag>
                    </div>
                  </Card>
                ))}
              </Space>
            ) : (
              <Card
                style={{
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                  textAlign: 'center',
                  padding: '32px 0'
                }}
              >
                <Text type="secondary">No applications yet</Text>
              </Card>
            )}
          </div>
        </div>
      </Content>

      {/* Edit Modal */}
      <Modal
        title="Edit Job Offer"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
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

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                size="large"
                onClick={() => setEditModalVisible(false)}
                style={{ borderRadius: 6 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={editLoading}
                style={{ borderRadius: 6 }}
              >
                Save Changes
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Job Offer"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setDeleteModalVisible(false)}
            style={{ borderRadius: 6 }}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            loading={deleteLoading}
            onClick={handleDeleteConfirm}
            style={{ borderRadius: 6 }}
          >
            Delete
          </Button>,
        ]}
      >
        <Text>Are you sure you want to delete this job offer? This action cannot be undone.</Text>
      </Modal>
    </Layout>
  );
};

export default RecruiterJobOfferDetail;
