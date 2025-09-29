import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';

interface ProjectSettingsScreenProps {
  navigation: any;
}

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}

export const ProjectSettingsScreen: React.FC<ProjectSettingsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Work Projects',
      description: 'Main work-related tasks and projects',
      color: '#6366F1',
      isActive: true,
    },
    {
      id: '2',
      name: 'Personal Development',
      description: 'Learning and self-improvement tasks',
      color: '#EC4899',
      isActive: false,
    },
    {
      id: '3',
      name: 'Side Projects',
      description: 'Creative and experimental projects',
      color: '#10B981',
      isActive: false,
    },
  ]);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const projectColors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const addProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
        color: projectColors[Math.floor(Math.random() * projectColors.length)],
        isActive: false,
      };
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setNewProjectDescription('');
      setShowAddForm(false);
    }
  };

  const deleteProject = (projectId: string) => {
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
          },
        },
      ]
    );
  };

  const toggleProjectActive = (projectId: string) => {
    setProjects(projects.map(p => ({
      ...p,
      isActive: p.id === projectId ? !p.isActive : p.isActive
    })));
  };

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      <PremiumNavbar 
        title="Project Settings"
        showBackButton
        onBackPress={() => navigation.goBack()}
        variant="gradient"
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Projects */}
        <GlassCard style={styles.sectionCard} neumorphism>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Projects</Text>
            <AnimatedButton
              title="Add Project"
              onPress={() => setShowAddForm(!showAddForm)}
              variant="primary"
              size="small"
              icon="add"
            />
          </View>

          {projects.map((project) => (
            <View key={project.id} style={styles.projectItem}>
              <View style={styles.projectLeft}>
                <View style={[styles.projectColorDot, { backgroundColor: project.color }]} />
                <View style={styles.projectContent}>
                  <Text style={[styles.projectName, { color: colors.text }]}>{project.name}</Text>
                  <Text style={[styles.projectDescription, { color: colors.textSecondary }]}>
                    {project.description}
                  </Text>
                </View>
              </View>
              
              <View style={styles.projectActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${colors.primary}20` }]}
                  onPress={() => toggleProjectActive(project.id)}
                >
                  <Ionicons 
                    name={project.isActive ? "pause" : "play"} 
                    size={16} 
                    color={colors.primary} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${colors.error}20` }]}
                  onPress={() => deleteProject(project.id)}
                >
                  <Ionicons name="trash" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Add New Project Form */}
        {showAddForm && (
          <GlassCard style={styles.addFormCard} neumorphism glow>
            <Text style={[styles.formTitle, { color: colors.text }]}>Add New Project</Text>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surfaceElevated,
                color: colors.text,
                borderColor: colors.border,
              }]}
              placeholder="Project name"
              placeholderTextColor={colors.textSecondary}
              value={newProjectName}
              onChangeText={setNewProjectName}
            />
            
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: colors.surfaceElevated,
                color: colors.text,
                borderColor: colors.border,
              }]}
              placeholder="Project description (optional)"
              placeholderTextColor={colors.textSecondary}
              value={newProjectDescription}
              onChangeText={setNewProjectDescription}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.formActions}>
              <AnimatedButton
                title="Cancel"
                onPress={() => setShowAddForm(false)}
                variant="ghost"
                style={styles.formButton}
              />
              <AnimatedButton
                title="Add Project"
                onPress={addProject}
                variant="primary"
                style={styles.formButton}
              />
            </View>
          </GlassCard>
        )}

        {/* Project Statistics */}
        <GlassCard style={styles.statsCard} neumorphism>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Project Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {projects.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Projects</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {projects.filter(p => p.isActive).length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Projects</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.warning }]}>
                {projects.filter(p => !p.isActive).length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Inactive Projects</Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  sectionCard: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  projectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.md,
  },
  projectContent: {
    flex: 1,
  },
  projectName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: FONT_SIZES.sm,
  },
  projectActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFormCard: {
    marginBottom: SPACING.lg,
  },
  formTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  formButton: {
    flex: 1,
  },
  statsCard: {
    marginBottom: SPACING.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
});
