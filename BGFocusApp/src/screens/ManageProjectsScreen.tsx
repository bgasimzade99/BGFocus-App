import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';

interface ManageProjectsScreenProps {
  navigation: {
    goBack: () => void;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  dueDate: string;
  teamSize: number;
  color: string;
  createdAt: string;
}

export const ManageProjectsScreen: React.FC<ManageProjectsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'on-hold' | 'planning'>('all');
  
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'BGFocus Mobile App',
      description: 'AI-powered productivity and focus management application',
      status: 'active',
      priority: 'high',
      progress: 75,
      dueDate: '2024-12-15',
      teamSize: 8,
      color: '#6366F1',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Analytics Dashboard',
      description: 'Real-time analytics and reporting system',
      status: 'active',
      priority: 'medium',
      progress: 45,
      dueDate: '2024-11-30',
      teamSize: 5,
      color: '#10B981',
      createdAt: '2024-02-01',
    },
    {
      id: '3',
      name: 'User Authentication',
      description: 'Secure authentication and authorization system',
      status: 'completed',
      priority: 'high',
      progress: 100,
      dueDate: '2024-09-15',
      teamSize: 3,
      color: '#EC4899',
      createdAt: '2024-01-01',
    },
    {
      id: '4',
      name: 'API Integration',
      description: 'Third-party API integrations and webhooks',
      status: 'planning',
      priority: 'medium',
      progress: 15,
      dueDate: '2024-12-30',
      teamSize: 4,
      color: '#F59E0B',
      createdAt: '2024-03-01',
    },
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    dueDate: '',
    teamSize: 1,
  });

  const statusColors = {
    active: '#10B981',
    completed: '#6366F1',
    'on-hold': '#F59E0B',
    planning: '#8B5CF6',
  };

  const priorityColors = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      Alert.alert('Error', 'Project name is required');
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      ...newProject,
      progress: 0,
      color: '#6366F1',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      dueDate: '',
      teamSize: 1,
    });
    setShowCreateModal(false);
    Alert.alert('Success', 'Project created successfully!');
  };

  const handleDeleteProject = (projectId: string) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProjects(projects.filter(p => p.id !== projectId));
            Alert.alert('Success', 'Project deleted successfully!');
          },
        },
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'play-circle';
      case 'completed': return 'checkmark-circle';
      case 'on-hold': return 'pause-circle';
      case 'planning': return 'time';
      default: return 'folder';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'arrow-up';
      case 'medium': return 'remove';
      case 'low': return 'arrow-down';
      default: return 'remove';
    }
  };

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.backButtonGradient}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Projects</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Organize your work</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setShowCreateModal(true)} 
          style={styles.addButton}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Project Statistics */}
        <GlassCard style={styles.statsCard} neumorphism glow>
          <View style={styles.statsHeader}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.statsIconGradient}
            >
              <Ionicons name="analytics" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.statsContent}>
              <Text style={[styles.statsTitle, { color: colors.text }]}>Project Overview</Text>
              <Text style={[styles.statsSubtitle, { color: colors.textSecondary }]}>
                {projects.length} total projects
              </Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>
                {projects.filter(p => p.status === 'active').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#6366F1' }]}>
                {projects.filter(p => p.status === 'completed').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                {projects.filter(p => p.status === 'on-hold').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>On Hold</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#8B5CF6' }]}>
                {projects.filter(p => p.status === 'planning').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Planning</Text>
            </View>
          </View>
        </GlassCard>

        {/* Search and Filter */}
        <GlassCard style={styles.filterCard} neumorphism>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search projects..."
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {(['all', 'active', 'completed', 'on-hold', 'planning'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filterStatus === status && styles.filterButtonActive
                ]}
                onPress={() => setFilterStatus(status)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterButtonText,
                  { color: filterStatus === status ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </GlassCard>

        {/* Projects List */}
        <View style={styles.projectsList}>
          {filteredProjects.map((project) => (
            <GlassCard key={project.id} style={styles.projectCard} neumorphism>
              <TouchableOpacity
                style={styles.projectContent}
                onPress={() => setSelectedProject(project)}
                activeOpacity={0.7}
              >
                <View style={styles.projectHeader}>
                  <View style={styles.projectLeft}>
                    <LinearGradient
                      colors={[project.color, `${project.color}CC`]}
                      style={styles.projectIconGradient}
                    >
                      <Ionicons name="folder" size={20} color="#FFFFFF" />
                    </LinearGradient>
                    <View style={styles.projectInfo}>
                      <Text style={[styles.projectName, { color: colors.text }]}>{project.name}</Text>
                      <Text style={[styles.projectDescription, { color: colors.textSecondary }]}>
                        {project.description}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteProject(project.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.projectMeta}>
                  <View style={styles.projectStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors[project.status] }]}>
                      <Ionicons name={getStatusIcon(project.status) as any} size={12} color="#FFFFFF" />
                      <Text style={styles.statusText}>{project.status}</Text>
                    </View>
                    <View style={[styles.priorityBadge, { backgroundColor: priorityColors[project.priority] }]}>
                      <Ionicons name={getPriorityIcon(project.priority) as any} size={12} color="#FFFFFF" />
                      <Text style={styles.priorityText}>{project.priority}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.projectProgress}>
                    <View style={styles.progressHeader}>
                      <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Progress</Text>
                      <Text style={[styles.progressValue, { color: colors.text }]}>{project.progress}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={[project.color, `${project.color}CC`]}
                        style={[styles.progressFill, { width: `${project.progress}%` }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.projectFooter}>
                  <View style={styles.projectDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="people" size={14} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {project.teamSize} members
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        Due {new Date(project.dueDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            </GlassCard>
          ))}
        </View>
      </ScrollView>

      {/* Create Project Modal */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Project</Text>
              <TouchableOpacity 
                onPress={() => setShowCreateModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Project Name</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newProject.name}
                  onChangeText={(text) => setNewProject({...newProject, name: text})}
                  placeholder="Enter project name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { color: colors.text }]}
                  value={newProject.description}
                  onChangeText={(text) => setNewProject({...newProject, description: text})}
                  placeholder="Enter project description"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Priority</Text>
                <View style={styles.prioritySelector}>
                  {(['high', 'medium', 'low'] as const).map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityOption,
                        newProject.priority === priority && styles.priorityOptionSelected
                      ]}
                      onPress={() => setNewProject({...newProject, priority})}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        { color: newProject.priority === priority ? '#FFFFFF' : colors.text }
                      ]}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Due Date</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newProject.dueDate}
                  onChangeText={(text) => setNewProject({...newProject, dueDate: text})}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Team Size</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newProject.teamSize.toString()}
                  onChangeText={(text) => setNewProject({...newProject, teamSize: parseInt(text) || 1})}
                  placeholder="Number of team members"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <AnimatedButton
                title="Cancel"
                onPress={() => setShowCreateModal(false)}
                variant="ghost"
                style={styles.modalButton}
              />
              <AnimatedButton
                title="Create Project"
                onPress={handleCreateProject}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: SPACING.md,
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: 2,
    opacity: 0.8,
  },
  addButton: {
    marginLeft: SPACING.md,
  },
  addButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  statsCard: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statsIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statsContent: {
    flex: 1,
  },
  statsTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterCard: {
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    marginBottom: SPACING.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  filterScroll: {
    marginTop: SPACING.sm,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  projectsList: {
    marginBottom: SPACING.xl,
  },
  projectCard: {
    marginBottom: SPACING.md,
  },
  projectContent: {
    padding: SPACING.lg,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  projectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    opacity: 0.7,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  projectMeta: {
    marginBottom: SPACING.md,
  },
  projectStatus: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  projectProgress: {
    marginBottom: SPACING.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  progressValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  projectFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectDetails: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 20,
    padding: SPACING.lg,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  modalCloseButton: {
    padding: SPACING.sm,
  },
  modalForm: {
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  priorityOptionSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  priorityOptionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
  },
});
