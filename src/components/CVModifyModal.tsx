import React, { useState, useEffect } from 'react';
import { Modal, Card, Typography, Empty, Spin, Button, Tag, Input, Select, Form } from 'antd';
import { FileTextOutlined, EyeOutlined, CheckCircleFilled, RobotOutlined } from '@ant-design/icons';
import type { CVResponse } from '../types/cv';
import { CVTemplateEnum, CVTemplateLabels } from '../types/cv';
import { listCVs } from '../services/cv.service';
import { getApplierProfile } from '../services/applierProfile.service';
import CVViewerModal from './CVViewerModal';

const { Text } = Typography;

interface CVModifyModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (cvId: string, name: string, template: CVTemplateEnum) => void;
  loading?: boolean;
  jobTitle?: string;
}

const CVModifyModal: React.FC<CVModifyModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  jobTitle = ''
}) => {
  const [cvs, setCVs] = useState<CVResponse[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewCV, setPreviewCV] = useState<CVResponse | null>(null);
  const [cvName, setCvName] = useState('');
  const [template, setTemplate] = useState<CVTemplateEnum>(CVTemplateEnum.MODERN);

  useEffect(() => {
    if (visible) {
      fetchCVs();
      // Set default name based on job title
      if (jobTitle) {
        setCvName(`CV for ${jobTitle}`);
      }
    } else {
      // Reset state when modal closes
      setSelectedCvId(null);
      setCvName('');
      setTemplate(CVTemplateEnum.MODERN);
    }
  }, [visible, jobTitle]);

  const fetchCVs = async () => {
    try {
      setFetchLoading(true);

      const profileResponse = await getApplierProfile();
      if (profileResponse.data) {
        const profileId = profileResponse.data.applierProfileId;

        const cvsResponse = await listCVs(profileId, 1, 50);
        if (cvsResponse.data) {
          // Only show completed CVs
          const completedCVs = cvsResponse.data.data.filter(
            cv => cv.processStatus === 'COMPLETED'
          );
          setCVs(completedCVs);
        }
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handlePreview = (cv: CVResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewCV(cv);
    setPreviewVisible(true);
  };

  const handleSelectCV = (cvId: string) => {
    setSelectedCvId(cvId);
  };

  const handleConfirm = () => {
    if (selectedCvId && cvName.trim()) {
      onSubmit(selectedCvId, cvName.trim(), template);
    }
  };

  const handleCancel = () => {
    setSelectedCvId(null);
    setCvName('');
    setTemplate(CVTemplateEnum.MODERN);
    onCancel();
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isFormValid = selectedCvId && cvName.trim();

  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RobotOutlined style={{ color: '#722ed1' }} />
            <span>AI CV Modification</span>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        width={750}
        centered
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="modify"
            type="primary"
            onClick={handleConfirm}
            disabled={!isFormValid}
            loading={loading}
            style={{
              background: isFormValid ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
              border: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (isFormValid) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(118, 75, 162, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Modify CV with AI
          </Button>
        ]}
        styles={{
          body: { padding: '24px' }
        }}
      >
        {/* Info banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f5f0ff 0%, #ede7f6 100%)',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
            border: '1px solid #d3adf7'
          }}
        >
          <Text style={{ color: '#531dab' }}>
            AI will analyze your CV and tailor it to match this job offer's requirements.
            The modified CV will be saved as a new document.
          </Text>
        </div>

        {/* Form fields */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Name for Modified CV
            </Text>
            <Input
              value={cvName}
              onChange={(e) => setCvName(e.target.value)}
              placeholder="Enter a name for your modified CV"
              size="large"
              style={{ borderRadius: 6 }}
            />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              CV Template
            </Text>
            <Select
              value={template}
              onChange={setTemplate}
              size="large"
              style={{ width: '100%', borderRadius: 6 }}
            >
              {Object.entries(CVTemplateLabels).map(([value, label]) => (
                <Select.Option key={value} value={value}>{label}</Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {/* CV Selection */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>
            Select CV to Modify
          </Text>

          {fetchLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <Spin size="large" />
            </div>
          ) : cvs.length === 0 ? (
            <Empty
              image={<FileTextOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
              description={
                <div>
                  <Text>No CVs available</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Please generate a CV from your dashboard first
                  </Text>
                </div>
              }
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16,
                maxHeight: '300px',
                overflowY: 'auto',
                padding: 4
              }}
            >
              {cvs.map((cv) => {
                const isSelected = selectedCvId === cv.cvId;

                return (
                  <Card
                    key={cv.cvId}
                    hoverable
                    onClick={() => handleSelectCV(cv.cvId)}
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #722ed1' : '1px solid #e0e0e0',
                      borderRadius: 8,
                      transition: 'all 0.3s ease',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isSelected ? '0 4px 12px rgba(114, 46, 209, 0.3)' : 'none'
                    }}
                    bodyStyle={{ padding: 12 }}
                    cover={
                      <div
                        style={{
                          position: 'relative',
                          height: 120,
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px 8px 0 0',
                          overflow: 'hidden'
                        }}
                      >
                        {cv.thumbnail ? (
                          <img
                            src={cv.thumbnail}
                            alt={cv.filename}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <FileTextOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                        )}

                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: '#722ed1',
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <CheckCircleFilled style={{ color: '#fff', fontSize: 16 }} />
                          </div>
                        )}

                        <Button
                          type="primary"
                          icon={<EyeOutlined />}
                          size="small"
                          onClick={(e) => handlePreview(cv, e)}
                          style={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            opacity: 0.9
                          }}
                        >
                          Preview
                        </Button>
                      </div>
                    }
                  >
                    <Text
                      strong
                      style={{
                        fontSize: 13,
                        display: 'block',
                        marginBottom: 4
                      }}
                      ellipsis
                    >
                      {cv.filename}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {formatDateTime(cv.createdAt)}
                    </Text>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* CV Preview Modal */}
      {previewCV && (
        <CVViewerModal
          visible={previewVisible}
          pdfUrl={previewCV.storageKey}
          filename={previewCV.filename}
          onClose={() => {
            setPreviewVisible(false);
            setPreviewCV(null);
          }}
        />
      )}
    </>
  );
};

export default CVModifyModal;
