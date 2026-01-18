import React, { useState, useEffect } from 'react';
import { Layout, Input, Card, Pagination, Empty, Typography, Flex, Space, Spin, message, Tag, InputNumber, Button, Collapse } from 'antd';
import {
  SearchOutlined,
  EnvironmentOutlined,
  BankOutlined,
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  UserOutlined,
  FilterOutlined,
  CloseOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import JobSeekerNav from '../components/JobSeekerNav';
import { getAllOffers } from '../services/offer.service';
import type { OfferResponse, OfferFilters, EmploymentTypeEnum, ExperienceLevelEnum, WorkModeEnum } from '../types/offer';
import { EmploymentTypeLabels, ExperienceLevelLabels, WorkModeLabels } from '../types/offer';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const formatSalary = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const BrowseJobs: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Applied filters (what's currently being used for the API call)
  const [appliedFilters, setAppliedFilters] = useState<OfferFilters>({});

  // Pending filter states (what user is currently editing)
  const [searchName, setSearchName] = useState('');
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<ExperienceLevelEnum[]>([]);
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<EmploymentTypeEnum[]>([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState<WorkModeEnum[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState<number | undefined>(undefined);
  const [salaryMax, setSalaryMax] = useState<number | undefined>(undefined);

  const fetchOffers = async (page: number, filters: OfferFilters) => {
    try {
      setLoading(true);
      const response = await getAllOffers(page, itemsPerPage, filters);

      if (response.data) {
        setOffers(response.data.data);
        setTotalCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      message.error('Failed to load job offers');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(currentPage, appliedFilters);
  }, [currentPage, appliedFilters]);

  const handleSearch = () => {
    const newFilters: OfferFilters = {
      ...appliedFilters,
      name: searchName || undefined
    };
    setAppliedFilters(newFilters);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    const newFilters: OfferFilters = {
      name: appliedFilters.name, // Keep the search name from applied filters
      experienceLevels: selectedExperienceLevels.length > 0 ? selectedExperienceLevels : undefined,
      employmentTypes: selectedEmploymentTypes.length > 0 ? selectedEmploymentTypes : undefined,
      workModes: selectedWorkModes.length > 0 ? selectedWorkModes : undefined,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      salaryBottom: salaryMin,
      salaryTop: salaryMax
    };
    setAppliedFilters(newFilters);
    setCurrentPage(1);
  };

  const handleExperienceLevelChange = (level: ExperienceLevelEnum, checked: boolean) => {
    if (checked) {
      setSelectedExperienceLevels([...selectedExperienceLevels, level]);
    } else {
      setSelectedExperienceLevels(selectedExperienceLevels.filter(l => l !== level));
    }
  };

  const handleEmploymentTypeChange = (type: EmploymentTypeEnum, checked: boolean) => {
    if (checked) {
      setSelectedEmploymentTypes([...selectedEmploymentTypes, type]);
    } else {
      setSelectedEmploymentTypes(selectedEmploymentTypes.filter(t => t !== type));
    }
  };

  const handleWorkModeChange = (mode: WorkModeEnum, checked: boolean) => {
    if (checked) {
      setSelectedWorkModes([...selectedWorkModes, mode]);
    } else {
      setSelectedWorkModes(selectedWorkModes.filter(m => m !== mode));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills([...selectedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleClearFilters = () => {
    setSelectedExperienceLevels([]);
    setSelectedEmploymentTypes([]);
    setSelectedWorkModes([]);
    setSelectedSkills([]);
    setSalaryMin(undefined);
    setSalaryMax(undefined);
    // Also clear applied filters (except search name)
    setAppliedFilters({ name: appliedFilters.name });
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchName('');
    setAppliedFilters({ ...appliedFilters, name: undefined });
    setCurrentPage(1);
  };

  // Check if there are pending filter changes
  const hasPendingFilterChanges =
    JSON.stringify(selectedExperienceLevels) !== JSON.stringify(appliedFilters.experienceLevels || []) ||
    JSON.stringify(selectedEmploymentTypes) !== JSON.stringify(appliedFilters.employmentTypes || []) ||
    JSON.stringify(selectedWorkModes) !== JSON.stringify(appliedFilters.workModes || []) ||
    JSON.stringify(selectedSkills) !== JSON.stringify(appliedFilters.skills || []) ||
    salaryMin !== appliedFilters.salaryBottom ||
    salaryMax !== appliedFilters.salaryTop;

  const hasActiveFilters = appliedFilters.name || (appliedFilters.experienceLevels && appliedFilters.experienceLevels.length > 0) ||
    (appliedFilters.employmentTypes && appliedFilters.employmentTypes.length > 0) ||
    (appliedFilters.workModes && appliedFilters.workModes.length > 0) ||
    (appliedFilters.skills && appliedFilters.skills.length > 0) ||
    appliedFilters.salaryBottom !== undefined || appliedFilters.salaryTop !== undefined;

  const hasPendingFiltersSet = selectedExperienceLevels.length > 0 ||
    selectedEmploymentTypes.length > 0 || selectedWorkModes.length > 0 ||
    selectedSkills.length > 0 || salaryMin !== undefined || salaryMax !== undefined;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

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
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 40, paddingBottom: 32, width: '60%' }}>
          <Title level={3} style={{ marginBottom: 24, fontWeight: 500 }}>
            Browse Job Opportunities
          </Title>

          {/* Search Input */}
          <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
            <Input
              size="large"
              placeholder="Search jobs by title..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
              onClear={handleClearSearch}
              style={{
                borderRadius: '8px 0 0 8px',
                border: '1px solid #e0e0e0',
              }}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{
                borderRadius: '0 8px 8px 0',
                height: 40
              }}
            >
              Search
            </Button>
          </Space.Compact>

          {/* Filters Panel */}
          <Card
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: 12,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
            styles={{ body: { padding: 0 } }}
          >
            <Collapse
              ghost
              defaultActiveKey={[]}
              expandIconPosition="end"
              items={[
                {
                  key: 'filters',
                  label: (
                    <Flex align="center" gap={12} style={{ padding: '4px 0' }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FilterOutlined style={{ color: '#fff', fontSize: 16 }} />
                      </div>
                      <div>
                        <Text strong style={{ fontSize: 15 }}>Filters</Text>
                        {hasActiveFilters && (
                          <Tag color="blue" style={{ marginLeft: 10, borderRadius: 10 }}>
                            Active
                          </Tag>
                        )}
                      </div>
                    </Flex>
                  ),
                  children: (
                    <div style={{ padding: '8px 16px 20px 16px' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 24
                      }}>
                        {/* Experience Level */}
                        <div style={{
                          background: '#fafafa',
                          borderRadius: 10,
                          padding: 16,
                          border: '1px solid #f0f0f0'
                        }}>
                          <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
                            <UserOutlined style={{ color: '#722ed1', fontSize: 14 }} />
                            <Text strong style={{ color: '#333' }}>Experience Level</Text>
                          </Flex>
                          <Space wrap size={8}>
                            {(Object.keys(ExperienceLevelLabels) as ExperienceLevelEnum[]).map((level) => (
                              <Tag
                                key={level}
                                style={{
                                  cursor: 'pointer',
                                  padding: '6px 12px',
                                  borderRadius: 6,
                                  fontSize: 13,
                                  border: selectedExperienceLevels.includes(level) ? '1px solid #722ed1' : '1px solid #d9d9d9',
                                  background: selectedExperienceLevels.includes(level) ? '#f9f0ff' : '#fff',
                                  color: selectedExperienceLevels.includes(level) ? '#722ed1' : '#595959',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleExperienceLevelChange(level, !selectedExperienceLevels.includes(level))}
                              >
                                {ExperienceLevelLabels[level]}
                              </Tag>
                            ))}
                          </Space>
                        </div>

                        {/* Employment Type */}
                        <div style={{
                          background: '#fafafa',
                          borderRadius: 10,
                          padding: 16,
                          border: '1px solid #f0f0f0'
                        }}>
                          <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
                            <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 14 }} />
                            <Text strong style={{ color: '#333' }}>Employment Type</Text>
                          </Flex>
                          <Space wrap size={8}>
                            {(Object.keys(EmploymentTypeLabels) as EmploymentTypeEnum[]).map((type) => (
                              <Tag
                                key={type}
                                style={{
                                  cursor: 'pointer',
                                  padding: '6px 12px',
                                  borderRadius: 6,
                                  fontSize: 13,
                                  border: selectedEmploymentTypes.includes(type) ? '1px solid #1890ff' : '1px solid #d9d9d9',
                                  background: selectedEmploymentTypes.includes(type) ? '#e6f7ff' : '#fff',
                                  color: selectedEmploymentTypes.includes(type) ? '#1890ff' : '#595959',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleEmploymentTypeChange(type, !selectedEmploymentTypes.includes(type))}
                              >
                                {EmploymentTypeLabels[type]}
                              </Tag>
                            ))}
                          </Space>
                        </div>

                        {/* Work Mode */}
                        <div style={{
                          background: '#fafafa',
                          borderRadius: 10,
                          padding: 16,
                          border: '1px solid #f0f0f0'
                        }}>
                          <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
                            <LaptopOutlined style={{ color: '#13c2c2', fontSize: 14 }} />
                            <Text strong style={{ color: '#333' }}>Work Mode</Text>
                          </Flex>
                          <Space wrap size={8}>
                            {(Object.keys(WorkModeLabels) as WorkModeEnum[]).map((mode) => (
                              <Tag
                                key={mode}
                                style={{
                                  cursor: 'pointer',
                                  padding: '6px 12px',
                                  borderRadius: 6,
                                  fontSize: 13,
                                  border: selectedWorkModes.includes(mode) ? '1px solid #13c2c2' : '1px solid #d9d9d9',
                                  background: selectedWorkModes.includes(mode) ? '#e6fffb' : '#fff',
                                  color: selectedWorkModes.includes(mode) ? '#13c2c2' : '#595959',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleWorkModeChange(mode, !selectedWorkModes.includes(mode))}
                              >
                                {WorkModeLabels[mode]}
                              </Tag>
                            ))}
                          </Space>
                        </div>

                        {/* Salary Range */}
                        <div style={{
                          background: '#fafafa',
                          borderRadius: 10,
                          padding: 16,
                          border: '1px solid #f0f0f0'
                        }}>
                          <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
                            <DollarOutlined style={{ color: '#52c41a', fontSize: 14 }} />
                            <Text strong style={{ color: '#333' }}>Salary Range (USD)</Text>
                          </Flex>
                          <Flex gap={12} align="center">
                            <InputNumber
                              placeholder="Min"
                              value={salaryMin}
                              onChange={(value) => { setSalaryMin(value ?? undefined); setCurrentPage(1); }}
                              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, '') || 0) as 0}
                              style={{ width: 130, borderRadius: 6 }}
                            />
                            <Text type="secondary">to</Text>
                            <InputNumber
                              placeholder="Max"
                              value={salaryMax}
                              onChange={(value) => { setSalaryMax(value ?? undefined); setCurrentPage(1); }}
                              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, '') || 0) as 0}
                              style={{ width: 130, borderRadius: 6 }}
                            />
                          </Flex>
                        </div>
                      </div>

                      {/* Skills - Full Width */}
                      <div style={{
                        background: '#fafafa',
                        borderRadius: 10,
                        padding: 16,
                        border: '1px solid #f0f0f0',
                        marginTop: 24
                      }}>
                        <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
                          <SearchOutlined style={{ color: '#fa8c16', fontSize: 14 }} />
                          <Text strong style={{ color: '#333' }}>Skills</Text>
                        </Flex>
                        <Flex gap={12} wrap="wrap" align="center">
                          <Space.Compact>
                            <Input
                              placeholder="Type a skill and press Enter..."
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onPressEnter={handleAddSkill}
                              style={{ width: 280, borderRadius: '6px 0 0 6px' }}
                            />
                            <Button
                              onClick={handleAddSkill}
                              style={{ borderRadius: '0 6px 6px 0' }}
                            >
                              Add
                            </Button>
                          </Space.Compact>
                          {selectedSkills.length > 0 && (
                            <Flex gap={8} wrap="wrap" style={{ marginLeft: 8 }}>
                              {selectedSkills.map((skill) => (
                                <Tag
                                  key={skill}
                                  closable
                                  onClose={() => handleRemoveSkill(skill)}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: 6,
                                    background: '#fff7e6',
                                    border: '1px solid #ffd591',
                                    color: '#d46b08'
                                  }}
                                >
                                  {skill}
                                </Tag>
                              ))}
                            </Flex>
                          )}
                        </Flex>
                      </div>

                      {/* Filter Action Buttons */}
                      <Flex justify="flex-end" gap={12} style={{ marginTop: 20 }}>
                        {(hasPendingFiltersSet || hasActiveFilters) && (
                          <Button
                            icon={<CloseOutlined />}
                            onClick={handleClearFilters}
                            style={{
                              borderRadius: 8,
                              height: 38,
                              paddingLeft: 16,
                              paddingRight: 16
                            }}
                          >
                            Clear Filters
                          </Button>
                        )}
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={handleApplyFilters}
                          disabled={!hasPendingFilterChanges && !hasPendingFiltersSet}
                          style={{
                            borderRadius: 8,
                            height: 38,
                            paddingLeft: 16,
                            paddingRight: 16,
                            background: hasPendingFilterChanges ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined
                          }}
                        >
                          Apply Filters
                        </Button>
                      </Flex>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 48, width: '60%' }}>
          {offers.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {offers.map((offer) => (
                  <Card
                    key={offer.offerId}
                    hoverable
                    onClick={() => handleJobClick(offer.offerId)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 8,
                      border: '1px solid #e0e0e0',
                      boxShadow: 'none',
                      width: '100%',
                      transition: 'all 0.3s ease'
                    }}
                    styles={{
                      body: { padding: '24px' }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Flex justify="space-between" align="start" style={{ marginBottom: 12 }}>
                      <Title level={5} style={{ marginBottom: 0, marginTop: 0, fontWeight: 500 }}>
                        {offer.name}
                      </Title>
                      {offer.isSalaryDisclosed && (
                        <Tag icon={<DollarOutlined />} color="green" style={{ marginLeft: 12 }}>
                          {formatSalary(offer.salaryBottom)} - {formatSalary(offer.salaryTop)}
                        </Tag>
                      )}
                    </Flex>

                    <Space size={24} wrap style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        <BankOutlined style={{ marginRight: 6 }} />
                        {offer.firm.name}
                      </Text>
                      {offer.firm.location && (
                        <Text style={{ fontSize: 14, color: '#666' }}>
                          <EnvironmentOutlined style={{ marginRight: 6 }} />
                          {offer.firm.location}
                        </Text>
                      )}
                    </Space>

                    {/* Job Info Tags */}
                    <div style={{ marginBottom: 12 }}>
                      <Space size={6} wrap>
                        <Tag icon={<ClockCircleOutlined />} color="blue">
                          {EmploymentTypeLabels[offer.employmentType]}
                        </Tag>
                        <Tag icon={<UserOutlined />} color="purple">
                          {ExperienceLevelLabels[offer.experienceLevel]}
                        </Tag>
                        <Tag icon={<LaptopOutlined />} color="cyan">
                          {WorkModeLabels[offer.workMode]}
                        </Tag>
                      </Space>
                    </div>

                    {/* Skills */}
                    {offer.skills && offer.skills.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <Space size={4} wrap>
                          {offer.skills.slice(0, 5).map((skill, index) => (
                            <Tag key={index} style={{ borderRadius: 4, fontSize: 12 }}>
                              {skill}
                            </Tag>
                          ))}
                          {offer.skills.length > 5 && (
                            <Tag style={{ borderRadius: 4, fontSize: 12, background: '#f5f5f5' }}>
                              +{offer.skills.length - 5} more
                            </Tag>
                          )}
                        </Space>
                      </div>
                    )}

                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{
                        marginBottom: 0,
                        color: '#666',
                        fontSize: 14,
                        lineHeight: 1.6
                      }}
                    >
                      {offer.description}
                    </Paragraph>
                  </Card>
                ))}
              </div>

              {totalCount > itemsPerPage && (
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                  <Pagination
                    current={currentPage}
                    total={totalCount}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} jobs`}
                  />
                </div>
              )}
            </>
          ) : (
            <Card
              style={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: 'none'
              }}
            >
              <Empty
                image={<FileTextOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
                description={
                  <div>
                    <div>No job offers found</div>
                    {hasActiveFilters && (
                      <Text type="secondary" style={{ fontSize: 14, display: 'block', marginTop: 8 }}>
                        Try adjusting your search criteria or filters
                      </Text>
                    )}
                  </div>
                }
              />
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default BrowseJobs;
