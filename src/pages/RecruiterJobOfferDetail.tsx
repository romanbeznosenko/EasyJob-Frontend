import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Typography, Space, Spin, message, Modal, Form, Input, Tag, Avatar, Select, InputNumber, Switch, Row, Col } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  LaptopOutlined,
  MailOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import RecruiterNav from '../components/RecruiterNav';
import { getOfferById, editOffer, deleteOffer } from '../services/offer.service';
import { getOfferApplications } from '../services/application.service';
import type { OfferResponse } from '../types/offer';
import {
  EmploymentTypeLabels,
  ExperienceLevelLabels,
  WorkModeLabels
} from '../types/offer';
import type { OfferApplicationResponse, ApplicationStatus } from '../types/application';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const formatSalary = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

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

  // Edit modal state
  const [isSalaryDisclosed, setIsSalaryDisclosed] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

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
      if (a.isOpened !== b.isOpened) {
        return a.isOpened ? 1 : -1;
      }
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

  const getStatusLabel = (status: ApplicationStatus): string => {
    switch (status) {
      case 'ACCEPTED':
        return 'Accepted';
      case 'REJECTED':
        return 'Rejected';
      case 'REVIEWED':
        return 'Reviewed';
      case 'PENDING':
      default:
        return 'Pending';
    }
  };

  const handleBack = () => {
    navigate('/my-offers');
  };

  const handleEdit = () => {
    if (offer) {
      form.setFieldsValue({
        title: offer.name,
        description: offer.description,
        responsibilities: offer.responsibilities,
        requirements: offer.requirements,
        employmentType: offer.employmentType,
        experienceLevel: offer.experienceLevel,
        workMode: offer.workMode,
        salaryBottom: offer.salaryBottom,
        salaryTop: offer.salaryTop,
      });
      setIsSalaryDisclosed(offer.isSalaryDisclosed);
      setSkills(offer.skills || []);
    }
    setEditModalVisible(true);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (!offerId) return;

    if (skills.length === 0) {
      message.error('Please add at least one skill');
      return;
    }

    setEditLoading(true);

    try {
      await editOffer(offerId, {
        name: values.title,
        description: values.description,
        responsibilities: values.responsibilities,
        requirements: values.requirements,
        isSalaryDisclosed: isSalaryDisclosed,
        salaryBottom: values.salaryBottom || 0,
        salaryTop: values.salaryTop || 0,
        employmentType: values.employmentType,
        experienceLevel: values.experienceLevel,
        workMode: values.workMode,
        skills: skills,
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

  const getInitials = (name: string, surname: string): string => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
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

          {/* Job Offer Header Card */}
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              padding: 32,
              marginBottom: 24
            }}
          >
            {/* Header with Title and Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
              <Title level={3} style={{ marginTop: 0, marginBottom: 0, fontWeight: 500 }}>
                {offer.name}
              </Title>
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

            {/* Company & Location */}
            <Space size={24} wrap style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, color: '#666' }}>
                <BankOutlined style={{ marginRight: 6 }} />
                {offer.firm.name}
              </Text>
              {offer.firm.location && (
                <Text style={{ fontSize: 14, color: '#666' }}>
                  <EnvironmentOutlined style={{ marginRight: 6 }} />
                  {offer.firm.location}
                </Text>
              )}
            </Space>

            {/* Job Info Tags */}
            <div style={{ marginBottom: 16 }}>
              <Space size={8} wrap>
                <Tag icon={<ClockCircleOutlined />} color="blue">
                  {EmploymentTypeLabels[offer.employmentType]}
                </Tag>
                <Tag icon={<UserOutlined />} color="purple">
                  {ExperienceLevelLabels[offer.experienceLevel]}
                </Tag>
                <Tag icon={<LaptopOutlined />} color="cyan">
                  {WorkModeLabels[offer.workMode]}
                </Tag>
                {offer.isSalaryDisclosed && (
                  <Tag icon={<DollarOutlined />} color="green">
                    {formatSalary(offer.salaryBottom)} - {formatSalary(offer.salaryTop)}
                  </Tag>
                )}
              </Space>
            </div>

            {/* Skills */}
            {offer.skills && offer.skills.length > 0 && (
              <div>
                <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8, color: '#666' }}>
                  Required Skills:
                </Text>
                <Space size={6} wrap>
                  {offer.skills.map((skill, index) => (
                    <Tag key={index} style={{ borderRadius: 4 }}>
                      {skill}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>

          {/* Job Description Card */}
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              padding: 32,
              marginBottom: 24
            }}
          >
            <Title level={5} style={{ marginTop: 0, marginBottom: 16, fontWeight: 500 }}>
              Job Description
            </Title>

            {offer.description && (
              <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 24, whiteSpace: 'pre-wrap' }}>
                {offer.description}
              </Paragraph>
            )}

            {offer.responsibilities && (
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
                  Responsibilities:
                </Text>
                <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                  {offer.responsibilities}
                </Paragraph>
              </div>
            )}

            {offer.requirements && (
              <div>
                <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
                  Requirements:
                </Text>
                <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                  {offer.requirements}
                </Paragraph>
              </div>
            )}
          </div>

          {/* Applications Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0, fontWeight: 500 }}>
                Applications
              </Title>
              <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                {applications.length} {applications.length === 1 ? 'applicant' : 'applicants'}
              </Tag>
            </div>

            {applicationsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Spin />
              </div>
            ) : applications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {applications.map((application) => (
                  <Card
                    key={application.offerApplicationId}
                    hoverable
                    onClick={() => handleApplicationClick(application)}
                    style={{
                      borderRadius: 8,
                      border: application.isOpened ? '1px solid #e0e0e0' : '2px solid #1890ff',
                      boxShadow: 'none',
                      cursor: 'pointer',
                      backgroundColor: application.isOpened ? '#ffffff' : '#f6fbff',
                      transition: 'all 0.3s ease'
                    }}
                    styles={{
                      body: { padding: '20px 24px' }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Avatar
                          size={48}
                          style={{
                            backgroundColor: application.isOpened ? '#e0e0e0' : '#1890ff',
                            color: application.isOpened ? '#666' : '#fff',
                            fontWeight: 500
                          }}
                        >
                          {getInitials(
                            application.applierProfile.user.name,
                            application.applierProfile.user.surname
                          )}
                        </Avatar>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Text strong style={{ fontSize: 15 }}>
                              {application.applierProfile.user.name} {application.applierProfile.user.surname}
                            </Text>
                            {!application.isOpened && (
                              <Tag color="blue" style={{ fontSize: 11, padding: '0 6px', lineHeight: '18px' }}>
                                New
                              </Tag>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Text style={{ fontSize: 13, color: '#666' }}>
                              <MailOutlined style={{ marginRight: 6 }} />
                              {application.applierProfile.user.email}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#999' }}>
                              <ClockCircleOutlined style={{ marginRight: 6 }} />
                              {formatDateTime(application.createdAt)}
                            </Text>
                          </div>
                        </div>
                      </div>
                      <Tag
                        color={getStatusColor(application.status)}
                        style={{ fontSize: 13, padding: '4px 12px', borderRadius: 4 }}
                      >
                        {getStatusLabel(application.status)}
                      </Tag>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card
                style={{
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                  textAlign: 'center',
                  padding: '48px 0'
                }}
              >
                <UserOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 15 }}>No applications yet</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Applications will appear here when candidates apply
                </Text>
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
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          requiredMark={false}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label={<Text strong>Job Title</Text>}
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
            label={<Text strong>Job Description</Text>}
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
            label={<Text strong>Responsibilities</Text>}
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
            label={<Text strong>Requirements</Text>}
            name="requirements"
            rules={[{ required: true, message: 'Please enter job requirements' }]}
          >
            <TextArea
              placeholder="List the required skills, experience, and qualifications..."
              rows={4}
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={<Text strong>Employment Type</Text>}
                name="employmentType"
                rules={[{ required: true, message: 'Please select employment type' }]}
              >
                <Select size="large" style={{ borderRadius: 6 }}>
                  {Object.entries(EmploymentTypeLabels).map(([value, label]) => (
                    <Select.Option key={value} value={value}>{label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<Text strong>Experience Level</Text>}
                name="experienceLevel"
                rules={[{ required: true, message: 'Please select experience level' }]}
              >
                <Select size="large" style={{ borderRadius: 6 }}>
                  {Object.entries(ExperienceLevelLabels).map(([value, label]) => (
                    <Select.Option key={value} value={value}>{label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<Text strong>Work Mode</Text>}
                name="workMode"
                rules={[{ required: true, message: 'Please select work mode' }]}
              >
                <Select size="large" style={{ borderRadius: 6 }}>
                  {Object.entries(WorkModeLabels).map(([value, label]) => (
                    <Select.Option key={value} value={value}>{label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Text strong style={{ marginRight: 12 }}>Disclose Salary</Text>
              <Switch
                checked={isSalaryDisclosed}
                onChange={setIsSalaryDisclosed}
              />
              {!isSalaryDisclosed && (
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 12 }}>
                  Salary will not be shown to applicants
                </Text>
              )}
            </div>

            {isSalaryDisclosed && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<Text strong>Minimum Salary (USD)</Text>}
                    name="salaryBottom"
                    rules={[{ required: isSalaryDisclosed, message: 'Please enter minimum salary' }]}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: '100%', borderRadius: 6 }}
                      min={0}
                      placeholder="50000"
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => Number(value?.replace(/\$\s?|(,*)/g, '') || 0) as 0}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<Text strong>Maximum Salary (USD)</Text>}
                    name="salaryTop"
                    rules={[
                      { required: isSalaryDisclosed, message: 'Please enter maximum salary' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('salaryBottom') <= value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Maximum salary must be greater than minimum'));
                        },
                      }),
                    ]}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: '100%', borderRadius: 6 }}
                      min={0}
                      placeholder="80000"
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => Number(value?.replace(/\$\s?|(,*)/g, '') || 0) as 0}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Required Skills</Text>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillInputKeyPress}
                placeholder="Add a skill (e.g., React, Python, AWS)"
                style={{ borderRadius: 6 }}
              />
              <Button
                icon={<PlusOutlined />}
                onClick={handleAddSkill}
                style={{ borderRadius: 6 }}
              >
                Add
              </Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map((skill) => (
                <Tag
                  key={skill}
                  closable
                  onClose={() => handleRemoveSkill(skill)}
                  style={{ padding: '4px 12px', fontSize: 14, borderRadius: 4 }}
                >
                  {skill}
                </Tag>
              ))}
            </div>
            {skills.length === 0 && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Add at least one required skill
              </Text>
            )}
          </div>

          <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
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
                style={{ borderRadius: 6, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
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
        footer={null}
      >
        <div style={{ padding: '16px 0' }}>
          <Text>Are you sure you want to delete this job offer? This action cannot be undone.</Text>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            All applications for this position will also be removed.
          </Text>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 24 }}>
          <Button
            onClick={() => setDeleteModalVisible(false)}
            style={{ borderRadius: 6 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            loading={deleteLoading}
            onClick={handleDeleteConfirm}
            style={{ borderRadius: 6 }}
          >
            Delete Offer
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default RecruiterJobOfferDetail;
