import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';

interface ProjectFilesScreenProps {
  navigation: {
    goBack: () => void;
  };
}

interface ProjectFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'code' | 'archive' | 'other';
  size: number;
  uploadDate: string;
  uploadedBy: string;
  project: string;
  version: string;
  status: 'active' | 'archived' | 'pending';
  downloadCount: number;
  lastModified: string;
}

export const ProjectFilesScreen: React.FC<ProjectFilesScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'document' | 'image' | 'video' | 'code' | 'archive' | 'other'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  
  const [files, setFiles] = useState<ProjectFile[]>([
    {
      id: '1',
      name: 'BGFocus_App_Design_v2.fig',
      type: 'image',
      size: 2.4,
      uploadDate: '2024-09-15',
      uploadedBy: 'Michael Chen',
      project: 'BGFocus Mobile App',
      version: '2.0',
      status: 'active',
      downloadCount: 45,
      lastModified: '2024-09-15',
    },
    {
      id: '2',
      name: 'User_Authentication_API.md',
      type: 'document',
      size: 0.8,
      uploadDate: '2024-09-14',
      uploadedBy: 'Sarah Johnson',
      project: 'BGFocus Mobile App',
      version: '1.5',
      status: 'active',
      downloadCount: 23,
      lastModified: '2024-09-14',
    },
    {
      id: '3',
      name: 'Analytics_Dashboard_Code.zip',
      type: 'archive',
      size: 15.2,
      uploadDate: '2024-09-13',
      uploadedBy: 'David Kim',
      project: 'Analytics Dashboard',
      version: '1.0',
      status: 'active',
      downloadCount: 12,
      lastModified: '2024-09-13',
    },
    {
      id: '4',
      name: 'Project_Requirements.pdf',
      type: 'document',
      size: 3.1,
      uploadDate: '2024-09-12',
      uploadedBy: 'Emily Rodriguez',
      project: 'BGFocus Mobile App',
      version: '3.0',
      status: 'active',
      downloadCount: 67,
      lastModified: '2024-09-12',
    },
    {
      id: '5',
      name: 'App_Demo_Video.mp4',
      type: 'video',
      size: 45.8,
      uploadDate: '2024-09-11',
      uploadedBy: 'Lisa Wang',
      project: 'BGFocus Mobile App',
      version: '1.0',
      status: 'active',
      downloadCount: 89,
      lastModified: '2024-09-11',
    },
    {
      id: '6',
      name: 'Database_Schema.sql',
      type: 'code',
      size: 0.5,
      uploadDate: '2024-09-10',
      uploadedBy: 'Sarah Johnson',
      project: 'BGFocus Mobile App',
      version: '2.1',
      status: 'active',
      downloadCount: 34,
      lastModified: '2024-09-10',
    },
  ]);

  const [newFile, setNewFile] = useState({
    name: '',
    type: 'document' as const,
    project: 'BGFocus Mobile App',
  });

  const typeColors = {
    document: '#6366F1',
    image: '#EC4899',
    video: '#EF4444',
    code: '#10B981',
    archive: '#F59E0B',
    other: '#6B7280',
  };

  const typeIcons = {
    document: 'document-text',
    image: 'image',
    video: 'videocam',
    code: 'code-slash',
    archive: 'archive',
    other: 'folder',
  };

  const statusColors = {
    active: '#10B981',
    archived: '#6B7280',
    pending: '#F59E0B',
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case 'size':
        return b.size - a.size;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const handleUploadFile = () => {
    if (!newFile.name.trim()) {
      Alert.alert('Error', 'File name is required');
      return;
    }

    const file: ProjectFile = {
      id: Date.now().toString(),
      ...newFile,
      size: Math.random() * 50, // Random size for demo
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      version: '1.0',
      status: 'pending',
      downloadCount: 0,
      lastModified: new Date().toISOString().split('T')[0],
    };

    setFiles([file, ...files]);
    setNewFile({
      name: '',
      type: 'document',
      project: 'BGFocus Mobile App',
    });
    setShowUploadModal(false);
    Alert.alert('Success', 'File uploaded successfully!');
  };

  const handleDeleteFile = (fileId: string) => {
    Alert.alert(
      'Delete File',
      'Are you sure you want to delete this file? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setFiles(files.filter(f => f.id !== fileId));
            Alert.alert('Success', 'File deleted successfully!');
          },
        },
      ]
    );
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const getFileStats = () => {
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const activeFiles = files.filter(f => f.status === 'active').length;
    const totalDownloads = files.reduce((sum, file) => sum + file.downloadCount, 0);
    
    return { totalFiles, totalSize, activeFiles, totalDownloads };
  };

  const stats = getFileStats();

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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Project Files</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Manage documents</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setShowUploadModal(true)} 
          style={styles.uploadButton}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.uploadButtonGradient}
          >
            <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* File Statistics */}
        <GlassCard style={styles.statsCard} neumorphism glow>
          <View style={styles.statsHeader}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.statsIconGradient}
            >
              <Ionicons name="folder" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.statsContent}>
              <Text style={[styles.statsTitle, { color: colors.text }]}>File Overview</Text>
              <Text style={[styles.statsSubtitle, { color: colors.textSecondary }]}>
                {stats.totalFiles} files, {formatFileSize(stats.totalSize)} total
              </Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.activeFiles}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#6366F1' }]}>{stats.totalDownloads}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Downloads</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>{formatFileSize(stats.totalSize)}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Storage</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#EC4899' }]}>{files.filter(f => f.type === 'document').length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Documents</Text>
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
                placeholder="Search files..."
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {(['all', 'document', 'image', 'video', 'code', 'archive', 'other'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterButton,
                    filterType === type && styles.filterButtonActive
                  ]}
                  onPress={() => setFilterType(type)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.filterButtonText,
                    { color: filterType === type ? '#FFFFFF' : colors.textSecondary }
                  ]}>
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={styles.sortButton}>
              <Ionicons name="swap-vertical" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Files List */}
        <View style={styles.filesList}>
          {filteredFiles.map((file) => (
            <GlassCard key={file.id} style={styles.fileCard} neumorphism>
              <TouchableOpacity
                style={styles.fileContent}
                onPress={() => setSelectedFile(file)}
                activeOpacity={0.7}
              >
                <View style={styles.fileHeader}>
                  <View style={styles.fileLeft}>
                    <View style={[styles.fileIconContainer, { backgroundColor: typeColors[file.type] }]}>
                      <Ionicons name={typeIcons[file.type] as any} size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={[styles.fileName, { color: colors.text }]}>{file.name}</Text>
                      <Text style={[styles.fileProject, { color: colors.textSecondary }]}>{file.project}</Text>
                      <Text style={[styles.fileUploader, { color: colors.textSecondary }]}>
                        Uploaded by {file.uploadedBy}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteFile(file.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.fileMeta}>
                  <View style={styles.fileDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="resize" size={14} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {formatFileSize(file.size)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="download" size={14} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {file.downloadCount} downloads
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.fileStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors[file.status] }]}>
                      <Text style={styles.statusText}>{file.status.toUpperCase()}</Text>
                    </View>
                    <Text style={[styles.versionText, { color: colors.textSecondary }]}>
                      v{file.version}
                    </Text>
                  </View>
                </View>

                <View style={styles.fileActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <LinearGradient
                      colors={[typeColors[file.type], `${typeColors[file.type]}CC`]}
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons name="download" size={16} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Download</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons name="share" size={16} color={colors.text} />
                      <Text style={[styles.actionButtonText, { color: colors.text }]}>Share</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons name="eye" size={16} color={colors.text} />
                      <Text style={[styles.actionButtonText, { color: colors.text }]}>Preview</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </GlassCard>
          ))}
        </View>
      </ScrollView>

      {/* Upload File Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Upload File</Text>
              <TouchableOpacity 
                onPress={() => setShowUploadModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>File Name</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newFile.name}
                  onChangeText={(text) => setNewFile({...newFile, name: text})}
                  placeholder="Enter file name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>File Type</Text>
                <View style={styles.typeSelector}>
                  {(['document', 'image', 'video', 'code', 'archive', 'other'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        newFile.type === type && styles.typeOptionSelected
                      ]}
                      onPress={() => setNewFile({...newFile, type})}
                    >
                      <Ionicons 
                        name={typeIcons[type] as any} 
                        size={16} 
                        color={newFile.type === type ? '#FFFFFF' : colors.textSecondary} 
                      />
                      <Text style={[
                        styles.typeOptionText,
                        { color: newFile.type === type ? '#FFFFFF' : colors.text }
                      ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Project</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newFile.project}
                  onChangeText={(text) => setNewFile({...newFile, project: text})}
                  placeholder="Select project"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.uploadArea}>
                <LinearGradient
                  colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                  style={styles.uploadAreaGradient}
                >
                  <Ionicons name="cloud-upload" size={48} color="#10B981" />
                  <Text style={[styles.uploadText, { color: colors.text }]}>Drop files here or click to browse</Text>
                  <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>
                    Supports all file types up to 100MB
                  </Text>
                </LinearGradient>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <AnimatedButton
                title="Cancel"
                onPress={() => setShowUploadModal(false)}
                variant="ghost"
                style={styles.modalButton}
              />
              <AnimatedButton
                title="Upload File"
                onPress={handleUploadFile}
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
  uploadButton: {
    marginLeft: SPACING.md,
  },
  uploadButtonGradient: {
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
    shadowColor: '#10B981',
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterScroll: {
    flex: 1,
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
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  sortButton: {
    padding: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filesList: {
    marginBottom: SPACING.xl,
  },
  fileCard: {
    marginBottom: SPACING.md,
  },
  fileContent: {
    padding: SPACING.lg,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIconContainer: {
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
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 2,
  },
  fileProject: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: 2,
  },
  fileUploader: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    opacity: 0.7,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  fileMeta: {
    marginBottom: SPACING.md,
  },
  fileDetails: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
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
  fileStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  versionText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  fileActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    gap: SPACING.sm,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: '#FFFFFF',
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
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: SPACING.sm,
  },
  typeOptionSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  typeOptionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  uploadArea: {
    marginTop: SPACING.md,
  },
  uploadAreaGradient: {
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: SPACING.sm,
    textAlign: 'center',
    opacity: 0.7,
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
