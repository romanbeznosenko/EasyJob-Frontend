import React, { useState, useEffect } from 'react';
import { Layout, Input, Card, Pagination, Empty, Typography, Flex, Space, Spin, message } from 'antd';
import { SearchOutlined, EnvironmentOutlined, BankOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import JobSeekerNav from '../components/JobSeekerNav';
import { getAllOffers } from '../services/offer.service';
import type { OfferResponse } from '../types/offer';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const BrowseJobs: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOffers(currentPage);
  }, [currentPage]);

  const fetchOffers = async (page: number) => {
    try {
      setLoading(true);
      const response = await getAllOffers(page, itemsPerPage);

      if (response.data) {
        setOffers(response.data.data);
        setTotalCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      message.error('Failed to load job offers');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter(offer =>
    offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.firm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <JobSeekerNav />
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 32, width: '20%' }}>
          <Title level={3} style={{ marginBottom: 24, fontWeight: 500 }}>
            Browse Job Opportunities
          </Title>
          <Input
            size="large"
            placeholder="Search jobs by title, company, or description..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0'
            }}
          />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 48, width: '20%' }}>
          {filteredOffers.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredOffers.map((offer) => (
                  <Card
                    key={offer.offerId}
                    hoverable
                    onClick={() => handleJobClick(offer.offerId)}
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
                    <Flex justify="space-between" align="start" style={{ marginBottom: 12 }}>
                      <Title level={5} style={{ marginBottom: 0, marginTop: 0, fontWeight: 500 }}>
                        {offer.name}
                      </Title>
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

                    <Paragraph
                      ellipsis={{ rows: 3 }}
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

              {!searchTerm && totalCount > itemsPerPage && (
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                  <Pagination
                    current={currentPage}
                    total={totalCount}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} jobs`}
                  />
                </div>
              )}
            </>
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
                    <div>No job offers found</div>
                    {searchTerm && (
                      <Text type="secondary" style={{ fontSize: 14, display: 'block', marginTop: 8 }}>
                        Try adjusting your search criteria
                      </Text>
                    )}
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

export default BrowseJobs;
