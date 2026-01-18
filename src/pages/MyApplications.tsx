import React, { useState, useEffect } from 'react';
import { Layout, Card, Tag, Empty, Typography, Space, Button, Spin, message, Flex } from 'antd';
import {
  BankOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import JobSeekerNav from '../components/JobSeekerNav';
import { useAuth } from '../contexts/AuthContext';
import { getUserApplications } from '../services/application.service';
import type { OfferApplicationResponse, ApplicationStatus } from '../types/application';
import { EmploymentTypeLabels, ExperienceLevelLabels, WorkModeLabels } from '../types/offer';

const { Content } = Layout;
const { Title, Text } = Typography;

const formatSalary = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<OfferApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getUserApplications();

      if (response.data) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      message.error('Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationClick = (offerId: string) => {
    navigate(`/jobs/${offerId}`);
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'PENDING':
        return 'gold';
      case 'REVIEWED':
        return 'blue';
      case 'ACCEPTED':
        return 'green';
      case 'REJECTED':
        return 'red';
      default:
        return 'default';
    }
  };

  const formatStatus = (status: ApplicationStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <JobSeekerNav />
        <Content style={{ padding: '40px 24px', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <JobSeekerNav />
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 32, width: '60%' }}>
          <Title level={3} style={{ marginBottom: 24, fontWeight: 500 }}>
            My Applications
          </Title>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 48, width: '60%' }}>
          {applications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {applications.map((application) => (
                <Card
                  key={application.offerApplicationId}
                  hoverable
                  onClick={() => handleApplicationClick(application.offer.offerId)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    boxShadow: 'none',
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                  styles={{
                    body: { padding: '24px' }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Header: Title + Status */}
                  <Flex justify="space-between" align="start" style={{ marginBottom: 12 }}>
                    <Title level={5} style={{ marginBottom: 0, marginTop: 0, fontWeight: 500 }}>
                      {application.offer.name}
                    </Title>
                    <Flex gap={8} align="center">
                      {application.offer.isSalaryDisclosed && (
                        <Tag icon={<DollarOutlined />} color="green">
                          {formatSalary(application.offer.salaryBottom)} - {formatSalary(application.offer.salaryTop)}
                        </Tag>
                      )}
                      <Tag
                        color={getStatusColor(application.status)}
                        style={{
                          padding: '4px 12px',
                          fontSize: 13,
                          borderRadius: 4,
                          fontWeight: 500
                        }}
                      >
                        {formatStatus(application.status)}
                      </Tag>
                    </Flex>
                  </Flex>

                  {/* Company & Location */}
                  <Space size={24} wrap style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 14, color: '#666' }}>
                      <BankOutlined style={{ marginRight: 6 }} />
                      {application.offer.firm.name}
                    </Text>
                    {application.offer.firm.location && (
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        <EnvironmentOutlined style={{ marginRight: 6 }} />
                        {application.offer.firm.location}
                      </Text>
                    )}
                    <Text style={{ fontSize: 14, color: '#999' }}>
                      <CalendarOutlined style={{ marginRight: 6 }} />
                      Applied {formatDate(application.createdAt)}
                    </Text>
                  </Space>

                  {/* Job Info Tags */}
                  <div style={{ marginBottom: 12 }}>
                    <Space size={6} wrap>
                      <Tag icon={<ClockCircleOutlined />} color="blue">
                        {EmploymentTypeLabels[application.offer.employmentType]}
                      </Tag>
                      <Tag icon={<UserOutlined />} color="purple">
                        {ExperienceLevelLabels[application.offer.experienceLevel]}
                      </Tag>
                      <Tag icon={<LaptopOutlined />} color="cyan">
                        {WorkModeLabels[application.offer.workMode]}
                      </Tag>
                    </Space>
                  </div>

                  {/* Skills */}
                  {application.offer.skills && application.offer.skills.length > 0 && (
                    <div>
                      <Space size={4} wrap>
                        {application.offer.skills.slice(0, 5).map((skill, index) => (
                          <Tag key={index} style={{ borderRadius: 4, fontSize: 12 }}>
                            {skill}
                          </Tag>
                        ))}
                        {application.offer.skills.length > 5 && (
                          <Tag style={{ borderRadius: 4, fontSize: 12, background: '#f5f5f5' }}>
                            +{application.offer.skills.length - 5} more
                          </Tag>
                        )}
                      </Space>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none'
              }}
            >
              <Empty
                image={<FileTextOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
                description={
                  <div>
                    <div style={{ marginBottom: 16 }}>You haven't applied to any jobs yet</div>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => navigate('/browse-jobs')}
                    >
                      Browse Jobs
                    </Button>
                  </div>
                }
              />
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default MyApplications;
