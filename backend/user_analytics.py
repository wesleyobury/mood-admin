"""
User Analytics and Tracking System
Tracks user behavior, engagement, and app usage patterns
"""
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class UserEvent(BaseModel):
    """Model for user activity events"""
    user_id: str
    event_type: str  # 'workout_completed', 'post_created', 'profile_viewed', etc.
    event_category: str  # 'workout', 'social', 'profile', 'navigation'
    metadata: Optional[dict] = None
    timestamp: datetime
    session_id: Optional[str] = None

class UserActivity(BaseModel):
    """Model for daily user activity summary"""
    user_id: str
    date: datetime
    events_count: int = 0
    workouts_completed: int = 0
    posts_created: int = 0
    comments_made: int = 0
    likes_given: int = 0
    profiles_viewed: int = 0
    time_spent_minutes: int = 0


# Event Types
EVENT_TYPES = {
    # Workout Events
    "workout_started": "workout",
    "workout_completed": "workout",
    "workout_skipped": "workout",
    "workout_abandoned": "workout",
    "workout_saved": "workout",
    "exercise_completed": "workout",
    
    # Social Events
    "post_created": "social",
    "post_liked": "social",
    "post_commented": "social",
    "user_followed": "social",
    "user_unfollowed": "social",
    "profile_viewed": "social",
    
    # Navigation Events
    "screen_viewed": "navigation",
    "tab_switched": "navigation",
    "search_performed": "navigation",
    
    # Engagement Events
    "app_session_start": "engagement",
    "app_opened": "engagement",
    "app_backgrounded": "engagement",
    "notification_clicked": "engagement",
    
    # Feature Usage
    "equipment_selected": "feature",
    "difficulty_selected": "feature",
    "mood_selected": "feature",
    "filter_applied": "feature"
}


async def track_user_event(
    db: AsyncIOMotorDatabase,
    user_id: str,
    event_type: str,
    metadata: Optional[dict] = None,
    session_id: Optional[str] = None
) -> None:
    """
    Track a user activity event
    """
    try:
        event_category = EVENT_TYPES.get(event_type, "other")
        
        event = {
            "user_id": user_id,
            "event_type": event_type,
            "event_category": event_category,
            "metadata": metadata or {},
            "timestamp": datetime.now(timezone.utc),
            "session_id": session_id
        }
        
        await db.user_events.insert_one(event)
        
        # Update daily activity summary
        await update_daily_activity(db, user_id, event_type)
        
        logger.info(f"Tracked event {event_type} for user {user_id}")
        
    except Exception as e:
        logger.error(f"Error tracking user event: {e}")


async def update_daily_activity(
    db: AsyncIOMotorDatabase,
    user_id: str,
    event_type: str
) -> None:
    """
    Update daily activity summary for a user
    """
    try:
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Increment counters based on event type
        update_fields = {"$inc": {"events_count": 1}}
        
        if event_type == "workout_completed":
            update_fields["$inc"]["workouts_completed"] = 1
        elif event_type == "post_created":
            update_fields["$inc"]["posts_created"] = 1
        elif event_type == "post_commented":
            update_fields["$inc"]["comments_made"] = 1
        elif event_type == "post_liked":
            update_fields["$inc"]["likes_given"] = 1
        elif event_type == "profile_viewed":
            update_fields["$inc"]["profiles_viewed"] = 1
        
        await db.daily_activity.update_one(
            {"user_id": user_id, "date": today},
            {
                **update_fields,
                "$setOnInsert": {
                    "user_id": user_id,
                    "date": today,
                    "created_at": datetime.now(timezone.utc)
                }
            },
            upsert=True
        )
        
    except Exception as e:
        logger.error(f"Error updating daily activity: {e}")


