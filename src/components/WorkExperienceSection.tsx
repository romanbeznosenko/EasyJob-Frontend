import { useState } from 'react';
import { Card, Button, Input, Space, Typography, Empty, Flex, Row, Col, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, ProjectOutlined } from '@ant-design/icons';
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

  return (
    <Card>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Work Experience</Title>
        {!isAdding && !editingId && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAdding(true)}
            style={{
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
        <Card style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
          <Flex vertical gap="middle">
            <div>
              <Text strong>Job Title</Text>
              <Input
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="Software Engineer"
                style={{ marginTop: 8 }}
              />
            </div>
            <div>
              <Text strong>Company Name</Text>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Tech Company Inc."
                style={{ marginTop: 8 }}
              />
            </div>
            <div>
              <Text strong>Location</Text>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA"
                style={{ marginTop: 8 }}
              />
            </div>
            <Row gutter={12}>
              <Col span={12}>
                <Text strong>Start Date</Text>
                <DatePicker
                  picker="month"
                  value={formData.startDate ? dayjs(formData.startDate) : null}
                  onChange={(date) => setFormData({ ...formData, startDate: date ? date.format('YYYY-MM') : '' })}
                  style={{ width: '100%', marginTop: 8 }}
                />
              </Col>
              <Col span={12}>
                <Text strong>End Date</Text>
                <DatePicker
                  picker="month"
                  value={formData.endDate ? dayjs(formData.endDate) : null}
                  onChange={(date) => setFormData({ ...formData, endDate: date ? date.format('YYYY-MM') : '' })}
                  placeholder="Leave empty if current"
                  style={{ width: '100%', marginTop: 8 }}
                />
              </Col>
            </Row>
            <div>
              <Text strong>Responsibilities</Text>
              <TextArea
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Describe your key responsibilities and achievements"
                rows={4}
                style={{ marginTop: 8 }}
              />
            </div>
            <Space>
              <Button type="primary" icon={<CheckOutlined />} onClick={editingId ? handleUpdate : handleAdd}>
                {editingId ? 'Update' : 'Add'}
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Flex>
        </Card>
      )}

      {workExperience.length > 0 ? (
        <Flex vertical gap="small">
          {workExperience.map((exp) => (
            <Card key={exp.id} size="small" style={{ backgroundColor: '#fafafa' }}>
              <Flex justify="space-between" align="start">
                <Flex gap="middle" style={{ flex: 1 }}>
                  <div style={{ padding: 8, backgroundColor: '#f6ffed', borderRadius: 8, height: 'fit-content' }}>
                    <ProjectOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong>{exp.jobTitle}</Text>
                    <br />
                    <Text>{exp.companyName}</Text>
                    {exp.location && (
                      <>
                        <br />
                        <Text type="secondary">{exp.location}</Text>
                      </>
                    )}
                    {(exp.startDate || exp.endDate) && (
                      <>
                        <br />
                        <Text type="secondary">
                          {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {' - '}
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
                        </Text>
                      </>
                    )}
                    {exp.responsibilities && (
                      <Text type="secondary" style={{ display: 'block', marginTop: 8, whiteSpace: 'pre-wrap' }}>
                        {exp.responsibilities}
                      </Text>
                    )}
                  </div>
                </Flex>
                <Space style={{ marginLeft: 16 }}>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(exp)} />
                  <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(exp.id)} />
                </Space>
              </Flex>
            </Card>
          ))}
        </Flex>
      ) : (
        <Empty description="No work experience added yet. Click 'Add Experience' to get started." />
      )}
    </Card>
  );
}
