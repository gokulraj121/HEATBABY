import { View, Modal, Text, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { Users, UserPlus, X, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AddChatModalProps {
  visible: boolean;
  onClose: () => void;
  onNewContact: () => void;
  onNewGroup: (data: { name: string; description: string }) => void;
}

export default function AddChatModal({ visible, onClose, onNewContact, onNewGroup }: AddChatModalProps) {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      onNewGroup({
        name: groupName.trim(),
        description: groupDescription.trim()
      });
      setGroupName('');
      setGroupDescription('');
      setIsCreatingGroup(false);
      onClose(); // Add this line to close the modal
    }
  };

  const handleClose = () => {
    setIsCreatingGroup(false);
    setGroupName('');
    setGroupDescription('');
    onClose();
  };

  const handleBack = () => {
    setIsCreatingGroup(false);
    setGroupName('');
    setGroupDescription('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#1a1a1a', '#2d2d2d']}
              style={styles.gradient}
            >
              <View style={styles.modalHeader}>
                {isCreatingGroup ? (
                  <Pressable onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft color="#FF3B30" size={24} />
                  </Pressable>
                ) : (
                  <View style={styles.placeholder} />
                )}
                <Text style={styles.modalTitle}>
                  {isCreatingGroup ? 'Create Group' : 'New Chat'}
                </Text>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                  <X color="#FF3B30" size={24} />
                </Pressable>
              </View>

              {!isCreatingGroup ? (
                <View style={styles.options}>
                  <Pressable 
                    style={styles.option} 
                    onPress={onNewContact}
                  >
                    <View style={styles.iconContainer}>
                      <UserPlus color="#FF3B30" size={24} />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>New Contact</Text>
                      <Text style={styles.optionDescription}>Add a new contact to chat with</Text>
                    </View>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.option} 
                    onPress={() => setIsCreatingGroup(true)}
                  >
                    <View style={styles.iconContainer}>
                      <Users color="#FF3B30" size={24} />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>New Group</Text>
                      <Text style={styles.optionDescription}>Create a group chat with multiple people</Text>
                    </View>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Group Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter group name"
                      placeholderTextColor="#666"
                      value={groupName}
                      onChangeText={setGroupName}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Enter group description (optional)"
                      placeholderTextColor="#666"
                      value={groupDescription}
                      onChangeText={setGroupDescription}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <Pressable 
                    style={[
                      styles.createButton,
                      !groupName.trim() && styles.createButtonDisabled
                    ]} 
                    onPress={handleCreateGroup}
                    disabled={!groupName.trim()}
                  >
                    <Text style={styles.createButtonText}>Create Group</Text>
                  </Pressable>
                </View>
              )}
            </LinearGradient>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  placeholder: {
    width: 24,
  },
  backButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    padding: 5,
  },
  options: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    color: '#888',
    fontSize: 14,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  createButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});



