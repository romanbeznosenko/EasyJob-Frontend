import { useState } from 'react';
import { Card, Button, Input, Space, Typography, Empty, Flex, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, LinkOutlined } from '@ant-design/icons';
import { createProject, editProject, deleteProject } from '../services/project.service';

const { Title, Text } = Typography;
const { TextArea } = Input;

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export function ProjectsSection({ projects, setProjects }: ProjectsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technologies: '',
    link: '',
  });

  const handleAdd = async () => {
    if (formData.name.trim() && formData.description.trim()) {
      try {
        const request = {
          name: formData.name,
          description: formData.description,
          technologies: formData.technologies,
          link: formData.link,
        };

        await createProject(request);

        // Optimistically add to UI
        const newProject: Project = {
          id: Date.now().toString(),
          ...formData,
        };
        setProjects([...projects, newProject]);
        setFormData({ name: '', description: '', technologies: '', link: '' });
        setIsAdding(false);
        message.success('Project added successfully');
      } catch (error) {
        message.error('Failed to add project');
        console.error('Error adding project:', error);
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      link: project.link,
    });
  };

  const handleUpdate = async () => {
    if (formData.name.trim() && formData.description.trim() && editingId) {
      try {
        const request = {
          name: formData.name,
          description: formData.description,
          technologies: formData.technologies,
          link: formData.link,
        };

        await editProject(editingId, request);

        setProjects(projects.map(p =>
          p.id === editingId ? { ...p, ...formData } : p
        ));
        setEditingId(null);
        setFormData({ name: '', description: '', technologies: '', link: '' });
        message.success('Project updated successfully');
      } catch (error) {
        message.error('Failed to update project');
        console.error('Error updating project:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      message.success('Project deleted successfully');
    } catch (error) {
      message.error('Failed to delete project');
      console.error('Error deleting project:', error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '', technologies: '', link: '' });
  };

  return (
    <Card>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Projects</Title>
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
            Add Project
          </Button>
        )}
      </Flex>

      {(isAdding || editingId) && (
        <Card style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
          <Flex vertical gap="middle">
            <div>
              <Text strong>Project Name</Text>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Awesome Project"
                style={{ marginTop: 8 }}
              />
            </div>
            <div>
              <Text strong>Description</Text>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the project"
                rows={3}
                style={{ marginTop: 8 }}
              />
            </div>
            <div>
              <Text strong>Technologies</Text>
              <Input
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Node.js, MongoDB"
                style={{ marginTop: 8 }}
              />
            </div>
            <div>
              <Text strong>Project Link</Text>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://github.com/username/project"
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

      {projects.length > 0 ? (
        <Flex vertical gap="small">
          {projects.map((project) => (
            <Card key={project.id} size="small" style={{ backgroundColor: '#fafafa' }}>
              <Flex justify="space-between" align="start">
                <div style={{ flex: 1 }}>
                  <Flex align="center" gap="small">
                    <Text strong>{project.name}</Text>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkOutlined style={{ color: '#1890ff' }} />
                      </a>
                    )}
                  </Flex>
                  {project.description && (
                    <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                      {project.description}
                    </Text>
                  )}
                  {project.technologies && (
                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                      <Text strong>Technologies:</Text> {project.technologies}
                    </Text>
                  )}
                </div>
                <Space style={{ marginLeft: 16 }}>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(project)} />
                  <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(project.id)} />
                </Space>
              </Flex>
            </Card>
          ))}
        </Flex>
      ) : (
        <Empty description="No projects added yet. Click 'Add Project' to get started." />
      )}
    </Card>
  );
}
