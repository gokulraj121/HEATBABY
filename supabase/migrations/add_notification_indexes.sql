-- Add indexes for faster friendship and notification checks
CREATE INDEX idx_user_friends_status ON user_friends (user_id, friend_id, status);
CREATE INDEX idx_location_notifications_users ON location_match_notifications (from_user_id, to_user_id, created_at);