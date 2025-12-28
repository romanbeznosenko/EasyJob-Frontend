import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Row, Col, Spin, message } from 'antd';
import { BankOutlined, ShopOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RecruiterNav from '../components/RecruiterNav';
import { useAuth } from '../contexts/AuthContext';
import { checkFirmExists, getUserFirm } from '../services/firm.service';
import { getFirmOffers } from '../services/offer.service';
import type { FirmResponse } from '../types/firm';

const { Content } = Layout;
const { Title, Text } = Typography;

interface DashboardStats {
  activeJobOffers: number;
}

const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);
  const [companyData, setCompanyData] = useState<FirmResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    activeJobOffers: 0,
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const existsResponse = await checkFirmExists();
        const exists = existsResponse.data || false;
        setHasCompany(exists);

        if (exists) {
          // Fetch full company data if it exists
          const firmResponse = await getUserFirm();
          if (firmResponse.data) {
            setCompanyData(firmResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
        setHasCompany(false);
        setCompanyData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (!hasCompany) return;

    const fetchStats = async () => {
      try {
        const offersResponse = await getFirmOffers();
        if (offersResponse.data) {
          setStats({
            activeJobOffers: offersResponse.data.count,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [hasCompany]);

  const handleCreateCompany = () => {
    navigate('/my-company');
  };

  const handleCreateJobOffer = () => {
    if (!hasCompany) {
      message.warning('Please create a company first before posting job offers');
      navigate('/my-company');
      return;
    }
    navigate('/create-job-offer');
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

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <RecruiterNav />
      <Content style={{ padding: '40px 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={3} style={{ marginBottom: 32, fontWeight: 500 }}>
            Recruiter Dashboard
          </Title>

          <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
            <Col xs={24} sm={12}>
              <Card
                style={{
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                }}
                styles={{
                  body: { padding: '24px' }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: '#e6f4ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BankOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  </div>
                  <div>
                    <Text style={{ fontSize: 14, color: '#666', display: 'block' }}>
                      Company
                    </Text>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                      {companyData ? companyData.name : 'No Company'}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card
                style={{
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                }}
                styles={{
                  body: { padding: '24px' }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: '#f6ffed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShopOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  </div>
                  <div>
                    <Text style={{ fontSize: 14, color: '#666', display: 'block' }}>
                      Active Job Offers
                    </Text>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                      {stats.activeJobOffers}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>

          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card
                title={<Text strong>Quick Actions</Text>}
                style={{
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Show Create Company first if no company exists */}
                  {!hasCompany && (
                    <div
                      style={{
                        backgroundColor: '#fff7e6',
                        borderRadius: 8,
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        border: '2px solid #ffa940',
                      }}
                      onClick={handleCreateCompany}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffe7ba';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff7e6';
                      }}
                    >
                      <PlusOutlined style={{ fontSize: 20, color: '#fa8c16' }} />
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ display: 'block', marginBottom: 2, fontSize: 15, color: '#fa8c16' }}>
                          Create Company Profile
                        </Text>
                        <Text style={{ color: '#ad6800', fontSize: 13 }}>
                          Required before posting jobs
                        </Text>
                      </div>
                    </div>
                  )}

                  {/* Show Create Job Offer with proper styling based on company status */}
                  <div
                    style={{
                      backgroundColor: hasCompany ? '#f0f7ff' : '#f5f5f5',
                      borderRadius: 8,
                      padding: '16px 20px',
                      cursor: hasCompany ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      opacity: hasCompany ? 1 : 0.6,
                    }}
                    onClick={handleCreateJobOffer}
                    onMouseEnter={(e) => {
                      if (hasCompany) {
                        e.currentTarget.style.backgroundColor = '#e6f4ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (hasCompany) {
                        e.currentTarget.style.backgroundColor = '#f0f7ff';
                      }
                    }}
                  >
                    <PlusOutlined style={{ fontSize: 20, color: hasCompany ? '#1890ff' : '#8c8c8c' }} />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ display: 'block', marginBottom: 2, fontSize: 15 }}>
                        Create Job Offer
                      </Text>
                      <Text style={{ color: '#666', fontSize: 13 }}>
                        {hasCompany ? 'Post a new position' : 'Create company first'}
                      </Text>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#fafafa',
                      borderRadius: 8,
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                    onClick={() => navigate('/my-offers')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fafafa';
                    }}
                  >
                    <ShopOutlined style={{ fontSize: 20, color: '#595959' }} />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ display: 'block', marginBottom: 2, fontSize: 15 }}>
                        Manage Offers
                      </Text>
                      <Text style={{ color: '#666', fontSize: 13 }}>
                        View and edit your job postings
                      </Text>
                    </div>
                  </div>

                  {hasCompany && (
                    <div
                      style={{
                        backgroundColor: '#fafafa',
                        borderRadius: 8,
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                      onClick={handleCreateCompany}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fafafa';
                      }}
                    >
                      <BankOutlined style={{ fontSize: 20, color: '#595959' }} />
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ display: 'block', marginBottom: 2, fontSize: 15 }}>
                          Company Profile
                        </Text>
                        <Text style={{ color: '#666', fontSize: 13 }}>
                          Edit your company details
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title={<Text strong>Getting Started</Text>}
                style={{
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: hasCompany ? '#52c41a' : '#f0f0f0',
                        color: hasCompany ? '#fff' : '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {hasCompany ? '✓' : '1'}
                    </div>
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: 2 }}>
                        Create your company profile
                      </Text>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        Add company details and logo
                      </Text>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      2
                    </div>
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: 2 }}>
                        Post your first job offer
                      </Text>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        Start attracting candidates
                      </Text>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      3
                    </div>
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: 2 }}>
                        Review applications
                      </Text>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        Connect with job seekers
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default RecruiterDashboard;
