import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Space, message, Spin } from 'antd';
import { BankOutlined, EnvironmentOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import JobSeekerNav from '../components/JobSeekerNav';
import { useAuth } from '../contexts/AuthContext';
import { getOfferById } from '../services/offer.service';
import { applyForOffer, getUserApplications } from '../services/application.service';
import type { OfferResponse } from '../types/offer';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<OfferResponse | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    fetchJobOffer();
    if (user) {
      checkIfApplied();
    }
  }, [jobId, user]);

  const fetchJobOffer = async () => {
    if (!jobId) return;

    try {
      setFetchLoading(true);
      const response = await getOfferById(jobId);

      if (response.data) {
        setJob(response.data);
      } else {
        message.error('Job offer not found');
        navigate('/browse-jobs');
      }
    } catch (error) {
      console.error('Error fetching job offer:', error);
      message.error('Failed to load job offer');
      navigate('/browse-jobs');
    } finally {
      setFetchLoading(false);
    }
  };

  const checkIfApplied = async () => {
    if (!jobId) return;

    try {
      const response = await getUserApplications();
      if (response.data) {
        const alreadyApplied = response.data.data.some(
          (app) => app.offer.offerId === jobId
        );
        setHasApplied(alreadyApplied);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApply = async () => {
    if (!user) {
      message.warning('Please login to apply for this job');
      navigate('/login');
      return;
    }

    if (!job) return;

    setLoading(true);

    try {
      await applyForOffer(job.offerId);
      setHasApplied(true);
      message.success('Application submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          'Failed to submit application';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToJobs = () => {
    navigate('/browse-jobs');
  };

  if (fetchLoading) {
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

  if (!job) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <JobSeekerNav />
        <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, width: '20%' }}>
            <Text>Job not found</Text>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <JobSeekerNav />
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 48, width: '20%' }}>
          {/* Back Button */}
          <div style={{ textAlign: 'left' }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToJobs}
              style={{ padding: 0, marginBottom: 24, fontSize: 14 }}
            >
              Back to Jobs
            </Button>
          </div>

          {/* Job Card */}
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              padding: 32,
              marginBottom: 24
            }}
          >
            {/* Job Header */}
            <Title level={4} style={{ marginTop: 0, marginBottom: 16, fontWeight: 500 }}>
              {job.name}
            </Title>

            <Space size={24} wrap style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, color: '#666' }}>
                <BankOutlined style={{ marginRight: 6 }} />
                {job.firm.name}
              </Text>
              {job.firm.location && (
                <Text style={{ fontSize: 14, color: '#666' }}>
                  <EnvironmentOutlined style={{ marginRight: 6 }} />
                  {job.firm.location}
                </Text>
              )}
            </Space>

            {/* Apply Button - Second Row */}
            <div style={{ marginTop: 16 }}>
              {hasApplied ? (
                <Button
                  size="large"
                  disabled
                  style={{
                    backgroundColor: '#e0e0e0',
                    color: '#666',
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 500
                  }}
                >
                  Already Applied
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleApply}
                  loading={loading}
                  style={{
                    borderRadius: 6,
                    fontWeight: 500
                  }}
                >
                  Apply Now
                </Button>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              padding: 32,
              textAlign: 'left'
            }}
          >
            <Title level={5} style={{ marginTop: 0, marginBottom: 16, fontWeight: 500, textAlign: 'left' }}>
              Job Description
            </Title>

            {job.description && (
              <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 24, textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                {job.description}
              </Paragraph>
            )}

            {job.responsibilities && (
              <div style={{ marginBottom: 24, textAlign: 'left' }}>
                <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
                  Responsibilities:
                </Text>
                <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                  {job.responsibilities}
                </Paragraph>
              </div>
            )}

            {job.requirements && (
              <div style={{ textAlign: 'left' }}>
                <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
                  Requirements:
                </Text>
                <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                  {job.requirements}
                </Paragraph>
              </div>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default JobDetails;
