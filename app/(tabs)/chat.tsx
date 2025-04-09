import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MessageCircle, Plus, Search } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import PulsingStatusRing from '../../components/PulsingStatusRing';

// Mock data
const mockStatus = [
  { id: '1', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', name: 'Your Story', time: 'Tap to add' },
  { id: '2', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'Sarah', time: '2m ago' },
  { id: '3', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'Mike', time: '5m ago' },
  { id: '4', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', name: 'Jessica', time: '15m ago' },
];

const mockChats = [
  { id: '1', name: 'Gaming Squad', lastMessage: 'When are we playing next?', time: '2m ago', unread: 3 },
  { id: '2', name: 'Alice Smith', lastMessage: 'See you tomorrow!', time: '1h ago', unread: 0 },
  { id: '3', name: 'Work Group', lastMessage: 'Meeting at 3 PM', time: '2h ago', unread: 5 },
];

export default function ChatScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const handleStatusUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Selected image:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleNewChat = () => {
    setIsModalVisible(true);
  };

  const handleCreateGroup = () => {
    router.push('/chat-room/new-group');
    setIsModalVisible(false);
  };

  const handleNewContact = () => {
    router.push('/chat-room/new-contact');
    setIsModalVisible(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <MessageCircle color="#FF3B30" size={28} />
        <Text style={styles.headerTitle}>Chat</Text>
      </View>
      <Pressable style={styles.addButton} onPress={handleNewChat}>
        <Plus color="#FF3B30" size={24} />
      </Pressable>
    </View>
  );

  const renderStories = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
      contentContainerStyle={styles.storiesContent}
    >
      {mockStatus.map((status, index) => (
        <Pressable 
          key={status.id} 
          style={styles.statusItem}
          onPress={index === 0 ? handleStatusUpload : undefined}
        >
          <View style={styles.statusContainer}>
            <Image source={{ uri: status.avatar }} style={styles.statusImage} />
            {index === 0 && (
              <View style={styles.plusIconContainer}>
                <Plus color="#fff" size={14} />
              </View>
            )}
            <PulsingStatusRing size={68} />
          </View>
          <Text style={styles.statusUsername}>{status.name}</Text>
          <Text style={styles.statusTime}>{status.time}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  const renderChatList = () => (
    <ScrollView style={styles.chatList}>
      {mockChats.map(chat => (
        <Pressable 
          key={chat.id} 
          style={styles.chatItem}
          onPress={() => router.push(`/chat-room/${chat.id}`)}
        >
          <View style={styles.chatAvatar}>
            <Text style={styles.avatarText}>{chat.name[0]}</Text>
          </View>
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName}>{chat.name}</Text>
              <Text style={styles.chatTime}>{chat.time}</Text>
            </View>
            <View style={styles.chatFooter}>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {chat.lastMessage}
              </Text>
              {chat.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{chat.unread}</Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.gradient}>
        {renderHeader()}
        {renderStories()}
        <View style={styles.searchContainer}>
          <Search color="#666" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            placeholderTextColor="#666"
          />
        </View>
        {renderChatList()}
      </LinearGradient>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Chat</Text>
            <Pressable style={styles.modalOption} onPress={handleNewContact}>
              <Text style={styles.modalOptionText}>New Contact</Text>
            </Pressable>
            <Pressable style={styles.modalOption} onPress={handleCreateGroup}>
              <Text style={styles.modalOptionText}>Create Group</Text>
            </Pressable>
            <Pressable 
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storiesContainer: {
    maxHeight: 98,
  },
  storiesContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  statusItem: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  statusContainer: {
    position: 'relative',
    width: 68,
    height: 68,
    marginBottom: 8,
  },
  statusImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
    position: 'absolute',
    top: 3,
    left: 3,
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    zIndex: 2,
  },
  statusUsername: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  statusTime: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatTime: {
    color: '#666',
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMessage: {
    color: '#888',
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    backgroundColor: '#3d3d3d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 16,
  },
  modalCloseText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});





