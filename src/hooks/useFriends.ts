import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './useProfile';

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export const useFriends = (userId: string | undefined) => {
  const [friends, setFriends] = useState<Profile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setFriends([]);
      setFriendRequests([]);
      setSentRequests([]);
      setLoading(false);
      return;
    }

    fetchFriends();
    fetchFriendRequests();
  }, [userId]);

  const fetchFriends = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('friends')
        .select('friend_id, profiles!friends_friend_id_fkey(*)')
        .eq('user_id', userId);

      if (error) throw error;

      const friendProfiles = data?.map(f => f.profiles) || [];
      setFriends(friendProfiles as Profile[]);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    if (!userId) return;

    try {
      // Received requests
      const { data: received, error: receivedError } = await supabase
        .from('friend_requests')
        .select('*, sender:profiles!friend_requests_sender_id_fkey(*)')
        .eq('receiver_id', userId)
        .eq('status', 'pending');

      if (receivedError) throw receivedError;

      // Sent requests
      const { data: sent, error: sentError } = await supabase
        .from('friend_requests')
        .select('*, receiver:profiles!friend_requests_receiver_id_fkey(*)')
        .eq('sender_id', userId)
        .eq('status', 'pending');

      if (sentError) throw sentError;

      setFriendRequests((received || []) as FriendRequest[]);
      setSentRequests((sent || []) as FriendRequest[]);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const sendFriendRequest = async (receiverId: string) => {
    if (!userId) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: userId,
          receiver_id: receiverId
        });

      if (error) throw error;

      fetchFriendRequests();
      return { success: true };
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      return { success: false, error: error.message };
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      fetchFriends();
      fetchFriendRequests();
      return { success: true };
    } catch (error: any) {
      console.error('Error accepting friend request:', error);
      return { success: false, error: error.message };
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      fetchFriendRequests();
      return { success: true };
    } catch (error: any) {
      console.error('Error rejecting friend request:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!userId) return { success: false };

    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', friendId);

      if (error) throw error;

      fetchFriends();
      return { success: true };
    } catch (error) {
      console.error('Error removing friend:', error);
      return { success: false };
    }
  };

  return {
    friends,
    friendRequests,
    sentRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    refetch: () => {
      fetchFriends();
      fetchFriendRequests();
    }
  };
};