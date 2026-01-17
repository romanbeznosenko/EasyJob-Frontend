import React, { useState, useEffect } from 'react';
import { Modal, Card, Typography, Empty, Spin, Button, Tag } from 'antd';
import { FileTextOutlined, EyeOutlined, CheckCircleFilled, LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { CVResponse } from '../types/cv';
import { listCVs } from '../services/cv.service';
import { getApplierProfile } from '../services/applierProfile.service';
import CVViewerModal from './CVViewerModal';

const { Text } = Typography;

interface CVSelectModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (cvId: string) => void;
  loading?: boolean;
}

const CVSelectModal: React.FC<CVSelectModalProps> = ({
  visible,
  onCancel,
  onSelect,
  loading = false
}) => {
  const [cvs, setCVs] = useState<CVResponse[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewCV, setPreviewCV] = useState<CVResponse | null>(null);
  const [applierProfileId, setApplierProfileId] = useState<string>('');

  useEffect(() => {
    if (visible) {
      fetchCVs();
    }
  }, [visible]);

  const fetchCVs = async () => {
    try {
      setFetchLoading(true);

      // First get the applier profile to get the ID
      const profileResponse = await getApplierProfile();
      if (profileResponse.data) {
        const profileId = profileResponse.data.applierProfileId;
        setApplierProfileId(profileId);

        // Then fetch CVs
        const cvsResponse = await listCVs(profileId, 1, 50);
        if (cvsResponse.data) {
          // Only show completed CVs for application
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
    if (selectedCvId) {
      onSelect(selectedCvId);
    }
  };

  const handleCancel = () => {
    setSelectedCvId(null);
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

  return (
    <>
      <Modal
        title="Select CV for Application"
        open={visible}
        onCancel={handleCancel}
        width={700}
        centered
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={handleConfirm}
            disabled={!selectedCvId}
            loading={loading}
            style={{
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedCvId) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Apply with Selected CV
          </Button>
        ]}
        styles={{
          body: { padding: '24px', maxHeight: '60vh', overflowY: 'auto' }
        }}
      >
        {fetchLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Spin size="large" />
          </div>
        ) : cvs.length === 0 ? (
          <Empty
            image={<FileTextOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description={
              <div>
                <Text>No CVs available for application</Text>
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
              gap: 16
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
                    border: isSelected ? '2px solid #1890ff' : '1px solid #e0e0e0',
                    borderRadius: 8,
                    transition: 'all 0.3s ease',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isSelected ? '0 4px 12px rgba(24, 144, 255, 0.3)' : 'none'
                  }}
                  bodyStyle={{ padding: 12 }}
                  cover={
                    <div
                      style={{
                        position: 'relative',
                        height: 140,
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

                      {/* Selection indicator */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: '#1890ff',
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

                      {/* Preview button */}
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

export default CVSelectModal;
