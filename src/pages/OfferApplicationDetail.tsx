import React, { useState } from 'react';
import { Layout, Card, Button, Typography, Space, Tag, Divider, Empty, Select, message } from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  BankOutlined,
  CalendarOutlined,
  LinkOutlined,
  TrophyOutlined,
  ToolOutlined,
  ProjectOutlined,
  FileTextOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import RecruiterNav from '../components/RecruiterNav';
import { changeApplicationStatus, openApplication } from '../services/application.service';
import type { OfferApplicationResponse, ApplicationStatus } from '../types/application';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const OfferApplicationDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const application = location.state?.application as OfferApplicationResponse;
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(application?.status);
  const [statusLoading, setStatusLoading] = useState(false);
  const [hasMarkedAsOpened, setHasMarkedAsOpened] = useState(false);

  const getStatusColor = (status: ApplicationStatus): string => {
    switch (status) {
      case 'ACCEPTED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'REVIEWED':
        return 'blue';
      case 'PENDING':
      default:
        return 'orange';
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application) return;

    setStatusLoading(true);

    try {
      await changeApplicationStatus(application.offerApplicationId, newStatus);
      setCurrentStatus(newStatus);
      message.success('Application status updated successfully!');
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          'Failed to update application status';
      message.error(errorMessage);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleViewEvaluation = () => {
    if (!application) return;
    navigate(`/applications/${application.offerApplicationId}/evaluation`);
  };

  const markAsOpened = async () => {
    if (!application) return;

    try {
      await openApplication(application.offerApplicationId);
      setHasMarkedAsOpened(true);
    } catch (error) {
      console.error('Error marking application as opened:', error);
      // Silent failure - not critical to user experience
    }
  };

  React.useEffect(() => {
    if (application && !application.isOpened && !hasMarkedAsOpened) {
      markAsOpened();
    }
  }, [application, hasMarkedAsOpened]);

  if (!application) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <RecruiterNav />
        <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, width: '60%' }}>
            <Text>Application not found</Text>
          </div>
        </Content>
      </Layout>
    );
  }

  const { applierProfile, offer, status } = application;
  const { user, education, project, skill, workExperience, cv } = applierProfile;

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <RecruiterNav />
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 48, width: '70%' }}>
          {/* Back Button */}
          <div style={{ textAlign: 'left' }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ padding: 0, marginBottom: 24, fontSize: 14 }}
            >
              Back
            </Button>
          </div>

          {/* Applicant Header */}
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
              marginBottom: 24
            }}
            styles={{
              body: { padding: '32px' }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <Title level={3} style={{ marginTop: 0, marginBottom: 8, fontWeight: 500 }}>
                  {user.name} {user.surname}
                </Title>
                <Space size={16} direction="vertical" style={{ width: '100%' }}>
                  <Text style={{ fontSize: 14, color: '#666' }}>
                    <MailOutlined style={{ marginRight: 8 }} />
                    {user.email}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>
                    <BankOutlined style={{ marginRight: 8 }} />
                    Applied for: {offer.name}
                  </Text>
                </Space>
              </div>
              <div style={{ minWidth: 180 }}>
                <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>
                  Status
                </Text>
                <Select
                  value={currentStatus}
                  onChange={handleStatusChange}
                  loading={statusLoading}
                  style={{ width: '100%' }}
                  size="large"
                  options={[
                    {
                      value: 'PENDING',
                      label: (
                        <Space>
                          <Tag color="orange" style={{ margin: 0 }}>PENDING</Tag>
                        </Space>
                      )
                    },
                    {
                      value: 'REVIEWED',
                      label: (
                        <Space>
                          <Tag color="blue" style={{ margin: 0 }}>REVIEWED</Tag>
                        </Space>
                      )
                    },
                    {
                      value: 'ACCEPTED',
                      label: (
                        <Space>
                          <Tag color="green" style={{ margin: 0 }}>ACCEPTED</Tag>
                        </Space>
                      )
                    },
                    {
                      value: 'REJECTED',
                      label: (
                        <Space>
                          <Tag color="red" style={{ margin: 0 }}>REJECTED</Tag>
                        </Space>
                      )
                    }
                  ]}
                />
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <Space size={12}>
                {cv && (
                  <Button
                    icon={<FileTextOutlined />}
                    href={cv}
                    target="_blank"
                    style={{ borderRadius: 6 }}
                  >
                    View CV
                  </Button>
                )}
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  onClick={handleViewEvaluation}
                  style={{ borderRadius: 6 }}
                >
                  View Evaluation
                </Button>
              </Space>
            </div>
          </Card>

          {/* Work Experience */}
          {workExperience && workExperience.length > 0 && (
            <Card
              title={
                <Space>
                  <BankOutlined />
                  <Text strong>Work Experience</Text>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                marginBottom: 24
              }}
            >
              {workExperience.map((exp, index) => (
                <div key={exp.workExperienceId}>
                  {index > 0 && <Divider />}
                  <div style={{ marginBottom: 12 }}>
                    <Title level={5} style={{ marginBottom: 4, fontWeight: 500 }}>
                      {exp.title}
                    </Title>
                    <Text strong style={{ fontSize: 14, color: '#666' }}>
                      {exp.companyName}
                    </Text>
                    {exp.location && (
                      <Text style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>
                        • {exp.location}
                      </Text>
                    )}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 13, color: '#999' }}>
                      <CalendarOutlined style={{ marginRight: 6 }} />
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </Text>
                  </div>
                  <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                    {exp.responsibilities}
                  </Paragraph>
                </div>
              ))}
            </Card>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <Card
              title={
                <Space>
                  <TrophyOutlined />
                  <Text strong>Education</Text>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                marginBottom: 24
              }}
            >
              {education.map((edu, index) => (
                <div key={edu.educationId}>
                  {index > 0 && <Divider />}
                  <div style={{ marginBottom: 8 }}>
                    <Title level={5} style={{ marginBottom: 4, fontWeight: 500 }}>
                      {edu.degree} {edu.major && `in ${edu.major}`}
                    </Title>
                    <Text strong style={{ fontSize: 14, color: '#666' }}>
                      {edu.university}
                    </Text>
                  </div>
                  <Space size={16} style={{ fontSize: 13, color: '#999' }}>
                    <Text style={{ color: '#999' }}>
                      <CalendarOutlined style={{ marginRight: 6 }} />
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Text>
                    {edu.gpa && (
                      <Text style={{ color: '#999' }}>
                        GPA: {edu.gpa.toFixed(2)}
                      </Text>
                    )}
                  </Space>
                </div>
              ))}
            </Card>
          )}

          {/* Projects */}
          {project && project.length > 0 && (
            <Card
              title={
                <Space>
                  <ProjectOutlined />
                  <Text strong>Projects</Text>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                marginBottom: 24
              }}
            >
              {project.map((proj, index) => (
                <div key={proj.projectId}>
                  {index > 0 && <Divider />}
                  <div style={{ marginBottom: 8 }}>
                    <Title level={5} style={{ marginBottom: 4, fontWeight: 500 }}>
                      {proj.name}
                    </Title>
                    {proj.link && (
                      <div style={{ marginBottom: 8 }}>
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13 }}>
                          <LinkOutlined style={{ marginRight: 6 }} />
                          View Project
                        </a>
                      </div>
                    )}
                  </div>
                  <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 8, whiteSpace: 'pre-wrap' }}>
                    {proj.description}
                  </Paragraph>
                  <Text style={{ fontSize: 13, color: '#999' }}>
                    <ToolOutlined style={{ marginRight: 6 }} />
                    {proj.technologies}
                  </Text>
                </div>
              ))}
            </Card>
          )}

          {/* Skills */}
          {skill && skill.length > 0 && (
            <Card
              title={
                <Space>
                  <ToolOutlined />
                  <Text strong>Skills</Text>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                marginBottom: 24
              }}
            >
              <Space size={[8, 8]} wrap>
                {skill.map((sk) => (
                  <Tag
                    key={sk.skillId}
                    style={{
                      fontSize: 13,
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: '1px solid #d9d9d9',
                      backgroundColor: '#fafafa'
                    }}
                  >
                    {sk.name} • {sk.level}
                  </Tag>
                ))}
              </Space>
            </Card>
          )}

          {/* Empty state if no additional info */}
          {(!workExperience || workExperience.length === 0) &&
           (!education || education.length === 0) &&
           (!project || project.length === 0) &&
           (!skill || skill.length === 0) &&
           !cv && (
            <Card
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                textAlign: 'center',
                padding: '32px 0'
              }}
            >
              <Empty description="No additional information provided" />
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default OfferApplicationDetail;
