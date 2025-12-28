import React from 'react';
import { Card, Button, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, DownloadOutlined, FileTextOutlined, LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { CVResponse } from '../types/cv';

const { Text } = Typography;

interface CVCardProps {
  cv: CVResponse;
  onClick: (cv: CVResponse) => void;
  onDelete: (cvId: string) => void;
  onEdit: (cv: CVResponse) => void;
  onDownload: (cv: CVResponse) => void;
  isDeleting?: boolean;
}

const CVCard: React.FC<CVCardProps> = ({ cv, onClick, onDelete, onEdit, onDownload, isDeleting }) => {
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isProcessing = cv.processStatus === 'PENDING' || cv.processStatus === 'PROCESSING';
  const isFailed = cv.processStatus === 'FAILED';
  const isCompleted = cv.processStatus === 'COMPLETED';

  const handleCardClick = () => {
    console.log('CV Card clicked:', {
      filename: cv.filename,
      status: cv.processStatus,
      isCompleted,
      storageKey: cv.storageKey
    });
    if (isCompleted) {
      onClick(cv);
    }
  };

  return (
    <Card
      hoverable={isCompleted}
      onClick={handleCardClick}
      style={{
        cursor: isCompleted ? 'pointer' : 'default',
        borderRadius: 8,
        border: '1px solid #e0e0e0',
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
      cover={
        <div style={{ position: 'relative', height: 200, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isCompleted && cv.thumbnail ? (
            <img src={cv.thumbnail} alt={cv.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
          )}

          {isProcessing && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <LoadingOutlined style={{ fontSize: 32, color: '#1890ff' }} spin />
              <Tag color="orange">Processing...</Tag>
            </div>
          )}

          {isFailed && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <CloseCircleOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
              <Tag color="red">Failed</Tag>
            </div>
          )}
        </div>
      }
    >
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -8, right: -8, display: 'flex', gap: 4 }}>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onDownload(cv);
            }}
            style={{ color: '#52c41a' }}
            disabled={!isCompleted}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(cv);
            }}
            style={{ color: '#1890ff' }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(cv.cvId);
            }}
            loading={isDeleting}
          />
        </div>

        <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4, paddingRight: 90 }} ellipsis>
          {cv.filename}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatDateTime(cv.createdAt)}
        </Text>
      </div>
    </Card>
  );
};

export default CVCard;
