import { useState } from 'react';
import { Card, Button, Input, Space, Typography, Empty, Flex, Row, Col, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, ReadOutlined } from '@ant-design/icons';
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

  return (
    <Card>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Education</Title>
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
            Add Education
          </Button>
        )}
      </Flex>

      {(isAdding || editingId) && (
        <Card style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
          <Flex vertical gap="middle">
            <div>
              <Text strong>Degree</Text>
              <Input
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Bachelor of Science"
                style={{ marginTop: 8 }}
              />
            </div>
            <div>
              <Text strong>University</Text>
              <Input
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                placeholder="University Name"
                style={{ marginTop: 8 }}
              />
            </div>
            <div>
              <Text strong>Major</Text>
              <Input
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder="Computer Science"
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
                  style={{ width: '100%', marginTop: 8 }}
                />
              </Col>
            </Row>
            <div>
              <Text strong>GPA</Text>
              <Input
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                placeholder="3.8/4.0"
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

      {education.length > 0 ? (
        <Flex vertical gap="small">
          {education.map((edu) => (
            <Card key={edu.id} size="small" style={{ backgroundColor: '#fafafa' }}>
              <Flex justify="space-between" align="start">
                <Flex gap="middle" style={{ flex: 1 }}>
                  <div style={{ padding: 8, backgroundColor: '#e6f7ff', borderRadius: 8, height: 'fit-content' }}>
                    <ReadOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong>{edu.degree}</Text>
                    <br />
                    <Text>{edu.university}</Text>
                    {edu.major && (
                      <>
                        <br />
                        <Text type="secondary">Major: {edu.major}</Text>
                      </>
                    )}
                    <Flex gap="middle" style={{ marginTop: 8 }}>
                      {(edu.startDate || edu.endDate) && (
                        <Text type="secondary">
                          {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {edu.startDate && edu.endDate && ' - '}
                          {edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </Text>
                      )}
                      {edu.gpa && <Text type="secondary">GPA: {edu.gpa}</Text>}
                    </Flex>
                  </div>
                </Flex>
                <Space style={{ marginLeft: 16 }}>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(edu)} />
                  <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(edu.id)} />
                </Space>
              </Flex>
            </Card>
          ))}
        </Flex>
      ) : (
        <Empty description="No education added yet. Click 'Add Education' to get started." />
      )}
    </Card>
  );
}
