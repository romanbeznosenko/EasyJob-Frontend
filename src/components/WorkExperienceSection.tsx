import { useState } from 'react';
import { Card, Button, Input, Space, Typography, Empty, Flex, Row, Col, DatePicker, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, BankOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createWorkExperience, editWorkExperience, deleteWorkExperience } from '../services/workExperience.service';

const { Title, Text } = Typography;
const { TextArea } = Input;

export interface WorkExperience {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  location: string;
}

interface WorkExperienceSectionProps {
  workExperience: WorkExperience[];
  setWorkExperience: (workExperience: WorkExperience[]) => void;
}

export function WorkExperienceSection({ workExperience, setWorkExperience }: WorkExperienceSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
    location: '',
  });

  const handleAdd = async () => {
    if (formData.jobTitle.trim() && formData.companyName.trim() && formData.startDate && formData.endDate) {
      try {
        const request = {
          title: formData.jobTitle,
          companyName: formData.companyName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          responsibilities: formData.responsibilities,
          location: formData.location,
        };

        await createWorkExperience(request);

        // Optimistically add to UI
        const newExperience: WorkExperience = {
          id: Date.now().toString(),
          ...formData,
        };
        setWorkExperience([...workExperience, newExperience]);
        setFormData({ jobTitle: '', companyName: '', startDate: '', endDate: '', responsibilities: '', location: '' });
        setIsAdding(false);
        message.success('Work experience added successfully');
      } catch (error) {
        message.error('Failed to add work experience');
        console.error('Error adding work experience:', error);
      }
    } else {
      message.warning('Please fill in all required fields');
    }
  };

  const handleEdit = (exp: WorkExperience) => {
    setEditingId(exp.id);
    setFormData({
      jobTitle: exp.jobTitle,
      companyName: exp.companyName,
      startDate: exp.startDate,
      endDate: exp.endDate,
      responsibilities: exp.responsibilities,
      location: exp.location,
    });
  };

  const handleUpdate = async () => {
    if (formData.jobTitle.trim() && formData.companyName.trim() && formData.startDate && formData.endDate && editingId) {
      try {
        const request = {
          title: formData.jobTitle,
          companyName: formData.companyName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          responsibilities: formData.responsibilities,
          location: formData.location,
        };

        await editWorkExperience(editingId, request);

        setWorkExperience(workExperience.map(e =>
          e.id === editingId ? { ...e, ...formData } : e
        ));
        setEditingId(null);
        setFormData({ jobTitle: '', companyName: '', startDate: '', endDate: '', responsibilities: '', location: '' });
        message.success('Work experience updated successfully');
      } catch (error) {
        message.error('Failed to update work experience');
        console.error('Error updating work experience:', error);
      }
    } else {
      message.warning('Please fill in all required fields');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWorkExperience(id);
      setWorkExperience(workExperience.filter(e => e.id !== id));
      message.success('Work experience deleted successfully');
    } catch (error) {
      message.error('Failed to delete work experience');
      console.error('Error deleting work experience:', error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ jobTitle: '', companyName: '', startDate: '', endDate: '', responsibilities: '', location: '' });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <Card
      style={{
        borderRadius: 12,
        border: '1px solid #e8e8e8',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Flex align="center" gap={12}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BankOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Work Experience</Title>
        </Flex>
        {!isAdding && !editingId && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAdding(true)}
            style={{
              borderRadius: 8,
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
            Add Experience
          </Button>
        )}
      </Flex>

      {(isAdding || editingId) && (
        <Card
          style={{
            marginBottom: 20,
            backgroundColor: '#fafafa',
            borderRadius: 10,
            border: '1px solid #f0f0f0'
          }}
        >
          <Flex vertical gap="middle">
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Job Title</Text>
              <Input
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="Software Engineer"
                style={{ marginTop: 8, borderRadius: 8 }}
                size="large"
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Company Name</Text>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Tech Company Inc."
                style={{ marginTop: 8, borderRadius: 8 }}
                size="large"
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Location</Text>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA"
                style={{ marginTop: 8, borderRadius: 8 }}
                size="large"
              />
            </div>
            <Row gutter={12}>
              <Col span={12}>
                <Text strong style={{ fontSize: 13, color: '#666' }}>Start Date</Text>
                <DatePicker
                  picker="month"
                  value={formData.startDate ? dayjs(formData.startDate) : null}
                  onChange={(date) => setFormData({ ...formData, startDate: date ? date.format('YYYY-MM') : '' })}
                  style={{ width: '100%', marginTop: 8 }}
                  size="large"
                />
              </Col>
              <Col span={12}>
                <Text strong style={{ fontSize: 13, color: '#666' }}>End Date</Text>
                <DatePicker
                  picker="month"
                  value={formData.endDate ? dayjs(formData.endDate) : null}
                  onChange={(date) => setFormData({ ...formData, endDate: date ? date.format('YYYY-MM') : '' })}
                  placeholder="Leave empty if current"
                  style={{ width: '100%', marginTop: 8 }}
                  size="large"
                />
              </Col>
            </Row>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Responsibilities</Text>
              <TextArea
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Describe your key responsibilities and achievements"
                rows={4}
                style={{ marginTop: 8, borderRadius: 8 }}
              />
            </div>
            <Flex gap={8}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={editingId ? handleUpdate : handleAdd}
                style={{ borderRadius: 8 }}
              >
                {editingId ? 'Update' : 'Add'}
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancel}
                style={{ borderRadius: 8 }}
              >
                Cancel
              </Button>
            </Flex>
          </Flex>
        </Card>
      )}

      {workExperience.length > 0 ? (
        <Flex vertical gap={12}>
          {workExperience.map((exp) => (
            <div
              key={exp.id}
              style={{
                padding: '20px',
                backgroundColor: '#fafafa',
                borderRadius: 10,
                border: '1px solid #f0f0f0',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
                e.currentTarget.style.borderColor = '#e8e8e8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
                e.currentTarget.style.borderColor = '#f0f0f0';
              }}
            >
              <Flex justify="space-between" align="start">
                <div style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>
                    {exp.jobTitle}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666', display: 'block', marginBottom: 8 }}>
                    {exp.companyName}
                  </Text>
                  <Flex gap={8} wrap="wrap" align="center" style={{ marginBottom: exp.responsibilities ? 12 : 0 }}>
                    {exp.location && (
                      <Tag
                        icon={<EnvironmentOutlined />}
                        style={{
                          borderRadius: 12,
                          background: '#fff7e6',
                          border: '1px solid #ffd591',
                          color: '#fa8c16',
                          fontSize: 12,
                          padding: '2px 10px'
                        }}
                      >
                        {exp.location}
                      </Tag>
                    )}
                    {(exp.startDate || exp.endDate) && (
                      <Tag
                        icon={<CalendarOutlined />}
                        style={{
                          borderRadius: 12,
                          background: '#e6f7ff',
                          border: '1px solid #91d5ff',
                          color: '#1890ff',
                          fontSize: 12,
                          padding: '2px 10px'
                        }}
                      >
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </Tag>
                    )}
                  </Flex>
                  {exp.responsibilities && (
                    <Text style={{ display: 'block', color: '#666', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {exp.responsibilities}
                    </Text>
                  )}
                </div>
                <Space size={4} style={{ marginLeft: 16 }}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(exp)}
                    style={{ color: '#1890ff' }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(exp.id)}
                  />
                </Space>
              </Flex>
            </div>
          ))}
        </Flex>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">No work experience added yet. Click 'Add Experience' to get started.</Text>
          }
        />
      )}
    </Card>
  );
}
