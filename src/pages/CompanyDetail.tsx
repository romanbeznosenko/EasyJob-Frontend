import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Avatar, Space, Card } from 'antd';
import { EnvironmentOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import JobSeekerNav from '../components/JobSeekerNav';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Company {
  id: string;
  name: string;
  location: string;
  description: string;
  logo?: string;
}

interface JobOffer {
  id: string;
  name: string;
  description: string;
  firmId: string;
  firmName: string;
  location?: string;
  createdAt: string;
}

const CompanyDetail: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<JobOffer[]>([]);

  useEffect(() => {
    if (!companyId) return;

    // Load company
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    const foundCompany = companies.find((c: Company) => c.id === companyId);

    if (foundCompany) {
      setCompany(foundCompany);
    }

    // Load company jobs
    const offers = JSON.parse(localStorage.getItem('offers') || '[]');
    const companyJobs = offers.filter((job: JobOffer) => job.firmId === companyId);
    setJobs(companyJobs);
  }, [companyId]);

  const handleBackToCompanies = () => {
    navigate('/companies');
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

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
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ marginTop: 0, marginBottom: 8, fontWeight: 500 }}>
                  {company.name}
                </Title>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  <EnvironmentOutlined style={{ marginRight: 6 }} />
                  {company.location}
                </Text>
                <Paragraph style={{ marginTop: 16, marginBottom: 0, color: '#666', fontSize: 14, lineHeight: 1.6 }}>
                  {company.description}
                </Paragraph>
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
                  key={job.id}
                  hoverable
                  onClick={() => handleJobClick(job.id)}
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
                      <Title level={5} style={{ marginTop: 0, marginBottom: 8, fontWeight: 500 }}>
                        {job.name}
                      </Title>
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ marginBottom: 0, color: '#666', fontSize: 14, lineHeight: 1.6 }}
                      >
                        {job.description}
                      </Paragraph>
                    </div>
                    <Text style={{ fontSize: 14, color: '#666', whiteSpace: 'nowrap', marginLeft: 16 }}>
                      {new Date(job.createdAt).toLocaleDateString('en-GB')}
                    </Text>
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
