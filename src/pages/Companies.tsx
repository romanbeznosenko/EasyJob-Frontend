import React, { useState, useEffect } from 'react';
import { Layout, Input, Card, Row, Col, Typography, Avatar, Space, Spin, message, Pagination, Empty } from 'antd';
import { SearchOutlined, EnvironmentOutlined, BankOutlined } from '@ant-design/icons';
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
  const itemsPerPage = 10;

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
            Browse Companies
          </Title>
          <Input
            size="large"
            placeholder="Search companies by name or location..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0'
            }}
          />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 48, width: '20%' }}>
          {filteredFirms.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {filteredFirms.map((firm) => (
                  <Col xs={24} sm={24} md={12} key={firm.firmId}>
                    <Card
                      hoverable
                      onClick={() => handleCompanyClick(firm.firmId)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: 8,
                        border: '1px solid #e0e0e0',
                        boxShadow: 'none',
                        height: '100%'
                      }}
                      styles={{
                        body: { padding: '24px' }
                      }}
                    >
                      <Space direction="vertical" size={12} style={{ width: '100%' }}>
                        <Space align="start" size={12}>
                          {firm.logo ? (
                            <Avatar
                              size={64}
                              src={firm.logo}
                              style={{ flexShrink: 0 }}
                            />
                          ) : (
                            <Avatar
                              size={64}
                              icon={<BankOutlined />}
                              style={{
                                backgroundColor: '#f0f0f0',
                                color: '#666',
                                fontSize: 24,
                                flexShrink: 0
                              }}
                            />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Title level={5} style={{ marginTop: 0, marginBottom: 4, fontWeight: 500 }}>
                              {firm.name}
                            </Title>
                            <Text style={{ fontSize: 14, color: '#666' }}>
                              <EnvironmentOutlined style={{ marginRight: 6 }} />
                              {firm.location}
                            </Text>
                          </div>
                        </Space>

                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ marginBottom: 0, color: '#666', fontSize: 14, lineHeight: 1.6 }}
                        >
                          {firm.description}
                        </Paragraph>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>

              {!searchTerm && totalCount > itemsPerPage && (
                <div style={{ marginTop: 32, textAlign: 'center' }}>
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
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none'
              }}
            >
              <Empty
                description={
                  <div>
                    <div>No companies found</div>
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

export default Companies;
