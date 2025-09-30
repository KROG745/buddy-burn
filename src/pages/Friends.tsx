import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useFriends } from "@/hooks/useFriends";
import FriendCard from "@/components/FriendCard";
import FriendRequestCard from "@/components/FriendRequestCard";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Friends = () => {
  const navigate = useNavigate();
  const { user } = useProfile();
  const { 
    friends, 
    friendRequests, 
    sentRequests,
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest,
    removeFriend,
    loading
  } = useFriends(user?.id);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
        .neq('id', user?.id || '')
        .limit(20);

      if (error) throw error;

      // Filter out existing friends and pending requests
      const friendIds = friends.map(f => f.id);
      const sentRequestIds = sentRequests.map(r => r.receiver_id);
      
      const filtered = data?.filter(profile => 
        !friendIds.includes(profile.id) && 
        !sentRequestIds.includes(profile.id)
      ) || [];

      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (receiverId: string) => {
    const result = await sendFriendRequest(receiverId);
    if (result.success) {
      toast.success('Friend request sent!');
      // Remove from search results
      setSearchResults(prev => prev.filter(p => p.id !== receiverId));
    } else {
      toast.error(result.error || 'Failed to send friend request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading friends...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground p-6 shadow-elevation">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Friends</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">
              Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({friendRequests.length})
            </TabsTrigger>
            <TabsTrigger value="search">
              Add Friends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            {friends.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  You don't have any friends yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Search for users and send friend requests!
                </p>
              </Card>
            ) : (
              friends.map((friend) => (
                <FriendCard 
                  key={friend.id} 
                  friend={friend} 
                  onRemove={removeFriend}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {friendRequests.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No pending friend requests</p>
              </Card>
            ) : (
              friendRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  onAccept={acceptFriendRequest}
                  onReject={rejectFriendRequest}
                />
              ))
            )}

            {sentRequests.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6">Sent Requests</h3>
                {sentRequests.map((request) => (
                  <Card key={request.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.receiver?.avatar_url || undefined} />
                        <AvatarFallback>
                          {request.receiver?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {request.receiver?.display_name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-muted-foreground">Pending...</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by username or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={searching}>
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {searchResults.length === 0 && !searching && searchQuery && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No users found</p>
              </Card>
            )}

            {searchResults.map((profile) => (
              <Card key={profile.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback>
                        {profile.display_name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{profile.display_name || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">@{profile.username || 'user'}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSendRequest(profile.id)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Friend
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Friends;