import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Avatar, Space, Card, Spin, message } from 'antd';
import { EnvironmentOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import JobSeekerNav from '../components/JobSeekerNav';
import { getFirmById } from '../services/firm.service';
import { getOffersByFirmId } from '../services/offer.service';
import type { FirmResponse } from '../types/firm';
import type { OfferResponse } from '../types/offer';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

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
          <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, width: '60%' }}>
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
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 48, width: '60%' }}>
          {/* Back Button */}
          <div style={{ textAlign: 'left' }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToCompanies}
              style={{ padding: 0, marginBottom: 24, fontSize: 14 }}
            >
              Back to Companies
            </Button>
          </div>

          {/* Company Info Card */}
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              padding: 32,
              marginBottom: 24
            }}
          >
            <Space align="start" size={16} style={{ width: '100%' }}>
              {company.logo ? (
                <Avatar
                  size={80}
                  src={company.logo}
                  style={{ flexShrink: 0 }}
                />
              ) : (
                <Avatar
                  size={80}
                  style={{
                    backgroundColor: '#f0f0f0',
                    color: '#666',
                    fontSize: 32,
                    flexShrink: 0
                  }}
                >
                  {company.name.charAt(0)}
                </Avatar>
              )}
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ marginTop: 0, marginBottom: 8, fontWeight: 500 }}>
                  {company.name}
                </Title>
                {company.location && (
                  <Text style={{ fontSize: 14, color: '#666' }}>
                    <EnvironmentOutlined style={{ marginRight: 6 }} />
                    {company.location}
                  </Text>
                )}
                {company.description && (
                  <Paragraph style={{ marginTop: 16, marginBottom: 0, color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {company.description}
                  </Paragraph>
                )}
              </div>
            </Space>
          </div>

          {/* Open Positions */}
          <Title level={5} style={{ marginBottom: 16, fontWeight: 500 }}>
            Open Positions ({jobs.length})
          </Title>

          {jobs.length > 0 ? (
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {jobs.map((job) => (
                <Card
                  key={job.offerId}
                  hoverable
                  onClick={() => handleJobClick(job.offerId)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    boxShadow: 'none',
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <Title level={5} style={{ marginTop: 0, marginBottom: 8, fontWeight: 500 }}>
                        {job.name}
                      </Title>
                      {job.description && (
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ marginBottom: 0, color: '#666', fontSize: 14, lineHeight: 1.6 }}
                        >
                          {job.description}
                        </Paragraph>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          ) : (
            <Card
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                textAlign: 'center',
                padding: 32
              }}
            >
              <Text type="secondary">No open positions at this time</Text>
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default CompanyDetail;
