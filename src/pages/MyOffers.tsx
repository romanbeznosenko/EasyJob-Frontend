import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Empty, Typography, Space, Spin, message, Tag, Flex } from 'antd';
import {
  PlusOutlined,
  BankOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RecruiterNav from '../components/RecruiterNav';
import { useAuth } from '../contexts/AuthContext';
import { getFirmOffers } from '../services/offer.service';
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

const MyOffers: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchOffers();
  }, [user]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await getFirmOffers();

      if (response.data) {
        setOffers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      message.error('Failed to load job offers');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = () => {
    navigate('/create-job-offer');
  };

  const handleOfferClick = (offerId: string) => {
    navigate(`/my-offers/${offerId}`);
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
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 32, width: '60%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={3} style={{ margin: 0, fontWeight: 500 }}>
              My Job Offers
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleCreateOffer}
              style={{ borderRadius: 6 }}
            >
              Create Job Offer
            </Button>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 48, width: '60%' }}>
          {offers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {offers.map((offer: OfferResponse) => (
                <Card
                  key={offer.offerId}
                  hoverable
                  onClick={() => handleOfferClick(offer.offerId)}
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
                  <Flex justify="space-between" align="start" style={{ marginBottom: 12 }}>
                    <Title level={5} style={{ marginBottom: 0, marginTop: 0, fontWeight: 500 }}>
                      {offer.name}
                    </Title>
                    {offer.isSalaryDisclosed && (
                      <Tag icon={<DollarOutlined />} color="green" style={{ marginLeft: 12 }}>
                        {formatSalary(offer.salaryBottom)} - {formatSalary(offer.salaryTop)}
                      </Tag>
                    )}
                  </Flex>

                  <Space size={24} wrap style={{ marginBottom: 12 }}>
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
                  <div style={{ marginBottom: 12 }}>
                    <Space size={6} wrap>
                      <Tag icon={<ClockCircleOutlined />} color="blue">
                        {EmploymentTypeLabels[offer.employmentType]}
                      </Tag>
                      <Tag icon={<UserOutlined />} color="purple">
                        {ExperienceLevelLabels[offer.experienceLevel]}
                      </Tag>
                      <Tag icon={<LaptopOutlined />} color="cyan">
                        {WorkModeLabels[offer.workMode]}
                      </Tag>
                    </Space>
                  </div>

                  {/* Skills */}
                  {offer.skills && offer.skills.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <Space size={4} wrap>
                        {offer.skills.slice(0, 5).map((skill, index) => (
                          <Tag key={index} style={{ borderRadius: 4, fontSize: 12 }}>
                            {skill}
                          </Tag>
                        ))}
                        {offer.skills.length > 5 && (
                          <Tag style={{ borderRadius: 4, fontSize: 12, background: '#f5f5f5' }}>
                            +{offer.skills.length - 5} more
                          </Tag>
                        )}
                      </Space>
                    </div>
                  )}

                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{
                      marginBottom: 0,
                      color: '#666',
                      fontSize: 14,
                      lineHeight: 1.6
                    }}
                  >
                    {offer.description}
                  </Paragraph>
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
                    <div style={{ marginBottom: 16 }}>You haven't created any job offers yet</div>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={handleCreateOffer}
                    >
                      Create Your First Job Offer
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

export default MyOffers;
