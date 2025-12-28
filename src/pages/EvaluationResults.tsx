import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Typography, Space, Spin, Progress, Tag, Divider, Alert, message } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  BulbOutlined,
  TeamOutlined,
  RiseOutlined,
  CommentOutlined,
  FileTextOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import RecruiterNav from '../components/RecruiterNav';
import { getEvaluation, evaluateApplication } from '../services/application.service';
import type { OfferApplicationEvaluationResponse, RecommendationEnum, ProcessStatusEnum } from '../types/evaluation';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const EvaluationResults: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<OfferApplicationEvaluationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluateLoading, setEvaluateLoading] = useState(false);

  useEffect(() => {
    if (!applicationId) return;
    fetchEvaluation();
  }, [applicationId]);

  const fetchEvaluation = async () => {
    if (!applicationId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getEvaluation(applicationId);

      if (response.data) {
        setEvaluation(response.data);
      } else {
        // API returned null - evaluation doesn't exist yet
        setEvaluation(null);
      }
    } catch (error: any) {
      console.error('Error fetching evaluation:', error);
      // Don't set error for 404 or null responses - treat as "not created yet"
      if (error?.response?.status === 404) {
        setEvaluation(null);
      } else {
        setError(error?.response?.data?.message || error?.message || 'Failed to load evaluation results');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEvaluate = async () => {
    if (!applicationId) return;

    setEvaluateLoading(true);

    try {
      await evaluateApplication(applicationId);
      message.success('Evaluation started successfully! Please wait a few moments and refresh the page.');

      // Automatically refresh after a short delay
      setTimeout(() => {
        fetchEvaluation();
      }, 2000);
    } catch (error: any) {
      console.error('Error starting evaluation:', error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          'Failed to start evaluation';
      message.error(errorMessage);
    } finally {
      setEvaluateLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: RecommendationEnum): string => {
    switch (recommendation) {
      case 'STRONG_MATCH':
        return 'green';
      case 'GOOD_MATCH':
        return 'blue';
      case 'MODERATE_MATCH':
        return 'orange';
      case 'WEAK_MATCH':
        return 'red';
      default:
        return 'default';
    }
  };

  const getRecommendationText = (recommendation: RecommendationEnum): string => {
    return recommendation.replace('_', ' ');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#1890ff';
    if (score >= 40) return '#faad14';
    return '#ff4d4f';
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

  // Show error only if there's an actual error (not just missing evaluation)
  if (error) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <RecruiterNav />
        <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, width: '60%' }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ padding: 0, marginBottom: 24, fontSize: 14 }}
            >
              Back
            </Button>
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
            />
          </div>
        </Content>
      </Layout>
    );
  }

  // Show "Start Evaluation" view if evaluation doesn't exist yet
  if (!evaluation) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <RecruiterNav />
        <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 48, width: '60%' }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ padding: 0, marginBottom: 24, fontSize: 14 }}
            >
              Back
            </Button>

            <Card
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                textAlign: 'center',
                padding: '60px 40px'
              }}
            >
              <FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 24 }} />
              <Title level={3} style={{ marginBottom: 16 }}>
                No Evaluation Yet
              </Title>
              <Paragraph style={{ fontSize: 15, color: '#666', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                This candidate hasn't been evaluated yet. Start an AI-powered evaluation to analyze their qualifications, skills, and fit for this position.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={handleEvaluate}
                loading={evaluateLoading}
                style={{ borderRadius: 6, height: 48, fontSize: 16, padding: '0 32px' }}
              >
                Start Evaluation
              </Button>
              <div style={{ marginTop: 16 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  The evaluation process typically takes 10-30 seconds
                </Text>
              </div>
            </Card>
          </div>
        </Content>
      </Layout>
    );
  }

  // Check if evaluation is not completed
  if (evaluation.processStatus !== 'COMPLETED') {
    const statusMessages: Record<ProcessStatusEnum, { title: string; description: string; type: 'info' | 'warning' | 'error' }> = {
      PENDING: {
        title: 'Evaluation Pending',
        description: 'The evaluation has not started yet. Please wait a moment and refresh the page.',
        type: 'info'
      },
      PROCESSING: {
        title: 'Evaluation In Progress',
        description: 'The candidate evaluation is currently being processed. This may take a few moments. Please refresh the page shortly.',
        type: 'info'
      },
      COMPLETED: {
        title: 'Completed',
        description: 'Evaluation completed successfully.',
        type: 'info'
      },
      FAILED: {
        title: 'Evaluation Failed',
        description: 'The evaluation process failed. Please try evaluating the candidate again.',
        type: 'error'
      }
    };

    const status = statusMessages[evaluation.processStatus];

    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <RecruiterNav />
        <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, width: '60%' }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ padding: 0, marginBottom: 24, fontSize: 14 }}
            >
              Back
            </Button>
            <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Spin size="large" style={{ marginBottom: 24 }} />
              <Alert
                message={status.title}
                description={status.description}
                type={status.type}
                showIcon
                action={
                  <Space>
                    <Button onClick={fetchEvaluation} type="default" icon={<ReloadOutlined />}>
                      Refresh
                    </Button>
                    {evaluation.processStatus === 'FAILED' && (
                      <Button onClick={handleEvaluate} type="primary" loading={evaluateLoading} icon={<CheckCircleOutlined />}>
                        Retry Evaluation
                      </Button>
                    )}
                  </Space>
                }
              />
            </Card>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <RecruiterNav />
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 48, width: '80%' }}>
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

          {/* Header Card */}
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
              marginBottom: 24
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ marginTop: 0, marginBottom: 16 }}>
                Candidate Evaluation Results
              </Title>
              <div style={{ marginBottom: 24 }}>
                <Progress
                  type="circle"
                  percent={evaluation.overallMatchScore}
                  strokeColor={getScoreColor(evaluation.overallMatchScore)}
                  format={(percent) => (
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 'bold' }}>{percent}</div>
                      <div style={{ fontSize: 14, color: '#666' }}>Overall Match</div>
                    </div>
                  )}
                  size={180}
                />
              </div>
              <Tag color={getRecommendationColor(evaluation.recommendation)} style={{ fontSize: 16, padding: '8px 16px' }}>
                {getRecommendationText(evaluation.recommendation)}
              </Tag>
              <div style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleEvaluate}
                  loading={evaluateLoading}
                  style={{ borderRadius: 6 }}
                  size="large"
                >
                  Re-evaluate Candidate
                </Button>
              </div>
            </div>
          </Card>

          {/* Score Breakdown */}
          <Card
            title={<Text strong>Score Breakdown</Text>}
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
              marginBottom: 24
            }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Skills</Text>
                  <Text strong>{evaluation.skillsScore}%</Text>
                </div>
                <Progress percent={evaluation.skillsScore} strokeColor={getScoreColor(evaluation.skillsScore)} showInfo={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Experience</Text>
                  <Text strong>{evaluation.experienceScore}%</Text>
                </div>
                <Progress percent={evaluation.experienceScore} strokeColor={getScoreColor(evaluation.experienceScore)} showInfo={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Education</Text>
                  <Text strong>{evaluation.educationScore}%</Text>
                </div>
                <Progress percent={evaluation.educationScore} strokeColor={getScoreColor(evaluation.educationScore)} showInfo={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Projects</Text>
                  <Text strong>{evaluation.projectsScore}%</Text>
                </div>
                <Progress percent={evaluation.projectsScore} strokeColor={getScoreColor(evaluation.projectsScore)} showInfo={false} />
              </div>
            </Space>
          </Card>

          {/* Skills Analysis */}
          <Card
            title={
              <Space>
                <TrophyOutlined />
                <Text strong>Skills Analysis</Text>
              </Space>
            }
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
              marginBottom: 24
            }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  Skills Candidate Has
                </Text>
                <Space size={[8, 8]} wrap>
                  {evaluation.skillsAnalysis.candidateHas.map((skill, index) => (
                    <Tag key={index} color="green">{skill}</Tag>
                  ))}
                </Space>
              </div>
              <Divider style={{ margin: 0 }} />
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                  Missing Skills
                </Text>
                <Space size={[8, 8]} wrap>
                  {evaluation.skillsAnalysis.missingSkills.length > 0 ? (
                    evaluation.skillsAnalysis.missingSkills.map((skill, index) => (
                      <Tag key={index} color="red">{skill}</Tag>
                    ))
                  ) : (
                    <Text type="secondary">None</Text>
                  )}
                </Space>
              </div>
              {evaluation.skillsAnalysis.transferableSkills.length > 0 && (
                <>
                  <Divider style={{ margin: 0 }} />
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Transferable Skills</Text>
                    <Space size={[8, 8]} wrap>
                      {evaluation.skillsAnalysis.transferableSkills.map((skill, index) => (
                        <Tag key={index} color="blue">{skill}</Tag>
                      ))}
                    </Space>
                  </div>
                </>
              )}
            </Space>
          </Card>

          {/* Strengths & Weaknesses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <Card
              title={
                <Space>
                  <TrophyOutlined style={{ color: '#52c41a' }} />
                  <Text strong>Strengths</Text>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none'
              }}
            >
              <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                {evaluation.strengths}
              </Paragraph>
            </Card>
            <Card
              title={
                <Space>
                  <BulbOutlined style={{ color: '#faad14' }} />
                  <Text strong>Areas for Development</Text>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none'
              }}
            >
              <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                {evaluation.weaknesses}
              </Paragraph>
            </Card>
          </div>

          {/* Cultural Fit & Growth Potential */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <Card
              title={
                <Space>
                  <TeamOutlined />
                  <Text strong>Cultural Fit</Text>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none'
              }}
            >
              <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                {evaluation.culturalFit}
              </Paragraph>
            </Card>
            <Card
              title={
                <Space>
                  <RiseOutlined />
                  <Text strong>Growth Potential</Text>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none'
              }}
            >
              <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                {evaluation.growthPotential}
              </Paragraph>
            </Card>
          </div>

          {/* Interview Focus Areas */}
          <Card
            title={
              <Space>
                <CommentOutlined />
                <Text strong>Interview Focus Areas</Text>
              </Space>
            }
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
              marginBottom: 24
            }}
          >
            <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 0 }}>
              {evaluation.interviewFocusArea}
            </Paragraph>
          </Card>

          {/* Detailed Summary */}
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <Text strong>Detailed Summary</Text>
              </Space>
            }
            style={{
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              boxShadow: 'none'
            }}
          >
            <Paragraph style={{ color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 0 }}>
              {evaluation.detailedSummary}
            </Paragraph>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default EvaluationResults;
