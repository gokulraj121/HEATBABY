import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export function useSubscription() {
  const { user } = useAuth();
  const [activeSubscriptions, setActiveSubscriptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('subscription_id')
        .eq('user_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;

      setActiveSubscriptions(data?.map(sub => sub.subscription_id) || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasSubscription = (subscriptionId: string) => {
    return activeSubscriptions.includes(subscriptionId) || 
           activeSubscriptions.includes('premium'); // Premium includes all features
  };

  const canAccessFind = () => hasSubscription('find_users') || hasSubscription('premium');
  const canReceiveNotifications = () => hasSubscription('notifications') || hasSubscription('premium');

  return {
    loading,
    activeSubscriptions,
    hasSubscription,
    canAccessFind,
    canReceiveNotifications,
  };
}
