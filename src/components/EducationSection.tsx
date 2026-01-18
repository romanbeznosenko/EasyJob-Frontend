import { useState } from 'react';
import { Card, Button, Input, Space, Typography, Empty, Flex, Row, Col, DatePicker, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, ReadOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export interface Education {
  id: string;
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
  major: string;
  gpa: string;
}

interface EducationSectionProps {
  education: Education[];
  setEducation: (education: Education[]) => void;
}

export function EducationSection({ education, setEducation }: EducationSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    degree: '',
    university: '',
    startDate: '',
    endDate: '',
    major: '',
    gpa: '',
  });

  const handleAdd = () => {
    if (formData.degree.trim() && formData.university.trim()) {
      const newEducation: Education = {
        id: Date.now().toString(),
        ...formData,
      };
      setEducation([...education, newEducation]);
      setFormData({ degree: '', university: '', startDate: '', endDate: '', major: '', gpa: '' });
      setIsAdding(false);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData({
      degree: edu.degree,
      university: edu.university,
      startDate: edu.startDate,
      endDate: edu.endDate,
      major: edu.major,
      gpa: edu.gpa,
    });
  };

  const handleUpdate = () => {
    if (formData.degree.trim() && formData.university.trim()) {
      setEducation(education.map(e =>
        e.id === editingId ? { ...e, ...formData } : e
      ));
      setEditingId(null);
      setFormData({ degree: '', university: '', startDate: '', endDate: '', major: '', gpa: '' });
    }
  };

  const handleDelete = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ degree: '', university: '', startDate: '', endDate: '', major: '', gpa: '' });
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
            background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ReadOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Education</Title>
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
            Add Education
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
              <Text strong style={{ fontSize: 13, color: '#666' }}>Degree</Text>
              <Input
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Bachelor of Science"
                style={{ marginTop: 8, borderRadius: 8 }}
                size="large"
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>University</Text>
              <Input
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                placeholder="University Name"
                style={{ marginTop: 8, borderRadius: 8 }}
                size="large"
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Major</Text>
              <Input
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder="Computer Science"
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
                  style={{ width: '100%', marginTop: 8 }}
                  size="large"
                />
              </Col>
            </Row>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>GPA</Text>
              <Input
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                placeholder="3.8/4.0"
                style={{ marginTop: 8, borderRadius: 8 }}
                size="large"
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

      {education.length > 0 ? (
        <Flex vertical gap={12}>
          {education.map((edu) => (
            <div
              key={edu.id}
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
                    {edu.degree}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666', display: 'block', marginBottom: 8 }}>
                    {edu.university}
                  </Text>
                  <Flex gap={8} wrap="wrap" align="center">
                    {edu.major && (
                      <Tag
                        style={{
                          borderRadius: 12,
                          background: '#f9f0ff',
                          border: '1px solid #d3adf7',
                          color: '#722ed1',
                          fontSize: 12,
                          padding: '2px 10px'
                        }}
                      >
                        {edu.major}
                      </Tag>
                    )}
                    {(edu.startDate || edu.endDate) && (
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
                        {formatDate(edu.startDate)}
                        {edu.startDate && edu.endDate && ' - '}
                        {formatDate(edu.endDate)}
                      </Tag>
                    )}
                    {edu.gpa && (
                      <Tag
                        style={{
                          borderRadius: 12,
                          background: '#f6ffed',
                          border: '1px solid #b7eb8f',
                          color: '#52c41a',
                          fontSize: 12,
                          padding: '2px 10px'
                        }}
                      >
                        GPA: {edu.gpa}
                      </Tag>
                    )}
                  </Flex>
                </div>
                <Space size={4} style={{ marginLeft: 16 }}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(edu)}
                    style={{ color: '#1890ff' }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(edu.id)}
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
            <Text type="secondary">No education added yet. Click 'Add Education' to get started.</Text>
          }
        />
      )}
    </Card>
  );
}
