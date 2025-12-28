import React, { useState, useEffect } from 'react';
import { Card, Empty, message, Spin, Modal, Input, Form, Button, Dropdown } from 'antd';
import { FileTextOutlined, ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { listCVs, deleteCV, editCV } from '../services/cv.service';
import { generateCV } from '../services/applierProfile.service';
import { CVTemplateEnum } from '../types/applierProfile';
import type { CVResponse } from '../types/cv';
import CVCard from './CVCard';
import CVViewerModal from './CVViewerModal';

const { confirm } = Modal;

interface CVSectionProps {
  applierProfileId: string;
}

const CVSection: React.FC<CVSectionProps> = ({ applierProfileId }) => {
  const [cvs, setCVs] = useState<CVResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedCV, setSelectedCV] = useState<CVResponse | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCV, setEditingCV] = useState<CVResponse | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (applierProfileId) {
      fetchCVs();
    }
  }, [applierProfileId]);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const response = await listCVs(applierProfileId);

      if (response.data) {
        setCVs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
      message.error('Failed to load CVs');
      setCVs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (cvId: string) => {
    confirm({
      title: 'Delete CV',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this CV? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        setDeletingId(cvId);
        try {
          await deleteCV(applierProfileId, cvId);
          setCVs(cvs.filter(cv => cv.cvId !== cvId));
          message.success('CV deleted successfully');
        } catch (error) {
          console.error('Error deleting CV:', error);
          message.error('Failed to delete CV');
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  const handleViewCV = (cv: CVResponse) => {
    console.log('handleViewCV called with:', {
      filename: cv.filename,
      storageKey: cv.storageKey,
      status: cv.processStatus
    });
    setSelectedCV(cv);
    setViewerVisible(true);
  };

  const handleEdit = (cv: CVResponse) => {
    setEditingCV(cv);
    // Remove .pdf extension for editing
    const filenameWithoutExtension = cv.filename.replace(/\.pdf$/i, '');
    form.setFieldsValue({ filename: filenameWithoutExtension });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!editingCV) return;

      // Always ensure .pdf extension
      const filenameWithExtension = values.filename.endsWith('.pdf')
        ? values.filename
        : `${values.filename}.pdf`;

      await editCV(applierProfileId, editingCV.cvId, { filename: filenameWithExtension });

      // Update the CV in the list
      setCVs(cvs.map(cv =>
        cv.cvId === editingCV.cvId
          ? { ...cv, filename: filenameWithExtension }
          : cv
      ));

      message.success('CV filename updated successfully');
      setEditModalVisible(false);
      setEditingCV(null);
      form.resetFields();
    } catch (error) {
      console.error('Error updating CV filename:', error);
      message.error('Failed to update CV filename');
    }
  };

  const handleDownload = (cv: CVResponse) => {
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = cv.storageKey;
      link.download = cv.filename.endsWith('.pdf') ? cv.filename : `${cv.filename}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success('Download started');
    } catch (error) {
      console.error('Error downloading CV:', error);
      message.error('Failed to download CV');
    }
  };

  const handleGenerateCV = async (template: CVTemplateEnum) => {
    try {
      message.loading({ content: 'Generating CV...', key: 'cv-generation' });
      await generateCV(template);
      message.success({
        content: 'CV generation started successfully! Your CV will appear here once processing is complete.',
        key: 'cv-generation',
        duration: 5
      });
      // Refresh the CV list after a short delay to show the new CV with PENDING status
      setTimeout(() => {
        fetchCVs();
      }, 2000);
    } catch (error) {
      message.error({ content: 'Failed to generate CV', key: 'cv-generation' });
      console.error('Error generating CV:', error);
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'creative',
      label: 'Creative',
      onClick: () => handleGenerateCV(CVTemplateEnum.CREATIVE),
    },
    {
      key: 'corporate',
      label: 'Corporate',
      onClick: () => handleGenerateCV(CVTemplateEnum.CORPORATE),
    },
    {
      key: 'minimal',
      label: 'Minimal',
      onClick: () => handleGenerateCV(CVTemplateEnum.MINIMAL),
    },
    {
      key: 'modern',
      label: 'Modern',
      onClick: () => handleGenerateCV(CVTemplateEnum.MODERN),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>My CVs</h2>
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
            >
              Generate CV
            </Button>
          </Dropdown>
        </div>
        <Card style={{ borderRadius: 8, border: '1px solid #e0e0e0', boxShadow: 'none', textAlign: 'center', padding: '32px 0' }}>
          <Empty
            image={<FileTextOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description="No CVs generated yet"
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>My CVs</h2>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
          >
            Generate CV
          </Button>
        </Dropdown>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
          width: '100%'
        }}
      >
        {cvs.map((cv) => (
          <CVCard
            key={cv.cvId}
            cv={cv}
            onClick={handleViewCV}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onDownload={handleDownload}
            isDeleting={deletingId === cv.cvId}
          />
        ))}
      </div>

      {selectedCV && (
        <CVViewerModal
          visible={viewerVisible}
          pdfUrl={selectedCV.storageKey}
          filename={selectedCV.filename}
          onClose={() => {
            setViewerVisible(false);
            setSelectedCV(null);
          }}
        />
      )}

      <Modal
        title="Edit CV Filename"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingCV(null);
          form.resetFields();
        }}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="filename"
            label="Filename"
            rules={[
              { required: true, message: 'Please enter a filename' },
              { whitespace: true, message: 'Filename cannot be empty' }
            ]}
            extra="File extension .pdf will be added automatically"
          >
            <Input
              placeholder="Enter CV filename (without extension)"
              addonAfter=".pdf"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CVSection;
