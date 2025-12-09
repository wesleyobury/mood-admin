"""
Auth Tracking System
Tracks user authentication events, sessions, and security-related activities
"""
from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class LoginEvent(BaseModel):
    """Model for login events"""
    user_id: str
    login_method: str  # 'google_oauth', 'email_password', 'demo'
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    device_info: Optional[dict] = None
    success: bool
    timestamp: datetime
    failure_reason: Optional[str] = None

class UserSession(BaseModel):
    """Model for active user sessions"""
    user_id: str
    session_token: str
    login_method: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    device_type: Optional[str] = None  # 'mobile', 'desktop', 'tablet'
    created_at: datetime
    last_activity: datetime
    expires_at: datetime
    is_active: bool = True

class AuthMetadata(BaseModel):
    """Auth metadata stored in user document"""
    login_methods: List[str] = []  # List of methods user has used
    first_login_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    total_logins: int = 0
    failed_login_attempts: int = 0
    last_failed_login: Optional[datetime] = None
    password_changed_at: Optional[datetime] = None


async def track_login_event(
    db: AsyncIOMotorDatabase,
    user_id: str,
    login_method: str,
    success: bool,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    device_info: Optional[dict] = None,
    failure_reason: Optional[str] = None
) -> None:
    """
    Track a login event (successful or failed)
    """
    try:
        event = {
            "user_id": user_id,
            "login_method": login_method,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "device_info": device_info,
            "success": success,
            "timestamp": datetime.now(timezone.utc),
            "failure_reason": failure_reason
        }
        
        await db.login_events.insert_one(event)
        logger.info(f"Tracked login event for user {user_id}: method={login_method}, success={success}")
        
    except Exception as e:
        logger.error(f"Error tracking login event: {e}")


async def update_auth_metadata(
    db: AsyncIOMotorDatabase,
    user_id: str,
    login_method: str,
    success: bool
) -> None:
    """
    Update user's auth metadata after login attempt
    """
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return
        
        now = datetime.now(timezone.utc)
        
        # Get current auth metadata or initialize
        auth_meta = user.get("auth_metadata", {})
        login_methods = auth_meta.get("login_methods", [])
        
        if success:
            # Add login method if not already tracked
            if login_method not in login_methods:
                login_methods.append(login_method)
            
            # Update metadata
            update_data = {
                "auth_metadata.login_methods": login_methods,
                "auth_metadata.last_login_at": now,
                "auth_metadata.total_logins": auth_meta.get("total_logins", 0) + 1,
                "auth_metadata.failed_login_attempts": 0  # Reset on successful login
            }
            
            # Set first login if not set
            if not auth_meta.get("first_login_at"):
                update_data["auth_metadata.first_login_at"] = now
            
        else:
            # Track failed attempt
            update_data = {
                "auth_metadata.failed_login_attempts": auth_meta.get("failed_login_attempts", 0) + 1,
                "auth_metadata.last_failed_login": now
            }
        
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        logger.info(f"Updated auth metadata for user {user_id}")
        
    except Exception as e:
        logger.error(f"Error updating auth metadata: {e}")


async def create_session_record(
    db: AsyncIOMotorDatabase,
    user_id: str,
    session_token: str,
    login_method: str,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    device_type: Optional[str] = None,
    expires_at: Optional[datetime] = None
) -> None:
    """
    Create a session record for tracking active sessions
    """
    try:
        now = datetime.now(timezone.utc)
        
        session = {
            "user_id": user_id,
            "session_token": session_token,
            "login_method": login_method,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "device_type": device_type or detect_device_type(user_agent),
            "created_at": now,
            "last_activity": now,
            "expires_at": expires_at or (now + timedelta(days=7)),
            "is_active": True
        }
        
        await db.user_sessions.insert_one(session)
        logger.info(f"Created session record for user {user_id}")
        
    except Exception as e:
        logger.error(f"Error creating session record: {e}")


async def update_session_activity(
    db: AsyncIOMotorDatabase,
    session_token: str
) -> None:
    """
    Update last activity timestamp for a session
    """
    try:
        await db.user_sessions.update_one(
            {"session_token": session_token, "is_active": True},
            {"$set": {"last_activity": datetime.now(timezone.utc)}}
        )
    except Exception as e:
        logger.error(f"Error updating session activity: {e}")


async def deactivate_session(
    db: AsyncIOMotorDatabase,
    session_token: str
) -> None:
    """
    Deactivate a session (logout)
    """
    try:
        await db.user_sessions.update_one(
            {"session_token": session_token},
            {"$set": {"is_active": False, "ended_at": datetime.now(timezone.utc)}}
        )
        logger.info(f"Deactivated session")
    except Exception as e:
        logger.error(f"Error deactivating session: {e}")


async def get_active_sessions(
    db: AsyncIOMotorDatabase,
    user_id: str
) -> List[dict]:
    """
    Get all active sessions for a user
    """
    try:
        sessions = await db.user_sessions.find({
            "user_id": user_id,
            "is_active": True
        }).sort("last_activity", -1).to_list(length=100)
        
        return sessions
    except Exception as e:
        logger.error(f"Error getting active sessions: {e}")
        return []


async def get_login_history(
    db: AsyncIOMotorDatabase,
    user_id: str,
    limit: int = 50
) -> List[dict]:
    """
    Get login history for a user
    """
    try:
        events = await db.login_events.find({
            "user_id": user_id
        }).sort("timestamp", -1).limit(limit).to_list(length=limit)
        
        return events
    except Exception as e:
        logger.error(f"Error getting login history: {e}")
        return []


async def track_password_change(
    db: AsyncIOMotorDatabase,
    user_id: str
) -> None:
    """
    Track when a user changes their password
    """
    try:
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"auth_metadata.password_changed_at": datetime.now(timezone.utc)}}
        )
        logger.info(f"Tracked password change for user {user_id}")
    except Exception as e:
        logger.error(f"Error tracking password change: {e}")


def detect_device_type(user_agent: Optional[str]) -> str:
    """
    Detect device type from user agent string
    """
    if not user_agent:
        return "unknown"
    
    user_agent_lower = user_agent.lower()
    
    if any(mobile in user_agent_lower for mobile in ['mobile', 'android', 'iphone', 'ipod']):
        return "mobile"
    elif 'tablet' in user_agent_lower or 'ipad' in user_agent_lower:
        return "tablet"
    else:
        return "desktop"


def get_client_ip(request) -> Optional[str]:
    """
    Extract client IP from request
    """
    # Check common headers for proxied requests
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fallback to direct client
    if hasattr(request.client, 'host'):
        return request.client.host
    
    return None


def get_user_agent(request) -> Optional[str]:
    """
    Extract user agent from request
    """
    return request.headers.get("User-Agent")


# Import timedelta for expires_at calculation
from datetime import timedelta
