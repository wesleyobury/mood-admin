"""
MOOD Premium Notifications System
Phase 1: Backend models, device tokens, push for Messages/Follows/Comments

This module handles:
- Notification data models and storage
- Device token management
- Push notification delivery via Expo
- Event triggers for social interactions
- Deep link generation
"""

import os
import logging
import httpx
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from bson import ObjectId
from enum import Enum

logger = logging.getLogger(__name__)

# ============================================
# NOTIFICATION TYPES & CONSTANTS
# ============================================

class NotificationType(str, Enum):
    # Social (Phase 1)
    LIKE = "like"
    COMMENT = "comment"
    FOLLOW = "follow"
    MESSAGE = "message"
    MESSAGE_REQUEST = "message_request"
    
    # Engagement (Phase 3-4)
    WORKOUT_REMINDER = "workout_reminder"
    FEATURED_WORKOUT = "featured_workout"
    FEATURED_SUGGESTION = "featured_suggestion"
    FOLLOWING_DIGEST = "following_digest"
    
    # System
    WHILE_AWAY_DIGEST = "while_away_digest"


# Premium copy library for featured suggestions
SUGGESTION_COPY_LIBRARY = [
    "What are you feeling today?",
    "Pick a MOOD. We'll handle the rest.",
    "No plan needed. Just start.",
    "However you feel — move.",
    "Start where you are.",
    "In the MOOD for a sweat?",
    "Want to grow that 🍑 today?",
    "Sweat now. Think later.",
    "This one doesn't waste time.",
    "In the MOOD to get swole?",
    "A short session works.",
    "Meet your body where it is.",
    "Consistency beats intensity.",
    "Training > overthinking.",
    "Quiet grind.",
    "Strength, without the fluff.",
    "Built for today.",
    "Just enough burn.",
    "Move with intent.",
    "Just press start.",
]

# Deep link URL schemes
DEEP_LINK_SCHEMES = {
    NotificationType.LIKE: "mood://post/{entity_id}",
    NotificationType.COMMENT: "mood://post/{entity_id}",
    NotificationType.FOLLOW: "mood://profile/{actor_id}",
    NotificationType.MESSAGE: "mood://chat/{entity_id}",
    NotificationType.MESSAGE_REQUEST: "mood://chat/{entity_id}",
    NotificationType.FEATURED_WORKOUT: "mood://featured-workout/{entity_id}",
    NotificationType.WORKOUT_REMINDER: "mood://start-workout",
    NotificationType.FEATURED_SUGGESTION: "mood://",
    NotificationType.FOLLOWING_DIGEST: "mood://explore?filter=following",
}


# ============================================
# NOTIFICATION SERVICE CLASS
# ============================================

