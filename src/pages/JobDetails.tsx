import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Space, message, Spin, Tag } from 'antd';
import {
  BankOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  UserOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import JobSeekerNav from '../components/JobSeekerNav';
import CVSelectModal from '../components/CVSelectModal';
import CVModifyModal from '../components/CVModifyModal';
import { useAuth } from '../contexts/AuthContext';
import { getOfferById } from '../services/offer.service';
import { applyForOffer, getUserApplications } from '../services/application.service';
import { modifyCV } from '../services/cv.service';
import type { OfferResponse } from '../types/offer';
import { EmploymentTypeLabels, ExperienceLevelLabels, WorkModeLabels } from '../types/offer';
import type { CVTemplateEnum } from '../types/cv';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const formatSalary = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<OfferResponse | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [cvSelectModalVisible, setCvSelectModalVisible] = useState(false);
  const [cvModifyModalVisible, setCvModifyModalVisible] = useState(false);
  const [modifyLoading, setModifyLoading] = useState(false);

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

  const handleApplyClick = () => {
    if (!user) {
      message.warning('Please login to apply for this job');
      navigate('/login');
      return;
    }

    if (!job) return;

    // Open CV selection modal
    setCvSelectModalVisible(true);
  };

  const handleApplyWithCV = async (cvId: string) => {
    if (!job) return;

    setLoading(true);

    try {
      await applyForOffer(job.offerId, cvId);
      setHasApplied(true);
      setCvSelectModalVisible(false);
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

  const handleModifyCVClick = () => {
    if (!user) {
      message.warning('Please login to use this feature');
      navigate('/login');
      return;
    }
    setCvModifyModalVisible(true);
  };

  const handleModifyCV = async (cvId: string, name: string, template: CVTemplateEnum) => {
    if (!job) return;

    setModifyLoading(true);

    try {
      await modifyCV(job.offerId, {
        cvId,
        name,
        cvTemplate: template,
      });
      setCvModifyModalVisible(false);
      message.success('CV modification started! Check your CVs list when it\'s ready.');
    } catch (error: any) {
      console.error('Error modifying CV:', error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          'Failed to start CV modification';
      message.error(errorMessage);
    } finally {
      setModifyLoading(false);
    }
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
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 48, width: '60%' }}>
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
              <Text
                style={{
                  fontSize: 14,
                  color: '#1890ff',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onClick={() => navigate(`/companies/${job.firm.firmId}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#40a9ff';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#1890ff';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
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

            {/* Job Info Tags */}
            <div style={{ marginBottom: 16 }}>
              <Space size={8} wrap>
                <Tag icon={<ClockCircleOutlined />} color="blue">
                  {EmploymentTypeLabels[job.employmentType]}
                </Tag>
                <Tag icon={<UserOutlined />} color="purple">
                  {ExperienceLevelLabels[job.experienceLevel]}
                </Tag>
                <Tag icon={<LaptopOutlined />} color="cyan">
                  {WorkModeLabels[job.workMode]}
                </Tag>
                {job.isSalaryDisclosed && (
                  <Tag icon={<DollarOutlined />} color="green">
                    {formatSalary(job.salaryBottom)} - {formatSalary(job.salaryTop)}
                  </Tag>
                )}
              </Space>
            </div>

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8, color: '#666' }}>
                  Required Skills:
                </Text>
                <Space size={6} wrap>
                  {job.skills.map((skill, index) => (
                    <Tag key={index} style={{ borderRadius: 4 }}>
                      {skill}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
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
                  onClick={handleApplyClick}
                  style={{
                    borderRadius: 6,
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Apply Now
                </Button>
              )}
              <Button
                size="large"
                icon={<RobotOutlined />}
                onClick={handleModifyCVClick}
                style={{
                  borderRadius: 6,
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(118, 75, 162, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Modify CV for this Offer
              </Button>
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

        {/* CV Selection Modal */}
        <CVSelectModal
          visible={cvSelectModalVisible}
          onCancel={() => setCvSelectModalVisible(false)}
          onSelect={handleApplyWithCV}
          loading={loading}
        />

        {/* CV Modify Modal */}
        <CVModifyModal
          visible={cvModifyModalVisible}
          onCancel={() => setCvModifyModalVisible(false)}
          onSubmit={handleModifyCV}
          loading={modifyLoading}
          jobTitle={job?.name}
        />
      </Content>
    </Layout>
  );
};

export default JobDetails;
