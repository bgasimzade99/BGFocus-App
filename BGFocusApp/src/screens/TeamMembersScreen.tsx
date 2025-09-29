import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';

interface TeamMembersScreenProps {
  navigation: {
    goBack: () => void;
  };
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  avatar: string;
  skills: string[];
  projects: number;
  tasksCompleted: number;
  joinDate: string;
  performance: number;
}

export const TeamMembersScreen: React.FC<TeamMembersScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<'all' | 'development' | 'design' | 'marketing' | 'management'>('all');
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@bgfocus.com',
      role: 'Senior Developer',
      department: 'development',
      status: 'online',
      avatar: '👩‍💻',
      skills: ['React Native', 'TypeScript', 'Node.js'],
      projects: 5,
      tasksCompleted: 127,
      joinDate: '2023-01-15',
      performance: 95,
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@bgfocus.com',
      role: 'UI/UX Designer',
      department: 'design',
      status: 'busy',
      avatar: '👨‍🎨',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      projects: 3,
      tasksCompleted: 89,
      joinDate: '2023-03-01',
      performance: 88,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@bgfocus.com',
      role: 'Product Manager',
      department: 'management',
      status: 'online',
      avatar: '👩‍💼',
      skills: ['Agile', 'Scrum', 'Product Strategy'],
      projects: 8,
      tasksCompleted: 156,
      joinDate: '2022-11-20',
      performance: 92,
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@bgfocus.com',
      role: 'Marketing Specialist',
      department: 'marketing',
      status: 'away',
      avatar: '👨‍💼',
      skills: ['Digital Marketing', 'Analytics', 'Content Creation'],
      projects: 4,
      tasksCompleted: 73,
      joinDate: '2023-06-10',
      performance: 85,
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa.wang@bgfocus.com',
      role: 'Frontend Developer',
      department: 'development',
      status: 'offline',
      avatar: '👩‍💻',
      skills: ['React', 'JavaScript', 'CSS'],
      projects: 6,
      tasksCompleted: 98,
      joinDate: '2023-02-28',
      performance: 90,
    },
  ]);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    department: 'development' as const,
    skills: '',
  });

  const departmentColors = {
    development: '#6366F1',
    design: '#EC4899',
    marketing: '#10B981',
    management: '#F59E0B',
  };

  const statusColors = {
    online: '#10B981',
    offline: '#6B7280',
    busy: '#EF4444',
    away: '#F59E0B',
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterDepartment === 'all' || member.department === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim() || !newMember.role.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      ...newMember,
      status: 'offline',
      avatar: '👤',
      skills: newMember.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      projects: 0,
      tasksCompleted: 0,
      joinDate: new Date().toISOString().split('T')[0],
      performance: 0,
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({
      name: '',
      email: '',
      role: '',
      department: 'development',
      skills: '',
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Team member added successfully!');
  };

  const handleRemoveMember = (memberId: string) => {
    Alert.alert(
      'Remove Team Member',
      'Are you sure you want to remove this team member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setTeamMembers(teamMembers.filter(m => m.id !== memberId));
            Alert.alert('Success', 'Team member removed successfully!');
          },
        },
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return 'radio-button-on';
      case 'offline': return 'radio-button-off';
      case 'busy': return 'pause-circle';
      case 'away': return 'time';
      default: return 'radio-button-off';
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'development': return 'code-slash';
      case 'design': return 'color-palette';
      case 'marketing': return 'megaphone';
      case 'management': return 'people';
      default: return 'person';
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Team Members</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Collaborate effectively</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setShowAddModal(true)} 
          style={styles.addButton}
        >
          <LinearGradient
            colors={['#EC4899', '#DB2777']}
            style={styles.addButtonGradient}
          >
            <Ionicons name="person-add" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Team Statistics */}
        <GlassCard style={styles.statsCard} neumorphism glow>
          <View style={styles.statsHeader}>
            <LinearGradient
              colors={['#EC4899', '#DB2777']}
              style={styles.statsIconGradient}
            >
              <Ionicons name="people" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.statsContent}>
              <Text style={[styles.statsTitle, { color: colors.text }]}>Team Overview</Text>
              <Text style={[styles.statsSubtitle, { color: colors.textSecondary }]}>
                {teamMembers.length} team members
              </Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>
                {teamMembers.filter(m => m.status === 'online').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Online</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#6366F1' }]}>
                {teamMembers.filter(m => m.department === 'development').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Dev</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#EC4899' }]}>
                {teamMembers.filter(m => m.department === 'design').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Design</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                {teamMembers.filter(m => m.department === 'management').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Mgmt</Text>
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
                placeholder="Search team members..."
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {(['all', 'development', 'design', 'marketing', 'management'] as const).map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.filterButton,
                  filterDepartment === dept && styles.filterButtonActive
                ]}
                onPress={() => setFilterDepartment(dept)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterButtonText,
                  { color: filterDepartment === dept ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {dept === 'all' ? 'All' : dept.charAt(0).toUpperCase() + dept.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </GlassCard>

        {/* Team Members List */}
        <View style={styles.membersList}>
          {filteredMembers.map((member) => (
            <GlassCard key={member.id} style={styles.memberCard} neumorphism>
              <TouchableOpacity
                style={styles.memberContent}
                onPress={() => setSelectedMember(member)}
                activeOpacity={0.7}
              >
                <View style={styles.memberHeader}>
                  <View style={styles.memberLeft}>
                    <View style={styles.avatarContainer}>
                      <Text style={styles.avatarText}>{member.avatar}</Text>
                      <View style={[
                        styles.statusIndicator,
                        { backgroundColor: statusColors[member.status] }
                      ]} />
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                      <Text style={[styles.memberRole, { color: colors.textSecondary }]}>{member.role}</Text>
                      <Text style={[styles.memberEmail, { color: colors.textSecondary }]}>{member.email}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveMember(member.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.memberMeta}>
                  <View style={styles.memberStatus}>
                    <View style={[styles.departmentBadge, { backgroundColor: departmentColors[member.department] }]}>
                      <Ionicons name={getDepartmentIcon(member.department) as any} size={12} color="#FFFFFF" />
                      <Text style={styles.departmentText}>{member.department}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors[member.status] }]}>
                      <Ionicons name={getStatusIcon(member.status) as any} size={12} color="#FFFFFF" />
                      <Text style={styles.statusText}>{member.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.performanceSection}>
                    <View style={styles.performanceHeader}>
                      <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Performance</Text>
                      <Text style={[styles.performanceValue, { color: colors.text }]}>{member.performance}%</Text>
                    </View>
                    <View style={styles.performanceBar}>
                      <LinearGradient
                        colors={[departmentColors[member.department], `${departmentColors[member.department]}CC`]}
                        style={[styles.performanceFill, { width: `${member.performance}%` }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.skillsSection}>
                  <Text style={[styles.skillsLabel, { color: colors.textSecondary }]}>Skills</Text>
                  <View style={styles.skillsContainer}>
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {member.skills.length > 3 && (
                      <View style={styles.skillTag}>
                        <Text style={styles.skillText}>+{member.skills.length - 3}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.memberFooter}>
                  <View style={styles.memberStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="folder" size={14} color={colors.textSecondary} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {member.projects} projects
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="checkmark-circle" size={14} color={colors.textSecondary} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {member.tasksCompleted} tasks
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        Joined {new Date(member.joinDate).toLocaleDateString()}
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

      {/* Add Member Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Team Member</Text>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newMember.name}
                  onChangeText={(text) => setNewMember({...newMember, name: text})}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newMember.email}
                  onChangeText={(text) => setNewMember({...newMember, email: text})}
                  placeholder="Enter email address"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Role</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newMember.role}
                  onChangeText={(text) => setNewMember({...newMember, role: text})}
                  placeholder="Enter job role"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Department</Text>
                <View style={styles.departmentSelector}>
                  {(['development', 'design', 'marketing', 'management'] as const).map((dept) => (
                    <TouchableOpacity
                      key={dept}
                      style={[
                        styles.departmentOption,
                        newMember.department === dept && styles.departmentOptionSelected
                      ]}
                      onPress={() => setNewMember({...newMember, department: dept})}
                    >
                      <Text style={[
                        styles.departmentOptionText,
                        { color: newMember.department === dept ? '#FFFFFF' : colors.text }
                      ]}>
                        {dept.charAt(0).toUpperCase() + dept.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Skills (comma-separated)</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { color: colors.text }]}
                  value={newMember.skills}
                  onChangeText={(text) => setNewMember({...newMember, skills: text})}
                  placeholder="React, TypeScript, Node.js"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={2}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <AnimatedButton
                title="Cancel"
                onPress={() => setShowAddModal(false)}
                variant="ghost"
                style={styles.modalButton}
              />
              <AnimatedButton
                title="Add Member"
                onPress={handleAddMember}
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
    shadowColor: '#EC4899',
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
    shadowColor: '#EC4899',
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
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  membersList: {
    marginBottom: SPACING.xl,
  },
  memberCard: {
    marginBottom: SPACING.md,
  },
  memberContent: {
    padding: SPACING.lg,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(20, 20, 20, 0.8)',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 2,
  },
  memberRole: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    opacity: 0.7,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  memberMeta: {
    marginBottom: SPACING.md,
  },
  memberStatus: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  departmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  departmentText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
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
  performanceSection: {
    marginBottom: SPACING.sm,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  performanceLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  performanceValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
  },
  performanceBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  performanceFill: {
    height: '100%',
    borderRadius: 4,
  },
  skillsSection: {
    marginBottom: SPACING.md,
  },
  skillsLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  skillTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  skillText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: '#FFFFFF',
  },
  memberFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberStats: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  statText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    marginLeft: 4,
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
    height: 60,
    textAlignVertical: 'top',
  },
  departmentSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  departmentOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  departmentOptionSelected: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  departmentOptionText: {
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
