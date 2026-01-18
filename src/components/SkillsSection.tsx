import { useState } from 'react';
import { Card, Button, Input, Select, Space, Typography, Empty, Flex, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, TrophyOutlined } from '@ant-design/icons';
import { createSkill, editSkill, deleteSkill } from '../services/skill.service';

const { Title, Text } = Typography;

export interface Skill {
  id: string;
  name: string;
  level: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return { bg: '#fff7e6', border: '#ffd591', color: '#fa8c16' };
    case 'Intermediate':
      return { bg: '#e6f7ff', border: '#91d5ff', color: '#1890ff' };
    case 'Advanced':
      return { bg: '#f6ffed', border: '#b7eb8f', color: '#52c41a' };
    case 'Expert':
      return { bg: '#f9f0ff', border: '#d3adf7', color: '#722ed1' };
    default:
      return { bg: '#f5f5f5', border: '#d9d9d9', color: '#666' };
  }
};

export function SkillsSection({ skills, setSkills }: SkillsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', level: 'Beginner' });

  const handleAdd = async () => {
    if (formData.name.trim()) {
      try {
        const request = {
          name: formData.name,
          level: formData.level,
        };

        await createSkill(request);

        // Optimistically add to UI
        const newSkill: Skill = {
          id: Date.now().toString(),
          name: formData.name,
          level: formData.level,
        };
        setSkills([...skills, newSkill]);
        setFormData({ name: '', level: 'Beginner' });
        setIsAdding(false);
        message.success('Skill added successfully');
      } catch (error) {
        message.error('Failed to add skill');
        console.error('Error adding skill:', error);
      }
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({ name: skill.name, level: skill.level });
  };

  const handleUpdate = async () => {
    if (formData.name.trim() && editingId) {
      try {
        const request = {
          name: formData.name,
          level: formData.level,
        };

        await editSkill(editingId, request);

        setSkills(skills.map(s =>
          s.id === editingId
            ? { ...s, name: formData.name, level: formData.level }
            : s
        ));
        setEditingId(null);
        setFormData({ name: '', level: 'Beginner' });
        message.success('Skill updated successfully');
      } catch (error) {
        message.error('Failed to update skill');
        console.error('Error updating skill:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);
      setSkills(skills.filter(s => s.id !== id));
      message.success('Skill deleted successfully');
    } catch (error) {
      message.error('Failed to delete skill');
      console.error('Error deleting skill:', error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', level: 'Beginner' });
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrophyOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Skills</Title>
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
            Add Skill
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
          <Flex vertical gap="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Skill Name</Text>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., JavaScript, Python, Design"
                style={{ marginTop: 8, borderRadius: 8 }}
                size="large"
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Skill Level</Text>
              <Select
                value={formData.level}
                onChange={(value) => setFormData({ ...formData, level: value })}
                style={{ width: '100%', marginTop: 8 }}
                size="large"
                options={[
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced' },
                  { value: 'Expert', label: 'Expert' }
                ]}
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

      {skills.length > 0 ? (
        <Flex vertical gap={12} style={{ width: '100%' }}>
          {skills.map((skill) => {
            const levelColors = getLevelColor(skill.level);
            return (
              <div
                key={skill.id}
                style={{
                  padding: '16px 20px',
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
                <Flex justify="space-between" align="center">
                  <Flex align="center" gap={16}>
                    <Text strong style={{ fontSize: 15 }}>{skill.name}</Text>
                    <Tag
                      style={{
                        borderRadius: 12,
                        background: levelColors.bg,
                        border: `1px solid ${levelColors.border}`,
                        color: levelColors.color,
                        fontSize: 12,
                        padding: '2px 10px'
                      }}
                    >
                      {skill.level}
                    </Tag>
                  </Flex>
                  <Space size={4}>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(skill)}
                      style={{ color: '#1890ff' }}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(skill.id)}
                    />
                  </Space>
                </Flex>
              </div>
            );
          })}
        </Flex>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">No skills added yet. Click 'Add Skill' to get started.</Text>
          }
        />
      )}
    </Card>
  );
}