async def get_user_activity_summary(
    db: AsyncIOMotorDatabase,
    user_id: str,
    days: int = 30
) -> Dict[str, Any]:
    """
    Get user activity summary for the past N days
    """
    try:
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Get daily activity records
        activities = await db.daily_activity.find({
            "user_id": user_id,
            "date": {"$gte": start_date}
        }).sort("date", -1).to_list(length=days)
        
        # Calculate totals
        total_workouts = sum(a.get("workouts_completed", 0) for a in activities)
        total_posts = sum(a.get("posts_created", 0) for a in activities)
        total_comments = sum(a.get("comments_made", 0) for a in activities)
        total_likes = sum(a.get("likes_given", 0) for a in activities)
        total_events = sum(a.get("events_count", 0) for a in activities)
        
        # Calculate streak
        streak = await calculate_workout_streak(db, user_id)
        
        return {
            "user_id": user_id,
            "period_days": days,
            "total_workouts": total_workouts,
            "total_posts": total_posts,
            "total_comments": total_comments,
            "total_likes": total_likes,
            "total_events": total_events,
            "current_streak": streak,
            "daily_breakdown": [
                {
                    "date": a["date"].isoformat(),
                    "workouts": a.get("workouts_completed", 0),
                    "posts": a.get("posts_created", 0),
                    "events": a.get("events_count", 0)
                }
                for a in activities
            ]
        }
        
    except Exception as e:
        logger.error(f"Error getting user activity summary: {e}")
        return {}


async def calculate_workout_streak(
    db: AsyncIOMotorDatabase,
    user_id: str
) -> int:
    """
    Calculate current workout streak for a user
    """
    try:
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        streak = 0
        current_date = today
        
        # Check each day backwards until we find a day without workout
        for i in range(365):  # Max 365 days
            activity = await db.daily_activity.find_one({
                "user_id": user_id,
                "date": current_date,
                "workouts_completed": {"$gt": 0}
            })
            
            if activity:
                streak += 1
                current_date = current_date - timedelta(days=1)
            else:
                # Check if it's today - if today has no workout, check yesterday
                if i == 0:
                    current_date = current_date - timedelta(days=1)
                    continue
                break
        
        return streak
        
    except Exception as e:
        logger.error(f"Error calculating workout streak: {e}")
        return 0


async def get_feature_usage_stats(
    db: AsyncIOMotorDatabase,
    user_id: str,
    days: int = 30
) -> Dict[str, Any]:
    """
    Get feature usage statistics for a user
    """
    try:
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Aggregate events by category
        pipeline = [
            {
                "$match": {
                    "user_id": user_id,
                    "timestamp": {"$gte": start_date}
                }
            },
            {
                "$group": {
                    "_id": "$event_category",
                    "count": {"$sum": 1},
                    "events": {"$push": "$event_type"}
                }
            }
        ]
        
        category_stats = await db.user_events.aggregate(pipeline).to_list(length=100)
        
        # Get most used features
        feature_pipeline = [
            {
                "$match": {
                    "user_id": user_id,
                    "timestamp": {"$gte": start_date},
                    "event_category": "feature"
                }
            },
            {
                "$group": {
                    "_id": "$event_type",
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"count": -1}
            },
            {
                "$limit": 10
            }
        ]
        
        top_features = await db.user_events.aggregate(feature_pipeline).to_list(length=10)
        
        return {
            "user_id": user_id,
            "period_days": days,
            "by_category": {
                stat["_id"]: stat["count"]
                for stat in category_stats
            },
            "top_features": [
                {
                    "feature": f["_id"],
                    "usage_count": f["count"]
                }
                for f in top_features
            ]
        }
        
    except Exception as e:
        logger.error(f"Error getting feature usage stats: {e}")
        return {}


async def get_workout_analytics(
    db: AsyncIOMotorDatabase,
    user_id: str,
    days: int = 30
) -> Dict[str, Any]:
    """
    Get detailed workout analytics for a user
    """
    try:
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Get workout events with metadata
        workout_events = await db.user_events.find({
            "user_id": user_id,
            "event_type": {"$in": ["workout_completed", "workout_started"]},
            "timestamp": {"$gte": start_date}
        }).to_list(length=1000)
        
        # Analyze workout patterns
        completed_workouts = [e for e in workout_events if e["event_type"] == "workout_completed"]
        
        # Group by mood category if available
        mood_counts = {}
        difficulty_counts = {}
        
        for workout in completed_workouts:
            metadata = workout.get("metadata", {})
            mood = metadata.get("mood_category")
            difficulty = metadata.get("difficulty")
            
            if mood:
                mood_counts[mood] = mood_counts.get(mood, 0) + 1
            if difficulty:
                difficulty_counts[difficulty] = difficulty_counts.get(difficulty, 0) + 1
        
        # Calculate completion rate
        started = len([e for e in workout_events if e["event_type"] == "workout_started"])
        completed = len(completed_workouts)
        completion_rate = (completed / started * 100) if started > 0 else 0
        
        return {
            "user_id": user_id,
            "period_days": days,
            "total_workouts_completed": completed,
            "total_workouts_started": started,
            "completion_rate": round(completion_rate, 2),
            "workouts_by_mood": mood_counts,
            "workouts_by_difficulty": difficulty_counts,
            "average_workouts_per_week": round(completed / (days / 7), 2) if days >= 7 else completed
        }
        
    except Exception as e:
        logger.error(f"Error getting workout analytics: {e}")
        return {}


