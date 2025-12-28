import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Space, Spin, Tag, Pagination, message } from 'antd';
import { UserOutlined, BankOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RecruiterNav from '../components/RecruiterNav';
import { getFirmApplications } from '../services/application.service';
import type { OfferApplicationResponse, ApplicationStatus } from '../types/application';

const { Content } = Layout;
const { Title, Text } = Typography;

const FirmApplications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<OfferApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchApplications();
  }, [currentPage]);

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
    try {
      setLoading(true);
      const response = await getFirmApplications(currentPage, pageSize);

      if (response.data) {
        const sortedApplications = sortApplications(response.data.data);
        setApplications(sortedApplications);
        setTotalCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      message.error('Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
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

  const handleApplicationClick = (application: OfferApplicationResponse) => {
    navigate(`/applications/${application.offerApplicationId}`, { state: { application } });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <RecruiterNav />
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 48, width: '70%' }}>
          <Title level={3} style={{ marginBottom: 24, fontWeight: 500 }}>
            All Applications
          </Title>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Spin size="large" />
            </div>
          ) : applications.length > 0 ? (
            <>
              <Space direction="vertical" size={12} style={{ width: '100%', marginBottom: 24 }}>
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
                      <Space size={16} style={{ flex: 1 }}>
                        <UserOutlined style={{ fontSize: 20, color: '#666' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: 4 }}>
                            <Text strong style={{ fontSize: 15 }}>
                              {application.applierProfile.user.name} {application.applierProfile.user.surname}
                            </Text>
                          </div>
                          <div style={{ marginBottom: 2 }}>
                            <Text style={{ fontSize: 13, color: '#666' }}>
                              {application.applierProfile.user.email}
                            </Text>
                          </div>
                          <div style={{ marginBottom: 2 }}>
                            <Text style={{ fontSize: 13, color: '#999' }}>
                              <BankOutlined style={{ marginRight: 6 }} />
                              Applied for: {application.offer.name}
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

              {totalCount > pageSize && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                  <Pagination
                    current={currentPage}
                    total={totalCount}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
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
      </Content>
    </Layout>
  );
};

export default FirmApplications;
