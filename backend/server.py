from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import jwt
import bcrypt
import base64
import aiofiles
from auth import (
    exchange_session_id_for_token,
    create_or_update_user,
    store_session,
    get_user_from_session_token,
    delete_session,
    set_session_cookie,
    clear_session_cookie,
    get_session_token_from_request
)
from auth_tracking import (
    track_login_event,
    update_auth_metadata,
    create_session_record,
    deactivate_session,
    get_active_sessions,
    get_login_history,
    get_client_ip,
    get_user_agent
)
from user_analytics import (
    track_user_event,
    get_user_activity_summary,
    get_feature_usage_stats,
    get_workout_analytics,
    get_social_engagement_stats,
    get_admin_analytics,
    get_user_journey,
    get_all_users_detail,
    get_new_users_detail,
    get_screen_views_breakdown,
    get_mood_selections_breakdown,
    get_equipment_selections_breakdown,
    get_difficulty_selections_breakdown,
    get_exercises_breakdown,
    get_social_activity_breakdown,
    get_workout_funnel_detail
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'mood-app-secret-key-2025')
JWT_ALGORITHM = 'HS256'

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Helper functions
def create_jwt_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc).timestamp() + (7 * 24 * 3600)  # 7 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user_id
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Pydantic Models

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    followers_count: int = 0
    following_count: int = 0
    workouts_count: int = 0
    current_streak: int = 0
    created_at: datetime

class WorkoutCreate(BaseModel):
    title: str
    mood_category: str  # One of the 7 mood types
    exercises: List[Dict[str, Any]]
    duration: int  # in minutes
    difficulty: str  # beginner, intermediate, advanced
    equipment: List[str] = []
    calories_estimate: Optional[int] = None

class WorkoutResponse(BaseModel):
    id: str
    title: str
    mood_category: str
    exercises: List[Dict[str, Any]]
    duration: int
    difficulty: str
    equipment: List[str]
    calories_estimate: Optional[int] = None
    created_at: datetime

class UserWorkoutCreate(BaseModel):
    workout_id: str
    completed_at: Optional[datetime] = None
    duration_actual: Optional[int] = None  # actual duration completed
    notes: Optional[str] = None
    mood_before: Optional[str] = None
    mood_after: Optional[str] = None

class PostCreate(BaseModel):
    workout_id: Optional[str] = None
    caption: str
    media_urls: List[str] = []  # URLs to uploaded media files
    hashtags: List[str] = []
    cover_urls: Optional[dict] = None  # Map of media index to cover image URL

class CredentialsUpdate(BaseModel):
    current_password: str
    new_username: Optional[str] = None
    new_email: Optional[str] = None
    new_password: Optional[str] = None

class PostResponse(BaseModel):
    id: str
    author: UserResponse
    workout: Optional[WorkoutResponse] = None
    caption: str
    media_urls: List[str] = []
    hashtags: List[str] = []
    cover_urls: Optional[dict] = None  # Map of media index to cover image URL
    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False
    created_at: datetime

class CommentCreate(BaseModel):
    post_id: str
    text: str

class FollowResponse(BaseModel):
    follower: UserResponse
    following: UserResponse
    created_at: datetime

# Authentication Endpoints

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if username or email already exists
    existing_user = await db.users.find_one({
        "$or": [
            {"username": user_data.username},
            {"email": user_data.email}
        ]
    })
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    # Hash password
    hashed_password = bcrypt.hashpw(user_data.password.encode(), bcrypt.gensalt()).decode()
    
    # Create user with generated user_id
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    
    user_doc = {
        "user_id": user_id,
        "username": user_data.username,
        "email": user_data.email,
        "password": hashed_password,
        "name": user_data.name or user_data.username,
        "bio": "",
        "avatar": "",
        "followers_count": 0,
        "following_count": 0,
        "workouts_count": 0,
        "current_streak": 0,
        "longest_streak": 0,
        "total_workouts": 0,
        "following": [],
        "followers": [],
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.users.insert_one(user_doc)
    
    # Track user signup event
    await db.user_events.insert_one({
        "user_id": user_id,
        "event_type": "user_registered",
        "timestamp": datetime.now(timezone.utc),
        "metadata": {
            "username": user_data.username,
            "email": user_data.email,
            "registration_method": "email_password"
        }
    })
    logger.info(f"New user registered: {user_data.username} ({user_data.email})")
    
    # Generate JWT token
    token = create_jwt_token(user_id)
    
    return {
        "message": "User created successfully",
        "token": token,
        "user_id": user_id
    }

@api_router.post("/auth/login")
async def login(login_data: UserLogin, request: Request):
    user_id = None
    success = False
    
    # Get client info
    ip_address = get_client_ip(request)
    user_agent = get_user_agent(request)
    
    try:
        # Find user by username OR email (case insensitive)
        import re
        login_identifier = login_data.username.strip()
        escaped_identifier = re.escape(login_identifier)
        user = await db.users.find_one({
            "$or": [
                {"username": {"$regex": f"^{escaped_identifier}$", "$options": "i"}},
                {"email": {"$regex": f"^{escaped_identifier}$", "$options": "i"}}
            ]
        })
        if not user:
            logger.info(f"Login failed: User {login_identifier} not found")
            # Track failed login attempt
            await track_login_event(
                db, "unknown", "email_password", False,
                ip_address, user_agent, failure_reason="User not found"
            )
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user_id = str(user["_id"])
        logger.info(f"Login attempt for user: {user.get('username')} (searched: {login_identifier})")
        logger.info(f"User has password field: {'password' in user}")
        
        # Verify password
        try:
            stored_password = user.get("password") or user.get("password_hash")
            if not stored_password:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            if isinstance(stored_password, bytes):
                password_match = bcrypt.checkpw(login_data.password.encode(), stored_password)
            else:
                password_match = bcrypt.checkpw(login_data.password.encode(), stored_password.encode())
            
            logger.info(f"Password match result: {password_match}")
            if not password_match:
                # Track failed login - wrong password
                await track_login_event(
                    db, user_id, "email_password", False,
                    ip_address, user_agent, failure_reason="Invalid password"
                )
                await update_auth_metadata(db, user_id, "email_password", False)
                raise HTTPException(status_code=401, detail="Invalid credentials")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Password verification error: {e}")
            await track_login_event(
                db, user_id, "email_password", False,
                ip_address, user_agent, failure_reason="Password verification error"
            )
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Generate JWT token
        token = create_jwt_token(str(user["_id"]))
        
        # Track successful login
        success = True
        await track_login_event(
            db, user_id, "email_password", True,
            ip_address, user_agent
        )
        await update_auth_metadata(db, user_id, "email_password", True)
        await create_session_record(
            db, user_id, token, "email_password",
            ip_address, user_agent
        )
        
        logger.info(f"Login successful for: {login_data.username}")
        return {
            "message": "Login successful",
            "token": token,
            "user_id": str(user["_id"])
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected login error: {e}")
        if user_id:
            await track_login_event(
                db, user_id, "email_password", False,
                ip_address, user_agent, failure_reason=str(e)
            )
        raise HTTPException(status_code=500, detail="Login failed")

# Emergent Auth Endpoints

@api_router.post("/auth/oauth/callback")
async def emergent_auth_callback(
    session_id: str,
    response: Response
):
    """
    Handle OAuth callback from Emergent Auth
    Exchange session_id for user data and create/update user session
    """
    logger.info(f"Processing Emergent Auth callback with session_id")
    
    # Exchange session_id for user data
    user_data = await exchange_session_id_for_token(session_id)
    
    # Create or get existing user
    user_id = await create_or_update_user(db, user_data)
    
    # Store session in database
    await store_session(db, user_id, user_data.session_token)
    
    # Set httpOnly cookie
    set_session_cookie(response, user_data.session_token)
    
    logger.info(f"OAuth login successful for: {user_data.email}")
    
    return {
        "message": "Login successful",
        "session_token": user_data.session_token,
        "user_id": user_id
    }

class AppleAuthRequest(BaseModel):
    user_id: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    identity_token: Optional[str] = None
    authorization_code: Optional[str] = None

@api_router.post("/auth/apple")
async def apple_sign_in(
    auth_data: AppleAuthRequest,
    request: Request,
    response: Response
):
    """
    Handle Apple Sign-In authentication
    Creates or updates user based on Apple credentials
    """
    logger.info(f"Processing Apple Sign-In for user_id: {auth_data.user_id}")
    
    try:
        # Check if user already exists with this Apple ID
        existing_user = await db.users.find_one({"apple_user_id": auth_data.user_id})
        
        if existing_user:
            # User exists, log them in
            # Handle both user_id field and _id (ObjectId) for backwards compatibility
            if "user_id" in existing_user:
                user_id = existing_user["user_id"]
            else:
                user_id = str(existing_user["_id"])
                # Add user_id field for future consistency
                await db.users.update_one(
                    {"_id": existing_user["_id"]},
                    {"$set": {"user_id": user_id}}
                )
            username = existing_user.get("username")
            email = existing_user.get("email")
            logger.info(f"Existing Apple user found: {username}")
        else:
            # Create new user
            # Generate username from email or Apple user ID
            if auth_data.email:
                base_username = auth_data.email.split('@')[0]
            elif auth_data.full_name:
                base_username = auth_data.full_name.lower().replace(' ', '_')
            else:
                base_username = f"apple_user_{auth_data.user_id[:8]}"
            
            # Ensure unique username
            username = base_username
            counter = 1
            while await db.users.find_one({"username": username}):
                username = f"{base_username}_{counter}"
                counter += 1
            
            email = auth_data.email or f"{auth_data.user_id}@apple.privaterelay.com"
            
            # Generate user_id before insert for consistency
            user_id = f"apple_{uuid.uuid4().hex[:12]}"
            
            new_user = {
                "user_id": user_id,
                "username": username,
                "email": email,
                "name": auth_data.full_name,
                "apple_user_id": auth_data.user_id,
                "password_hash": None,  # No password for Apple Sign-In users
                "created_at": datetime.now(timezone.utc),
                "current_streak": 0,
                "longest_streak": 0,
                "total_workouts": 0,
                "avatar": None,
                "bio": "",
                "auth_provider": "apple",
                "auth_metadata": {
                    "login_methods": ["apple"],
                    "first_login_at": datetime.now(timezone.utc),
                    "last_login_at": datetime.now(timezone.utc),
                    "total_logins": 1
                }
            }
            
            await db.users.insert_one(new_user)
            logger.info(f"Created new Apple user: {username} with user_id: {user_id}")
        
        # Generate session token
        session_token = jwt.encode(
            {
                "user_id": user_id,
                "username": username,
                "email": email,
                "auth_provider": "apple",
                "exp": datetime.now(timezone.utc).timestamp() + (30 * 24 * 60 * 60)  # 30 days
            },
            os.getenv("JWT_SECRET", "your-secret-key"),
            algorithm="HS256"
        )
        
        # Update last login - use user_id field or _id depending on format
        if user_id.startswith("apple_") or user_id.startswith("user_"):
            await db.users.update_one(
                {"user_id": user_id},
                {
                    "$set": {
                        "auth_metadata.last_login_at": datetime.now(timezone.utc)
                    },
                    "$inc": {
                        "auth_metadata.total_logins": 1
                    }
                }
            )
        else:
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {
                        "auth_metadata.last_login_at": datetime.now(timezone.utc)
                    },
                    "$inc": {
                        "auth_metadata.total_logins": 1
                    }
                }
            )
        
        # Track login event
        await track_login_event(db, user_id, "apple", True, get_client_ip(request), get_user_agent(request))
        
        # Create session record
        await create_session_record(db, user_id, session_token, get_client_ip(request), get_user_agent(request))
        
        # Set cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=30 * 24 * 60 * 60  # 30 days
        )
        
        logger.info(f"Apple Sign-In successful for: {username}")
        
        return {
            "message": "Login successful",
            "session_token": session_token,
            "user_id": user_id,
            "username": username
        }
        
    except Exception as e:
        logger.error(f"Apple Sign-In error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")