async def get_social_engagement_stats(
    db: AsyncIOMotorDatabase,
    user_id: str,
    days: int = 30
) -> Dict[str, Any]:
    """
    Get social engagement statistics for a user
    """
    try:
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Count social events
        social_events = await db.user_events.find({
            "user_id": user_id,
            "event_category": "social",
            "timestamp": {"$gte": start_date}
        }).to_list(length=10000)
        
        posts_created = len([e for e in social_events if e["event_type"] == "post_created"])
        likes_given = len([e for e in social_events if e["event_type"] == "post_liked"])
        comments_made = len([e for e in social_events if e["event_type"] == "post_commented"])
        follows = len([e for e in social_events if e["event_type"] == "user_followed"])
        unfollows = len([e for e in social_events if e["event_type"] == "user_unfollowed"])
        
        # Get user's current social stats from database
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        
        return {
            "user_id": user_id,
            "period_days": days,
            "posts_created": posts_created,
            "likes_given": likes_given,
            "comments_made": comments_made,
            "follows": follows,
            "unfollows": unfollows,
            "net_follows": follows - unfollows,
            "current_followers": user.get("followers_count", 0) if user else 0,
            "current_following": user.get("following_count", 0) if user else 0,
            "engagement_score": posts_created + likes_given + comments_made
        }
        
    except Exception as e:
        logger.error(f"Error getting social engagement stats: {e}")
        return {}


