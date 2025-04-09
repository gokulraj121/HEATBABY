import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Users } from 'lucide-react-native';
import { useMemo } from 'react';

export default function ChatRoomScreen() {
  const { id, isGroup } = useLocalSearchParams<{ id: string; isGroup: string }>();
  const router = useRouter();
  
  // Mock data - replace with your actual data fetching logic
  const chatData = useMemo(() => {
    // This should be replaced with actual data fetching from your Supabase backend
    return {
      name: isGroup === '1' ? 'Group Chat' : 'User Name',
      participants: isGroup === '1' ? ['User 1', 'User 2', 'User 3'] : [],
    };
  }, [id, isGroup]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft color="#FF3B30" size={24} />
          </Pressable>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{chatData.name}</Text>
            {isGroup === '1' && (
              <Text style={styles.headerSubtitle}>
                {chatData.participants.length} participants
              </Text>
            )}
          </View>

          {isGroup === '1' && (
            <Pressable style={styles.groupIcon}>
              <Users color="#FF3B30" size={24} />
            </Pressable>
          )}
        </View>

        {/* Chat Messages Area */}
        <View style={styles.chatContainer}>
          <Text style={styles.placeholder}>Messages will appear here</Text>
        </View>

        {/* Message Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <Text style={styles.inputPlaceholder}>Type a message...</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  groupIcon: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: '#666',
    fontSize: 16,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 16,
  },
  inputPlaceholder: {
    color: '#666',
    fontSize: 16,
  },
});

