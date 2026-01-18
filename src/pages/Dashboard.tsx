import React from 'react';
import { Layout, Avatar, Typography, Flex, message, Spin, Card, Tag } from 'antd';
import { UserOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import JobSeekerNav from '../components/JobSeekerNav';
import { SkillsSection } from '../components/SkillsSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { EducationSection } from '../components/EducationSection';
import { WorkExperienceSection } from '../components/WorkExperienceSection';
import CVSection from '../components/CVSection';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApplierProfile } from '../services/applierProfile.service';

const { Content } = Layout;
const { Title } = Typography;

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
  const [applierProfileId, setApplierProfileId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplierProfile = async () => {
      try {
        setLoading(true);
        const response = await getApplierProfile();

        if (response.data) {
          const profile = response.data;

          // Set applier profile ID
          setApplierProfileId(profile.applierProfileId);

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


  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <JobSeekerNav />
        <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <JobSeekerNav />
      <Content style={{ padding: '0 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 40, paddingBottom: 48 }}>
          {/* Profile Header Card */}
          <Card
            style={{
              borderRadius: 12,
              border: '1px solid #e8e8e8',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              marginBottom: 32,
              overflow: 'hidden'
            }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Gradient Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: 24
            }}>
              <Avatar
                size={100}
                icon={<UserOutlined style={{ fontSize: 48 }} />}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1 }}>
                <Title level={2} style={{ margin: 0, marginBottom: 8, color: '#fff', fontWeight: 600 }}>
                  {user?.name ?? "John"} {user?.surname ?? "Doe"}
                </Title>
                <Flex gap={12} wrap="wrap" align="center">
                  <Tag
                    icon={<MailOutlined />}
                    style={{
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#fff',
                      fontSize: 13,
                      padding: '4px 12px'
                    }}
                  >
                    {user?.email}
                  </Tag>
                  <Tag
                    icon={<IdcardOutlined />}
                    style={{
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#fff',
                      fontSize: 13,
                      padding: '4px 12px'
                    }}
                  >
                    Job Seeker
                  </Tag>
                </Flex>
              </div>
            </div>

          </Card>

          {/* Content Sections */}
          <Flex vertical gap={24} style={{ width: '100%' }}>
            <CVSection applierProfileId={applierProfileId} />
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