@api_router.get("/auth/session")
async def check_session(request: Request):
    """
    Check if current session is valid
    Returns user data if authenticated, 401 if not
    """
    session_token = await get_session_token_from_request(request)
    
    if not session_token:
        raise HTTPException(status_code=401, detail="No session token provided")
    
    user = await get_user_from_session_token(db, session_token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    return {
        "authenticated": True,
        "user": {
            "user_id": user["user_id"],
            "email": user["email"],
            "username": user["username"],
            "name": user["name"],
            "avatar": user.get("avatar")
        }
    }

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """
    Logout user and clear session
    """
    session_token = await get_session_token_from_request(request)
    
    if session_token:
        await delete_session(db, session_token)
    
    clear_session_cookie(response)
    
    return {"message": "Logged out successfully"}


# Auth Tracking Endpoints

@api_router.get("/auth/sessions")
async def get_user_sessions(current_user_id: str = Depends(get_current_user)):
    """
    Get all active sessions for the current user
    """
    sessions = await get_active_sessions(db, current_user_id)
    
    # Format response
    formatted_sessions = []
    for session in sessions:
        formatted_sessions.append({
            "session_token": session["session_token"][:20] + "...",  # Truncate for security
            "login_method": session["login_method"],
            "device_type": session.get("device_type", "unknown"),
            "ip_address": session.get("ip_address"),
            "created_at": session["created_at"].isoformat(),
            "last_activity": session["last_activity"].isoformat(),
            "is_current": False  # Could enhance to detect current session
        })
    
    return {"sessions": formatted_sessions, "total": len(formatted_sessions)}


@api_router.get("/auth/login-history")
async def get_user_login_history(
    current_user_id: str = Depends(get_current_user),
    limit: int = 50
):
    """
    Get login history for the current user
    """
    history = await get_login_history(db, current_user_id, limit)
    
    # Format response
    formatted_history = []
    for event in history:
        formatted_history.append({
            "login_method": event["login_method"],
            "success": event["success"],
            "ip_address": event.get("ip_address"),
            "device_info": event.get("device_info"),
            "timestamp": event["timestamp"].isoformat(),
            "failure_reason": event.get("failure_reason")
        })
    
    return {"history": formatted_history, "total": len(formatted_history)}


@api_router.get("/auth/metadata")
async def get_auth_metadata(current_user_id: str = Depends(get_current_user)):
    """
    Get authentication metadata for the current user
    """
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    auth_meta = user.get("auth_metadata", {})
    
    return {
        "login_methods": auth_meta.get("login_methods", []),
        "first_login_at": auth_meta.get("first_login_at").isoformat() if auth_meta.get("first_login_at") else None,
        "last_login_at": auth_meta.get("last_login_at").isoformat() if auth_meta.get("last_login_at") else None,
        "total_logins": auth_meta.get("total_logins", 0),
        "failed_login_attempts": auth_meta.get("failed_login_attempts", 0),
        "last_failed_login": auth_meta.get("last_failed_login").isoformat() if auth_meta.get("last_failed_login") else None
    }


# User Analytics Endpoints

class TrackEventRequest(BaseModel):
    event_type: str
    metadata: Optional[dict] = None

@api_router.post("/analytics/track")
async def track_event(
    request: TrackEventRequest,
    current_user_id: str = Depends(get_current_user)
):
    """
    Track a user event
    """
    await track_user_event(db, current_user_id, request.event_type, request.metadata)
    return {"message": "Event tracked successfully"}


@api_router.get("/analytics/activity-summary")
async def get_activity_summary(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get user activity summary for the past N days
    """
    summary = await get_user_activity_summary(db, current_user_id, days)
    return summary


@api_router.get("/analytics/feature-usage")
async def get_feature_usage(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get feature usage statistics
    """
    stats = await get_feature_usage_stats(db, current_user_id, days)
    return stats


@api_router.get("/analytics/workout-stats")
async def get_workout_stats(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get workout analytics
    """
    analytics = await get_workout_analytics(db, current_user_id, days)
    return analytics


@api_router.get("/analytics/social-stats")
async def get_social_stats(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get social engagement statistics
    """
    stats = await get_social_engagement_stats(db, current_user_id, days)
    return stats


@api_router.get("/analytics/user-journey")
async def get_journey(
    limit: int = 100,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get user activity timeline/journey
    """
    journey = await get_user_journey(db, current_user_id, limit)
    return {"journey": journey, "total": len(journey)}


@api_router.get("/analytics/admin/platform-stats")
async def get_platform_stats(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get platform-wide analytics (admin only)
    Note: In production, add admin role check here
    """
    # TODO: Add admin role verification
    # For now, any authenticated user can access
    stats = await get_admin_analytics(db, days)
    return stats


# ============================================
# TIME-SERIES ANALYTICS ENDPOINTS
# ============================================

@api_router.get("/analytics/admin/time-series/{metric_type}")
async def get_time_series_analytics(
    metric_type: str,
    period: str = "day",  # day, week, month
    limit: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get time-series data for various metrics.
    
    metric_type options:
    - active_users: Unique users with activity
    - app_sessions: Total app sessions started
    - screen_views: Total screen views
    - screen_time: Total time spent (in minutes)
    - workouts_started: Workouts initiated
    - workouts_completed: Workouts finished
    - mood_selections: Mood/goal selections made
    - posts_created: New posts created
    - social_interactions: Likes, comments, follows combined
    """
    from collections import defaultdict
    
    # Determine time grouping
    if period == "month":
        days_back = 365
        date_format = "%Y-%m"
    elif period == "week":
        days_back = 180
        date_format = "%Y-W%V"
    else:  # day
        days_back = 30 if limit <= 30 else limit
        date_format = "%Y-%m-%d"
    
    cutoff = datetime.now(timezone.utc) - timedelta(days=days_back)
    
    try:
        data_by_period = defaultdict(lambda: {"count": 0, "value": 0})
        
        if metric_type == "active_users":
            # Count unique users per period
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}},
                {"user_id": 1, "timestamp": 1}
            ).to_list(100000)
            
            users_by_period = defaultdict(set)
            for event in events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    users_by_period[period_key].add(event.get("user_id"))
            
            for period_key, users in users_by_period.items():
                data_by_period[period_key]["count"] = len(users)
                
        elif metric_type == "app_sessions":
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}, "event_type": "app_session_start"},
                {"timestamp": 1}
            ).to_list(100000)
            
            for event in events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    data_by_period[period_key]["count"] += 1
                    
        elif metric_type == "screen_views":
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}, "event_type": {"$in": ["screen_viewed", "screen_entered"]}},
                {"timestamp": 1}
            ).to_list(100000)
            
            for event in events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    data_by_period[period_key]["count"] += 1
                    
        elif metric_type == "screen_time":
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}, "event_type": "screen_time_spent"},
                {"timestamp": 1, "metadata": 1}
            ).to_list(100000)
            
            for event in events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    duration = event.get("metadata", {}).get("duration_seconds", 0)
                    data_by_period[period_key]["count"] += 1
                    data_by_period[period_key]["value"] += duration / 60  # Convert to minutes
                    
        elif metric_type == "workouts_started":
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}, "event_type": "workout_started"},
                {"timestamp": 1}
            ).to_list(100000)
            
            for event in events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    data_by_period[period_key]["count"] += 1
                    
        elif metric_type == "workouts_completed":
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}, "event_type": "workout_completed"},
                {"timestamp": 1}
            ).to_list(100000)
            
            for event in events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    data_by_period[period_key]["count"] += 1
                    
        elif metric_type == "mood_selections":
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}, "event_type": "mood_selected"},
                {"timestamp": 1, "metadata": 1}
            ).to_list(100000)
            
            for event in events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    data_by_period[period_key]["count"] += 1
                    
        elif metric_type == "posts_created":
            posts = await db.posts.find(
                {"created_at": {"$gte": cutoff}},
                {"created_at": 1}
            ).to_list(100000)
            
            for post in posts:
                if post.get("created_at"):
                    period_key = post["created_at"].strftime(date_format)
                    data_by_period[period_key]["count"] += 1
                    
        elif metric_type == "social_interactions":
            # Likes, comments, follows
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}, "event_type": {"$in": ["post_liked", "post_commented", "user_followed"]}},
                {"timestamp": 1, "event_type": 1}
            ).to_list(100000)
            
            for event in events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    data_by_period[period_key]["count"] += 1
                    
        elif metric_type == "new_users":
            users = await db.users.find(
                {"created_at": {"$gte": cutoff}},
                {"created_at": 1}
            ).to_list(100000)
            
            for user in users:
                if user.get("created_at"):
                    period_key = user["created_at"].strftime(date_format)
                    data_by_period[period_key]["count"] += 1
        
        # Format response
        sorted_data = sorted(data_by_period.items(), key=lambda x: x[0])[-limit:]
        
        labels = []
        values = []
        secondary_values = []
        
        for date_key, data in sorted_data:
            # Format label
            if period == "month":
                try:
                    dt = datetime.strptime(date_key, "%Y-%m")
                    labels.append(dt.strftime("%b '%y"))
                except:
                    labels.append(date_key)
            elif period == "week":
                labels.append(f"W{date_key.split('W')[1]}")
            else:
                try:
                    dt = datetime.strptime(date_key, "%Y-%m-%d")
                    labels.append(dt.strftime("%m/%d"))
                except:
                    labels.append(date_key[-5:])
            
            values.append(data["count"])
            secondary_values.append(round(data["value"], 1) if data["value"] else 0)
        
        return {
            "metric_type": metric_type,
            "period": period,
            "labels": labels,
            "values": values,
            "secondary_values": secondary_values,  # For metrics like screen_time (minutes)
            "total": sum(values),
            "average": round(sum(values) / len(values), 1) if values else 0,
        }
        
    except Exception as e:
        logger.error(f"Error getting time-series for {metric_type}: {e}")
        return {
            "metric_type": metric_type,
            "period": period,
            "labels": [],
            "values": [],
            "secondary_values": [],
            "total": 0,
            "average": 0,
        }


@api_router.get("/analytics/admin/breakdown/{metric_type}")
async def get_metric_breakdown(
    metric_type: str,
    period: str = "day",
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get detailed breakdown of a metric with sub-categories.
    
    metric_type options:
    - screen_views: Breakdown by screen name
    - mood_selections: Breakdown by mood type
    - social_interactions: Breakdown by interaction type
    """
    from collections import defaultdict
    
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    
    try:
        if metric_type == "screen_views":
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}, "event_type": {"$in": ["screen_viewed", "screen_entered"]}},
                {"metadata": 1}
            ).to_list(100000)
            
            breakdown = defaultdict(int)
            for event in events:
                screen = event.get("metadata", {}).get("screen_name", "Unknown")
                breakdown[screen] += 1
            
            items = [{"name": k, "count": v} for k, v in sorted(breakdown.items(), key=lambda x: -x[1])[:20]]
            return {"metric_type": metric_type, "items": items, "total": sum(breakdown.values())}
            
        elif metric_type == "mood_selections":
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}, "event_type": "mood_selected"},
                {"metadata": 1}
            ).to_list(100000)
            
            mood_names = {
                "sweat": "I Want to Sweat",
                "energize": "Energize Me",
                "stress": "Stress Relief",
                "strength": "Build Strength",
                "lazy": "Lazy Day Workout",
            }
            
            breakdown = defaultdict(int)
            for event in events:
                mood = event.get("metadata", {}).get("mood", "Unknown")
                breakdown[mood_names.get(mood, mood)] += 1
            
            items = [{"name": k, "count": v} for k, v in sorted(breakdown.items(), key=lambda x: -x[1])]
            return {"metric_type": metric_type, "items": items, "total": sum(breakdown.values())}
            
        elif metric_type == "social_interactions":
            events = await db.user_events.find(
                {"timestamp": {"$gte": cutoff}, "event_type": {"$in": ["post_liked", "post_commented", "user_followed", "user_unfollowed"]}},
                {"event_type": 1}
            ).to_list(100000)
            
            type_names = {
                "post_liked": "Likes",
                "post_commented": "Comments",
                "user_followed": "Follows",
                "user_unfollowed": "Unfollows",
            }
            
            breakdown = defaultdict(int)
            for event in events:
                event_type = event.get("event_type", "Unknown")
                breakdown[type_names.get(event_type, event_type)] += 1
            
            items = [{"name": k, "count": v} for k, v in sorted(breakdown.items(), key=lambda x: -x[1])]
            return {"metric_type": metric_type, "items": items, "total": sum(breakdown.values())}
            
        return {"metric_type": metric_type, "items": [], "total": 0}
        
    except Exception as e:
        logger.error(f"Error getting breakdown for {metric_type}: {e}")
        return {"metric_type": metric_type, "items": [], "total": 0}


