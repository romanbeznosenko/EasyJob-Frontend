import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Avatar, message, Spin, Select, InputNumber, Switch, Tag, Row, Col } from 'antd';
import { ShopOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RecruiterNav from '../components/RecruiterNav';
import { useAuth } from '../contexts/AuthContext';
import { getUserFirm } from '../services/firm.service';
import { createOffer } from '../services/offer.service';
import type { FirmResponse } from '../types/firm';
import {
  EmploymentTypeEnum,
  EmploymentTypeLabels,
  ExperienceLevelEnum,
  ExperienceLevelLabels,
  WorkModeEnum,
  WorkModeLabels
} from '../types/offer';

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
  const [isSalaryDisclosed, setIsSalaryDisclosed] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

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

  const handleSubmit = async (values: any) => {
    if (!company) return;

    if (skills.length === 0) {
      message.error('Please add at least one skill');
      return;
    }

    setLoading(true);

    try {
      await createOffer({
        name: values.title,
        description: values.description,
        responsibilities: values.responsibilities,
        requirements: values.requirements,
        isSalaryDisclosed: isSalaryDisclosed,
        salaryBottom: values.salaryBottom,
        salaryTop: values.salaryTop,
        employmentType: values.employmentType,
        experienceLevel: values.experienceLevel,
        workMode: values.workMode,
        skills: skills,
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
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
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
              initialValues={{
                employmentType: EmploymentTypeEnum.FULL_TIME,
                experienceLevel: ExperienceLevelEnum.MID,
                workMode: WorkModeEnum.ON_SITE,
              }}
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

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={<Text strong>Employment Type *</Text>}
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
                    label={<Text strong>Experience Level *</Text>}
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
                    label={<Text strong>Work Mode *</Text>}
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
                        label={<Text strong>Minimum Salary (USD) *</Text>}
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
                        label={<Text strong>Maximum Salary (USD) *</Text>}
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
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Required Skills *</Text>
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
                    style={{
                      borderRadius: 6,
                      minWidth: 160,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
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
