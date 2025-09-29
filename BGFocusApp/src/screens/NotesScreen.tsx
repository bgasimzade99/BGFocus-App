import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { Note } from '../types';

interface NotesScreenProps {
  navigation: any;
}

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes',
    content: 'Discuss project timeline and deliverables for Q4',
    type: 'text',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['work', 'meeting'],
    isOrganized: true,
    category: 'Work',
  },
  {
    id: '2',
    title: 'Voice Note',
    content: 'Remember to call the client about the proposal',
    type: 'voice',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['urgent', 'client'],
    isOrganized: false,
    category: 'Personal',
  },
  {
    id: '3',
    title: 'Ideas for App',
    content: 'Add dark mode, improve animations, better onboarding',
    type: 'text',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['ideas', 'app'],
    isOrganized: true,
    category: 'Development',
  },
];

export const NotesScreen: React.FC<NotesScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Work', 'Personal', 'Development', 'Ideas'];

  const getFilteredNotes = () => {
    if (selectedCategory === 'All') return notes;
    return notes.filter(note => note.category === selectedCategory);
  };

  const addNewNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        type: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        isOrganized: false,
        category: 'Personal',
      };
      setNotes(prevNotes => [newNote, ...prevNotes]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowAddNote(false);
    }
  };

  const organizeNotes = () => {
    // Simulate AI organization
    setNotes(prevNotes =>
      prevNotes.map(note => ({
        ...note,
        isOrganized: true,
        category: note.category || 'Personal',
      }))
    );
  };

  const renderNote = ({ item: note }: { item: Note }) => (
    <TouchableOpacity
      style={[styles.noteItem, { backgroundColor: colors.glass }]}
    >
      <View style={styles.noteHeader}>
        <View style={styles.noteTitleContainer}>
          <Ionicons 
            name={note.type === 'voice' ? 'mic' : 'document-text'} 
            size={20} 
            color={colors.primary} 
            style={styles.noteIcon}
          />
          <Text style={[styles.noteTitle, { color: colors.text }]}>{note.title}</Text>
        </View>
        {note.isOrganized && (
          <View style={[styles.organizedBadge, { backgroundColor: `${colors.success}20` }]}>
            <Ionicons name="checkmark-circle" size={12} color={colors.success} />
            <Text style={[styles.organizedText, { color: colors.success }]}>AI</Text>
          </View>
        )}
      </View>
      
      <Text style={[styles.noteContent, { color: colors.textSecondary }]} numberOfLines={3}>
        {note.content}
      </Text>
      
      <View style={styles.noteMeta}>
        <View style={[styles.categoryBadge, { backgroundColor: colors.border }]}>
          <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
            {note.category}
          </Text>
        </View>
        <Text style={[styles.noteDate, { color: colors.textSecondary }]}>
          {note.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No notes found</Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        Add your first note to get started!
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddNote(!showAddNote)}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Add Note Input */}
      {showAddNote && (
        <GlassCard style={styles.addNoteCard}>
          <TextInput
            style={[styles.noteInput, { color: colors.text, borderBottomColor: colors.border }]}
            placeholder="Note title..."
            placeholderTextColor={colors.textSecondary}
            value={newNoteTitle}
            onChangeText={setNewNoteTitle}
            autoFocus
          />
          <TextInput
            style={[styles.noteInput, { color: colors.text, borderBottomColor: colors.border }]}
            placeholder="Note content..."
            placeholderTextColor={colors.textSecondary}
            value={newNoteContent}
            onChangeText={setNewNoteContent}
            multiline
          />
          <View style={styles.addNoteActions}>
            <AnimatedButton
              title="Cancel"
              onPress={() => setShowAddNote(false)}
              variant="ghost"
              size="small"
            />
            <AnimatedButton
              title="Add Note"
              onPress={addNewNote}
              variant="primary"
              size="small"
            />
          </View>
        </GlassCard>
      )}

      {/* AI Organize Button */}
      <View style={styles.organizeContainer}>
        <AnimatedButton
          title="Organize Notes with AI"
          onPress={organizeNotes}
          variant="accent"
          icon="sparkles"
          iconPosition="left"
          size="medium"
        />
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { backgroundColor: colors.glass },
              selectedCategory === category && { backgroundColor: `${colors.primary}20` },
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              { color: colors.textSecondary },
              selectedCategory === category && { color: colors.primary, fontWeight: FONT_WEIGHTS.semiBold },
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notes List */}
      <FlatList
        data={getFilteredNotes()}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        style={styles.notesList}
        contentContainerStyle={styles.notesContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  addButton: {
    padding: SPACING.sm,
  },
  addNoteCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  noteInput: {
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    marginBottom: SPACING.md,
  },
  addNoteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  organizeContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  categoryContainer: {
    marginBottom: SPACING.md,
  },
  categoryContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  categoryButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonText: {
    fontSize: FONT_SIZES.sm,
  },
  notesList: {
    flex: 1,
  },
  notesContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  noteItem: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  noteTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteIcon: {
    marginRight: SPACING.sm,
  },
  noteTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    flex: 1,
  },
  organizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  organizedText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginLeft: 2,
  },
  noteContent: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.medium,
  },
  noteDate: {
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
