import { useState } from 'react';
import { Card, Button, Input, Space, Typography, Empty, Flex, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, LinkOutlined, RocketOutlined } from '@ant-design/icons';
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
            background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RocketOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Projects</Title>
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
            Add Project
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
              <Text strong style={{ fontSize: 13, color: '#666' }}>Project Name</Text>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Awesome Project"
                style={{ marginTop: 8, borderRadius: 8 }}
                size="large"
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Description</Text>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the project"
                rows={3}
                style={{ marginTop: 8, borderRadius: 8 }}
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Technologies</Text>
              <Input
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Node.js, MongoDB"
                style={{ marginTop: 8, borderRadius: 8 }}
                size="large"
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Project Link</Text>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://github.com/username/project"
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

      {projects.length > 0 ? (
        <Flex vertical gap={12}>
          {projects.map((project) => (
            <div
              key={project.id}
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
                  <Flex align="center" gap={12} style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 16 }}>{project.name}</Text>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          background: '#e6f7ff',
                          borderRadius: 12,
                          fontSize: 12,
                          color: '#1890ff',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#bae7ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#e6f7ff';
                        }}
                      >
                        <LinkOutlined style={{ marginRight: 4 }} />
                        View
                      </a>
                    )}
                  </Flex>
                  {project.description && (
                    <Text style={{ display: 'block', color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                      {project.description}
                    </Text>
                  )}
                  {project.technologies && (
                    <Flex gap={6} wrap="wrap">
                      {project.technologies.split(',').map((tech, index) => (
                        <Tag
                          key={index}
                          style={{
                            borderRadius: 12,
                            background: '#f6ffed',
                            border: '1px solid #b7eb8f',
                            color: '#52c41a',
                            fontSize: 12,
                            padding: '2px 10px'
                          }}
                        >
                          {tech.trim()}
                        </Tag>
                      ))}
                    </Flex>
                  )}
                </div>
                <Space size={4} style={{ marginLeft: 16 }}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(project)}
                    style={{ color: '#1890ff' }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(project.id)}
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
            <Text type="secondary">No projects added yet. Click 'Add Project' to get started.</Text>
          }
        />
      )}
    </Card>
  );
}
