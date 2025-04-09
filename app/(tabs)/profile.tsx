import { LinearGradient } from 'expo-linear-gradient';
import { Edit2, Heart, MessageCircle, Settings, Trophy, User, Plus, Crown, Bell, Users } from 'lucide-react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Simplified subscription types
interface Subscription {
  id: string;
  name: string;
  price: number;
  features: string[];
  icon: any;
}

const subscriptionPlans: Subscription[] = [
  {
    id: 'find_users',
    name: 'Find Users Plan',
    price: 50,
    features: [
      'Access to Find Users page',
      'Browse other users profiles',
      'Basic matching features'
    ],
    icon: Users
  },
  {
    id: 'notifications',
    name: 'Notifications Plan',
    price: 20,
    features: [
      'Nearby user notifications',
      'Real-time alerts',
      'Location-based matching'
    ],
    icon: Bell
  },
  {
    id: 'premium',
    name: 'Premium Bundle',
    price: 60,
    features: [
      'All Find Users features',
      'All Notifications features',
      'Priority support',
      'Save 10 Rs/month'
    ],
    icon: Crown
  }
];

interface Stats {
  games: number;
  friends: number;
  points: number;
}

interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  stats: Stats;
  interests: string[];
}

const mockProfile: UserProfile = {
  name: 'Alex Johnson',
  username: '@alexj',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  bio: 'Passionate gamer looking for fun and friendship. Love competitive games and meeting new people!',
  stats: {
    games: 156,
    friends: 48,
    points: 2750,
  },
  interests: ['Gaming', 'Adventure', 'Strategy', 'Puzzle', 'Social'],
};

export default function ProfileScreen() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserSubscriptions();
    }
  }, [user]);

  const fetchUserSubscriptions = async () => {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('subscription_id')
      .eq('user_id', user?.id)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return;
    }

    setActiveSubscriptions(data?.map(sub => sub.subscription_id) || []);
  };

  const renderSubscriptionCard = (subscription: Subscription) => {
    const isSubscribed = activeSubscriptions.includes(subscription.id);
    const Icon = subscription.icon;

    return (
      <View style={styles.subscriptionCard} key={subscription.id}>
        <Icon color={isSubscribed ? "#FFD700" : "#FF69B4"} size={24} />
        <Text style={styles.subscriptionName}>{subscription.name}</Text>
        <Text style={styles.subscriptionPrice}>₹{subscription.price}/month</Text>
        {subscription.features.map((feature, index) => (
          <Text key={index} style={styles.featureText}>• {feature}</Text>
        ))}
        <View
          style={[
            styles.subscriptionStatus,
            isSubscribed ? styles.subscribedStatus : styles.notSubscribedStatus
          ]}
        >
          <Text style={styles.statusText}>
            {isSubscribed ? 'Active' : 'Coming Soon'}
          </Text>
        </View>
      </View>
    );
  };

  const handleAddPhoto = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access gallery is required!');
        return;
      }

      // Pick the image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        // Upload to Supabase Storage
        const fileExt = file.uri.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const response = await fetch(file.uri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, blob);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(filePath);

        // Save to profile_photos table
        const { error: dbError } = await supabase
          .from('profile_photos')
          .insert({
            user_id: user?.id,
            photo_url: publicUrl,
            created_at: new Date().toISOString()
          });

        if (dbError) {
          throw dbError;
        }

        setPhotos([...photos, publicUrl]);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo');
    }
  };

  const renderStat = (label: string, value: number) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <View style={styles.header}>
        <User color="#FF3B30" size={32} />
        <Text style={styles.title}>Profile</Text>
        <Pressable style={styles.settingsButton}>
          <Settings color="#fff" size={24} />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: mockProfile.avatar }} style={styles.avatar} />
          <Pressable style={styles.editButton}>
            <Edit2 color="#fff" size={20} />
          </Pressable>
        </View>

        <Text style={styles.name}>{mockProfile.name}</Text>
        <Text style={styles.username}>{mockProfile.username}</Text>
        <Text style={styles.bio}>{mockProfile.bio}</Text>

        <View style={styles.statsContainer}>
          {renderStat('Games', mockProfile.stats.games)}
          {renderStat('Friends', mockProfile.stats.friends)}
          {renderStat('Points', mockProfile.stats.points)}
        </View>

        <View style={styles.interestsContainer}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestTags}>
            {mockProfile.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>My Photos</Text>
          <View style={styles.photoGrid}>
            {photos.map((photo: string, index: number) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.photoThumbnail}
              />
            ))}
            <Pressable style={styles.addPhotoButton} onPress={handleAddPhoto}>
              <Plus color="#FF69B4" size={32} />
            </Pressable>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Pressable style={styles.actionButton}>
            <Heart color="#FF69B4" size={24} />
            <Text style={styles.actionText}>Favorites</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Trophy color="#FFD700" size={24} />
            <Text style={styles.actionText}>Achievements</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <MessageCircle color="#4A90E2" size={24} />
            <Text style={styles.actionText}>Messages</Text>
          </Pressable>
        </View>

        <View style={styles.subscriptionsSection}>
          <Text style={styles.sectionTitle}>Subscriptions</Text>
          <View style={styles.subscriptionsList}>
            {subscriptionPlans.map(renderSubscriptionCard)}
          </View>
        </View>
      </ScrollView>
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
    flex: 1,
    fontSize: 32,
    color: '#fff',
    marginLeft: 10,
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF69B4',
  },
  editButton: {
    position: 'absolute',
    right: '30%',
    bottom: 0,
    backgroundColor: '#FF69B4',
    padding: 8,
    borderRadius: 20,
  },
  name: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  bio: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  interestsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: 'rgba(255,105,180,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    color: '#fff',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
  photosSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'rgba(255,105,180,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF69B4',
    borderStyle: 'dashed',
  },
  subscriptionsSection: {
    marginTop: 20,
    padding: 15,
  },
  subscriptionsList: {
    gap: 15,
  },
  subscriptionCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  subscriptionName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subscriptionPrice: {
    color: '#FF69B4',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  featureText: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 3,
  },
  subscriptionStatus: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  subscribedStatus: {
    backgroundColor: '#FFD700',
  },
  notSubscribedStatus: {
    backgroundColor: '#FF69B4',
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});






