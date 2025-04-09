import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { supabase } from '../lib/supabase';

// Distance threshold in meters
const MATCHING_DISTANCE = 50;

interface UserLocation {
  user_id: string;
  latitude: number;
  longitude: number;
  last_updated: string;
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
}

interface NearbyLocation {
  user_id: string;
  latitude: number;
  longitude: number;
  users: {
    id: string;
    name: string;
    avatar: string;
  };
}

export async function setupLocationTracking(userId: string) {
  // Request permissions
  const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
  const { status: notificationStatus } = await Notifications.requestPermissionsAsync();

  if (locationStatus !== 'granted' || notificationStatus !== 'granted') {
    throw new Error('Permission to access location or notifications was denied');
  }

  // Start watching location
  Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 10, // Update every 10 meters
      timeInterval: 30000, // Update every 30 seconds
    },
    (location) => updateUserLocation(userId, location)
  );
}

async function updateUserLocation(userId: string, location: Location.LocationObject) {
  const { error } = await supabase
    .from('user_locations')
    .upsert({
      user_id: userId,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      last_updated: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating location:', error);
    return;
  }

  // Check for nearby users
  checkNearbyUsers(userId, location.coords.latitude, location.coords.longitude);
}

async function checkNearbyUsers(userId: string, latitude: number, longitude: number) {
  // Get all user locations updated in the last 5 minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  const { data: nearbyLocations, error } = await supabase
    .from('user_locations')
    .select(`
      user_id,
      latitude,
      longitude,
      users:user_id (
        id,
        name,
        avatar
      )
    `)
    .neq('user_id', userId)
    .gte('last_updated', fiveMinutesAgo) as { data: NearbyLocation[] | null, error: any };

  if (error || !nearbyLocations) {
    console.error('Error fetching nearby users:', error);
    return;
  }

  for (const nearby of nearbyLocations) {
    const distance = calculateDistance(
      latitude,
      longitude,
      nearby.latitude,
      nearby.longitude
    );

    if (distance <= MATCHING_DISTANCE) {
      // Check if they're already friends or if a notification was recently sent
      const shouldNotify = await checkNotificationEligibility(userId, nearby.user_id);
      
      if (shouldNotify) {
        await sendMatchNotification(userId, nearby.users);
        await createFriendRequest(userId, nearby.user_id);
      }
    }
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

async function checkNotificationEligibility(userId: string, otherUserId: string): Promise<boolean> {
  // Check if they're already friends (checking both possible combinations)
  const { data: existingFriendship, error: friendError } = await supabase
    .from('user_friends')
    .select()
    .or(`and(user_id.eq.${userId},friend_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},friend_id.eq.${userId})`)
    .eq('status', 'active')
    .single();

  if (friendError) {
    console.error('Error checking friendship status:', friendError);
    return false;
  }

  // If they're already friends, don't send notification
  if (existingFriendship) {
    return false;
  }

  // Check if there's a pending friend request
  const { data: pendingRequest, error: requestError } = await supabase
    .from('user_friends')
    .select()
    .or(`and(user_id.eq.${userId},friend_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},friend_id.eq.${userId})`)
    .eq('status', 'pending')
    .single();

  if (requestError) {
    console.error('Error checking friend request status:', requestError);
    return false;
  }

  // If there's a pending request, don't send notification
  if (pendingRequest) {
    return false;
  }

  // Check if notification was sent in the last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentNotification, error: notificationError } = await supabase
    .from('location_match_notifications')
    .select()
    .or(`and(from_user_id.eq.${userId},to_user_id.eq.${otherUserId}),and(from_user_id.eq.${otherUserId},to_user_id.eq.${userId})`)
    .gte('created_at', oneDayAgo)
    .single();

  if (notificationError) {
    console.error('Error checking recent notifications:', notificationError);
    return false;
  }

  // Return true only if:
  // 1. They're not friends
  // 2. There's no pending friend request
  // 3. No notification was sent in the last 24 hours
  return !recentNotification;
}

async function sendMatchNotification(userId: string, nearbyUser: UserProfile) {
  try {
    // Double-check eligibility right before sending
    const isEligible = await checkNotificationEligibility(userId, nearbyUser.id);
    if (!isEligible) {
      return;
    }

    // Record the notification
    const { error: notificationError } = await supabase
      .from('location_match_notifications')
      .insert({
        from_user_id: userId,
        to_user_id: nearbyUser.id,
        created_at: new Date().toISOString(),
      });

    if (notificationError) {
      console.error('Error recording notification:', notificationError);
      return;
    }

    // Send push notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New Player Nearby! 👋',
        body: `${nearbyUser.name} is near you! Add them as a friend to play together.`,
        data: { userId: nearbyUser.id },
      },
      trigger: null, // Send immediately
    });

  } catch (error) {
    console.error('Error sending match notification:', error);
  }
}

async function createFriendRequest(fromUserId: string, toUserId: string) {
  await supabase
    .from('friend_requests')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
}



