import React, { useState, useEffect } from 'react';
import { Layout, Input, Card, Row, Col, Typography, Avatar, Space, Spin, message, Pagination, Empty, Flex, Tag, Button } from 'antd';
import { SearchOutlined, EnvironmentOutlined, BankOutlined, TeamOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import JobSeekerNav from '../components/JobSeekerNav';
import { getFirmsList } from '../services/firm.service';
import type { FirmResponse } from '../types/firm';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Companies: React.FC = () => {
  const navigate = useNavigate();
  const [firms, setFirms] = useState<FirmResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchFirms(currentPage);
  }, [currentPage]);

  const fetchFirms = async (page: number) => {
    try {
      setLoading(true);
      const response = await getFirmsList(page, itemsPerPage);

      if (response.data) {
        setFirms(response.data.data);
        setTotalCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching firms:', error);
      message.error('Failed to load companies');
      setFirms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFirms = firms.filter(firm =>
    firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    firm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    firm.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompanyClick = (firmId: string) => {
    navigate(`/companies/${firmId}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
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
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 40, paddingBottom: 32 }}>
          {/* Header Section */}
          <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
            <div>
              <Title level={3} style={{ marginBottom: 4, fontWeight: 600 }}>
                Discover Companies
              </Title>
              <Text type="secondary" style={{ fontSize: 15 }}>
                Explore top companies and find your next opportunity
              </Text>
            </div>
            <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px', borderRadius: 16 }}>
              <TeamOutlined style={{ marginRight: 6 }} />
              {totalCount} Companies
            </Tag>
          </Flex>

          {/* Search Input */}
          <Space.Compact style={{ width: '100%', marginBottom: 32 }}>
            <Input
              size="large"
              placeholder="Search companies by name, location, or description..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
              style={{
                borderRadius: '8px 0 0 8px',
                border: '1px solid #e0e0e0',
              }}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{
                borderRadius: '0 8px 8px 0',
                height: 40
              }}
            >
              Search
            </Button>
          </Space.Compact>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 48 }}>
          {filteredFirms.length > 0 ? (
            <>
              <Row gutter={[20, 20]}>
                {filteredFirms.map((firm) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={firm.firmId}>
                    <Card
                      hoverable
                      onClick={() => handleCompanyClick(firm.firmId)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: 12,
                        border: '1px solid #e8e8e8',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden'
                      }}
                      styles={{
                        body: { padding: 0 }
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
                      {/* Company Logo Section */}
                      <div style={{
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%)',
                        padding: '24px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        {firm.logo ? (
                          <Avatar
                            size={72}
                            src={firm.logo}
                            style={{
                              border: '3px solid #fff',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        ) : (
                          <Avatar
                            size={72}
                            icon={<BankOutlined style={{ fontSize: 32 }} />}
                            style={{
                              backgroundColor: '#fff',
                              color: '#1890ff',
                              border: '3px solid #fff',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        )}
                      </div>

                      {/* Company Info Section */}
                      <div style={{ padding: '20px' }}>
                        <Title
                          level={5}
                          style={{
                            marginTop: 0,
                            marginBottom: 8,
                            fontWeight: 600,
                            fontSize: 16,
                            textAlign: 'center'
                          }}
                          ellipsis={{ rows: 1 }}
                        >
                          {firm.name}
                        </Title>

                        <Flex justify="center" style={{ marginBottom: 12 }}>
                          <Tag
                            icon={<EnvironmentOutlined />}
                            style={{
                              borderRadius: 12,
                              background: '#f6ffed',
                              border: '1px solid #b7eb8f',
                              color: '#52c41a',
                              fontSize: 12
                            }}
                          >
                            {firm.location}
                          </Tag>
                        </Flex>

                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{
                            marginBottom: 16,
                            color: '#666',
                            fontSize: 13,
                            lineHeight: 1.6,
                            textAlign: 'center',
                            minHeight: 42
                          }}
                        >
                          {firm.description || 'No description available'}
                        </Paragraph>

                        <Flex justify="center">
                          <Text
                            style={{
                              fontSize: 13,
                              color: '#1890ff',
                              fontWeight: 500,
                              cursor: 'pointer'
                            }}
                          >
                            View Profile <RightOutlined style={{ fontSize: 10 }} />
                          </Text>
                        </Flex>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {!searchTerm && totalCount > itemsPerPage && (
                <div style={{ marginTop: 40, textAlign: 'center' }}>
                  <Pagination
                    current={currentPage}
                    total={totalCount}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} companies`}
                  />
                </div>
              )}
            </>
          ) : (
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <Empty
                image={<BankOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
                description={
                  <div>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>No companies found</div>
                    {searchTerm && (
                      <Text type="secondary" style={{ fontSize: 14 }}>
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

export default Companies;