async def get_admin_analytics(
    db: AsyncIOMotorDatabase,
    days: int = 30
) -> Dict[str, Any]:
    """
    Get platform-wide analytics (admin view)
    """
    try:
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Total users
        total_users = await db.users.count_documents({})
        
        # Active users (users with events in period)
        active_users = len(await db.user_events.distinct("user_id", {
            "timestamp": {"$gte": start_date}
        }))
        
        # Daily active users (today)
        dau = len(await db.user_events.distinct("user_id", {
            "timestamp": {"$gte": today}
        }))
        
        # Total workouts completed
        total_workouts = await db.user_events.count_documents({
            "event_type": "workout_completed",
            "timestamp": {"$gte": start_date}
        })
        
        # Total posts created
        total_posts = await db.user_events.count_documents({
            "event_type": "post_created",
            "timestamp": {"$gte": start_date}
        })
        
        # Total likes
        total_likes = await db.user_events.count_documents({
            "event_type": "post_liked",
            "timestamp": {"$gte": start_date}
        })
        
        # Total comments
        total_comments = await db.user_events.count_documents({
            "event_type": "post_commented",
            "timestamp": {"$gte": start_date}
        })
        
        # Total follows
        total_follows = await db.user_events.count_documents({
            "event_type": "user_followed",
            "timestamp": {"$gte": start_date}
        })
        
        # Total unfollows
        total_unfollows = await db.user_events.count_documents({
            "event_type": "user_unfollowed",
            "timestamp": {"$gte": start_date}
        })
        
        # Workouts started (for completion rate)
        workouts_started = await db.user_events.count_documents({
            "event_type": "workout_started",
            "timestamp": {"$gte": start_date}
        })
        
        # Workouts skipped
        workouts_skipped = await db.user_events.count_documents({
            "event_type": "workout_skipped",
            "timestamp": {"$gte": start_date}
        })
        
        # Workouts abandoned
        workouts_abandoned = await db.user_events.count_documents({
            "event_type": "workout_abandoned",
            "timestamp": {"$gte": start_date}
        })
        
        # Profile views
        profile_views = await db.user_events.count_documents({
            "event_type": "profile_viewed",
            "timestamp": {"$gte": start_date}
        })
        
        # App sessions
        app_sessions = await db.user_events.count_documents({
            "event_type": "app_session_start",
            "timestamp": {"$gte": start_date}
        })
        
        # App opens (foreground)
        app_opens = await db.user_events.count_documents({
            "event_type": "app_opened",
            "timestamp": {"$gte": start_date}
        })
        
        # Screen views
        screen_views = await db.user_events.count_documents({
            "event_type": "screen_viewed",
            "timestamp": {"$gte": start_date}
        })
        
        # Tab switches
        tab_switches = await db.user_events.count_documents({
            "event_type": "tab_switched",
            "timestamp": {"$gte": start_date}
        })
        
        # Exercises completed
        exercises_completed = await db.user_events.count_documents({
            "event_type": "exercise_completed",
            "timestamp": {"$gte": start_date}
        })
        
        # Mood selections
        mood_selections = await db.user_events.count_documents({
            "event_type": "mood_selected",
            "timestamp": {"$gte": start_date}
        })
        
        # Equipment selections
        equipment_selections = await db.user_events.count_documents({
            "event_type": "equipment_selected",
            "timestamp": {"$gte": start_date}
        })
        
        # Difficulty selections
        difficulty_selections = await db.user_events.count_documents({
            "event_type": "difficulty_selected",
            "timestamp": {"$gte": start_date}
        })
        
        # New users in period
        new_users = await db.users.count_documents({
            "created_at": {"$gte": start_date}
        })
        
        # Most popular mood categories
        mood_pipeline = [
            {
                "$match": {
                    "event_type": "workout_completed",
                    "timestamp": {"$gte": start_date}
                }
            },
            {
                "$group": {
                    "_id": "$metadata.mood_category",
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"count": -1}
            },
            {
                "$limit": 10
            }
        ]
        
        popular_moods = await db.user_events.aggregate(mood_pipeline).to_list(length=10)
        
        return {
            "period_days": days,
            "total_users": total_users,
            "active_users": active_users,
            "daily_active_users": dau,
            "new_users": new_users,
            "total_workouts_started": workouts_started,
            "total_workouts_completed": total_workouts,
            "total_workouts_skipped": workouts_skipped,
            "total_workouts_abandoned": workouts_abandoned,
            "workout_completion_rate": round((total_workouts / workouts_started * 100), 1) if workouts_started > 0 else 0,
            "total_exercises_completed": exercises_completed,
            "total_posts_created": total_posts,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "total_follows": total_follows,
            "total_unfollows": total_unfollows,
            "total_profile_views": profile_views,
            "total_app_sessions": app_sessions,
            "total_app_opens": app_opens,
            "total_screen_views": screen_views,
            "total_tab_switches": tab_switches,
            "total_mood_selections": mood_selections,
            "total_equipment_selections": equipment_selections,
            "total_difficulty_selections": difficulty_selections,
            "retention_rate": round((active_users / total_users * 100), 2) if total_users > 0 else 0,
            "average_workouts_per_active_user": round(total_workouts / active_users, 2) if active_users > 0 else 0,
            "popular_mood_categories": [
                {"mood": m["_id"], "count": m["count"]}
                for m in popular_moods if m["_id"]
            ]
        }
        
    except Exception as e:
        logger.error(f"Error getting admin analytics: {e}")
        return {}


async def get_user_journey(
    db: AsyncIOMotorDatabase,
    user_id: str,
    limit: int = 100
) -> List[Dict[str, Any]]:
    """
    Get chronological user journey/activity timeline
    """
    try:
        events = await db.user_events.find({
            "user_id": user_id
        }).sort("timestamp", -1).limit(limit).to_list(length=limit)
        
        return [
            {
                "event_type": e["event_type"],
                "category": e["event_category"],
                "timestamp": e["timestamp"].isoformat(),
                "metadata": e.get("metadata", {})
            }
            for e in events
        ]
        
    except Exception as e:
        logger.error(f"Error getting user journey: {e}")
        return []