class NotificationService:
    """Handles all notification operations"""
    
    def __init__(self, db):
        self.db = db
        self.expo_push_url = "https://exp.host/--/api/v2/push/send"
    
    # ----------------------------------------
    # DEVICE TOKEN MANAGEMENT
    # ----------------------------------------
    
    async def register_device_token(
        self,
        user_id: str,
        token: str,
        platform: str,  # 'ios', 'android', 'web'
        device_id: Optional[str] = None
    ) -> dict:
        """Register or update a device push token"""
        now = datetime.now(timezone.utc)
        
        # Check if token already exists for this user
        existing = await self.db.device_tokens.find_one({
            "user_id": user_id,
            "token": token
        })
        
        if existing:
            # Update last_active
            await self.db.device_tokens.update_one(
                {"_id": existing["_id"]},
                {"$set": {"last_active": now, "platform": platform}}
            )
            return {"status": "updated", "id": str(existing["_id"])}
        
        # Insert new token
        doc = {
            "user_id": user_id,
            "token": token,
            "platform": platform,
            "device_id": device_id,
            "created_at": now,
            "last_active": now,
            "is_valid": True
        }
        
        result = await self.db.device_tokens.insert_one(doc)
        logger.info(f"📱 Registered device token for user {user_id[:8]}... on {platform}")
        
        return {"status": "created", "id": str(result.inserted_id)}
    
    async def unregister_device_token(self, user_id: str, token: str) -> bool:
        """Remove a device token"""
        result = await self.db.device_tokens.delete_one({
            "user_id": user_id,
            "token": token
        })
        return result.deleted_count > 0
    
    async def invalidate_token(self, token: str) -> None:
        """Mark a token as invalid (e.g., after failed push)"""
        await self.db.device_tokens.update_one(
            {"token": token},
            {"$set": {"is_valid": False}}
        )
    
    async def get_user_tokens(self, user_id: str) -> List[str]:
        """Get all valid push tokens for a user"""
        tokens = await self.db.device_tokens.find({
            "user_id": user_id,
            "is_valid": True
        }).to_list(10)
        
        return [t["token"] for t in tokens]
    
    # ----------------------------------------
    # NOTIFICATION SETTINGS
    # ----------------------------------------
    
    async def get_user_settings(self, user_id: str) -> dict:
        """Get notification settings for a user, with defaults"""
        settings = await self.db.notification_settings.find_one({"user_id": user_id})
        
        if not settings:
            # Return defaults
            return self._get_default_settings(user_id)
        
        return {
            "user_id": settings["user_id"],
            "notifications_enabled": settings.get("notifications_enabled", True),
            "likes_enabled": settings.get("likes_enabled", True),
            "likes_from_following_only": settings.get("likes_from_following_only", False),
            "comments_enabled": settings.get("comments_enabled", True),
            "comments_from_following_only": settings.get("comments_from_following_only", False),
            "messages_enabled": settings.get("messages_enabled", True),
            "message_requests_enabled": settings.get("message_requests_enabled", True),
            "follows_enabled": settings.get("follows_enabled", True),
            "workout_reminders_enabled": settings.get("workout_reminders_enabled", True),
            "featured_workouts_enabled": settings.get("featured_workouts_enabled", True),
            "following_digest_enabled": settings.get("following_digest_enabled", True),
            "following_digest_frequency": settings.get("following_digest_frequency", "daily"),  # daily, 3x_week, off
            "featured_suggestions_enabled": settings.get("featured_suggestions_enabled", True),
            "quiet_hours_enabled": settings.get("quiet_hours_enabled", True),
            "quiet_hours_start": settings.get("quiet_hours_start", "22:00"),
            "quiet_hours_end": settings.get("quiet_hours_end", "08:00"),
            "digest_time": settings.get("digest_time", "18:00"),
            "timezone": settings.get("timezone", "America/New_York"),
        }
    
    def _get_default_settings(self, user_id: str) -> dict:
        """Get default notification settings"""
        return {
            "user_id": user_id,
            "notifications_enabled": True,
            "likes_enabled": True,
            "likes_from_following_only": False,
            "comments_enabled": True,
            "comments_from_following_only": False,
            "messages_enabled": True,
            "message_requests_enabled": True,
            "follows_enabled": True,
            "workout_reminders_enabled": True,
            "featured_workouts_enabled": True,
            "following_digest_enabled": True,
            "following_digest_frequency": "daily",
            "featured_suggestions_enabled": True,
            "quiet_hours_enabled": True,
            "quiet_hours_start": "22:00",
            "quiet_hours_end": "08:00",
            "digest_time": "18:00",
            "timezone": "America/New_York",
        }
    
    async def update_user_settings(self, user_id: str, settings: dict) -> dict:
        """Update notification settings for a user"""
        now = datetime.now(timezone.utc)
        
        # Filter only allowed fields
        allowed_fields = [
            "notifications_enabled", "likes_enabled", "likes_from_following_only",
            "comments_enabled", "comments_from_following_only", "messages_enabled",
            "message_requests_enabled", "follows_enabled", "workout_reminders_enabled",
            "featured_workouts_enabled", "following_digest_enabled", "following_digest_frequency",
            "featured_suggestions_enabled", "quiet_hours_enabled", "quiet_hours_start",
            "quiet_hours_end", "digest_time", "timezone"
        ]
        
        update_data = {k: v for k, v in settings.items() if k in allowed_fields}
        update_data["updated_at"] = now
        
        await self.db.notification_settings.update_one(
            {"user_id": user_id},
            {"$set": update_data, "$setOnInsert": {"user_id": user_id, "created_at": now}},
            upsert=True
        )
        
        return await self.get_user_settings(user_id)
    
    # ----------------------------------------
    # NOTIFICATION CREATION
    # ----------------------------------------
    
    async def create_notification(
        self,
        user_id: str,
        notification_type: NotificationType,
        title: str,
        body: str,
        actor_id: Optional[str] = None,
        entity_id: Optional[str] = None,
        entity_type: Optional[str] = None,
        image_url: Optional[str] = None,
        metadata: Optional[dict] = None,
        group_key: Optional[str] = None,
        send_push: bool = True
    ) -> Optional[str]:
        """
        Create a notification and optionally send push
        Returns notification ID or None if not created
        """
        now = datetime.now(timezone.utc)
        
        # Check user settings
        settings = await self.get_user_settings(user_id)
        
        if not settings.get("notifications_enabled", True):
            logger.debug(f"Notifications disabled for user {user_id[:8]}...")
            return None
        
        # Check type-specific settings
        type_setting_map = {
            NotificationType.LIKE: "likes_enabled",
            NotificationType.COMMENT: "comments_enabled",
            NotificationType.FOLLOW: "follows_enabled",
            NotificationType.MESSAGE: "messages_enabled",
            NotificationType.MESSAGE_REQUEST: "message_requests_enabled",
            NotificationType.WORKOUT_REMINDER: "workout_reminders_enabled",
            NotificationType.FEATURED_WORKOUT: "featured_workouts_enabled",
            NotificationType.FEATURED_SUGGESTION: "featured_suggestions_enabled",
            NotificationType.FOLLOWING_DIGEST: "following_digest_enabled",
        }
        
        setting_key = type_setting_map.get(notification_type)
        if setting_key and not settings.get(setting_key, True):
            logger.debug(f"{notification_type.value} notifications disabled for user {user_id[:8]}...")
            return None
        
        # Check "from following only" settings for likes/comments
        if notification_type in [NotificationType.LIKE, NotificationType.COMMENT] and actor_id:
            from_following_key = f"{notification_type.value}s_from_following_only"
            if settings.get(from_following_key, False):
                # Check if actor is being followed by user
                is_following = await self.db.follows.find_one({
                    "follower_id": ObjectId(user_id),
                    "following_id": ObjectId(actor_id)
                })
                if not is_following:
                    logger.debug(f"Skipping {notification_type.value} from non-followed user")
                    return None
        
        # Generate deep link
        deep_link = self._generate_deep_link(notification_type, actor_id, entity_id)
        
        # Create notification document
        notification_doc = {
            "user_id": user_id,
            "type": notification_type.value,
            "title": title,
            "body": body,
            "actor_id": actor_id,
            "entity_id": entity_id,
            "entity_type": entity_type,
            "image_url": image_url,
            "deep_link": deep_link,
            "metadata": metadata or {},
            "group_key": group_key,
            "created_at": now,
            "read_at": None,
            "delivered_push_at": None,
        }
        
        result = await self.db.notifications.insert_one(notification_doc)
        notification_id = str(result.inserted_id)
        
        logger.info(f"🔔 Created notification {notification_type.value} for user {user_id[:8]}...")
        
        # Send push if enabled and not in quiet hours
        if send_push:
            in_quiet_hours = self._is_in_quiet_hours(settings)
            if in_quiet_hours:
                logger.debug(f"User {user_id[:8]}... is in quiet hours, skipping push")
            else:
                await self._send_push_notification(
                    user_id=user_id,
                    notification_id=notification_id,
                    title=title,
                    body=body,
                    deep_link=deep_link,
                    notification_type=notification_type,
                    image_url=image_url
                )
        
        # Track analytics
        await self._track_notification_event(user_id, "notification_created", notification_type.value)
        
        return notification_id
    
    def _generate_deep_link(
        self,
        notification_type: NotificationType,
        actor_id: Optional[str],
        entity_id: Optional[str]
    ) -> str:
        """Generate deep link URL for notification"""
        template = DEEP_LINK_SCHEMES.get(notification_type, "mood://")
        
        deep_link = template
        if "{entity_id}" in deep_link and entity_id:
            deep_link = deep_link.replace("{entity_id}", entity_id)
        if "{actor_id}" in deep_link and actor_id:
            deep_link = deep_link.replace("{actor_id}", actor_id)
        
        return deep_link
    
    def _is_in_quiet_hours(self, settings: dict) -> bool:
        """Check if current time is within user's quiet hours"""
        if not settings.get("quiet_hours_enabled", True):
            return False
        
        try:
            from datetime import time
            now = datetime.now(timezone.utc)
            
            # Parse quiet hours (simple implementation - assumes UTC for now)
            start_str = settings.get("quiet_hours_start", "22:00")
            end_str = settings.get("quiet_hours_end", "08:00")
            
            start_parts = start_str.split(":")
            end_parts = end_str.split(":")
            
            start_time = time(int(start_parts[0]), int(start_parts[1]))
            end_time = time(int(end_parts[0]), int(end_parts[1]))
            current_time = now.time()
            
            # Handle overnight quiet hours (e.g., 22:00 - 08:00)
            if start_time > end_time:
                return current_time >= start_time or current_time < end_time
            else:
                return start_time <= current_time < end_time
        except Exception as e:
            logger.error(f"Error checking quiet hours: {e}")
            return False
    
    # ----------------------------------------
    # PUSH NOTIFICATION DELIVERY
    # ----------------------------------------
    
    async def _send_push_notification(
        self,
        user_id: str,
        notification_id: str,
        title: str,
        body: str,
        deep_link: str,
        notification_type: NotificationType,
        image_url: Optional[str] = None
    ) -> bool:
        """Send push notification via Expo Push API"""
        tokens = await self.get_user_tokens(user_id)
        
        if not tokens:
            logger.debug(f"No push tokens for user {user_id[:8]}...")
            return False
        
        # Build push message
        messages = []
        for token in tokens:
            message = {
                "to": token,
                "title": title,
                "body": body,
                "data": {
                    "notification_id": notification_id,
                    "type": notification_type.value,
                    "deep_link": deep_link,
                },
                "sound": "default",
                "priority": "high",
            }
            
            # Add category/actions based on type
            if notification_type == NotificationType.MESSAGE:
                message["categoryId"] = "MESSAGE"
            elif notification_type == NotificationType.FEATURED_WORKOUT:
                message["categoryId"] = "FEATURED_WORKOUT"
            
            messages.append(message)
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.expo_push_url,
                    json=messages,
                    headers={"Content-Type": "application/json"},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Check for individual ticket errors
                    for i, ticket in enumerate(result.get("data", [])):
                        if ticket.get("status") == "error":
                            error_msg = ticket.get("message", "Unknown error")
                            if "DeviceNotRegistered" in error_msg:
                                await self.invalidate_token(tokens[i])
                                logger.warning("Invalidated token: DeviceNotRegistered")
                            else:
                                logger.error(f"Push error: {error_msg}")
                    
                    # Mark as delivered
                    await self.db.notifications.update_one(
                        {"_id": ObjectId(notification_id)},
                        {"$set": {"delivered_push_at": datetime.now(timezone.utc)}}
                    )
                    
                    # Track analytics
                    await self._track_notification_event(
                        user_id, "push_sent", notification_type.value
                    )
                    
                    logger.info(f"📤 Push sent to {len(tokens)} device(s) for user {user_id[:8]}...")
                    return True
                else:
                    logger.error(f"Expo push failed: {response.status_code} - {response.text}")
                    return False
                    
        except Exception as e:
            logger.error(f"Error sending push notification: {e}")
            return False
    
    # ----------------------------------------
    # NOTIFICATION RETRIEVAL
    # ----------------------------------------
    
    async def get_notifications(
        self,
        user_id: str,
        limit: int = 50,
        skip: int = 0,
        unread_only: bool = False
    ) -> List[dict]:
        """Get notifications for a user with pagination"""
        query = {"user_id": user_id}
        
        if unread_only:
            query["read_at"] = None
        
        pipeline = [
            {"$match": query},
            {"$sort": {"created_at": -1}},
            {"$skip": skip},
            {"$limit": limit},
            # Lookup actor info
            {
                "$lookup": {
                    "from": "users",
                    "let": {"actor_id": {"$toObjectId": "$actor_id"}},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$actor_id"]}}},
                        {"$project": {"username": 1, "avatar": 1, "name": 1}}
                    ],
                    "as": "actor"
                }
            },
            {"$unwind": {"path": "$actor", "preserveNullAndEmptyArrays": True}},
            {
                "$project": {
                    "id": {"$toString": "$_id"},
                    "type": 1,
                    "title": 1,
                    "body": 1,
                    "image_url": 1,
                    "deep_link": 1,
                    "entity_id": 1,
                    "entity_type": 1,
                    "created_at": 1,
                    "read_at": 1,
                    "actor": {
                        "id": {"$toString": "$actor._id"},
                        "username": "$actor.username",
                        "avatar": "$actor.avatar",
                        "name": "$actor.name"
                    },
                    "_id": 0
                }
            }
        ]
        
        notifications = await self.db.notifications.aggregate(pipeline).to_list(limit)
        return notifications
    
    async def get_unread_count(self, user_id: str) -> int:
        """Get count of unread notifications"""
        return await self.db.notifications.count_documents({
            "user_id": user_id,
            "read_at": None
        })
    
    async def mark_as_read(self, user_id: str, notification_ids: List[str]) -> int:
        """Mark notifications as read"""
        now = datetime.now(timezone.utc)
        
        object_ids = [ObjectId(nid) for nid in notification_ids]
        
        result = await self.db.notifications.update_many(
            {
                "_id": {"$in": object_ids},
                "user_id": user_id,
                "read_at": None
            },
            {"$set": {"read_at": now}}
        )
        
        return result.modified_count
    
    async def mark_all_as_read(self, user_id: str) -> int:
        """Mark all notifications as read for a user"""
        now = datetime.now(timezone.utc)
        
        result = await self.db.notifications.update_many(
            {"user_id": user_id, "read_at": None},
            {"$set": {"read_at": now}}
        )
        
        return result.modified_count
    
    async def delete_notification(self, user_id: str, notification_id: str) -> bool:
        """Delete a notification"""
        result = await self.db.notifications.delete_one({
            "_id": ObjectId(notification_id),
            "user_id": user_id
        })
        return result.deleted_count > 0
    
    # ----------------------------------------
    # EVENT TRIGGERS (for social actions)
    # ----------------------------------------
    
    async def trigger_follow_notification(
        self,
        follower_id: str,
        followed_user_id: str
    ) -> Optional[str]:
        """Trigger notification when someone follows a user"""
        # Get follower info
        follower = await self.db.users.find_one({"_id": ObjectId(follower_id)})
        if not follower:
            return None
        
        follower_name = follower.get("name") or follower.get("username", "Someone")
        avatar = follower.get("avatar") or follower.get("avatar_url")
        
        return await self.create_notification(
            user_id=followed_user_id,
            notification_type=NotificationType.FOLLOW,
            title="New Follower",
            body=f"{follower_name} started following you",
            actor_id=follower_id,
            image_url=avatar,
            metadata={"follower_username": follower.get("username")}
        )
    
    async def trigger_comment_notification(
        self,
        commenter_id: str,
        post_id: str,
        comment_text: str
    ) -> Optional[str]:
        """Trigger notification when someone comments on a post"""
        # Get post and commenter info
        post = await self.db.posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            return None
        
        post_author_id = post.get("author_id")
        if not post_author_id or str(post_author_id) == commenter_id:
            # Don't notify yourself
            return None
        
        commenter = await self.db.users.find_one({"_id": ObjectId(commenter_id)})
        if not commenter:
            return None
        
        commenter_name = commenter.get("name") or commenter.get("username", "Someone")
        avatar = commenter.get("avatar") or commenter.get("avatar_url")
        
        # Truncate comment for body
        truncated_comment = comment_text[:50] + "..." if len(comment_text) > 50 else comment_text
        
        # Get post preview image
        media_urls = post.get("media_urls", [])
        post_image = media_urls[0] if media_urls else None
        
        return await self.create_notification(
            user_id=str(post_author_id),
            notification_type=NotificationType.COMMENT,
            title="New Comment",
            body=f'{commenter_name}: "{truncated_comment}"',
            actor_id=commenter_id,
            entity_id=post_id,
            entity_type="post",
            image_url=avatar,
            metadata={
                "commenter_username": commenter.get("username"),
                "post_preview": post_image
            }
        )
    
    async def trigger_message_notification(
        self,
        sender_id: str,
        recipient_id: str,
        conversation_id: str,
        message_text: str,
        is_request: bool = False
    ) -> Optional[str]:
        """Trigger notification when someone sends a message"""
        sender = await self.db.users.find_one({"_id": ObjectId(sender_id)})
        if not sender:
            return None
        
        sender_name = sender.get("name") or sender.get("username", "Someone")
        avatar = sender.get("avatar") or sender.get("avatar_url")
        
        # Truncate message for body
        truncated_msg = message_text[:50] + "..." if len(message_text) > 50 else message_text
        
        notification_type = NotificationType.MESSAGE_REQUEST if is_request else NotificationType.MESSAGE
        title = "Message Request" if is_request else "New Message"
        
        return await self.create_notification(
            user_id=recipient_id,
            notification_type=notification_type,
            title=title,
            body=f'{sender_name}: "{truncated_msg}"',
            actor_id=sender_id,
            entity_id=conversation_id,
            entity_type="conversation",
            image_url=avatar,
            metadata={"sender_username": sender.get("username")}
        )
    
    # ----------------------------------------
    # ANALYTICS TRACKING
    # ----------------------------------------
    
    async def _track_notification_event(
        self,
        user_id: str,
        event_type: str,
        notification_type: str,
        metadata: Optional[dict] = None
    ) -> None:
        """Track notification-related analytics event"""
        try:
            await self.db.notification_analytics.insert_one({
                "user_id": user_id,
                "event_type": event_type,
                "notification_type": notification_type,
                "metadata": metadata or {},
                "timestamp": datetime.now(timezone.utc)
            })
        except Exception as e:
            logger.error(f"Error tracking notification event: {e}")


# ============================================
# FACTORY FUNCTION
# ============================================

_notification_service = None

def get_notification_service(db) -> NotificationService:
    """Get or create the notification service singleton"""
    global _notification_service
    if _notification_service is None:
        _notification_service = NotificationService(db)
    return _notification_service
