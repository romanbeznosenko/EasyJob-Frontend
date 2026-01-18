import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Avatar, Space, Card, Spin, message, Tag, Flex, Row, Col } from 'antd';
import {
  EnvironmentOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  UserOutlined,
  RightOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import JobSeekerNav from '../components/JobSeekerNav';
import { getFirmById } from '../services/firm.service';
import { getOffersByFirmId } from '../services/offer.service';
import type { FirmResponse } from '../types/firm';
import type { OfferResponse } from '../types/offer';
import { EmploymentTypeLabels, ExperienceLevelLabels, WorkModeLabels } from '../types/offer';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const formatSalary = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const CompanyDetail: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<FirmResponse | null>(null);
  const [jobs, setJobs] = useState<OfferResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    fetchCompanyDetails();
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    if (!companyId) return;

    try {
      setLoading(true);

      // Fetch company details and jobs in parallel
      const [companyResponse, jobsResponse] = await Promise.all([
        getFirmById(companyId),
        getOffersByFirmId(companyId)
      ]);

      if (companyResponse.data) {
        setCompany(companyResponse.data);
      } else {
        message.error('Company not found');
        navigate('/companies');
      }

      if (jobsResponse.data) {
        setJobs(jobsResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
      message.error('Failed to load company details');
      navigate('/companies');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCompanies = () => {
    navigate('/companies');
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <JobSeekerNav />
        <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <JobSeekerNav />
        <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 40 }}>
            <Text>Company not found</Text>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <JobSeekerNav />
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 40, paddingBottom: 48 }}>
          {/* Back Button */}
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToCompanies}
            style={{ padding: 0, marginBottom: 24, fontSize: 14 }}
          >
            Back to Companies
          </Button>

          {/* Company Header Card */}
          <Card
            style={{
              borderRadius: 12,
              border: '1px solid #e8e8e8',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              marginBottom: 32,
              overflow: 'hidden'
            }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Gradient Header with Logo */}
            <div style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%)',
              padding: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              borderBottom: '1px solid #f0f0f0'
            }}>
              {company.logo ? (
                <Avatar
                  size={100}
                  src={company.logo}
                  style={{
                    border: '4px solid #fff',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    flexShrink: 0
                  }}
                />
              ) : (
                <Avatar
                  size={100}
                  icon={<BankOutlined style={{ fontSize: 40 }} />}
                  style={{
                    backgroundColor: '#fff',
                    color: '#1890ff',
                    border: '4px solid #fff',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    flexShrink: 0
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <Title level={3} style={{ marginTop: 0, marginBottom: 8, fontWeight: 600 }}>
                  {company.name}
                </Title>
                <Flex gap={12} wrap="wrap" align="center">
                  {company.location && (
                    <Tag
                      icon={<EnvironmentOutlined />}
                      style={{
                        borderRadius: 12,
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        color: '#52c41a',
                        fontSize: 13,
                        padding: '4px 12px'
                      }}
                    >
                      {company.location}
                    </Tag>
                  )}
                  <Tag
                    icon={<TeamOutlined />}
                    style={{
                      borderRadius: 12,
                      background: '#e6f7ff',
                      border: '1px solid #91d5ff',
                      color: '#1890ff',
                      fontSize: 13,
                      padding: '4px 12px'
                    }}
                  >
                    {jobs.length} Open Position{jobs.length !== 1 ? 's' : ''}
                  </Tag>
                </Flex>
              </div>
            </div>

            {/* Company Description */}
            {company.description && (
              <div style={{ padding: '24px 40px' }}>
                <Title level={5} style={{ marginTop: 0, marginBottom: 12, fontWeight: 600, color: '#333' }}>
                  About the Company
                </Title>
                <Paragraph style={{
                  marginBottom: 0,
                  color: '#666',
                  fontSize: 14,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap'
                }}>
                  {company.description}
                </Paragraph>
              </div>
            )}
          </Card>

          {/* Open Positions Section */}
          <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
            <Title level={4} style={{ marginBottom: 0, fontWeight: 600 }}>
              Open Positions
            </Title>
            <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px', borderRadius: 16 }}>
              {jobs.length} Job{jobs.length !== 1 ? 's' : ''}
            </Tag>
          </Flex>

          {jobs.length > 0 ? (
            <Row gutter={[20, 20]}>
              {jobs.map((job) => (
                <Col xs={24} sm={24} md={12} key={job.offerId}>
                  <Card
                    hoverable
                    onClick={() => handleJobClick(job.offerId)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 12,
                      border: '1px solid #e8e8e8',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      height: '100%',
                      transition: 'all 0.3s ease'
                    }}
                    styles={{
                      body: { padding: '24px' }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
                      e.currentTarget.style.borderColor = '#1890ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.borderColor = '#e8e8e8';
                    }}
                  >
                    {/* Job Title & Salary */}
                    <Flex justify="space-between" align="start" style={{ marginBottom: 12 }}>
                      <Title
                        level={5}
                        style={{
                          marginTop: 0,
                          marginBottom: 0,
                          fontWeight: 600,
                          fontSize: 16,
                          flex: 1
                        }}
                        ellipsis={{ rows: 1 }}
                      >
                        {job.name}
                      </Title>
                      {job.isSalaryDisclosed && (
                        <Tag icon={<DollarOutlined />} color="green" style={{ marginLeft: 8, flexShrink: 0 }}>
                          {formatSalary(job.salaryBottom)} - {formatSalary(job.salaryTop)}
                        </Tag>
                      )}
                    </Flex>

                    {/* Job Info Tags */}
                    <div style={{ marginBottom: 16 }}>
                      <Space size={6} wrap>
                        <Tag icon={<ClockCircleOutlined />} color="blue" style={{ borderRadius: 4 }}>
                          {EmploymentTypeLabels[job.employmentType]}
                        </Tag>
                        <Tag icon={<UserOutlined />} color="purple" style={{ borderRadius: 4 }}>
                          {ExperienceLevelLabels[job.experienceLevel]}
                        </Tag>
                        <Tag icon={<LaptopOutlined />} color="cyan" style={{ borderRadius: 4 }}>
                          {WorkModeLabels[job.workMode]}
                        </Tag>
                      </Space>
                    </div>

                    {/* Job Description */}
                    {job.description && (
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{
                          marginBottom: 16,
                          color: '#666',
                          fontSize: 13,
                          lineHeight: 1.6,
                          minHeight: 42
                        }}
                      >
                        {job.description}
                      </Paragraph>
                    )}

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <Space size={4} wrap>
                          {job.skills.slice(0, 4).map((skill, index) => (
                            <Tag
                              key={index}
                              style={{
                                borderRadius: 4,
                                fontSize: 11,
                                background: '#f5f5f5',
                                border: '1px solid #e8e8e8',
                                color: '#666'
                              }}
                            >
                              {skill}
                            </Tag>
                          ))}
                          {job.skills.length > 4 && (
                            <Tag
                              style={{
                                borderRadius: 4,
                                fontSize: 11,
                                background: '#f5f5f5',
                                border: '1px solid #e8e8e8',
                                color: '#999'
                              }}
                            >
                              +{job.skills.length - 4} more
                            </Tag>
                          )}
                        </Space>
                      </div>
                    )}

                    {/* View Details Link */}
                    <Flex justify="flex-end">
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#1890ff',
                          fontWeight: 500
                        }}
                      >
                        View Details <RightOutlined style={{ fontSize: 10 }} />
                      </Text>
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                textAlign: 'center',
                padding: 48
              }}
            >
              <BankOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
              <div>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  No open positions at this time
                </Text>
              </div>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Check back later for new opportunities
                </Text>
              </div>
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default CompanyDetail;
