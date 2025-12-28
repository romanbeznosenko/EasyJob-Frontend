import React, { useState, useEffect } from 'react';
import { Layout, Card, Tag, Empty, Typography, Space, Button, Spin, message } from 'antd';
import { BankOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import JobSeekerNav from '../components/JobSeekerNav';
import { useAuth } from '../contexts/AuthContext';
import { getUserApplications } from '../services/application.service';
import type { OfferApplicationResponse, ApplicationStatus } from '../types/application';

const { Content } = Layout;
const { Title, Text } = Typography;

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
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 32, width: '20%' }}>
          <Title level={3} style={{ marginBottom: 24, fontWeight: 500 }}>
            My Applications
          </Title>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 48, width: '20%' }}>
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
                    width: '100%'
                  }}
                  styles={{
                    body: { padding: '24px' }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <Title level={5} style={{ marginBottom: 12, marginTop: 0, fontWeight: 500 }}>
                        {application.offer.name}
                      </Title>
                      <Space size={24} wrap>
                        <Text style={{ fontSize: 14, color: '#666' }}>
                          <BankOutlined style={{ marginRight: 6 }} />
                          {application.offer.firm.name}
                        </Text>
                      </Space>
                    </div>
                    <Tag
                      color={getStatusColor(application.status)}
                      style={{
                        marginLeft: 16,
                        padding: '4px 12px',
                        fontSize: 14,
                        borderRadius: 4
                      }}
                    >
                      {formatStatus(application.status)}
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
