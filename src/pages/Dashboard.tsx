import React from 'react';
import { Layout, Button, Avatar, Typography, Flex, message, Spin, Dropdown, Card } from 'antd';
import { DownloadOutlined, UserOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import JobSeekerNav from '../components/JobSeekerNav';
import { SkillsSection } from '../components/SkillsSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { EducationSection } from '../components/EducationSection';
import { WorkExperienceSection } from '../components/WorkExperienceSection';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApplierProfile, generateCV } from '../services/applierProfile.service';
import { CVTemplateEnum } from '../types/applierProfile';

const { Content } = Layout;
const { Title, Text } = Typography;

export interface Skill {
  id: string;
  name: string;
  level: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Education {
  id: string;
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
  major: string;
  gpa: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  location: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplierProfile = async () => {
      try {
        setLoading(true);
        const response = await getApplierProfile();

        if (response.data) {
          const profile = response.data;

          // Set CV URL if available
          if (profile.cv) {
            setCvUrl(profile.cv);
          }

          // Map skills from backend format
          setSkills(profile.skill.map(s => ({
            id: s.skillId,
            name: s.name,
            level: s.level
          })));

          // Map projects from backend format
          setProjects(profile.project.map(p => ({
            id: p.projectId,
            name: p.name,
            description: p.description,
            technologies: p.technologies,
            link: p.link
          })));

          // Map education from backend format
          setEducation(profile.education.map(e => ({
            id: e.educationId,
            degree: e.degree,
            university: e.university,
            startDate: e.startDate,
            endDate: e.endDate,
            major: e.major,
            gpa: e.gpa.toString()
          })));

          // Map work experience from backend format
          setWorkExperience(profile.workExperience.map(w => ({
            id: w.workExperienceId,
            jobTitle: w.title,
            companyName: w.companyName,
            startDate: w.startDate,
            endDate: w.endDate,
            responsibilities: w.responsibilities,
            location: w.location
          })));
        }
      } catch (error) {
        message.error('Failed to load profile data');
        console.error('Error fetching applier profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplierProfile();
    }
  }, [user]);

  const handleGenerateCV = async (template: CVTemplateEnum) => {
    try {
      message.loading({ content: 'Generating CV...', key: 'cv-generation' });
      await generateCV(template);
      message.success({ content: 'CV generation started successfully! Refresh the page in a few moments to see your CV.', key: 'cv-generation', duration: 5 });
    } catch (error) {
      message.error({ content: 'Failed to generate CV', key: 'cv-generation' });
      console.error('Error generating CV:', error);
    }
  };

  const handleViewCV = () => {
    if (cvUrl) {
      window.open(cvUrl, '_blank');
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
      <Layout style={{ minHeight: '100vh' }}>
        <JobSeekerNav />
        <Content style={{ padding: 0, backgroundColor: '#f5f5f5' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <JobSeekerNav />
      <Content style={{ padding: 0, backgroundColor: '#f5f5f5' }}>
        <div style={{ borderBottom: '1px solid #d9d9d9', backgroundColor: '#fff', padding: '32px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Flex justify="space-between" align="center">
              <Flex align="center" gap="large">
                <Avatar size={96} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div>
                  <Title level={2} style={{ margin: 0, marginBottom: 4 }}>
                    {user?.name ?? "John"} {user?.surname ?? "Doe"}
                  </Title>
                  <Text type="secondary">{user?.email}</Text>
                </div>
              </Flex>

              <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="large"
                >
                  Generate CV
                </Button>
              </Dropdown>
            </Flex>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          <Flex vertical gap="large" style={{ width: '100%' }}>
            {cvUrl && (
              <Card
                title={
                  <Flex align="center" gap="small">
                    <FileTextOutlined />
                    <span>Your CV</span>
                  </Flex>
                }
                extra={
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={handleViewCV}
                  >
                    View CV
                  </Button>
                }
                style={{ width: '100%' }}
              >
                <Flex vertical gap="small">
                  <Text>Your CV has been generated and is ready to view.</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Click "View CV" to open your CV in a new tab or download it.
                  </Text>
                </Flex>
              </Card>
            )}
            <SkillsSection skills={skills} setSkills={setSkills} />
            <ProjectsSection projects={projects} setProjects={setProjects} />
            <EducationSection education={education} setEducation={setEducation} />
            <WorkExperienceSection workExperience={workExperience} setWorkExperience={setWorkExperience} />
          </Flex>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
