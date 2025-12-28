import { useState } from 'react';
import { Card, Button, Input, Select, Space, Typography, Empty, Flex, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
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
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Skills</Title>
        {!isAdding && !editingId && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAdding(true)}>
            Add Skill
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
          <Flex vertical gap="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>Skill Name</Text>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., JavaScript, Python, Design"
                style={{ marginTop: 8 }}
              />
            </div>
            <div>
              <Text strong>Skill Level</Text>
              <Select
                value={formData.level}
                onChange={(value) => setFormData({ ...formData, level: value })}
                style={{ width: '100%', marginTop: 8 }}
                options={[
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced' },
                  { value: 'Expert', label: 'Expert' }
                ]}
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

      {skills.length > 0 ? (
        <Flex vertical gap="small" style={{ width: '100%' }}>
          {skills.map((skill) => (
            <Card key={skill.id} size="small" style={{ backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>{skill.name}</Text>
                  <br />
                  <Text type="secondary">{skill.level}</Text>
                </div>
                <Space>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(skill)} />
                  <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(skill.id)} />
                </Space>
              </div>
            </Card>
          ))}
        </Flex>
      ) : (
        <Empty description="No skills added yet. Click 'Add Skill' to get started." />
      )}
    </Card>
  );
}
