import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Empty, Typography, Space, Spin, message } from 'antd';
import { PlusOutlined, BankOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RecruiterNav from '../components/RecruiterNav';
import { useAuth } from '../contexts/AuthContext';
import { getFirmOffers } from '../services/offer.service';
import type { OfferResponse } from '../types/offer';

const { Content } = Layout;
const { Title, Text } = Typography;

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
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 32, width: '20%' }}>
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

        <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 48, width: '20%' }}>
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
                    boxShadow: 'none'
                  }}
                  styles={{
                    body: { padding: '24px' }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <Title level={5} style={{ marginBottom: 12, marginTop: 0, fontWeight: 500 }}>
                        {offer.name}
                      </Title>
                      <Space size={24} wrap>
                        <Text style={{ fontSize: 14, color: '#666' }}>
                          <BankOutlined style={{ marginRight: 6 }} />
                          {offer.firm.name}
                        </Text>
                      </Space>
                    </div>
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