# ============================================
# DETAILED ANALYTICS DRILL-DOWN ENDPOINTS
# ============================================

@api_router.get("/analytics/admin/users")
async def get_users_detail_endpoint(
    days: int = 30,
    limit: int = 100,
    skip: int = 0,
    current_user_id: str = Depends(get_current_user)
):
    """Get all users with activity summary"""
    return await get_all_users_detail(db, days, limit, skip)


@api_router.get("/analytics/admin/users/new")
async def get_new_users_endpoint(
    days: int = 30,
    limit: int = 100,
    current_user_id: str = Depends(get_current_user)
):
    """Get new users who joined in the period"""
    return await get_new_users_detail(db, days, limit)


@api_router.get("/analytics/admin/users/signup-trend")
async def get_signup_trend_endpoint(
    period: str = "day",  # day, week, month
    limit: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """Get user signup trends grouped by day, week, or month"""
    try:
        # Determine the date grouping format
        if period == "month":
            date_format = "%Y-%m"
            days_back = 365
        elif period == "week":
            date_format = "%Y-W%V"
            days_back = 180
        else:  # day
            date_format = "%Y-%m-%d"
            days_back = 30
        
        cutoff = datetime.now(timezone.utc) - timedelta(days=days_back)
        
        # Get all users created after cutoff
        users = await db.users.find(
            {"created_at": {"$gte": cutoff}},
            {"created_at": 1}
        ).to_list(10000)
        
        # Group by period
        from collections import defaultdict
        signup_counts = defaultdict(int)
        
        for user in users:
            if user.get("created_at"):
                created_at = user["created_at"]
                if period == "week":
                    # Format as year-week
                    period_key = created_at.strftime("%Y-W%V")
                elif period == "month":
                    period_key = created_at.strftime("%Y-%m")
                else:
                    period_key = created_at.strftime("%Y-%m-%d")
                signup_counts[period_key] += 1
        
        # Sort by date and limit
        sorted_data = sorted(signup_counts.items(), key=lambda x: x[0], reverse=True)[:limit]
        sorted_data.reverse()  # Chronological order
        
        # Format for chart
        labels = []
        values = []
        for date_key, count in sorted_data:
            if period == "month":
                # Format as "Jan", "Feb", etc.
                try:
                    dt = datetime.strptime(date_key, "%Y-%m")
                    labels.append(dt.strftime("%b"))
                except:
                    labels.append(date_key[-2:])
            elif period == "week":
                # Format as "W1", "W2", etc.
                labels.append(f"W{date_key.split('W')[1]}")
            else:
                # Format as "12/15", "12/16", etc.
                try:
                    dt = datetime.strptime(date_key, "%Y-%m-%d")
                    labels.append(dt.strftime("%m/%d"))
                except:
                    labels.append(date_key[-5:])
            values.append(count)
        
        return {
            "period": period,
            "labels": labels,
            "values": values,
            "total": sum(values),
        }
        
    except Exception as e:
        logger.error(f"Error getting signup trend: {e}")
        return {
            "period": period,
            "labels": [],
            "values": [],
            "total": 0,
        }


@api_router.get("/analytics/admin/users/active")
async def get_active_users_endpoint(
    days: int = 30,
    limit: int = 100,
    current_user_id: str = Depends(get_current_user)
):
    """Get users who were active in the specified period (based on any tracked event)"""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    
    logger.info(f"Fetching active users for last {days} days")
    
    # Find unique user IDs from user_events in the period
    active_user_ids = await db.user_events.distinct(
        "user_id",
        {"timestamp": {"$gte": cutoff}}
    )
    
    logger.info(f"Found {len(active_user_ids)} unique active user IDs: {active_user_ids}")
    
    # Get user details for these active users
    users = []
    for user_id in active_user_ids[:limit]:
        try:
            logger.info(f"Looking up user: {user_id}")
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            if user:
                logger.info(f"Found user: {user.get('username')}")
                # Get activity counts for this user
                event_count = await db.user_events.count_documents({
                    "user_id": user_id,
                    "timestamp": {"$gte": cutoff}
                })
                
                users.append({
                    "user_id": str(user["_id"]),
                    "username": user.get("username", "Unknown"),
                    "email": user.get("email", ""),
                    "avatar_url": user.get("avatar"),
                    "app_sessions": event_count,
                    "created_at": user.get("created_at").isoformat() if user.get("created_at") else None,
                })
            else:
                logger.warning(f"User not found for ID: {user_id}")
        except Exception as e:
            logger.error(f"Error looking up user {user_id}: {e}")
            continue
    
    logger.info(f"Returning {len(users)} users")
    
    # Sort by activity count
    users.sort(key=lambda x: x.get("app_sessions", 0), reverse=True)
    
    return {
        "users": users,
        "total": len(active_user_ids),
        "period_days": days
    }


@api_router.get("/analytics/admin/users/daily-active")
async def get_daily_active_users_endpoint(
    limit: int = 100,
    current_user_id: str = Depends(get_current_user)
):
    """Get users who were active in the last 24 hours"""
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    
    logger.info(f"Fetching daily active users (last 24 hours)")
    
    # Find unique user IDs from user_events in the last 24 hours
    daily_active_user_ids = await db.user_events.distinct(
        "user_id",
        {"timestamp": {"$gte": cutoff}}
    )
    
    logger.info(f"Found {len(daily_active_user_ids)} daily active user IDs: {daily_active_user_ids}")
    
    # Get user details
    users = []
    for user_id in daily_active_user_ids[:limit]:
        try:
            logger.info(f"Looking up user: {user_id}")
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            if user:
                logger.info(f"Found user: {user.get('username')}")
                # Get latest activity
                latest_event = await db.user_events.find_one(
                    {"user_id": user_id},
                    sort=[("timestamp", -1)]
                )
                
                users.append({
                    "user_id": str(user["_id"]),
                    "username": user.get("username", "Unknown"),
                    "email": user.get("email", ""),
                    "avatar_url": user.get("avatar"),
                    "last_active": latest_event["timestamp"].isoformat() if latest_event and latest_event.get("timestamp") else None,
                    "created_at": user.get("created_at").isoformat() if user.get("created_at") else None,
                })
            else:
                logger.warning(f"User not found for ID: {user_id}")
        except Exception as e:
            logger.error(f"Error looking up user {user_id}: {e}")
            continue
    
    logger.info(f"Returning {len(users)} daily active users")
    
    return {
        "users": users,
        "total": len(daily_active_user_ids),
        "period": "24 hours"
    }


@api_router.get("/analytics/admin/screens")
async def get_screens_breakdown_endpoint(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """Get breakdown of screen views"""
    return await get_screen_views_breakdown(db, days)


@api_router.get("/analytics/admin/moods")
async def get_moods_breakdown_endpoint(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """Get breakdown of mood selections"""
    return await get_mood_selections_breakdown(db, days)


@api_router.get("/analytics/admin/equipment")
async def get_equipment_breakdown_endpoint(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """Get breakdown of equipment selections with mood paths"""
    return await get_equipment_selections_breakdown(db, days)


@api_router.get("/analytics/admin/difficulties")
async def get_difficulties_breakdown_endpoint(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """Get breakdown of difficulty selections"""
    return await get_difficulty_selections_breakdown(db, days)


@api_router.get("/analytics/admin/exercises")
async def get_exercises_breakdown_endpoint(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """Get breakdown of exercises completed"""
    return await get_exercises_breakdown(db, days)


@api_router.get("/analytics/admin/social")
async def get_social_breakdown_endpoint(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """Get breakdown of social activity"""
    return await get_social_activity_breakdown(db, days)


@api_router.get("/analytics/admin/workout-funnel")
async def get_workout_funnel_endpoint(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """Get detailed workout funnel data"""
    return await get_workout_funnel_detail(db, days)



# User Endpoints

@api_router.get("/users/me", response_model=UserResponse)
async def get_current_user_info(current_user_id: str = Depends(get_current_user)):
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        email=user["email"],
        name=user.get("name"),
        bio=user.get("bio", ""),
        avatar=user.get("avatar", ""),
        followers_count=user.get("followers_count", 0),
        following_count=user.get("following_count", 0),
        workouts_count=user.get("workouts_count", 0),
        current_streak=user.get("current_streak", 0),
        created_at=user["created_at"]
    )


@api_router.get("/users/me/stats")
async def get_current_user_stats(current_user_id: str = Depends(get_current_user)):
    """Get user's workout stats from tracking events"""
    from datetime import datetime, timedelta, timezone
    
    # Get user document for stored streak
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    stored_streak = user.get("current_streak", 0) if user else 0
    
    # Count completed workouts
    workouts_completed = await db.user_events.count_documents({
        "user_id": current_user_id,
        "event_type": "workout_completed"
    })
    
    # Calculate total minutes (estimate based on workouts - average 20 mins per workout)
    total_minutes = workouts_completed * 20
    
    # Use stored streak if available, otherwise calculate from activity
    if stored_streak > 0:
        current_streak = stored_streak
    else:
        # Calculate streak (count consecutive days with any activity)
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        current_streak = 0
        
        for i in range(30):  # Check last 30 days
            day_start = today - timedelta(days=i)
            day_end = day_start + timedelta(days=1)
            
            # Check for any activity (workout completion or app session)
            day_activity = await db.user_events.count_documents({
                "user_id": current_user_id,
                "event_type": {"$in": ["workout_completed", "app_session_start", "app_opened"]},
                "timestamp": {"$gte": day_start, "$lt": day_end}
            })
            
            if day_activity > 0:
                current_streak += 1
            elif i > 0:  # Allow today to be 0 without breaking streak
                break
    
    return {
        "workouts_completed": workouts_completed,
        "total_minutes": total_minutes,
        "current_streak": current_streak
    }


@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str):
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            id=str(user["_id"]),
            username=user["username"],
            email=user["email"],
            name=user.get("name"),
            bio=user.get("bio", ""),
            avatar=user.get("avatar", ""),
            followers_count=user.get("followers_count", 0),
            following_count=user.get("following_count", 0),
            workouts_count=user.get("workouts_count", 0),
            current_streak=user.get("current_streak", 0),
            created_at=user["created_at"]
        )
    except:
        raise HTTPException(status_code=404, detail="User not found")

class UserUpdate(BaseModel):
    username: Optional[str] = None
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None

@api_router.put("/users/me")
async def update_profile(
    user_data: UserUpdate,
    current_user_id: str = Depends(get_current_user)
):
    """Update current user's profile"""
    update_fields = {}
    
    # Check if username is being changed and if it's available
    if user_data.username is not None:
        username = user_data.username.strip()
        if not username:
            raise HTTPException(status_code=400, detail="Username cannot be empty")
        
        # Check if username is already taken by another user
        existing_user = await db.users.find_one({"username": username})
        if existing_user and str(existing_user["_id"]) != current_user_id:
            raise HTTPException(status_code=400, detail="Username already taken")
        
        update_fields["username"] = username
    
    if user_data.name is not None:
        update_fields["name"] = user_data.name
    if user_data.bio is not None:
        update_fields["bio"] = user_data.bio
    if user_data.avatar is not None:
        update_fields["avatar"] = user_data.avatar
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": update_fields}
    )
    
    if result.modified_count == 0:
        # Check if user exists but fields didn't change
        user = await db.users.find_one({"_id": ObjectId(current_user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Profile updated successfully"}

@api_router.put("/users/me/credentials")
async def update_credentials(
    credentials: CredentialsUpdate,
    current_user_id: str = Depends(get_current_user)
):
    """Update user's login credentials (username, email, or password)"""
    try:
        # Get current user
        user = await db.users.find_one({"_id": ObjectId(current_user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify current password
        stored_password = user.get("password_hash") or user.get("password")
        if not stored_password:
            raise HTTPException(status_code=400, detail="Cannot change credentials for OAuth accounts")
        
        # Check if password matches
        if isinstance(stored_password, str):
            stored_password = stored_password.encode('utf-8')
        
        if not bcrypt.checkpw(credentials.current_password.encode('utf-8'), stored_password):
            raise HTTPException(status_code=401, detail="Current password is incorrect")
        
        update_fields = {}
        
        # Update username if provided
        if credentials.new_username:
            new_username = credentials.new_username.strip()
            if not new_username:
                raise HTTPException(status_code=400, detail="Username cannot be empty")
            if len(new_username) < 3:
                raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
            
            # Check if username is already taken
            existing = await db.users.find_one({"username": new_username})
            if existing and str(existing["_id"]) != current_user_id:
                raise HTTPException(status_code=400, detail="Username already taken")
            
            update_fields["username"] = new_username
        
        # Update email if provided
        if credentials.new_email:
            new_email = credentials.new_email.strip().lower()
            if not new_email or "@" not in new_email:
                raise HTTPException(status_code=400, detail="Invalid email address")
            
            # Check if email is already taken
            existing = await db.users.find_one({"email": new_email})
            if existing and str(existing["_id"]) != current_user_id:
                raise HTTPException(status_code=400, detail="Email already in use")
            
            update_fields["email"] = new_email
        
        # Update password if provided
        if credentials.new_password:
            if len(credentials.new_password) < 6:
                raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
            
            # Hash the new password
            new_hash = bcrypt.hashpw(credentials.new_password.encode('utf-8'), bcrypt.gensalt())
            update_fields["password_hash"] = new_hash
            update_fields["password"] = new_hash  # Update both fields for compatibility
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No changes provided")
        
        # Perform the update
        result = await db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": update_fields}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update credentials")
        
        logger.info(f"Credentials updated for user {current_user_id}: {list(update_fields.keys())}")
        
        return {
            "message": "Credentials updated successfully",
            "updated_fields": list(update_fields.keys())
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating credentials: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update credentials")

@api_router.delete("/users/me")
async def delete_user_account(current_user_id: str = Depends(get_current_user)):
    """Delete user account and all associated data"""
    try:
        # Get user info for logging
        user = await db.users.find_one({"_id": ObjectId(current_user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        username = user.get("username", "unknown")
        logger.info(f"🗑️ Deleting account for user: {username} ({current_user_id})")
        
        # Delete user's posts
        posts_result = await db.posts.delete_many({"author_id": current_user_id})
        logger.info(f"Deleted {posts_result.deleted_count} posts")
        
        # Delete user's comments
        comments_result = await db.comments.delete_many({"author_id": current_user_id})
        logger.info(f"Deleted {comments_result.deleted_count} comments")
        
        # Delete user's saved workouts
        saved_result = await db.saved_workouts.delete_many({"user_id": current_user_id})
        logger.info(f"Deleted {saved_result.deleted_count} saved workouts")
        
        # Delete user's workout cards
        cards_result = await db.workout_cards.delete_many({"user_id": current_user_id})
        logger.info(f"Deleted {cards_result.deleted_count} workout cards")
        
        # Delete user's analytics events
        events_result = await db.user_events.delete_many({"user_id": current_user_id})
        logger.info(f"Deleted {events_result.deleted_count} analytics events")
        
        # Delete user's sessions
        sessions_result = await db.user_sessions.delete_many({"user_id": current_user_id})
        logger.info(f"Deleted {sessions_result.deleted_count} sessions")
        
        # Remove user from followers/following lists
        await db.users.update_many(
            {"followers": current_user_id},
            {"$pull": {"followers": current_user_id}, "$inc": {"followers_count": -1}}
        )
        await db.users.update_many(
            {"following": current_user_id},
            {"$pull": {"following": current_user_id}, "$inc": {"following_count": -1}}
        )
        
        # Delete likes on user's posts
        await db.likes.delete_many({"author_id": current_user_id})
        
        # Delete the user
        delete_result = await db.users.delete_one({"_id": ObjectId(current_user_id)})
        
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"✅ Successfully deleted account for user: {username}")
        return {"message": "Account deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user account: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete account")

@api_router.post("/users/me/avatar")
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user)
):
    """Upload profile picture"""
    try:
        logger.info(f"📸 Avatar upload START")
        logger.info(f"Filename: {file.filename}")
        logger.info(f"Content-Type: {file.content_type}")
        logger.info(f"File object type: {type(file)}")
        
        # Validate file type - handle missing/empty filename
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        
        # Get file extension from filename or fallback to content_type
        file_ext = None
        if file.filename and file.filename.strip():
            file_ext = Path(file.filename).suffix.lower()
            logger.info(f"File extension from filename: {file_ext}")
        
        # Fallback: detect from content_type if filename is missing/invalid
        if not file_ext or file_ext not in allowed_extensions:
            content_type = file.content_type or ''
            logger.info(f"Using content_type fallback: {content_type}")
            
            if 'jpeg' in content_type or 'jpg' in content_type:
                file_ext = '.jpg'
            elif 'png' in content_type:
                file_ext = '.png'
            elif 'gif' in content_type:
                file_ext = '.gif'
            elif 'image' in content_type:
                # Generic image fallback
                file_ext = '.jpg'
        
        if not file_ext:
            file_ext = '.jpg'  # Ultimate fallback
        
        logger.info(f"Final file extension: {file_ext}")
        
        # Generate unique filename
        unique_filename = f"avatar_{current_user_id}_{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Update user's avatar URL
        file_url = f"/api/uploads/{unique_filename}"
        await db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"avatar": file_url}}
        )
        
        logger.info(f"✅ Profile picture uploaded successfully: {unique_filename} for user {current_user_id}")
        return {
            "message": "Profile picture uploaded successfully",
            "url": file_url
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile picture upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Profile picture upload failed: {str(e)}")

class AvatarBase64Upload(BaseModel):
    image_data: str

@api_router.post("/users/me/avatar-base64")
async def upload_profile_picture_base64(
    data: AvatarBase64Upload,
    current_user_id: str = Depends(get_current_user)
):
    """Upload profile picture using base64 encoded image"""
    try:
        logger.info(f"📸 Avatar upload (base64) START for user {current_user_id}")
        
        # Parse base64 data
        image_data = data.image_data
        
        # Extract file extension from base64 header
        if image_data.startswith('data:image/'):
            # Format: data:image/jpeg;base64,/9j/4AAQ...
            header, base64_string = image_data.split(',', 1)
            mime_type = header.split(';')[0].split(':')[1]
            
            if 'jpeg' in mime_type or 'jpg' in mime_type:
                file_ext = '.jpg'
            elif 'png' in mime_type:
                file_ext = '.png'
            elif 'gif' in mime_type:
                file_ext = '.gif'
            else:
                file_ext = '.jpg'
        else:
            # Assume it's just the base64 string without header
            base64_string = image_data
            file_ext = '.jpg'
        
        logger.info(f"Detected file extension: {file_ext}")
        
        # Decode base64
        import base64
        image_bytes = base64.b64decode(base64_string)
        
        # Generate unique filename
        unique_filename = f"avatar_{current_user_id}_{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(image_bytes)
        
        # Update user's avatar URL
        file_url = f"/api/uploads/{unique_filename}"
        await db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"avatar": file_url}}
        )
        
        logger.info(f"✅ Profile picture uploaded successfully (base64): {unique_filename}")
        return {
            "message": "Profile picture uploaded successfully",
            "url": file_url
        }
    
    except Exception as e:
        logger.error(f"Base64 avatar upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Profile picture upload failed: {str(e)}")

@api_router.get("/users/{user_id}/is-following")
async def check_following_status(
    user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Check if current user is following another user"""
    if user_id == current_user_id:
        return {"is_following": False, "is_self": True}
    
    try:
        following_object_id = ObjectId(user_id)
        follower_object_id = ObjectId(current_user_id)
        
        existing_follow = await db.follows.find_one({
            "follower_id": follower_object_id,
            "following_id": following_object_id
        })
        
        return {
            "is_following": existing_follow is not None,
            "is_self": False
        }
    except:
        raise HTTPException(status_code=404, detail="User not found")

@api_router.get("/users/{user_id}/followers")
async def get_user_followers(user_id: str, limit: int = 50, skip: int = 0):
    """Get list of user's followers"""
    try:
        user_object_id = ObjectId(user_id)
        
        # Get followers with user information
        pipeline = [
            {"$match": {"following_id": user_object_id}},
            {"$sort": {"created_at": -1}},
            {"$skip": skip},
            {"$limit": limit},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "follower_id",
                    "foreignField": "_id",
                    "as": "follower"
                }
            },
            {"$unwind": "$follower"}
        ]
        
        follows = await db.follows.aggregate(pipeline).to_list(length=limit)
        
        result = []
        for follow in follows:
            follower = follow["follower"]
            result.append(UserResponse(
                id=str(follower["_id"]),
                username=follower["username"],
                email=follower["email"],
                name=follower.get("name"),
                bio=follower.get("bio", ""),
                avatar=follower.get("avatar", ""),
                followers_count=follower.get("followers_count", 0),
                following_count=follower.get("following_count", 0),
                workouts_count=follower.get("workouts_count", 0),
                current_streak=follower.get("current_streak", 0),
                created_at=follower["created_at"]
            ))
        
        return result
    except:
        raise HTTPException(status_code=404, detail="User not found")

@api_router.get("/users/{user_id}/following")
async def get_user_following(user_id: str, limit: int = 50, skip: int = 0):
    """Get list of users that this user is following"""
    try:
        user_object_id = ObjectId(user_id)
        
        # Get following with user information
        pipeline = [
            {"$match": {"follower_id": user_object_id}},
            {"$sort": {"created_at": -1}},
            {"$skip": skip},
            {"$limit": limit},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "following_id",
                    "foreignField": "_id",
                    "as": "following"
                }
            },
            {"$unwind": "$following"}
        ]
        
        follows = await db.follows.aggregate(pipeline).to_list(length=limit)
        
        result = []
        for follow in follows:
            following = follow["following"]
            result.append(UserResponse(
                id=str(following["_id"]),
                username=following["username"],
                email=following["email"],
                name=following.get("name"),
                bio=following.get("bio", ""),
                avatar=following.get("avatar", ""),
                followers_count=following.get("followers_count", 0),
                following_count=following.get("following_count", 0),
                workouts_count=following.get("workouts_count", 0),
                current_streak=following.get("current_streak", 0),
                created_at=following["created_at"]
            ))
        
        return result
    except:
        raise HTTPException(status_code=404, detail="User not found")

@api_router.get("/users/search/query")
async def search_users(
    q: str,
    current_user_id: str = Depends(get_current_user),
    limit: int = 20
):
    """Search for users by username or name"""
    try:
        if not q or len(q.strip()) < 1:
            return []
        
        search_query = q.strip()
        
        # Search in username and name fields (case-insensitive)
        query = {
            "$or": [
                {"username": {"$regex": search_query, "$options": "i"}},
                {"name": {"$regex": search_query, "$options": "i"}}
            ]
        }
        
        users = await db.users.find(query).limit(limit).to_list(length=limit)
        
        result = []
        current_user_obj_id = ObjectId(current_user_id)
        
        for user in users:
            user_id = user["_id"]
            
            # Check if current user is following this user
            is_following = False
            if user_id != current_user_obj_id:
                follow = await db.follows.find_one({
                    "follower_id": current_user_obj_id,
                    "following_id": user_id
                })
                is_following = follow is not None
            
            result.append({
                "id": str(user_id),
                "username": user["username"],
                "name": user.get("name", ""),
                "bio": user.get("bio", ""),
                "avatar": user.get("avatar", ""),
                "followers_count": user.get("followers_count", 0),
                "following_count": user.get("following_count", 0),
                "is_following": is_following,
                "is_self": user_id == current_user_obj_id
            })
        
        return result
    
    except Exception as e:
        logger.error(f"User search error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@api_router.get("/users/{user_id}/posts")
async def get_user_posts(
    user_id: str,
    current_user_id: str = Depends(get_current_user),
    limit: int = 20,
    skip: int = 0
):
    """Get posts by a specific user"""
    try:
        user_object_id = ObjectId(user_id)
        
        # Get posts with author and workout details
        pipeline = [
            {"$match": {"author_id": user_object_id}},
            {"$sort": {"created_at": -1}},
            {"$skip": skip},
            {"$limit": limit},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "author_id",
                    "foreignField": "_id",
                    "as": "author"
                }
            },
            {"$unwind": "$author"},
            {
                "$lookup": {
                    "from": "workouts",
                    "localField": "workout_id",
                    "foreignField": "_id",
                    "as": "workout"
                }
            },
            {
                "$lookup": {
                    "from": "post_likes",
                    "let": {"post_id": "$_id", "user_id": ObjectId(current_user_id)},
                    "pipeline": [
                        {"$match": {"$expr": {"$and": [
                            {"$eq": ["$post_id", "$$post_id"]},
                            {"$eq": ["$user_id", "$$user_id"]}
                        ]}}}
                    ],
                    "as": "user_like"
                }
            }
        ]
        
        posts = await db.posts.aggregate(pipeline).to_list(length=limit)
        
        result = []
        for post in posts:
            # Convert ObjectIds to strings
            author_data = UserResponse(
                id=str(post["author"]["_id"]),
                username=post["author"]["username"],
                email=post["author"]["email"],
                name=post["author"].get("name"),
                bio=post["author"].get("bio", ""),
                avatar=post["author"].get("avatar", ""),
                followers_count=post["author"].get("followers_count", 0),
                following_count=post["author"].get("following_count", 0),
                workouts_count=post["author"].get("workouts_count", 0),
                current_streak=post["author"].get("current_streak", 0),
                created_at=post["author"]["created_at"]
            )
            
            workout_data = None
            if post.get("workout") and len(post["workout"]) > 0:
                workout = post["workout"][0]
                workout_data = WorkoutResponse(
                    id=str(workout["_id"]),
                    title=workout["title"],
                    mood_category=workout["mood_category"],
                    exercises=workout["exercises"],
                    duration=workout["duration"],
                    difficulty=workout["difficulty"],
                    equipment=workout.get("equipment", []),
                    calories_estimate=workout.get("calories_estimate"),
                    created_at=workout["created_at"]
                )
            
            result.append(PostResponse(
                id=str(post["_id"]),
                author=author_data,
                workout=workout_data,
                caption=post["caption"],
                media_urls=post.get("media_urls", []),
                hashtags=post.get("hashtags", []),
                likes_count=post.get("likes_count", 0),
                comments_count=post.get("comments_count", 0),
                is_liked=len(post.get("user_like", [])) > 0,
                created_at=post["created_at"]
            ))
        
        return result
    except:
        raise HTTPException(status_code=404, detail="User not found")

# Workout Endpoints

@api_router.get("/workouts")
async def get_workouts(mood: Optional[str] = None, difficulty: Optional[str] = None, limit: int = 20):
    """Get workouts with optional filtering by mood and difficulty"""
    filter_query = {}
    if mood:
        filter_query["mood_category"] = mood
    if difficulty:
        filter_query["difficulty"] = difficulty
    
    workouts_cursor = db.workouts.find(filter_query).limit(limit)
    workouts = await workouts_cursor.to_list(length=limit)
    
    return [
        WorkoutResponse(
            id=str(workout["_id"]),
            title=workout["title"],
            mood_category=workout["mood_category"],
            exercises=workout["exercises"],
            duration=workout["duration"],
            difficulty=workout["difficulty"],
            equipment=workout.get("equipment", []),
            calories_estimate=workout.get("calories_estimate"),
            created_at=workout["created_at"]
        )
        for workout in workouts
    ]

@api_router.post("/workouts", response_model=WorkoutResponse)
async def create_workout(workout_data: WorkoutCreate, current_user_id: str = Depends(get_current_user)):
    """Create a new workout (admin feature for now)"""
    workout_doc = {
        **workout_data.dict(),
        "created_by": current_user_id,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await db.workouts.insert_one(workout_doc)
    
    workout_doc["id"] = str(result.inserted_id)
    return WorkoutResponse(**workout_doc)

@api_router.get("/workouts/mood/{mood_category}")
async def get_workouts_by_mood(mood_category: str, limit: int = 10):
    """Get workouts filtered by mood category"""
    valid_moods = [
        "i want to sweat",
        "i want to push and gain muscle", 
        "i want to build explosiveness",
        "i want a light sweat",
        "im feeling lazy",
        "i want to do calisthenics",
        "i want to get outside"
    ]
    
    if mood_category.lower() not in [mood.lower() for mood in valid_moods]:
        raise HTTPException(status_code=400, detail="Invalid mood category")
    
    workouts_cursor = db.workouts.find({"mood_category": mood_category}).limit(limit)
    workouts = await workouts_cursor.to_list(length=limit)
    
    return [
        WorkoutResponse(
            id=str(workout["_id"]),
            title=workout["title"],
            mood_category=workout["mood_category"],
            exercises=workout["exercises"],
            duration=workout["duration"],
            difficulty=workout["difficulty"],
            equipment=workout.get("equipment", []),
            calories_estimate=workout.get("calories_estimate"),
            created_at=workout["created_at"]
        )
        for workout in workouts
    ]

# User Workout History

@api_router.post("/user-workouts")
async def log_workout_completion(workout_data: UserWorkoutCreate, current_user_id: str = Depends(get_current_user)):
    """Log a completed workout for the user"""
    workout_log = {
        **workout_data.dict(),
        "user_id": current_user_id,
        "completed_at": workout_data.completed_at or datetime.now(timezone.utc),
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await db.user_workouts.insert_one(workout_log)
    
    # Update user's workout count
    await db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$inc": {"workouts_count": 1}}
    )
    
    return {"message": "Workout logged successfully", "id": str(result.inserted_id)}

@api_router.get("/user-workouts")
async def get_user_workouts(current_user_id: str = Depends(get_current_user), limit: int = 20):
    """Get user's workout history"""
    user_workouts_cursor = db.user_workouts.find({"user_id": current_user_id}).sort("completed_at", -1).limit(limit)
    user_workouts = await user_workouts_cursor.to_list(length=limit)
    
    return user_workouts

# File Upload Endpoints

UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@api_router.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    """Serve uploaded media files"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)

@api_router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user)
):
    """Upload a single media file (image or video)"""
    try:
        # Validate file type - handle missing/empty filename
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi'}
        
        # Get file extension from filename or fallback to content_type
        file_ext = None
        if file.filename:
            file_ext = Path(file.filename).suffix.lower()
        
        # Fallback: detect from content_type if filename is missing/invalid
        if not file_ext or file_ext not in allowed_extensions:
            content_type = file.content_type or ''
            logger.info(f"Filename: {file.filename}, Content-Type: {content_type}")
            
            if 'image/jpeg' in content_type or 'image/jpg' in content_type:
                file_ext = '.jpg'
            elif 'image/png' in content_type:
                file_ext = '.png'
            elif 'image/gif' in content_type:
                file_ext = '.gif'
            elif 'video/mp4' in content_type:
                file_ext = '.mp4'
            elif 'video/quicktime' in content_type:
                file_ext = '.mov'
            elif 'video/avi' in content_type or 'video/x-msvideo' in content_type:
                file_ext = '.avi'
        
        if not file_ext or file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail=f"File type {file_ext} not allowed. Content-Type: {file.content_type}")
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Return file URL (relative path that frontend can use)
        file_url = f"/api/uploads/{unique_filename}"
        
        logger.info(f"✅ File uploaded successfully: {unique_filename}")
        return {
            "message": "File uploaded successfully",
            "url": file_url,
            "filename": unique_filename
        }
    
    except Exception as e:
        logger.error(f"File upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/upload/multiple")
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    current_user_id: str = Depends(get_current_user)
):
    """Upload multiple media files (up to 5)"""
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 files allowed")
    
    uploaded_urls = []
    
    for file in files:
        try:
            # Validate file type
            allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi'}
            file_ext = Path(file.filename).suffix.lower()
            
            if file_ext not in allowed_extensions:
                continue  # Skip invalid files
            
            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = UPLOAD_DIR / unique_filename
            
            # Save file
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            # Return file URL
            file_url = f"/api/uploads/{unique_filename}"
            uploaded_urls.append(file_url)
        
        except Exception as e:
            logger.error(f"File upload error for {file.filename}: {str(e)}")
            continue
    
    return {
        "message": f"{len(uploaded_urls)} files uploaded successfully",
        "urls": uploaded_urls
    }

# Social Features - Posts

@api_router.post("/posts")
async def create_post(post_data: PostCreate, current_user_id: str = Depends(get_current_user)):
    """Create a new social media post"""
    post_doc = {
        **post_data.dict(),
        "author_id": ObjectId(current_user_id),
        "likes_count": 0,
        "comments_count": 0,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await db.posts.insert_one(post_doc)
    return {"message": "Post created successfully", "id": str(result.inserted_id)}

@api_router.get("/posts/following")
async def get_following_posts(
    current_user_id: str = Depends(get_current_user),
    limit: int = 20,
    skip: int = 0
):
    """Get posts from users that the current user follows"""
    try:
        user_object_id = ObjectId(current_user_id)
        
        # Get list of users current user is following
        following = await db.follows.find({"follower_id": user_object_id}).to_list(length=None)
        following_ids = [f["following_id"] for f in following]
        
        if not following_ids:
            # If not following anyone, return empty list
            return []
        
        # Get posts from followed users with author and workout details
        pipeline = [
            {"$match": {"author_id": {"$in": following_ids}}},
            {"$sort": {"created_at": -1}},
            {"$skip": skip},
            {"$limit": limit},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "author_id",
                    "foreignField": "_id",
                    "as": "author"
                }
            },
            {"$unwind": "$author"},
            {
                "$lookup": {
                    "from": "workouts",
                    "localField": "workout_id",
                    "foreignField": "_id",
                    "as": "workout"
                }
            },
            {
                "$lookup": {
                    "from": "post_likes",
                    "let": {"post_id": "$_id", "user_id": user_object_id},
                    "pipeline": [
                        {"$match": {"$expr": {"$and": [
                            {"$eq": ["$post_id", "$$post_id"]},
                            {"$eq": ["$user_id", "$$user_id"]}
                        ]}}}
                    ],
                    "as": "user_like"
                }
            }
        ]
        
        posts = await db.posts.aggregate(pipeline).to_list(length=limit)
        
        result = []
        for post in posts:
            # Convert ObjectIds to strings
            author_data = UserResponse(
                id=str(post["author"]["_id"]),
                username=post["author"]["username"],
                email=post["author"]["email"],
                name=post["author"].get("name"),
                bio=post["author"].get("bio", ""),
                avatar=post["author"].get("avatar", ""),
                followers_count=post["author"].get("followers_count", 0),
                following_count=post["author"].get("following_count", 0),
                workouts_count=post["author"].get("workouts_count", 0),
                current_streak=post["author"].get("current_streak", 0),
                created_at=post["author"]["created_at"]
            )
            
            workout_data = None
            if post.get("workout") and len(post["workout"]) > 0:
                workout = post["workout"][0]
                workout_data = WorkoutResponse(
                    id=str(workout["_id"]),
                    title=workout["title"],
                    mood_category=workout["mood_category"],
                    exercises=workout["exercises"],
                    duration=workout["duration"],
                    difficulty=workout["difficulty"],
                    equipment=workout.get("equipment", []),
                    calories_estimate=workout.get("calories_estimate"),
                    created_at=workout["created_at"]
                )
            
            result.append(PostResponse(
                id=str(post["_id"]),
                author=author_data,
                workout=workout_data,
                caption=post["caption"],
                media_urls=post.get("media_urls", []),
                hashtags=post.get("hashtags", []),
                likes_count=post.get("likes_count", 0),
                comments_count=post.get("comments_count", 0),
                is_liked=len(post.get("user_like", [])) > 0,
                created_at=post["created_at"]
            ))
        
        return result
    except Exception as e:
        logger.error(f"Error fetching following posts: {str(e)}")
        return []

@api_router.get("/posts")
async def get_posts(current_user_id: str = Depends(get_current_user), limit: int = 20, skip: int = 0):
    """Get feed posts with user and workout information"""
    # Get posts with author and workout details
    pipeline = [
        {"$sort": {"created_at": -1}},
        {"$skip": skip},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "users",
                "localField": "author_id",
                "foreignField": "_id",
                "as": "author"
            }
        },
        {"$unwind": "$author"},
        {
            "$lookup": {
                "from": "workouts", 
                "localField": "workout_id",
                "foreignField": "_id", 
                "as": "workout"
            }
        },
        {
            "$lookup": {
                "from": "post_likes",
                "let": {"post_id": "$_id", "user_id": ObjectId(current_user_id)},
                "pipeline": [
                    {"$match": {"$expr": {"$and": [
                        {"$eq": ["$post_id", "$$post_id"]},
                        {"$eq": ["$user_id", "$$user_id"]}
                    ]}}}
                ],
                "as": "user_like"
            }
        }
    ]
    
    posts = await db.posts.aggregate(pipeline).to_list(length=limit)
    
    result = []
    for post in posts:
        # Convert ObjectIds to strings
        author_data = UserResponse(
            id=str(post["author"]["_id"]),
            username=post["author"]["username"],
            email=post["author"]["email"],
            name=post["author"].get("name"),
            bio=post["author"].get("bio", ""),
            avatar=post["author"].get("avatar", ""),
            followers_count=post["author"].get("followers_count", 0),
            following_count=post["author"].get("following_count", 0),
            workouts_count=post["author"].get("workouts_count", 0),
            current_streak=post["author"].get("current_streak", 0),
            created_at=post["author"]["created_at"]
        )
        
        workout_data = None
        if post.get("workout") and len(post["workout"]) > 0:
            workout = post["workout"][0]
            workout_data = WorkoutResponse(
                id=str(workout["_id"]),
                title=workout["title"],
                mood_category=workout["mood_category"],
                exercises=workout["exercises"],
                duration=workout["duration"],
                difficulty=workout["difficulty"],
                equipment=workout.get("equipment", []),
                calories_estimate=workout.get("calories_estimate"),
                created_at=workout["created_at"]
            )
        
        result.append(PostResponse(
            id=str(post["_id"]),
            author=author_data,
            workout=workout_data,
            caption=post["caption"],
            media_urls=post.get("media_urls", []),
            hashtags=post.get("hashtags", []),
            likes_count=post.get("likes_count", 0),
            comments_count=post.get("comments_count", 0),
            is_liked=len(post.get("user_like", [])) > 0,
            created_at=post["created_at"]
        ))
    
    return result

@api_router.get("/posts/{post_id}")
async def get_single_post(post_id: str, current_user_id: str = Depends(get_current_user)):
    """Get a single post by ID"""
    try:
        post_object_id = ObjectId(post_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid post ID")
    
    pipeline = [
        {"$match": {"_id": post_object_id}},
        {
            "$lookup": {
                "from": "users",
                "localField": "author_id",
                "foreignField": "_id",
                "as": "author"
            }
        },
        {"$unwind": "$author"},
        {
            "$lookup": {
                "from": "post_likes",
                "let": {"post_id": "$_id", "user_id": ObjectId(current_user_id)},
                "pipeline": [
                    {"$match": {"$expr": {"$and": [
                        {"$eq": ["$post_id", "$$post_id"]},
                        {"$eq": ["$user_id", "$$user_id"]}
                    ]}}}
                ],
                "as": "user_like"
            }
        },
        {
            "$project": {
                "_id": 0,
                "id": {"$toString": "$_id"},
                "author": {
                    "id": {"$toString": "$author._id"},
                    "username": "$author.username",
                    "name": {"$ifNull": ["$author.name", "$author.username"]},
                    "avatar": "$author.avatar"
                },
                "caption": 1,
                "media_urls": 1,
                "likes_count": {"$ifNull": ["$likes_count", 0]},
                "comments_count": {"$ifNull": ["$comments_count", 0]},
                "is_liked": {"$gt": [{"$size": "$user_like"}, 0]},
                "created_at": {"$toString": "$created_at"}
            }
        }
    ]
    
    result = await db.posts.aggregate(pipeline).to_list(1)
    
    if not result:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return result[0]

# Social Features - Likes

@api_router.post("/posts/{post_id}/like")
async def like_post(post_id: str, current_user_id: str = Depends(get_current_user)):
    """Like or unlike a post"""
    try:
        post_object_id = ObjectId(post_id)
        user_object_id = ObjectId(current_user_id)
        
        # Check if already liked
        existing_like = await db.post_likes.find_one({
            "post_id": post_object_id,
            "user_id": user_object_id
        })
        
        if existing_like:
            # Unlike
            await db.post_likes.delete_one({"_id": existing_like["_id"]})
            await db.posts.update_one(
                {"_id": post_object_id},
                {"$inc": {"likes_count": -1}}
            )
            # Get updated likes count
            updated_post = await db.posts.find_one({"_id": post_object_id})
            likes_count = updated_post.get("likes_count", 0) if updated_post else 0
            return {"message": "Post unliked", "liked": False, "likes_count": likes_count}
        else:
            # Like
            await db.post_likes.insert_one({
                "post_id": post_object_id,
                "user_id": user_object_id,
                "created_at": datetime.now(timezone.utc)
            })
            await db.posts.update_one(
                {"_id": post_object_id},
                {"$inc": {"likes_count": 1}}
            )
            # Get updated likes count
            updated_post = await db.posts.find_one({"_id": post_object_id})
            likes_count = updated_post.get("likes_count", 0) if updated_post else 0
            return {"message": "Post liked", "liked": True, "likes_count": likes_count}
    
    except:
        raise HTTPException(status_code=404, detail="Post not found")

# Social Features - Comments

@api_router.post("/comments")
async def create_comment(comment_data: CommentCreate, current_user_id: str = Depends(get_current_user)):
    """Create a comment on a post"""
    try:
        comment_doc = {
            **comment_data.dict(),
            "author_id": current_user_id,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = await db.comments.insert_one(comment_doc)
        
        # Update post comment count
        await db.posts.update_one(
            {"_id": ObjectId(comment_data.post_id)},
            {"$inc": {"comments_count": 1}}
        )
        
        return {"message": "Comment created successfully", "id": str(result.inserted_id)}
    except:
        raise HTTPException(status_code=404, detail="Post not found")

@api_router.get("/posts/{post_id}/comments")
async def get_post_comments(post_id: str, limit: int = 50):
    """Get comments for a post"""
    try:
        # Get comments with author information
        pipeline = [
            {"$match": {"post_id": post_id}},
            {"$sort": {"created_at": -1}},
            {"$limit": limit},
            {
                "$addFields": {
                    "author_id_obj": {"$toObjectId": "$author_id"}
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "author_id_obj",
                    "foreignField": "_id",
                    "as": "author"
                }
            },
            {"$unwind": "$author"},
            {
                "$project": {
                    "id": {"$toString": "$_id"},
                    "text": 1,
                    "created_at": 1,
                    "author": {
                        "id": {"$toString": "$author._id"},
                        "username": "$author.username",
                        "avatar": "$author.avatar"
                    },
                    "_id": 0
                }
            }
        ]
        
        comments = await db.comments.aggregate(pipeline).to_list(length=limit)
        return comments
    except:
        raise HTTPException(status_code=404, detail="Post not found")

# Social Features - Follow System

@api_router.post("/users/{user_id}/follow")
async def follow_user(user_id: str, current_user_id: str = Depends(get_current_user)):
    """Follow or unfollow a user"""
    if user_id == current_user_id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    
    try:
        following_object_id = ObjectId(user_id)
        follower_object_id = ObjectId(current_user_id)
        
        # Check if already following
        existing_follow = await db.follows.find_one({
            "follower_id": follower_object_id,
            "following_id": following_object_id
        })
        
        if existing_follow:
            # Unfollow
            await db.follows.delete_one({"_id": existing_follow["_id"]})
            
            # Update counts
            await db.users.update_one(
                {"_id": follower_object_id},
                {"$inc": {"following_count": -1}}
            )
            await db.users.update_one(
                {"_id": following_object_id},
                {"$inc": {"followers_count": -1}}
            )
            
            return {"message": "User unfollowed", "following": False}
        else:
            # Follow
            await db.follows.insert_one({
                "follower_id": follower_object_id,
                "following_id": following_object_id,
                "created_at": datetime.now(timezone.utc)
            })
            
            # Update counts
            await db.users.update_one(
                {"_id": follower_object_id},
                {"$inc": {"following_count": 1}}
            )
            await db.users.update_one(
                {"_id": following_object_id},
                {"$inc": {"followers_count": 1}}
            )
            
            return {"message": "User followed", "following": True}
    
    except:
        raise HTTPException(status_code=404, detail="User not found")

# Workout Cards Endpoints

class WorkoutCardCreate(BaseModel):
    workouts: List[Dict[str, Any]]
    total_duration: int
    completed_at: str

@api_router.post("/workout-cards")
async def save_workout_card(
    card_data: WorkoutCardCreate,
    current_user_id: str = Depends(get_current_user)
):
    """Save a completed workout card for the user"""
    card_doc = {
        **card_data.dict(),
        "user_id": current_user_id,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await db.workout_cards.insert_one(card_doc)
    
    # Update user's workouts count
    await db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$inc": {"workouts_count": 1}}
    )
    
    return {
        "message": "Workout card saved successfully",
        "id": str(result.inserted_id)
    }

@api_router.get("/workout-cards")
async def get_workout_cards(
    current_user_id: str = Depends(get_current_user),
    limit: int = 50,
    skip: int = 0
):
    """Get all saved workout cards for the current user"""
    cards = await db.workout_cards.find(
        {"user_id": current_user_id}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    
    result = []
    for card in cards:
        result.append({
            "id": str(card["_id"]),
            "workouts": card["workouts"],
            "total_duration": card["total_duration"],
            "completed_at": card["completed_at"],
            "created_at": card["created_at"].isoformat()
        })
    
    return result

@api_router.delete("/workout-cards/{card_id}")
async def delete_workout_card(
    card_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Delete a workout card"""
    try:
        result = await db.workout_cards.delete_one({
            "_id": ObjectId(card_id),
            "user_id": current_user_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Workout card not found")
        
        return {"message": "Workout card deleted successfully"}
    except:
        raise HTTPException(status_code=404, detail="Workout card not found")

# Saved Workouts Endpoints (for bookmarking workouts to do later)

class SavedWorkoutCreate(BaseModel):
    name: str
    workouts: List[Dict[str, Any]]  # List of workout exercises
    total_duration: int
    source: str = "custom"  # "custom" for cart saves, "featured" for featured workout saves
    featured_workout_id: Optional[str] = None
    mood: Optional[str] = None
    title: Optional[str] = None

@api_router.post("/saved-workouts")
async def save_workout(
    workout_data: SavedWorkoutCreate,
    current_user_id: str = Depends(get_current_user)
):
    """Save a workout for later"""
    # Check if this workout is already saved (by name and user)
    existing = await db.saved_workouts.find_one({
        "user_id": current_user_id,
        "name": workout_data.name
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Workout already saved")
    
    workout_doc = {
        **workout_data.dict(),
        "user_id": current_user_id,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await db.saved_workouts.insert_one(workout_doc)
    
    return {
        "message": "Workout saved successfully",
        "id": str(result.inserted_id)
    }

@api_router.get("/saved-workouts")
async def get_saved_workouts(
    current_user_id: str = Depends(get_current_user),
    limit: int = 50,
    skip: int = 0
):
    """Get all saved workouts for the current user"""
    workouts = await db.saved_workouts.find(
        {"user_id": current_user_id}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    
    result = []
    for workout in workouts:
        result.append({
            "id": str(workout["_id"]),
            "name": workout["name"],
            "workouts": workout["workouts"],
            "total_duration": workout["total_duration"],
            "source": workout.get("source", "custom"),
            "featured_workout_id": workout.get("featured_workout_id"),
            "mood": workout.get("mood"),
            "title": workout.get("title"),
            "created_at": workout["created_at"].isoformat()
        })
    
    return result

@api_router.delete("/saved-workouts/{workout_id}")
async def delete_saved_workout(
    workout_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Delete a saved workout"""
    try:
        result = await db.saved_workouts.delete_one({
            "_id": ObjectId(workout_id),
            "user_id": current_user_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Saved workout not found")
        
        return {"message": "Saved workout deleted successfully"}
    except:
        raise HTTPException(status_code=404, detail="Saved workout not found")

@api_router.get("/saved-workouts/check/{workout_name}")
async def check_saved_workout(
    workout_name: str,
    current_user_id: str = Depends(get_current_user)
):
    """Check if a workout is already saved"""
    existing = await db.saved_workouts.find_one({
        "user_id": current_user_id,
        "name": workout_name
    })
    
    return {"is_saved": existing is not None}

# Saved Posts Endpoints
@api_router.post("/posts/{post_id}/save")
async def save_post(
    post_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Save a post to user's saved posts"""
    # Check if post exists
    post = await db.posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if already saved
    existing = await db.saved_posts.find_one({
        "user_id": current_user_id,
        "post_id": post_id
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Post already saved")
    
    # Save the post
    saved_doc = {
        "user_id": current_user_id,
        "post_id": post_id,
        "saved_at": datetime.utcnow()
    }
    
    await db.saved_posts.insert_one(saved_doc)
    
    return {"message": "Post saved successfully", "is_saved": True}

@api_router.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Delete a post (only owner can delete)"""
    try:
        # Find the post and verify ownership
        post = await db.posts.find_one({"_id": ObjectId(post_id)})
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Check if the current user is the author
        if str(post.get("author_id")) != current_user_id:
            raise HTTPException(status_code=403, detail="You can only delete your own posts")
        
        # Delete the post
        result = await db.posts.delete_one({"_id": ObjectId(post_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=500, detail="Failed to delete post")
        
        # Also delete related data
        await db.likes.delete_many({"post_id": post_id})
        await db.comments.delete_many({"post_id": post_id})
        await db.saved_posts.delete_many({"post_id": post_id})
        
        logger.info(f"Post {post_id} deleted by user {current_user_id}")
        
        return {"message": "Post deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting post: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete post")

@api_router.delete("/posts/{post_id}/save")
async def unsave_post(
    post_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Remove a post from user's saved posts"""
    result = await db.saved_posts.delete_one({
        "user_id": current_user_id,
        "post_id": post_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Saved post not found")
    
    return {"message": "Post unsaved successfully", "is_saved": False}

@api_router.get("/posts/{post_id}/save/check")
async def check_post_saved(
    post_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Check if a post is saved by the current user"""
    existing = await db.saved_posts.find_one({
        "user_id": current_user_id,
        "post_id": post_id
    })
    
    return {"is_saved": existing is not None}

@api_router.get("/saved-posts")
async def get_saved_posts(
    current_user_id: str = Depends(get_current_user)
):
    """Get all saved posts for the current user with full post details"""
    saved_posts = await db.saved_posts.find(
        {"user_id": current_user_id}
    ).sort("saved_at", -1).to_list(100)
    
    # Get full post details for each saved post
    posts = []
    for saved in saved_posts:
        post = await db.posts.find_one({"_id": ObjectId(saved["post_id"])})
        if post:
            # Get author details
            author = await db.users.find_one({"_id": ObjectId(post["author_id"])})
            if author:
                posts.append({
                    "id": str(post["_id"]),
                    "author": {
                        "id": str(author["_id"]),
                        "username": author.get("username", ""),
                        "name": author.get("name", ""),
                        "avatar": author.get("avatar", "")
                    },
                    "caption": post.get("caption", ""),
                    "media_urls": post.get("media_urls", []),
                    "likes_count": post.get("likes_count", 0),
                    "comments_count": post.get("comments_count", 0),
                    "saved_at": saved["saved_at"].isoformat()
                })
    
    return posts

# Health Check
@api_router.get("/")
async def root():
    return {"message": "MOOD App API is running", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# Feedback endpoint
@api_router.post("/feedback")
async def submit_feedback(
    feedback_data: dict,
    current_user_id: str = Depends(get_current_user)
):
    """Submit user feedback"""
    feedback_doc = {
        "user_id": current_user_id,
        "feedback": feedback_data.get("feedback", ""),
        "type": feedback_data.get("type", "general"),
        "created_at": datetime.utcnow()
    }
    
    await db.feedback.insert_one(feedback_doc)
    
    return {"message": "Feedback submitted successfully"}

# Messaging endpoints
@api_router.get("/conversations")
async def get_conversations(
    current_user_id: str = Depends(get_current_user)
):
    """Get all conversations for the current user"""
    conversations = await db.conversations.find({
        "participants": current_user_id
    }).sort("updated_at", -1).to_list(50)
    
    result = []
    for conv in conversations:
        # Get the other participant
        other_user_id = [p for p in conv["participants"] if p != current_user_id][0]
        other_user = await db.users.find_one({"_id": ObjectId(other_user_id)})
        
        # Get unread count
        unread_count = await db.messages.count_documents({
            "conversation_id": str(conv["_id"]),
            "sender_id": {"$ne": current_user_id},
            "read": False
        })
        
        if other_user:
            result.append({
                "id": str(conv["_id"]),
                "other_user": {
                    "id": str(other_user["_id"]),
                    "username": other_user.get("username", ""),
                    "name": other_user.get("name", ""),
                    "avatar": other_user.get("avatar", "")
                },
                "last_message": conv.get("last_message", ""),
                "last_message_time": conv.get("updated_at", conv.get("created_at")).isoformat() if conv.get("updated_at") or conv.get("created_at") else None,
                "unread_count": unread_count
            })
    
    return result

@api_router.post("/conversations")
async def create_or_get_conversation(
    data: dict,
    current_user_id: str = Depends(get_current_user)
):
    """Create a new conversation or get existing one"""
    other_user_id = data.get("user_id")
    
    if not other_user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    # Check if conversation already exists
    existing = await db.conversations.find_one({
        "participants": {"$all": [current_user_id, other_user_id]}
    })
    
    if existing:
        return {"id": str(existing["_id"]), "exists": True}
    
    # Create new conversation
    conversation = {
        "participants": [current_user_id, other_user_id],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "last_message": ""
    }
    
    result = await db.conversations.insert_one(conversation)
    
    return {"id": str(result.inserted_id), "exists": False}

@api_router.get("/conversations/{conversation_id}/messages")
async def get_messages(
    conversation_id: str,
    skip: int = 0,
    limit: int = 50,
    current_user_id: str = Depends(get_current_user)
):
    """Get messages in a conversation"""
    # Verify user is participant
    conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    if not conversation or current_user_id not in conversation["participants"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this conversation")
    
    # Mark messages as read
    await db.messages.update_many(
        {
            "conversation_id": conversation_id,
            "sender_id": {"$ne": current_user_id},
            "read": False
        },
        {"$set": {"read": True}}
    )
    
    # Get messages
    messages = await db.messages.find(
        {"conversation_id": conversation_id}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    result = []
    for msg in messages:
        result.append({
            "id": str(msg["_id"]),
            "sender_id": msg["sender_id"],
            "content": msg["content"],
            "created_at": msg["created_at"].isoformat(),
            "read": msg.get("read", False)
        })
    
    return result[::-1]  # Return in chronological order

@api_router.post("/conversations/{conversation_id}/messages")
async def send_message(
    conversation_id: str,
    data: dict,
    current_user_id: str = Depends(get_current_user)
):
    """Send a message in a conversation"""
    content = data.get("content", "").strip()
    
    if not content:
        raise HTTPException(status_code=400, detail="Message content is required")
    
    # Verify user is participant
    conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    if not conversation or current_user_id not in conversation["participants"]:
        raise HTTPException(status_code=403, detail="Not authorized to send messages in this conversation")
    
    # Create message
    message = {
        "conversation_id": conversation_id,
        "sender_id": current_user_id,
        "content": content,
        "created_at": datetime.utcnow(),
        "read": False
    }
    
    result = await db.messages.insert_one(message)
    
    # Update conversation
    await db.conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {
            "$set": {
                "last_message": content[:100],
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "id": str(result.inserted_id),
        "sender_id": current_user_id,
        "content": content,
        "created_at": message["created_at"].isoformat(),
        "read": False
    }

@api_router.get("/conversations/unread-count")
async def get_unread_count(
    current_user_id: str = Depends(get_current_user)
):
    """Get total unread message count"""
    # Get all user's conversations
    conversations = await db.conversations.find({
        "participants": current_user_id
    }).to_list(100)
    
    conv_ids = [str(conv["_id"]) for conv in conversations]
    
    count = await db.messages.count_documents({
        "conversation_id": {"$in": conv_ids},
        "sender_id": {"$ne": current_user_id},
        "read": False
    })
    
    return {"unread_count": count}

# Include router in main app
app.include_router(api_router)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()