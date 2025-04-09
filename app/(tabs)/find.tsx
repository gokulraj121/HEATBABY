import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Search, Users, X } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/hooks/useSubscription';
import { router } from 'expo-router';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  avatar: string;
  interests: string[];
  photos?: string[];
}

const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Emma Wilson',
    age: 25,
    location: 'New York, USA',
    bio: 'Love playing games and meeting new people!',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    interests: ['Gaming', 'Travel', 'Music'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 28,
    location: 'London, UK',
    bio: 'Competitive gamer looking for gaming buddies',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    interests: ['Gaming', 'Sports', 'Technology'],
  },
  // Add more mock users as needed
];

export default function FindScreen() {
  const { canAccessFind } = useSubscription();
  
  if (!canAccessFind()) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Subscribe to access Find Users feature</Text>
        <Pressable
          style={styles.subscribeButton}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.buttonText}>Subscribe Now</Text>
        </Pressable>
      </View>
    );
  }

  const [users] = useState<UserProfile[]>(mockUsers);
  const [currentPhotoIndexes, setCurrentPhotoIndexes] = useState<{ [key: string]: number }>({});

  const handleNextPhoto = (userId: string, photosLength: number) => {
    setCurrentPhotoIndexes(prev => ({
      ...prev,
      [userId]: ((prev[userId] || 0) + 1) % photosLength
    }));
  };

  const renderUserCard = ({ item }: { item: UserProfile }) => {
    const photos = [item.avatar, ...(item.photos || [])];
    const currentPhotoIndex = currentPhotoIndexes[item.id] || 0;

    return (
      <View style={styles.card}>
        <Image source={{ uri: photos[currentPhotoIndex] }} style={styles.cardImage} />
        <Pressable
          style={styles.nextPhotoButton}
          onPress={() => handleNextPhoto(item.id, photos.length)}
        >
          <Text style={styles.nextPhotoText}>Next Photo</Text>
        </Pressable>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardOverlay}
        >
          <View style={styles.cardContent}>
            <Text style={styles.userName}>{item.name}, {item.age}</Text>
            <Text style={styles.userLocation}>{item.location}</Text>
            <Text style={styles.userBio}>{item.bio}</Text>
            
            <View style={styles.interestContainer}>
              {item.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actionButtons}>
              <Pressable style={[styles.actionButton, styles.passButton]}>
                <X color="#FF3B30" size={24} />
              </Pressable>
              <Pressable style={[styles.actionButton, styles.likeButton]}>
                <Heart color="#FF69B4" size={24} />
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <View style={styles.header}>
        <Users color="#FF3B30" size={32} />
        <Text style={styles.title}>Find People</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color="#888" size={20} />
        <Text style={styles.searchPlaceholder}>Search by interests, location...</Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  searchPlaceholder: {
    color: '#888',
    marginLeft: 10,
  },
  cardList: {
    padding: 20,
  },
  card: {
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  cardContent: {
    gap: 5,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userLocation: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  userBio: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  interestTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  interestText: {
    color: '#fff',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passButton: {
    backgroundColor: '#333',
  },
  likeButton: {
    backgroundColor: '#333',
  },
  nextPhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  nextPhotoText: {
    color: '#fff',
    fontSize: 14,
  },
  errorText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  subscribeButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});





