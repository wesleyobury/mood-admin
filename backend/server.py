from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, Request, Response, Header
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
import cloudinary
import cloudinary.uploader
import cloudinary.api
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
    get_workout_funnel_detail,
    EVENT_TYPES,
)
from content_moderation import (
    check_content,
    filter_content,
    is_valid_report_category,
    get_report_categories,
    REPORT_CATEGORIES,
    REPORT_STATUS,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'mood_app')]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'mood-app-secret-key-2025')
JWT_ALGORITHM = 'HS256'

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

logger = logging.getLogger(__name__)
logger.info(f"✅ Cloudinary configured with cloud: {os.environ.get('CLOUDINARY_CLOUD_NAME')}")

import time

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Response time logging middleware
@app.middleware("http")
async def log_response_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000  # Convert to ms
    
    # Log slow requests (> 500ms)
    if process_time > 500:
        logger.warning(f"SLOW REQUEST: {request.method} {request.url.path} took {process_time:.2f}ms")
    elif process_time > 200:
        logger.info(f"Request: {request.method} {request.url.path} took {process_time:.2f}ms")
    
    response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
    return response

# Root-level health check for Kubernetes deployment
@app.get("/health")
async def root_health_check():
    """Health check endpoint for Kubernetes liveness/readiness probes"""
    try:
        # Quick database ping
        await client.admin.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "healthy", "database": "disconnected", "error": str(e)}

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
        
        # Handle both ObjectId format and custom user_id format (for OAuth users)
        user = None
        
        # First try to find by custom user_id field
        user = await db.users.find_one({"user_id": user_id})
        
        # If not found, try ObjectId (for legacy users)
        if not user:
            try:
                user = await db.users.find_one({"_id": ObjectId(user_id)})
            except:
                pass  # Invalid ObjectId format, skip
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        # ALWAYS return the MongoDB ObjectId for consistency across all operations
        return str(user["_id"])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_optional_current_user(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Optional authentication - returns user_id if token is valid, None otherwise"""
    if not authorization:
        return None
    
    try:
        # Remove 'Bearer ' prefix if present
        token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
        
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        if not user_id:
            return None
        
        # Handle both ObjectId format and custom user_id format (for OAuth users)
        user = None
        
        # First try to find by custom user_id field
        user = await db.users.find_one({"user_id": user_id})
        
        # If not found, try ObjectId (for legacy users)
        if not user:
            try:
                user = await db.users.find_one({"_id": ObjectId(user_id)})
            except:
                pass  # Invalid ObjectId format, skip
        
        if not user:
            return None
        
        # ALWAYS return the MongoDB ObjectId for consistency across all operations
        return str(user["_id"])
    except:
        return None


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
    is_saved: bool = False
    created_at: datetime

class CommentCreate(BaseModel):
    post_id: str
    text: str

class FollowResponse(BaseModel):
    follower: UserResponse
    following: UserResponse
    created_at: datetime

# Content Moderation Models
class ContentReportCreate(BaseModel):
    content_type: str  # "post", "comment", "profile"
    content_id: str
    category: str  # One of REPORT_CATEGORIES
    reason: Optional[str] = None  # Additional details

class BlockUserCreate(BaseModel):
    blocked_user_id: str
    reason: Optional[str] = None

class ContentReportResponse(BaseModel):
    id: str
    reporter_id: str
    content_type: str
    content_id: str
    category: str
    reason: Optional[str]
    status: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    action_taken: Optional[str] = None

class BlockedUserResponse(BaseModel):
    id: str
    blocked_user_id: str
    blocked_username: str
    blocked_at: datetime

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
    
    # Create user with generated user_id (kept for backwards compatibility)
    custom_user_id = f"user_{uuid.uuid4().hex[:12]}"
    
    user_doc = {
        "user_id": custom_user_id,
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
    
    result = await db.users.insert_one(user_doc)
    # Use MongoDB ObjectId for token and response
    mongodb_id = str(result.inserted_id)
    
    # Track user signup event
    await db.user_events.insert_one({
        "user_id": mongodb_id,
        "event_type": "user_registered",
        "timestamp": datetime.now(timezone.utc),
        "metadata": {
            "username": user_data.username,
            "email": user_data.email,
            "registration_method": "email_password"
        }
    })
    logger.info(f"New user registered: {user_data.username} ({user_data.email})")
    
    # Generate JWT token using MongoDB ObjectId
    token = create_jwt_token(mongodb_id)
    
    return {
        "message": "User created successfully",
        "token": token,
        "user_id": mongodb_id  # Always return MongoDB ObjectId
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
    
    # Get user from database to get username
    user = await find_user_by_id(user_id)
    username = user.get("username", user_data.email.split('@')[0]) if user else user_data.email.split('@')[0]
    
    # Generate our own JWT token (not the one from Emergent Auth)
    session_token = jwt.encode(
        {
            "user_id": user_id,
            "username": username,
            "email": user_data.email,
            "auth_provider": "google",
            "exp": datetime.now(timezone.utc).timestamp() + (30 * 24 * 60 * 60)  # 30 days
        },
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )
    
    # Store session in database
    await store_session(db, user_id, session_token)
    
    # Set httpOnly cookie
    set_session_cookie(response, session_token)
    
    logger.info(f"OAuth login successful for: {user_data.email}")
    
    return {
        "message": "Login successful",
        "session_token": session_token,
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
        # First, check if user already exists with this Apple ID
        existing_user = await db.users.find_one({"apple_user_id": auth_data.user_id})
        
        # If not found by Apple ID but email is provided, check by email (account linking)
        if not existing_user and auth_data.email:
            existing_user = await db.users.find_one({"email": auth_data.email})
            if existing_user:
                # Link this Apple ID to the existing account
                await db.users.update_one(
                    {"_id": existing_user["_id"]},
                    {"$set": {"apple_user_id": auth_data.user_id}}
                )
                logger.info(f"Linked Apple ID to existing account: {auth_data.email}")
        
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
            logger.info(f"Existing user found for Apple Sign-In: {username}")
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
                "followers_count": 0,
                "following_count": 0,
                "workouts_count": 0,
                "following": [],
                "followers": [],
                "auth_provider": "apple",
                "auth_metadata": {
                    "login_methods": ["apple"],
                    "first_login_at": datetime.now(timezone.utc),
                    "last_login_at": datetime.now(timezone.utc),
                    "total_logins": 1
                }
            }
            
            result = await db.users.insert_one(new_user)
            # Get the MongoDB ObjectId after insert
            mongodb_id = str(result.inserted_id)
            logger.info(f"Created new Apple user: {username} with MongoDB ID: {mongodb_id}")
        
        # Get the MongoDB ObjectId for use in token and responses
        if existing_user:
            mongodb_id = str(existing_user["_id"])
        
        # Generate session token using MongoDB ObjectId (not custom user_id)
        session_token = jwt.encode(
            {
                "user_id": mongodb_id,  # Always use MongoDB ObjectId
                "username": username,
                "email": email,
                "auth_provider": "apple",
                "exp": datetime.now(timezone.utc).timestamp() + (30 * 24 * 60 * 60)  # 30 days
            },
            JWT_SECRET,
            algorithm=JWT_ALGORITHM
        )
        
        # Update last login using MongoDB ObjectId
        await db.users.update_one(
            {"_id": ObjectId(mongodb_id)},
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
        await track_login_event(db, mongodb_id, "apple", True, get_client_ip(request), get_user_agent(request))
        
        # Create session record
        await create_session_record(db, mongodb_id, session_token, get_client_ip(request), get_user_agent(request))
        
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
            "user_id": mongodb_id,  # Always return MongoDB ObjectId
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

class GuestTrackEventRequest(BaseModel):
    event_type: str
    device_id: str  # Unique device/session identifier for guests
    metadata: Optional[dict] = None

@api_router.post("/analytics/track")
async def track_event(
    request: TrackEventRequest,
    current_user_id: str = Depends(get_current_user)
):
    """
    Track a user event (authenticated users)
    """
    await track_user_event(db, current_user_id, request.event_type, request.metadata)
    return {"message": "Event tracked successfully"}

@api_router.post("/analytics/track/guest")
async def track_guest_event(request: GuestTrackEventRequest):
    """
    Track a guest user event (no authentication required).
    Uses device_id to identify the guest session.
    Guest events are stored separately and can be merged on signup.
    """
    try:
        # Create guest event document
        guest_event = {
            "device_id": request.device_id,
            "event_type": request.event_type,
            "event_category": EVENT_TYPES.get(request.event_type, "other"),
            "metadata": request.metadata or {},
            "is_guest": True,
            "merged_to_user_id": None,  # Will be set when guest signs up
            "timestamp": datetime.now(timezone.utc),
        }
        
        await db.user_events.insert_one(guest_event)
        logger.info(f"📊 Guest event tracked: {request.event_type} for device {request.device_id[:8]}...")
        
        return {"message": "Guest event tracked successfully"}
    except Exception as e:
        logger.error(f"Error tracking guest event: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to track event")

@api_router.post("/analytics/alias")
async def alias_guest_to_user(
    device_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Merge guest activity into a registered user account.
    Call this after a guest signs up or logs in.
    """
    try:
        # Find all guest events with this device_id that haven't been merged
        result = await db.user_events.update_many(
            {
                "device_id": device_id,
                "is_guest": True,
                "merged_to_user_id": None
            },
            {
                "$set": {
                    "merged_to_user_id": current_user_id,
                    "merged_at": datetime.now(timezone.utc)
                }
            }
        )
        
        merged_count = result.modified_count
        logger.info(f"🔗 Merged {merged_count} guest events from device {device_id[:8]}... to user {current_user_id}")
        
        return {
            "message": f"Successfully merged {merged_count} guest events",
            "merged_count": merged_count
        }
    except Exception as e:
        logger.error(f"Error aliasing guest to user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to merge guest activity")


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


# ============================================
# ENHANCED ADMIN ANALYTICS V2 ENDPOINTS
# ============================================

# Heartbeat endpoint for real-time active user tracking
@api_router.post("/analytics/heartbeat")
async def record_heartbeat(
    current_user_id: str = Depends(get_current_user)
):
    """
    Record user heartbeat for real-time active user tracking.
    Called every 30-60 seconds while app is open.
    """
    try:
        await db.user_heartbeats.update_one(
            {"user_id": current_user_id},
            {
                "$set": {
                    "user_id": current_user_id,
                    "last_heartbeat": datetime.now(timezone.utc),
                    "is_online": True
                }
            },
            upsert=True
        )
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Heartbeat error: {e}")
        return {"status": "error"}


@api_router.get("/analytics/admin/realtime-active")
async def get_realtime_active_users(
    timeout_minutes: int = 5,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get truly active users (with heartbeat in last N minutes).
    These are users currently with the app open.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=timeout_minutes)
    
    # Find users with recent heartbeats
    active_heartbeats = await db.user_heartbeats.find({
        "last_heartbeat": {"$gte": cutoff}
    }).to_list(1000)
    
    active_users = []
    for hb in active_heartbeats:
        user_id = hb.get("user_id")
        try:
            # Try to find user by custom user_id first
            user = await db.users.find_one({"user_id": user_id})
            if not user:
                user = await db.users.find_one({"_id": ObjectId(user_id)})
            
            if user:
                active_users.append({
                    "user_id": user_id,
                    "username": user.get("username", "Unknown"),
                    "avatar_url": user.get("avatar_url") or user.get("avatar", ""),
                    "avatar": user.get("avatar") or user.get("avatar_url", ""),
                    "last_active": hb.get("last_heartbeat").isoformat() if hb.get("last_heartbeat") else None
                })
        except:
            continue
    
    return {
        "active_count": len(active_users),
        "users": active_users,
        "timeout_minutes": timeout_minutes
    }


@api_router.get("/analytics/admin/comprehensive-stats")
async def get_comprehensive_stats(
    days: int = 1,
    user_type: str = "all",  # "all", "users", "guests"
    current_user_id: str = Depends(get_current_user)
):
    """
    Get comprehensive platform statistics with accurate data.
    This is the main endpoint for the admin dashboard.
    days=0 means "all time" (no date filter)
    user_type: "all" (combined), "users" (registered only), "guests" (guest only)
    """
    from collections import defaultdict
    
    # Handle "all time" option (days=0)
    is_all_time = days == 0
    if is_all_time:
        # Use a very old date to effectively get all data
        start_date = datetime(2020, 1, 1, tzinfo=timezone.utc)
    else:
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    realtime_cutoff = datetime.now(timezone.utc) - timedelta(minutes=5)
    
    # Build user type filter for event queries
    def get_user_type_filter():
        if user_type == "users":
            return {"is_guest": {"$ne": True}}  # Registered users only
        elif user_type == "guests":
            return {"is_guest": True}  # Guests only
        else:
            return {}  # All users (no filter)
    
    user_type_filter = get_user_type_filter()
    
    try:
        # === USER METRICS (Accurate) ===
        total_users = await db.users.count_documents({})
        
        # New users in period (for "all time", this equals total users)
        if is_all_time:
            new_users = total_users
        else:
            new_users = await db.users.count_documents({
                "created_at": {"$gte": start_date}
            })
        
        # Really active users (with heartbeat in last 5 mins) - registered users only
        realtime_active_users = await db.user_heartbeats.count_documents({
            "last_heartbeat": {"$gte": realtime_cutoff}
        })
        
        # Active guests (with recent guest events)
        realtime_active_guests = await db.user_events.distinct(
            "device_id",
            {
                "is_guest": True,
                "timestamp": {"$gte": realtime_cutoff}
            }
        )
        realtime_active_guest_count = len(realtime_active_guests) if realtime_active_guests else 0
        
        # Combined realtime active based on filter
        if user_type == "users":
            realtime_active = realtime_active_users
        elif user_type == "guests":
            realtime_active = realtime_active_guest_count
        else:
            realtime_active = realtime_active_users + realtime_active_guest_count
        
        # Users with any activity in period
        active_user_ids = await db.user_events.distinct(
            "user_id",
            {"timestamp": {"$gte": start_date}, "is_guest": {"$ne": True}}
        )
        active_guest_devices = await db.user_events.distinct(
            "device_id",
            {"timestamp": {"$gte": start_date}, "is_guest": True}
        )
        
        if user_type == "users":
            users_with_activity = len(active_user_ids) if active_user_ids else 0
        elif user_type == "guests":
            users_with_activity = len(active_guest_devices) if active_guest_devices else 0
        else:
            users_with_activity = (len(active_user_ids) if active_user_ids else 0) + (len(active_guest_devices) if active_guest_devices else 0)
        
        # === SESSION METRICS (Combined) ===
        session_filter = {"timestamp": {"$gte": start_date}, **user_type_filter}
        
        # Count actual app_opened events (most reliable session indicator)
        app_opens = await db.user_events.count_documents({
            "event_type": "app_opened",
            **session_filter
        })
        
        # Count app_session_start as fallback
        app_sessions = await db.user_events.count_documents({
            "event_type": "app_session_start",
            **session_filter
        })
        
        # Count guest_session_started for guests
        guest_sessions = await db.user_events.count_documents({
            "event_type": "guest_session_started",
            "timestamp": {"$gte": start_date}
        })
        
        if user_type == "guests":
            total_sessions = guest_sessions
        elif user_type == "users":
            total_sessions = max(app_opens, app_sessions) if app_opens > 0 or app_sessions > 0 else 0
        else:
            total_sessions = max(app_opens, app_sessions) + guest_sessions
        
        # === PAGE/SCREEN VIEWS ===
        # Use $toLower to normalize screen names and merge duplicates
        screen_views_pipeline = [
            {
                "$match": {
                    "event_type": {"$in": ["screen_viewed", "screen_entered"]},
                    "timestamp": {"$gte": start_date},
                    **user_type_filter
                }
            },
            {
                "$addFields": {
                    "normalized_screen": {"$toLower": "$metadata.screen_name"}
                }
            },
            {
                "$group": {
                    "_id": "$normalized_screen",
                    "count": {"$sum": 1},
                    "unique_users": {"$addToSet": {"$ifNull": ["$user_id", "$device_id"]}}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        
        # Page name normalization map
        page_name_map = {
            "profile": "Profile",
            "explore": "Explore", 
            "index": "Home",
            "home": "Home",
            "cart": "Workout Cart",
            "workout-session": "Workout Session",
            "create-post": "Create Post",
            "admin-dashboard": "Admin Dashboard",
            "featured-workout-detail": "Featured Workout",
            "user-profile": "User Profile",
            "settings": "Settings",
            "workout-type": "Workout Type",
            "landing": "Landing Page",
            "login": "Login",
            "register": "Register",
            "auth/login": "Login",
            "privacy-policy": "Privacy Policy",
        }
        
        top_pages = await db.user_events.aggregate(screen_views_pipeline).to_list(20)
        
        # Merge duplicates after normalization
        merged_pages = {}
        for page in top_pages:
            if page["_id"]:
                normalized = page["_id"].lower().strip()
                display_name = page_name_map.get(normalized, normalized.replace('-', ' ').title())
                
                if display_name in merged_pages:
                    merged_pages[display_name]["views"] += page["count"]
                    merged_pages[display_name]["unique_users"].update(page["unique_users"] or [])
                else:
                    merged_pages[display_name] = {
                        "page": display_name,
                        "views": page["count"],
                        "unique_users": set(page["unique_users"] or [])
                    }
        
        # Convert to list and sort by views
        top_pages_formatted = []
        total_screen_views = 0
        for page_data in sorted(merged_pages.values(), key=lambda x: x["views"], reverse=True)[:10]:
            total_screen_views += page_data["views"]
            top_pages_formatted.append({
                "page": page_data["page"],
                "views": page_data["views"],
                "unique_users": len(page_data["unique_users"])
            })
        
        # === MOOD CARD SELECTIONS ===
        mood_pipeline = [
            {
                "$match": {
                    "event_type": "mood_selected",
                    "timestamp": {"$gte": start_date},
                    **user_type_filter
                }
            },
            {
                "$group": {
                    "_id": "$metadata.mood_category",
                    "count": {"$sum": 1},
                    "unique_users": {"$addToSet": {"$ifNull": ["$user_id", "$device_id"]}}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        
        mood_display_names = {
            "sweat": "I Want to Sweat",
            "muscle": "Muscle Gainer",
            "outdoor": "Get Outside",
            "calisthenics": "Calisthenics",
            "lazy": "Feeling Lazy",
            "explosive": "Get Explosive"
        }
        
        top_moods = await db.user_events.aggregate(mood_pipeline).to_list(10)
        top_moods_formatted = []
        total_mood_selections = 0
        for mood in top_moods:
            if mood["_id"]:
                count = mood["count"]
                total_mood_selections += count
                display_name = mood_display_names.get(mood["_id"], mood["_id"])
                top_moods_formatted.append({
                    "mood": display_name,
                    "mood_id": mood["_id"],
                    "selections": count,
                    "unique_users": len(mood["unique_users"]) if mood["unique_users"] else 0
                })
        
        # === WORKOUT METRICS ===
        workouts_started = await db.user_events.count_documents({
            "event_type": "workout_started",
            "timestamp": {"$gte": start_date}
        })
        
        workouts_completed = await db.user_events.count_documents({
            "event_type": "workout_completed",
            "timestamp": {"$gte": start_date}
        })
        
        # Workouts added to cart (cart_item_added events)
        workouts_added = await db.user_events.count_documents({
            "event_type": "cart_item_added",
            "timestamp": {"$gte": start_date}
        })
        
        completion_rate = round((workouts_completed / workouts_started * 100), 1) if workouts_started > 0 else 0
        
        # === SOCIAL METRICS ===
        total_posts = await db.user_events.count_documents({
            "event_type": "post_created",
            "timestamp": {"$gte": start_date}
        })
        
        total_likes = await db.user_events.count_documents({
            "event_type": "post_liked",
            "timestamp": {"$gte": start_date}
        })
        
        total_comments = await db.user_events.count_documents({
            "event_type": "post_commented",
            "timestamp": {"$gte": start_date}
        })
        
        total_follows = await db.user_events.count_documents({
            "event_type": "user_followed",
            "timestamp": {"$gte": start_date}
        })
        
        # === GUEST METRICS ===
        # Count guest sessions started
        guest_signins = await db.user_events.count_documents({
            "event_type": "guest_session_started",
            "is_guest": True,
            "timestamp": {"$gte": start_date}
        })
        
        # Count unique guest devices
        guest_devices = await db.user_events.distinct(
            "device_id",
            {
                "event_type": "guest_session_started",
                "is_guest": True,
                "timestamp": {"$gte": start_date}
            }
        )
        unique_guest_devices = len(guest_devices) if guest_devices else 0
        
        # Count guests who converted (unique devices that merged to a user)
        converted_devices = await db.user_events.distinct(
            "device_id",
            {
                "is_guest": True,
                "merged_to_user_id": {"$ne": None},
                "timestamp": {"$gte": start_date}
            }
        )
        guest_conversions = len(converted_devices) if converted_devices else 0
        
        return {
            "period_days": days,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            
            # User Metrics
            "total_users": total_users,
            "new_users": new_users,
            "realtime_active_users": realtime_active,
            "users_with_activity": users_with_activity,
            
            # Session Metrics
            "total_sessions": total_sessions,
            "total_screen_views": total_screen_views,
            
            # Top Pages
            "top_pages": top_pages_formatted,
            
            # Mood Card Selections
            "total_mood_selections": total_mood_selections,
            "top_mood_cards": top_moods_formatted,
            
            # Workout Metrics
            "workouts_added": workouts_added,
            "workouts_started": workouts_started,
            "workouts_completed": workouts_completed,
            "workout_completion_rate": completion_rate,
            
            # Social Metrics
            "posts_created": total_posts,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "total_follows": total_follows,
            
            # Guest Metrics
            "guest_signins": guest_signins,
            "unique_guest_devices": unique_guest_devices,
            "guest_conversions": guest_conversions,
        }
        
    except Exception as e:
        logger.error(f"Error getting comprehensive stats: {e}")
        return {"error": str(e)}


@api_router.get("/analytics/admin/users/list")
async def get_users_list(
    days: int = 30,
    limit: int = 50,
    skip: int = 0,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    search: str = "",
    current_user_id: str = Depends(get_current_user)
):
    """
    Get paginated list of all users with detailed stats.
    Supports sorting and searching.
    """
    start_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    # Build query
    query = {}
    if search:
        query["$or"] = [
            {"username": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]
    
    # Determine sort order
    sort_direction = -1 if sort_order == "desc" else 1
    
    # Get users
    users_cursor = db.users.find(query).sort(sort_by, sort_direction).skip(skip).limit(limit)
    users = await users_cursor.to_list(limit)
    total_count = await db.users.count_documents(query)
    
    user_details = []
    for user in users:
        user_id = str(user["_id"])
        
        # Get activity metrics
        events_count = await db.user_events.count_documents({
            "user_id": user_id,
            "timestamp": {"$gte": start_date}
        })
        
        workouts_count = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "workout_completed",
            "timestamp": {"$gte": start_date}
        })
        
        posts_count = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "post_created",
            "timestamp": {"$gte": start_date}
        })
        
        # Get last activity
        last_event = await db.user_events.find_one(
            {"user_id": user_id},
            sort=[("timestamp", -1)]
        )
        
        user_details.append({
            "user_id": user_id,
            "username": user.get("username", "Unknown"),
            "email": user.get("email", ""),
            "avatar_url": user.get("avatar_url") or user.get("avatar", ""),
            "avatar": user.get("avatar") or user.get("avatar_url", ""),
            "created_at": user.get("created_at").isoformat() if user.get("created_at") else None,
            "last_active": last_event["timestamp"].isoformat() if last_event and last_event.get("timestamp") else None,
            "events_count": events_count,
            "workouts_completed": workouts_count,
            "posts_created": posts_count,
            "followers_count": user.get("followers_count", 0),
            "following_count": user.get("following_count", 0),
        })
    
    return {
        "users": user_details,
        "total_count": total_count,
        "page": skip // limit + 1,
        "total_pages": (total_count + limit - 1) // limit,
        "period_days": days
    }


@api_router.get("/analytics/admin/users/{user_id}/report")
async def get_user_detail_report(
    user_id: str,
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get detailed analytics report for a specific user.
    Includes: workouts added to cart, workouts completed, screens viewed,
    app sessions, posts/likes/comments, time spent in app.
    days=0 means "all time" (no date filter)
    """
    # Verify admin
    admin_user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not admin_user or admin_user.get("username", "").lower() != "officialmoodapp":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Handle "all time" option (days=0)
    is_all_time = days == 0
    if is_all_time:
        start_date = datetime(2020, 1, 1, tzinfo=timezone.utc)
    else:
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    # Build date filter for queries
    date_filter = {"$gte": start_date}
    
    try:
        # Find the user
        target_user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Basic user info
        user_info = {
            "user_id": user_id,
            "username": target_user.get("username", "Unknown"),
            "email": target_user.get("email", ""),
            "avatar_url": target_user.get("avatar_url") or target_user.get("avatar", ""),
            "avatar": target_user.get("avatar") or target_user.get("avatar_url", ""),
            "created_at": target_user.get("created_at").isoformat() if target_user.get("created_at") else None,
            "followers_count": target_user.get("followers_count", 0),
            "following_count": target_user.get("following_count", 0),
        }
        
        # Workouts added to cart
        workouts_added_to_cart = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "workout_added_to_cart",
            "timestamp": date_filter
        })
        
        # Workouts completed
        workouts_completed = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "workout_completed",
            "timestamp": date_filter
        })
        
        # Workouts started
        workouts_started = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "workout_started",
            "timestamp": date_filter
        })
        
        # Screen views (unique screens and total views)
        screen_views_pipeline = [
            {
                "$match": {
                    "user_id": user_id,
                    "event_type": {"$in": ["screen_viewed", "screen_entered"]},
                    "timestamp": date_filter
                }
            },
            {
                "$group": {
                    "_id": "$metadata.screen_name",
                    "count": {"$sum": 1}
                }
            }
        ]
        screen_views_result = await db.user_events.aggregate(screen_views_pipeline).to_list(100)
        total_screen_views = sum(s["count"] for s in screen_views_result)
        unique_screens_viewed = len([s for s in screen_views_result if s["_id"]])
        
        # Page name normalization map (same as aggregate)
        page_name_map = {
            "profile": "Profile",
            "explore": "Explore", 
            "index": "Home",
            "home": "Home",
            "cart": "Workout Cart",
            "workout-session": "Workout Session",
            "create-post": "Create Post",
            "admin-dashboard": "Admin Dashboard",
            "featured-workout-detail": "Featured Workout",
            "user-profile": "User Profile",
            "settings": "Settings",
            "workout-type": "Workout Type",
            "landing": "Landing Page",
            "login": "Login",
            "register": "Register",
            "auth/login": "Login",
            "privacy-policy": "Privacy Policy",
        }
        
        # Merge duplicate screens and normalize names
        merged_screens = {}
        for s in screen_views_result:
            if s["_id"]:
                normalized = s["_id"].lower().strip()
                display_name = page_name_map.get(normalized, normalized.replace('-', ' ').title())
                
                if display_name in merged_screens:
                    merged_screens[display_name]["views"] += s["count"]
                else:
                    merged_screens[display_name] = {
                        "screen": display_name,
                        "views": s["count"]
                    }
        
        # Top screens viewed (sorted and limited)
        top_screens = sorted(
            list(merged_screens.values()),
            key=lambda x: x["views"],
            reverse=True
        )[:5]
        
        # Calculate percentages for top screens
        if total_screen_views > 0:
            for screen in top_screens:
                screen["percentage"] = round((screen["views"] / total_screen_views) * 100, 1)
        
        # App sessions (app_opened or app_session_start events)
        app_sessions = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": {"$in": ["app_opened", "app_session_start"]},
            "timestamp": date_filter
        })
        
        # Posts created
        posts_created = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "post_created",
            "timestamp": date_filter
        })
        
        # Also count from posts collection
        posts_in_db = await db.posts.count_documents({
            "author_id": user_id
        })
        
        # Likes given
        likes_given = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "post_liked",
            "timestamp": date_filter
        })
        
        # Comments made
        comments_made = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "post_commented",
            "timestamp": date_filter
        })
        
        # Time spent in app (sum of screen_time_spent events)
        time_spent_pipeline = [
            {
                "$match": {
                    "user_id": user_id,
                    "event_type": "screen_time_spent",
                    "timestamp": date_filter
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total_seconds": {"$sum": "$metadata.duration_seconds"}
                }
            }
        ]
        time_spent_result = await db.user_events.aggregate(time_spent_pipeline).to_list(1)
        total_time_seconds = time_spent_result[0]["total_seconds"] if time_spent_result else 0
        
        # Format time spent
        hours = total_time_seconds // 3600
        minutes = (total_time_seconds % 3600) // 60
        time_spent_formatted = f"{hours}h {minutes}m" if hours > 0 else f"{minutes}m"
        
        # Get last activity
        last_event = await db.user_events.find_one(
            {"user_id": user_id},
            sort=[("timestamp", -1)]
        )
        
        # Mood selections
        mood_selections = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "mood_selected",
            "timestamp": date_filter
        })
        
        # Follows given
        follows_given = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "user_followed",
            "timestamp": date_filter
        })
        
        return {
            "user": user_info,
            "period_days": days,
            "is_all_time": is_all_time,
            "report": {
                # Workout metrics
                "workouts_added_to_cart": workouts_added_to_cart,
                "workouts_started": workouts_started,
                "workouts_completed": workouts_completed,
                "workout_completion_rate": round((workouts_completed / workouts_started * 100), 1) if workouts_started > 0 else 0,
                
                # Screen/navigation metrics
                "total_screen_views": total_screen_views,
                "unique_screens_viewed": unique_screens_viewed,
                "top_screens": top_screens,
                
                # App usage metrics
                "app_sessions": app_sessions,
                "total_time_seconds": total_time_seconds,
                "time_spent_formatted": time_spent_formatted,
                
                # Social/engagement metrics
                "posts_created": max(posts_created, posts_in_db),
                "likes_given": likes_given,
                "comments_made": comments_made,
                "follows_given": follows_given,
                
                # Other
                "mood_selections": mood_selections,
                "last_active": last_event["timestamp"].isoformat() if last_event and last_event.get("timestamp") else None,
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user report: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/analytics/admin/export/users")
async def export_users_csv(
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """
    Export all users data as CSV format (returns JSON for frontend to convert).
    """
    start_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    users = await db.users.find({}).to_list(10000)
    
    export_data = []
    for user in users:
        user_id = str(user["_id"])
        
        events_count = await db.user_events.count_documents({
            "user_id": user_id,
            "timestamp": {"$gte": start_date}
        })
        
        workouts_count = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": "workout_completed"
        })
        
        export_data.append({
            "username": user.get("username", ""),
            "email": user.get("email", ""),
            "created_at": user.get("created_at").isoformat() if user.get("created_at") else "",
            "followers": user.get("followers_count", 0),
            "following": user.get("following_count", 0),
            "total_workouts": workouts_count,
            "events_in_period": events_count,
        })
    
    return {
        "data": export_data,
        "count": len(export_data),
        "period_days": days
    }


@api_router.delete("/analytics/admin/users/{user_id}")
async def soft_delete_user(
    user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Soft delete a user - moves their profile to deleted_users collection
    for 7 days before permanent deletion.
    Only admin can perform this action.
    """
    # Verify admin
    admin_user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not admin_user or admin_user.get("username", "").lower() != "officialmoodapp":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Prevent self-deletion
    if user_id == current_user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    try:
        # Find the user to delete
        user_to_delete = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user_to_delete:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Prepare the deleted user record
        deleted_record = {
            **user_to_delete,
            "original_id": str(user_to_delete["_id"]),
            "deleted_at": datetime.now(timezone.utc),
            "deleted_by": current_user_id,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "reason": "admin_deletion"
        }
        del deleted_record["_id"]  # Remove original _id for new insertion
        
        # Move to deleted_users collection
        await db.deleted_users.insert_one(deleted_record)
        
        # Delete from main users collection
        await db.users.delete_one({"_id": ObjectId(user_id)})
        
        # Optionally mark their posts as from deleted user (keep posts but mark them)
        await db.posts.update_many(
            {"author_id": user_id},
            {"$set": {"author_deleted": True}}
        )
        
        logger.info(f"User {user_id} soft deleted by admin {current_user_id}")
        
        return {
            "message": "User deleted successfully",
            "user_id": user_id,
            "username": user_to_delete.get("username"),
            "recoverable_until": deleted_record["expires_at"].isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error soft deleting user: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/analytics/admin/deleted-users")
async def get_deleted_users(
    current_user_id: str = Depends(get_current_user)
):
    """
    Get list of soft-deleted users that can be recovered.
    """
    # Verify admin
    admin_user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not admin_user or admin_user.get("username", "").lower() != "officialmoodapp":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    now = datetime.now(timezone.utc)
    
    # Get deleted users that haven't expired
    deleted_users = await db.deleted_users.find({
        "expires_at": {"$gt": now}
    }).sort("deleted_at", -1).to_list(100)
    
    result = []
    for user in deleted_users:
        result.append({
            "original_id": user.get("original_id"),
            "username": user.get("username"),
            "email": user.get("email"),
            "deleted_at": user.get("deleted_at").isoformat() if user.get("deleted_at") else None,
            "expires_at": user.get("expires_at").isoformat() if user.get("expires_at") else None,
            "days_remaining": (user.get("expires_at") - now).days if user.get("expires_at") else 0
        })
    
    return {
        "deleted_users": result,
        "count": len(result)
    }


@api_router.post("/analytics/admin/users/{user_id}/restore")
async def restore_deleted_user(
    user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Restore a soft-deleted user before the 7-day expiration.
    """
    # Verify admin
    admin_user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not admin_user or admin_user.get("username", "").lower() != "officialmoodapp":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        # Find in deleted_users
        deleted_user = await db.deleted_users.find_one({"original_id": user_id})
        if not deleted_user:
            raise HTTPException(status_code=404, detail="Deleted user not found")
        
        # Check if expired
        if deleted_user.get("expires_at") and deleted_user["expires_at"] < datetime.now(timezone.utc):
            raise HTTPException(status_code=410, detail="User data has expired and been permanently deleted")
        
        # Restore to users collection
        restore_data = {k: v for k, v in deleted_user.items() 
                       if k not in ["_id", "original_id", "deleted_at", "deleted_by", "expires_at", "reason"]}
        restore_data["_id"] = ObjectId(user_id)
        restore_data["restored_at"] = datetime.now(timezone.utc)
        
        await db.users.insert_one(restore_data)
        
        # Remove from deleted_users
        await db.deleted_users.delete_one({"original_id": user_id})
        
        # Restore their posts
        await db.posts.update_many(
            {"author_id": user_id},
            {"$unset": {"author_deleted": ""}}
        )
        
        logger.info(f"User {user_id} restored by admin {current_user_id}")
        
        return {
            "message": "User restored successfully",
            "user_id": user_id,
            "username": restore_data.get("username")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error restoring user: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/analytics/admin/chart-data/{chart_type}")
async def get_chart_data(
    chart_type: str,
    period: str = "day",  # day, week, month
    days: int = 30,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get formatted data for various chart types.
    
    chart_type options:
    - user_growth: New users over time
    - session_trend: App sessions over time
    - mood_distribution: Pie chart of mood selections
    - page_views: Top pages bar chart
    - workout_completion: Workouts started vs completed
    - engagement_trend: Likes, comments, follows over time
    """
    from collections import defaultdict
    
    # Helper to get week start date from ISO week format
    def get_week_start_date(year_week_str):
        """Convert YYYY-WXX to the Monday of that week"""
        try:
            year = int(year_week_str.split('-W')[0])
            week = int(year_week_str.split('-W')[1])
            # Get first day of year, then add weeks
            first_day = datetime(year, 1, 1)
            # Find first Monday
            days_to_monday = (7 - first_day.weekday()) % 7
            first_monday = first_day + timedelta(days=days_to_monday)
            week_start = first_monday + timedelta(weeks=week - 1)
            return week_start
        except:
            return None
    
    # Determine date range and format
    if period == "month":
        days_back = min(days, 365)
        date_format = "%Y-%m"
    elif period == "week":
        days_back = min(days, 180)
        date_format = "%Y-W%V"
    else:
        days_back = min(days, 90)
        date_format = "%Y-%m-%d"
    
    cutoff = datetime.now(timezone.utc) - timedelta(days=days_back)
    
    def format_label(date_key, period_type):
        """Format a date key into a human-readable label"""
        try:
            if period_type == "month":
                dt = datetime.strptime(date_key, "%Y-%m")
                return dt.strftime("%b '%y")
            elif period_type == "week":
                # Convert YYYY-WXX to date range like "Dec 30 - Jan 5"
                week_start = get_week_start_date(date_key)
                if week_start:
                    week_end = week_start + timedelta(days=6)
                    if week_start.month == week_end.month:
                        return f"{week_start.strftime('%b %d')}-{week_end.strftime('%d')}"
                    else:
                        return f"{week_start.strftime('%b %d')}-{week_end.strftime('%b %d')}"
                return date_key
            else:
                dt = datetime.strptime(date_key, "%Y-%m-%d")
                return dt.strftime("%m/%d")
        except:
            return date_key
    
    try:
        if chart_type == "user_growth":
            users = await db.users.find(
                {"created_at": {"$gte": cutoff}},
                {"created_at": 1}
            ).to_list(100000)
            
            data_by_period = defaultdict(int)
            for user in users:
                if user.get("created_at"):
                    period_key = user["created_at"].strftime(date_format)
                    data_by_period[period_key] += 1
            
            sorted_data = sorted(data_by_period.items())
            
            # Calculate cumulative
            cumulative = []
            running_total = 0
            for _, count in sorted_data:
                running_total += count
                cumulative.append(running_total)
            
            labels = [format_label(date_key, period) for date_key, _ in sorted_data]
            
            return {
                "chart_type": chart_type,
                "labels": labels,
                "datasets": [
                    {"label": "New Users", "data": [v for _, v in sorted_data]},
                    {"label": "Cumulative", "data": cumulative}
                ]
            }
            
        elif chart_type == "session_trend":
            events = await db.user_events.find(
                {"event_type": {"$in": ["app_opened", "app_session_start"]}, "timestamp": {"$gte": cutoff}},
                {"timestamp": 1}
            ).to_list(100000)
            
            data_by_period = defaultdict(int)
            for event in events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    data_by_period[period_key] += 1
            
            sorted_data = sorted(data_by_period.items())
            labels = [format_label(date_key, period) for date_key, _ in sorted_data]
            
            return {
                "chart_type": chart_type,
                "labels": labels,
                "datasets": [
                    {"label": "Sessions", "data": [v for _, v in sorted_data]}
                ]
            }
            
        elif chart_type == "mood_distribution":
            mood_pipeline = [
                {"$match": {"event_type": "mood_selected", "timestamp": {"$gte": cutoff}}},
                {"$group": {"_id": "$metadata.mood_category", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}}
            ]
            
            mood_display_names = {
                "sweat": "I Want to Sweat",
                "muscle": "Muscle Gainer", 
                "outdoor": "Get Outside",
                "calisthenics": "Calisthenics",
                "lazy": "Feeling Lazy",
                "explosive": "Get Explosive"
            }
            
            moods = await db.user_events.aggregate(mood_pipeline).to_list(20)
            
            return {
                "chart_type": chart_type,
                "labels": [mood_display_names.get(m["_id"], m["_id"] or "Unknown") for m in moods if m["_id"]],
                "datasets": [
                    {"label": "Selections", "data": [m["count"] for m in moods if m["_id"]]}
                ]
            }
            
        elif chart_type == "page_views":
            page_pipeline = [
                {"$match": {"event_type": {"$in": ["screen_viewed", "screen_entered"]}, "timestamp": {"$gte": cutoff}}},
                {"$group": {"_id": "$metadata.screen_name", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10}
            ]
            
            pages = await db.user_events.aggregate(page_pipeline).to_list(10)
            
            return {
                "chart_type": chart_type,
                "labels": [p["_id"] or "Unknown" for p in pages],
                "datasets": [
                    {"label": "Views", "data": [p["count"] for p in pages]}
                ]
            }
            
        elif chart_type == "workout_completion":
            started_pipeline = [
                {"$match": {"event_type": "workout_started", "timestamp": {"$gte": cutoff}}},
                {"$group": {"_id": {"$dateToString": {"format": date_format, "date": "$timestamp"}}, "count": {"$sum": 1}}},
                {"$sort": {"_id": 1}}
            ]
            
            completed_pipeline = [
                {"$match": {"event_type": "workout_completed", "timestamp": {"$gte": cutoff}}},
                {"$group": {"_id": {"$dateToString": {"format": date_format, "date": "$timestamp"}}, "count": {"$sum": 1}}},
                {"$sort": {"_id": 1}}
            ]
            
            started = await db.user_events.aggregate(started_pipeline).to_list(100)
            completed = await db.user_events.aggregate(completed_pipeline).to_list(100)
            
            # Merge datasets
            all_dates = sorted(set([s["_id"] for s in started] + [c["_id"] for c in completed]))
            started_dict = {s["_id"]: s["count"] for s in started}
            completed_dict = {c["_id"]: c["count"] for c in completed}
            
            labels = [format_label(date_key, period) for date_key in all_dates]
            
            return {
                "chart_type": chart_type,
                "labels": labels,
                "datasets": [
                    {"label": "Started", "data": [started_dict.get(d, 0) for d in all_dates]},
                    {"label": "Completed", "data": [completed_dict.get(d, 0) for d in all_dates]}
                ]
            }
            
        elif chart_type == "engagement_trend":
            like_events = await db.user_events.find(
                {"event_type": "post_liked", "timestamp": {"$gte": cutoff}},
                {"timestamp": 1}
            ).to_list(100000)
            
            comment_events = await db.user_events.find(
                {"event_type": "post_commented", "timestamp": {"$gte": cutoff}},
                {"timestamp": 1}
            ).to_list(100000)
            
            follow_events = await db.user_events.find(
                {"event_type": "user_followed", "timestamp": {"$gte": cutoff}},
                {"timestamp": 1}
            ).to_list(100000)
            
            likes_by_period = defaultdict(int)
            comments_by_period = defaultdict(int)
            follows_by_period = defaultdict(int)
            
            for event in like_events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    likes_by_period[period_key] += 1
                    
            for event in comment_events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    comments_by_period[period_key] += 1
                    
            for event in follow_events:
                if event.get("timestamp"):
                    period_key = event["timestamp"].strftime(date_format)
                    follows_by_period[period_key] += 1
            
            all_dates = sorted(set(list(likes_by_period.keys()) + list(comments_by_period.keys()) + list(follows_by_period.keys())))
            
            labels = [format_label(date_key, period) for date_key in all_dates]
            
            return {
                "chart_type": chart_type,
                "labels": labels,
                "datasets": [
                    {"label": "Likes", "data": [likes_by_period.get(d, 0) for d in all_dates]},
                    {"label": "Comments", "data": [comments_by_period.get(d, 0) for d in all_dates]},
                    {"label": "Follows", "data": [follows_by_period.get(d, 0) for d in all_dates]}
                ]
            }
        
        # Individual engagement metric charts
        elif chart_type == "workouts_added":
            # Track cart_item_added events over time
            pipeline = [
                {"$match": {"event_type": "cart_item_added", "timestamp": {"$gte": cutoff}}},
                {"$group": {"_id": {"$dateToString": {"format": date_format, "date": "$timestamp"}}, "count": {"$sum": 1}}},
                {"$sort": {"_id": 1}}
            ]
            
            results = await db.user_events.aggregate(pipeline).to_list(100)
            labels = [format_label(r["_id"], period) for r in results]
            
            return {
                "chart_type": chart_type,
                "labels": labels,
                "datasets": [{"label": "Workouts Added", "data": [r["count"] for r in results]}]
            }
        
        elif chart_type == "workouts_completed":
            pipeline = [
                {"$match": {"event_type": "workout_completed", "timestamp": {"$gte": cutoff}}},
                {"$group": {"_id": {"$dateToString": {"format": date_format, "date": "$timestamp"}}, "count": {"$sum": 1}}},
                {"$sort": {"_id": 1}}
            ]
            
            results = await db.user_events.aggregate(pipeline).to_list(100)
            labels = [format_label(r["_id"], period) for r in results]
            
            return {
                "chart_type": chart_type,
                "labels": labels,
                "datasets": [{"label": "Workouts Completed", "data": [r["count"] for r in results]}]
            }
        
        elif chart_type == "posts_created":
            pipeline = [
                {"$match": {"event_type": "post_created", "timestamp": {"$gte": cutoff}}},
                {"$group": {"_id": {"$dateToString": {"format": date_format, "date": "$timestamp"}}, "count": {"$sum": 1}}},
                {"$sort": {"_id": 1}}
            ]
            
            results = await db.user_events.aggregate(pipeline).to_list(100)
            labels = [format_label(r["_id"], period) for r in results]
            
            return {
                "chart_type": chart_type,
                "labels": labels,
                "datasets": [{"label": "Posts Created", "data": [r["count"] for r in results]}]
            }
        
        elif chart_type == "likes":
            pipeline = [
                {"$match": {"event_type": "post_liked", "timestamp": {"$gte": cutoff}}},
                {"$group": {"_id": {"$dateToString": {"format": date_format, "date": "$timestamp"}}, "count": {"$sum": 1}}},
                {"$sort": {"_id": 1}}
            ]
            
            results = await db.user_events.aggregate(pipeline).to_list(100)
            labels = [format_label(r["_id"], period) for r in results]
            
            return {
                "chart_type": chart_type,
                "labels": labels,
                "datasets": [{"label": "Likes", "data": [r["count"] for r in results]}]
            }
        
        elif chart_type == "comments":
            pipeline = [
                {"$match": {"event_type": "post_commented", "timestamp": {"$gte": cutoff}}},
                {"$group": {"_id": {"$dateToString": {"format": date_format, "date": "$timestamp"}}, "count": {"$sum": 1}}},
                {"$sort": {"_id": 1}}
            ]
            
            results = await db.user_events.aggregate(pipeline).to_list(100)
            labels = [format_label(r["_id"], period) for r in results]
            
            return {
                "chart_type": chart_type,
                "labels": labels,
                "datasets": [{"label": "Comments", "data": [r["count"] for r in results]}]
            }
        
        elif chart_type == "guest_signins":
            pipeline = [
                {"$match": {"event_type": "guest_session_started", "is_guest": True, "timestamp": {"$gte": cutoff}}},
                {"$group": {"_id": {"$dateToString": {"format": date_format, "date": "$timestamp"}}, "count": {"$sum": 1}}},
                {"$sort": {"_id": 1}}
            ]
            
            results = await db.user_events.aggregate(pipeline).to_list(100)
            labels = [format_label(r["_id"], period) for r in results]
            
            return {
                "chart_type": chart_type,
                "labels": labels,
                "datasets": [{"label": "Guest Sign-ins", "data": [r["count"] for r in results]}]
            }
        
        return {"chart_type": chart_type, "labels": [], "datasets": []}
        
    except Exception as e:
        logger.error(f"Error getting chart data for {chart_type}: {e}")
        return {"chart_type": chart_type, "labels": [], "datasets": [], "error": str(e)}


# User Endpoints

async def calculate_user_streak(user_id: str) -> int:
    """Calculate accurate streak based on activity, reset if inactive"""
    from datetime import datetime, timedelta, timezone
    
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday = today - timedelta(days=1)
    
    # Check if user was active yesterday or today
    recent_activity = await db.user_events.count_documents({
        "user_id": user_id,
        "event_type": {"$in": ["workout_completed", "app_session_start", "app_opened"]},
        "timestamp": {"$gte": yesterday}
    })
    
    if recent_activity == 0:
        # No activity in last 2 days - streak is 0
        return 0
    
    # Calculate actual streak
    current_streak = 0
    for i in range(30):
        day_start = today - timedelta(days=i)
        day_end = day_start + timedelta(days=1)
        
        day_activity = await db.user_events.count_documents({
            "user_id": user_id,
            "event_type": {"$in": ["workout_completed", "app_session_start", "app_opened"]},
            "timestamp": {"$gte": day_start, "$lt": day_end}
        })
        
        if day_activity > 0:
            current_streak += 1
        elif i > 0:
            break
    
    return current_streak

async def find_user_by_id(user_id: str):
    """Find user by either custom user_id field or MongoDB ObjectId"""
    # First try to find by custom user_id field (for OAuth users)
    user = await db.users.find_one({"user_id": user_id})
    
    # If not found, try ObjectId (for legacy users)
    if not user:
        try:
            user = await db.users.find_one({"_id": ObjectId(user_id)})
        except:
            pass  # Invalid ObjectId format, skip
    
    return user

@api_router.get("/users/me", response_model=UserResponse)
async def get_current_user_info(current_user_id: str = Depends(get_current_user)):
    user = await find_user_by_id(current_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate accurate streak
    current_streak = await calculate_user_streak(current_user_id)
    
    # Update stored streak if different
    stored_streak = user.get("current_streak", 0)
    if current_streak != stored_streak:
        # Update using the appropriate identifier
        if "user_id" in user:
            await db.users.update_one(
                {"user_id": user["user_id"]},
                {"$set": {"current_streak": current_streak}}
            )
        else:
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"current_streak": current_streak}}
            )
    
    return UserResponse(
        id=str(user["_id"]),  # Always use MongoDB _id for consistency
        username=user["username"],
        email=user.get("email", ""),
        name=user.get("name"),
        bio=user.get("bio", ""),
        avatar=user.get("avatar", ""),
        followers_count=user.get("followers_count", 0),
        following_count=user.get("following_count", 0),
        workouts_count=user.get("workouts_count", 0),
        current_streak=current_streak,
        created_at=user.get("created_at", datetime.now(timezone.utc))
    )


@api_router.get("/users/me/stats")
async def get_current_user_stats(current_user_id: str = Depends(get_current_user)):
    """Get user's workout stats from tracking events"""
    
    # Count completed workouts
    workouts_completed = await db.user_events.count_documents({
        "user_id": current_user_id,
        "event_type": "workout_completed"
    })
    
    # Calculate total minutes (estimate based on workouts - average 20 mins per workout)
    total_minutes = workouts_completed * 20
    
    # Calculate accurate streak using helper function
    current_streak = await calculate_user_streak(current_user_id)
    
    # Get stored streak and update if different
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if user:
        stored_streak = user.get("current_streak", 0)
        if current_streak != stored_streak:
            await db.users.update_one(
                {"_id": ObjectId(current_user_id)},
                {"$set": {"current_streak": current_streak}}
            )
    
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
    """Upload profile picture to Cloudinary cloud storage"""
    try:
        logger.info(f"📸 Avatar upload START (Cloudinary)")
        logger.info(f"Filename: {file.filename}")
        logger.info(f"Content-Type: {file.content_type}")
        
        # Validate file type
        allowed_types = {'image/jpeg', 'image/jpg', 'image/png', 'image/gif'}
        content_type = file.content_type or ''
        
        if content_type not in allowed_types:
            # Try to determine from filename extension
            if file.filename:
                ext = Path(file.filename).suffix.lower()
                ext_to_type = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif'}
                content_type = ext_to_type.get(ext, content_type)
        
        if content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Only JPEG, PNG, and GIF images are allowed")
        
        # Read file content
        file_content = await file.read()
        
        # Upload to Cloudinary with avatar-specific transformations
        public_id = f"mood_app/avatars/{current_user_id}"
        
        result = cloudinary.uploader.upload(
            file_content,
            public_id=public_id,
            resource_type="image",
            folder="mood_app/avatars",
            overwrite=True,
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                {"quality": "auto", "fetch_format": "auto"}
            ]
        )
        
        # Get the secure URL (permanent, non-expiring)
        secure_url = result.get("secure_url")
        
        # Update user's avatar URL in database
        await db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"avatar": secure_url}}
        )
        
        logger.info(f"✅ Profile picture uploaded to Cloudinary: {secure_url}")
        return {
            "message": "Profile picture uploaded successfully",
            "url": secure_url
        }
    
    except cloudinary.exceptions.Error as e:
        logger.error(f"Cloudinary avatar upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cloud upload failed: {str(e)}")
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
    """Upload profile picture using base64 encoded image to Cloudinary"""
    try:
        logger.info(f"📸 Avatar upload (base64) START for user {current_user_id}")
        
        # Parse base64 data
        image_data = data.image_data
        
        # Upload to Cloudinary (it handles base64 data URLs directly)
        public_id = f"mood_app/avatars/{current_user_id}"
        
        result = cloudinary.uploader.upload(
            image_data,
            public_id=public_id,
            resource_type="image",
            folder="mood_app/avatars",
            overwrite=True,
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                {"quality": "auto", "fetch_format": "auto"}
            ]
        )
        
        # Get the secure URL (permanent, non-expiring)
        secure_url = result.get("secure_url")
        
        # Update user's avatar URL in database
        await db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"avatar": secure_url}}
        )
        
        logger.info(f"✅ Profile picture uploaded to Cloudinary (base64): {secure_url}")
        return {
            "message": "Profile picture uploaded successfully",
            "url": secure_url
        }
    
    except cloudinary.exceptions.Error as e:
        logger.error(f"Cloudinary avatar upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cloud upload failed: {str(e)}")
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
async def get_user_followers(
    user_id: str, 
    limit: int = 50, 
    skip: int = 0,
    current_user_id: Optional[str] = Depends(get_optional_current_user)
):
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
            follower_id = str(follower["_id"])
            
            # Check if current user is following this follower
            is_following = False
            is_self = False
            if current_user_id:
                is_self = follower_id == current_user_id
                if not is_self:
                    follow_check = await db.follows.find_one({
                        "follower_id": ObjectId(current_user_id),
                        "following_id": follower["_id"]
                    })
                    is_following = follow_check is not None
            
            result.append({
                "id": follower_id,
                "username": follower["username"],
                "name": follower.get("name", ""),
                "bio": follower.get("bio", ""),
                "avatar": follower.get("avatar", ""),
                "followers_count": follower.get("followers_count", 0),
                "following_count": follower.get("following_count", 0),
                "is_following": is_following,
                "is_self": is_self
            })
        
        return {"users": result}
    except:
        raise HTTPException(status_code=404, detail="User not found")

@api_router.get("/users/{user_id}/following")
async def get_user_following(
    user_id: str, 
    limit: int = 50, 
    skip: int = 0,
    current_user_id: Optional[str] = Depends(get_optional_current_user)
):
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
            following_id = str(following["_id"])
            
            # Check if current user is following this user
            is_following = False
            is_self = False
            if current_user_id:
                is_self = following_id == current_user_id
                if not is_self:
                    follow_check = await db.follows.find_one({
                        "follower_id": ObjectId(current_user_id),
                        "following_id": following["_id"]
                    })
                    is_following = follow_check is not None
            
            result.append({
                "id": following_id,
                "username": following["username"],
                "name": following.get("name", ""),
                "bio": following.get("bio", ""),
                "avatar": following.get("avatar", ""),
                "followers_count": following.get("followers_count", 0),
                "following_count": following.get("following_count", 0),
                "is_following": is_following,
                "is_self": is_self
            })
        
        return {"users": result}
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
        # Handle both MongoDB ObjectId and custom user_id formats
        user_object_id = None
        
        # First, try to use it as ObjectId directly
        try:
            user_object_id = ObjectId(user_id)
            # Verify this user exists
            user = await db.users.find_one({"_id": user_object_id})
            if not user:
                user_object_id = None
        except:
            user_object_id = None
        
        # If not a valid ObjectId, try to find user by custom user_id
        if not user_object_id:
            user = await db.users.find_one({"user_id": user_id})
            if user:
                user_object_id = user["_id"]
            else:
                # Return empty list if user not found
                return []
        
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

# File Upload Endpoints - Using Cloudinary for persistent cloud storage

UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Helper function to generate video thumbnail URL from Cloudinary
def get_cloudinary_video_thumbnail(public_id: str, timestamp: float = 2.0) -> str:
    """Generate a thumbnail URL for a video at a specific timestamp"""
    return f"https://res.cloudinary.com/{os.environ.get('CLOUDINARY_CLOUD_NAME')}/video/upload/so_{timestamp},w_400,h_400,c_fill/{public_id}.jpg"

@api_router.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    """Serve uploaded media files - Legacy endpoint for old local files"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)

@api_router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user)
):
    """Upload a single media file (image or video) to Cloudinary cloud storage"""
    try:
        # Validate file type - handle missing/empty filename
        allowed_image_types = {'image/jpeg', 'image/jpg', 'image/png', 'image/gif'}
        allowed_video_types = {'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'}
        allowed_types = allowed_image_types | allowed_video_types
        
        content_type = file.content_type or ''
        
        if content_type not in allowed_types:
            # Try to determine from filename extension
            if file.filename:
                ext = Path(file.filename).suffix.lower()
                ext_to_type = {
                    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
                    '.png': 'image/png', '.gif': 'image/gif',
                    '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.avi': 'video/avi'
                }
                content_type = ext_to_type.get(ext, content_type)
        
        if content_type not in allowed_types:
            raise HTTPException(status_code=400, detail=f"File type {content_type} not allowed")
        
        is_video = content_type in allowed_video_types
        
        # Read file content
        file_content = await file.read()
        
        # Determine resource type for Cloudinary
        resource_type = "video" if is_video else "image"
        
        # Upload to Cloudinary
        logger.info(f"📤 Uploading {resource_type} to Cloudinary...")
        
        # Create a unique public_id
        public_id = f"mood_app/{resource_type}s/{current_user_id}/{uuid.uuid4()}"
        
        # Upload options
        upload_options = {
            "public_id": public_id,
            "resource_type": resource_type,
            "folder": f"mood_app/{resource_type}s",
            "overwrite": True,
            "unique_filename": True,
        }
        
        # For videos, generate thumbnail eagerly
        if is_video:
            upload_options["eager"] = [
                {"format": "jpg", "transformation": [{"start_offset": "2", "width": 400, "height": 400, "crop": "fill"}]}
            ]
            upload_options["eager_async"] = False
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file_content,
            **upload_options
        )
        
        # Get the secure URL (permanent, non-expiring)
        secure_url = result.get("secure_url")
        
        # For videos, generate thumbnail URL
        thumbnail_url = None
        if is_video:
            if result.get("eager") and len(result["eager"]) > 0:
                thumbnail_url = result["eager"][0].get("secure_url")
            else:
                # Generate thumbnail URL manually
                thumbnail_url = get_cloudinary_video_thumbnail(result["public_id"])
        
        logger.info(f"✅ Cloudinary upload successful: {secure_url}")
        
        response_data = {
            "message": "File uploaded successfully to cloud storage",
            "url": secure_url,
            "public_id": result.get("public_id"),
            "resource_type": resource_type,
            "format": result.get("format"),
            "width": result.get("width"),
            "height": result.get("height"),
        }
        
        if is_video:
            response_data["duration"] = result.get("duration")
            response_data["thumbnail_url"] = thumbnail_url
        
        return response_data
    
    except cloudinary.exceptions.Error as e:
        logger.error(f"Cloudinary upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cloud upload failed: {str(e)}")
    except Exception as e:
        logger.error(f"File upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/upload/multiple")
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    current_user_id: str = Depends(get_current_user)
):
    """Upload multiple media files (up to 5) to Cloudinary cloud storage"""
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 files allowed")
    
    uploaded_results = []
    cover_urls = []  # Thumbnails for videos
    
    allowed_image_types = {'image/jpeg', 'image/jpg', 'image/png', 'image/gif'}
    allowed_video_types = {'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'}
    allowed_types = allowed_image_types | allowed_video_types
    
    for file in files:
        try:
            content_type = file.content_type or ''
            
            # Try to determine from filename extension if content_type not recognized
            if content_type not in allowed_types and file.filename:
                ext = Path(file.filename).suffix.lower()
                ext_to_type = {
                    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
                    '.png': 'image/png', '.gif': 'image/gif',
                    '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.avi': 'video/avi'
                }
                content_type = ext_to_type.get(ext, content_type)
            
            if content_type not in allowed_types:
                logger.warning(f"Skipping file with unsupported type: {content_type}")
                continue
            
            is_video = content_type in allowed_video_types
            resource_type = "video" if is_video else "image"
            
            # Read file content
            file_content = await file.read()
            
            # Create unique public_id
            public_id = f"mood_app/{resource_type}s/{current_user_id}/{uuid.uuid4()}"
            
            # Upload options
            upload_options = {
                "public_id": public_id,
                "resource_type": resource_type,
                "folder": f"mood_app/{resource_type}s",
                "overwrite": True,
                "unique_filename": True,
            }
            
            # For videos, generate thumbnail eagerly
            if is_video:
                upload_options["eager"] = [
                    {"format": "jpg", "transformation": [{"start_offset": "2", "width": 400, "height": 400, "crop": "fill"}]}
                ]
                upload_options["eager_async"] = False
            
            # Upload to Cloudinary
            logger.info(f"📤 Uploading {resource_type} to Cloudinary: {file.filename}")
            result = cloudinary.uploader.upload(file_content, **upload_options)
            
            secure_url = result.get("secure_url")
            uploaded_results.append(secure_url)
            
            # For videos, add thumbnail to cover_urls
            if is_video:
                if result.get("eager") and len(result["eager"]) > 0:
                    cover_urls.append(result["eager"][0].get("secure_url"))
                else:
                    cover_urls.append(get_cloudinary_video_thumbnail(result["public_id"]))
            else:
                # For images, use the image itself as cover
                cover_urls.append(secure_url)
            
            logger.info(f"✅ Uploaded: {secure_url}")
        
        except Exception as e:
            logger.error(f"File upload error for {file.filename}: {str(e)}")
            continue
    
    return {
        "message": f"{len(uploaded_results)} files uploaded successfully to cloud storage",
        "urls": uploaded_results,
        "cover_urls": cover_urls
    }

# Social Features - Posts

@api_router.post("/posts")
async def create_post(post_data: PostCreate, current_user_id: str = Depends(get_current_user)):
    """Create a new social media post with content filtering"""
    
    # Check content for objectionable material (pre-submission filtering)
    content_check = check_content(
        post_data.caption, 
        strict=True, 
        user_id=current_user_id, 
        content_type="post"
    )
    if not content_check["is_clean"]:
        # Log rejected attempt to database for moderation review
        await db.moderation_logs.insert_one({
            "user_id": current_user_id,
            "content_type": "post",
            "action": "rejected",
            "reason": "content_filter",
            "category": content_check.get("category"),
            "flagged_words": content_check.get("flagged_words", []),
            "flagged_phrases": content_check.get("flagged_phrases", []),
            "text_preview": post_data.caption[:200] if post_data.caption else "",
            "created_at": datetime.now(timezone.utc)
        })
        raise HTTPException(
            status_code=400, 
            detail="This content violates our community guidelines."
        )
    
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

@api_router.get("/posts/public")
async def get_public_posts(limit: int = 20, skip: int = 0):
    """Get public feed posts without authentication (for guest users)"""
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
        {"$unwind": "$author"}
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
        
        result.append(PostResponse(
            id=str(post["_id"]),
            author=author_data,
            workout=None,  # Skip workout details for public feed
            caption=post["caption"],
            media_urls=post.get("media_urls", []),
            hashtags=post.get("hashtags", []),
            cover_urls=post.get("cover_urls"),
            likes_count=post.get("likes_count", 0),
            comments_count=post.get("comments_count", 0),
            is_liked=False,  # Guests can't like
            is_saved=False,  # Guests can't save
            created_at=post["created_at"]
        ))
    
    return result

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
                "let": {"post_id": "$_id", "user_id_str": current_user_id},
                "pipeline": [
                    {"$match": {"$expr": {"$and": [
                        {"$eq": ["$post_id", "$$post_id"]},
                        {"$eq": [{"$toString": "$user_id"}, "$$user_id_str"]}
                    ]}}}
                ],
                "as": "user_like"
            }
        },
        {
            "$lookup": {
                "from": "saved_posts",
                "let": {"post_id": "$_id", "user_id_str": current_user_id},
                "pipeline": [
                    {"$match": {"$expr": {"$and": [
                        {"$eq": ["$post_id", "$$post_id"]},
                        {"$eq": [{"$toString": "$user_id"}, "$$user_id_str"]}
                    ]}}}
                ],
                "as": "user_saved"
            }
        },
        {
            "$lookup": {
                "from": "comments",
                "let": {"post_id": {"$toString": "$_id"}},
                "pipeline": [
                    {"$match": {"$expr": {"$eq": ["$post_id", "$$post_id"]}}},
                    {"$sort": {"created_at": 1}},
                    {"$limit": 1},
                    {
                        "$lookup": {
                            "from": "users",
                            "let": {"author_id": {"$toObjectId": "$author_id"}},
                            "pipeline": [
                                {"$match": {"$expr": {"$eq": ["$_id", "$$author_id"]}}}
                            ],
                            "as": "comment_author"
                        }
                    },
                    {"$unwind": {"path": "$comment_author", "preserveNullAndEmptyArrays": True}}
                ],
                "as": "first_comment"
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
        
        # Get first comment data
        first_comment_data = None
        if post.get("first_comment") and len(post["first_comment"]) > 0:
            fc = post["first_comment"][0]
            comment_author = fc.get("comment_author", {})
            first_comment_data = {
                "id": str(fc.get("_id", "")),
                "text": fc.get("text", ""),
                "author": {
                    "id": str(comment_author.get("_id", "")),
                    "username": comment_author.get("username", ""),
                    "avatar": comment_author.get("avatar")
                },
                "created_at": fc.get("created_at").isoformat() if fc.get("created_at") else None
            }
        
        post_data = {
            "id": str(post["_id"]),
            "author": author_data.dict(),
            "workout": workout_data.dict() if workout_data else None,
            "caption": post["caption"],
            "media_urls": post.get("media_urls", []),
            "hashtags": post.get("hashtags", []),
            "cover_urls": post.get("cover_urls"),
            "likes_count": post.get("likes_count", 0),
            "comments_count": post.get("comments_count", 0),
            "is_liked": len(post.get("user_like", [])) > 0,
            "is_saved": len(post.get("user_saved", [])) > 0,
            "created_at": post["created_at"].isoformat() if hasattr(post["created_at"], 'isoformat') else post["created_at"],
            "first_comment": first_comment_data
        }
        result.append(post_data)
    
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
    """Create a comment on a post with content filtering"""
    try:
        # Check content for objectionable material (pre-submission filtering)
        content_check = check_content(
            comment_data.text, 
            strict=True,
            user_id=current_user_id,
            content_type="comment"
        )
        if not content_check["is_clean"]:
            # Log rejected attempt to database for moderation review
            await db.moderation_logs.insert_one({
                "user_id": current_user_id,
                "content_type": "comment",
                "action": "rejected",
                "reason": "content_filter",
                "category": content_check.get("category"),
                "flagged_words": content_check.get("flagged_words", []),
                "flagged_phrases": content_check.get("flagged_phrases", []),
                "text_preview": comment_data.text[:200] if comment_data.text else "",
                "post_id": comment_data.post_id,
                "created_at": datetime.now(timezone.utc)
            })
            raise HTTPException(
                status_code=400, 
                detail="This content violates our community guidelines."
            )
        
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
    except HTTPException:
        raise
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

# ============================================
# USER NOTIFICATIONS ENDPOINTS
# ============================================

def get_post_preview_url(post: dict) -> Optional[str]:
    """Get the best preview URL for a post - prefer images over videos, use thumbnail for videos"""
    if not post:
        return None
    
    # Check for thumbnail_url first (usually set for video posts)
    thumbnail = post.get("thumbnail_url")
    if thumbnail:
        return thumbnail
    
    media_urls = post.get("media_urls", [])
    if not media_urls:
        return None
    
    # Look for first image URL
    video_extensions = ['.mov', '.mp4', '.avi', '.webm', '.mkv', '.m4v']
    
    for url in media_urls:
        url_lower = url.lower()
        is_video = any(ext in url_lower for ext in video_extensions)
        
        if not is_video:
            # This is likely an image, use it
            return url
        elif 'cloudinary' in url_lower:
            # For Cloudinary videos, generate a thumbnail URL
            # Transform video URL to get first frame as image
            # Example: .../video/upload/... -> .../video/upload/so_0/...
            if '/video/upload/' in url:
                return url.replace('/video/upload/', '/video/upload/so_0,f_jpg/')
    
    # No image found, return first URL (might be video - frontend will handle)
    return media_urls[0] if media_urls else None

@api_router.get("/notifications")
async def get_user_notifications(
    limit: int = 50,
    skip: int = 0,
    current_user_id: str = Depends(get_current_user)
):
    """Get user notifications for likes, comments, and follows"""
    notifications = []
    
    # Get user's post IDs as ObjectIds
    user_posts = await db.posts.find(
        {"author_id": ObjectId(current_user_id)}
    ).to_list(1000)
    user_post_ids = [post["_id"] for post in user_posts]  # Keep as ObjectId
    
    # Get likes on user's posts (all time, limited by count)
    likes_pipeline = [
        {
            "$match": {
                "post_id": {"$in": user_post_ids},
                "user_id": {"$ne": ObjectId(current_user_id)}
            }
        },
        {"$sort": {"created_at": -1}},
        {"$limit": 100},
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {"$unwind": "$user"},
        {
            "$lookup": {
                "from": "posts",
                "localField": "post_id",
                "foreignField": "_id",
                "as": "post"
            }
        },
        {"$unwind": "$post"}
    ]
    
    likes = await db.post_likes.aggregate(likes_pipeline).to_list(100)
    
    for like in likes:
        notifications.append({
            "id": str(like["_id"]),
            "type": "like",
            "user": {
                "id": str(like["user"]["_id"]),
                "username": like["user"]["username"],
                "name": like["user"].get("name", ""),
                "avatar": like["user"].get("avatar")
            },
            "post_id": str(like["post_id"]),
            "post_preview": get_post_preview_url(like.get("post")),
            "created_at": like["created_at"].isoformat(),
            "message": "liked your post"
        })
    
    # Get comments on user's posts (all time)
    user_post_ids_str = [str(pid) for pid in user_post_ids]  # Comments use string post_id
    comments_pipeline = [
        {
            "$match": {
                "post_id": {"$in": user_post_ids_str},
                "author_id": {"$ne": current_user_id}
            }
        },
        {"$sort": {"created_at": -1}},
        {"$limit": 100},
        {
            "$lookup": {
                "from": "users",
                "let": {"author_id": {"$toObjectId": "$author_id"}},
                "pipeline": [
                    {"$match": {"$expr": {"$eq": ["$_id", "$$author_id"]}}}
                ],
                "as": "user"
            }
        },
        {"$unwind": "$user"},
        {
            "$lookup": {
                "from": "posts",
                "let": {"post_id": {"$toObjectId": "$post_id"}},
                "pipeline": [
                    {"$match": {"$expr": {"$eq": ["$_id", "$$post_id"]}}}
                ],
                "as": "post"
            }
        },
        {"$unwind": "$post"}
    ]
    
    comments = await db.comments.aggregate(comments_pipeline).to_list(100)
    
    for comment in comments:
        notifications.append({
            "id": str(comment["_id"]),
            "type": "comment",
            "user": {
                "id": str(comment["user"]["_id"]),
                "username": comment["user"]["username"],
                "name": comment["user"].get("name", ""),
                "avatar": comment["user"].get("avatar")
            },
            "post_id": comment["post_id"],
            "post_preview": get_post_preview_url(comment.get("post")),
            "comment_text": comment.get("text", "")[:50],
            "created_at": comment["created_at"].isoformat(),
            "message": f"commented: \"{comment.get('text', '')[:30]}{'...' if len(comment.get('text', '')) > 30 else ''}\""
        })
    
    # Get followers (all time)
    followers_pipeline = [
        {
            "$match": {
                "following_id": ObjectId(current_user_id)
            }
        },
        {"$sort": {"created_at": -1}},
        {"$limit": 100},
        {
            "$lookup": {
                "from": "users",
                "let": {"follower_id": "$follower_id"},
                "pipeline": [
                    {"$match": {"$expr": {"$eq": ["$_id", "$$follower_id"]}}}
                ],
                "as": "user"
            }
        },
        {"$unwind": "$user"}
    ]
    
    followers = await db.follows.aggregate(followers_pipeline).to_list(100)
    
    for follow in followers:
        notifications.append({
            "id": str(follow["_id"]),
            "type": "follow",
            "user": {
                "id": str(follow["user"]["_id"]),
                "username": follow["user"]["username"],
                "name": follow["user"].get("name", ""),
                "avatar": follow["user"].get("avatar")
            },
            "created_at": follow["created_at"].isoformat(),
            "message": "started following you"
        })
    
    # Sort all notifications by date
    notifications.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Apply pagination
    paginated = notifications[skip:skip + limit]
    
    return {
        "notifications": paginated,
        "total": len(notifications),
        "has_more": len(notifications) > skip + limit
    }

@api_router.get("/notifications/unread-count")
async def get_unread_notifications_count(
    current_user_id: str = Depends(get_current_user)
):
    """Get count of unread notifications (activities in last 24 hours)"""
    twenty_four_hours_ago = datetime.now(timezone.utc) - timedelta(hours=24)
    
    # Get user's post IDs as ObjectIds
    user_posts = await db.posts.find(
        {"author_id": ObjectId(current_user_id)}
    ).to_list(1000)
    user_post_ids = [post["_id"] for post in user_posts]  # Keep as ObjectId
    user_post_ids_str = [str(post["_id"]) for post in user_posts]  # String version for comments
    
    # Count likes in last 24 hours (post_likes uses ObjectId for post_id)
    likes_count = await db.post_likes.count_documents({
        "post_id": {"$in": user_post_ids},
        "user_id": {"$ne": ObjectId(current_user_id)},
        "created_at": {"$gte": twenty_four_hours_ago}
    })
    
    # Count comments in last 24 hours (comments uses string for post_id)
    comments_count = await db.comments.count_documents({
        "post_id": {"$in": user_post_ids_str},
        "author_id": {"$ne": current_user_id},
        "created_at": {"$gte": twenty_four_hours_ago}
    })
    
    # Count new followers in last 24 hours
    follows_count = await db.follows.count_documents({
        "following_id": ObjectId(current_user_id),
        "created_at": {"$gte": twenty_four_hours_ago}
    })
    
    total = likes_count + comments_count + follows_count
    
    return {"unread_count": total}

# ============================================
# CONTENT MODERATION ENDPOINTS
# ============================================

@api_router.get("/moderation/report-categories")
async def get_available_report_categories():
    """Get list of available report categories"""
    return {
        "categories": [
            {"id": "spam", "label": "Spam"},
            {"id": "harassment_bullying", "label": "Harassment/Bullying"},
            {"id": "hate_speech", "label": "Hate Speech"},
            {"id": "nudity_sexual_content", "label": "Nudity/Sexual Content"},
            {"id": "violence", "label": "Violence"},
            {"id": "misinformation", "label": "Misinformation"},
            {"id": "other", "label": "Other"},
        ]
    }

@api_router.post("/moderation/report")
async def report_content(
    report_data: ContentReportCreate,
    current_user_id: str = Depends(get_current_user)
):
    """Report objectionable content (post, comment, or profile)"""
    
    # Validate content type
    if report_data.content_type not in ["post", "comment", "profile"]:
        raise HTTPException(status_code=400, detail="Invalid content type. Must be 'post', 'comment', or 'profile'")
    
    # Validate category
    if not is_valid_report_category(report_data.category):
        raise HTTPException(status_code=400, detail=f"Invalid category. Must be one of: {REPORT_CATEGORIES}")
    
    # Verify content exists
    if report_data.content_type == "post":
        content = await db.posts.find_one({"_id": ObjectId(report_data.content_id)})
        if not content:
            raise HTTPException(status_code=404, detail="Post not found")
        content_author_id = content.get("author_id") or content.get("user_id")
    elif report_data.content_type == "comment":
        content = await db.comments.find_one({"_id": ObjectId(report_data.content_id)})
        if not content:
            raise HTTPException(status_code=404, detail="Comment not found")
        content_author_id = content.get("user_id")
    else:  # profile
        content = await db.users.find_one({"_id": ObjectId(report_data.content_id)})
        if not content:
            raise HTTPException(status_code=404, detail="User not found")
        content_author_id = report_data.content_id
    
    # Check if user already reported this content
    existing_report = await db.content_reports.find_one({
        "reporter_id": current_user_id,
        "content_type": report_data.content_type,
        "content_id": report_data.content_id
    })
    
    if existing_report:
        raise HTTPException(status_code=400, detail="You have already reported this content")
    
    # Create report
    report = {
        "reporter_id": current_user_id,
        "content_type": report_data.content_type,
        "content_id": report_data.content_id,
        "content_author_id": content_author_id,
        "category": report_data.category,
        "reason": report_data.reason,
        "status": REPORT_STATUS["pending"],
        "created_at": datetime.now(timezone.utc),
        "reviewed_at": None,
        "reviewed_by": None,
        "action_taken": None
    }
    
    result = await db.content_reports.insert_one(report)
    
    logger.info(f"Content report created: {report_data.content_type} {report_data.content_id} by user {current_user_id}")
    
    return {
        "success": True,
        "report_id": str(result.inserted_id),
        "message": "Report submitted successfully. Our team will review it within 24 hours."
    }

@api_router.post("/moderation/block")
async def block_user(
    block_data: BlockUserCreate,
    current_user_id: str = Depends(get_current_user)
):
    """Block a user - mutual blocking, notifies admin"""
    
    blocked_user_id = block_data.blocked_user_id
    
    # Can't block yourself
    if blocked_user_id == current_user_id:
        raise HTTPException(status_code=400, detail="You cannot block yourself")
    
    # Verify blocked user exists
    blocked_user = await db.users.find_one({"_id": ObjectId(blocked_user_id)})
    if not blocked_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already blocked
    existing_block = await db.user_blocks.find_one({
        "blocker_id": current_user_id,
        "blocked_id": blocked_user_id
    })
    
    if existing_block:
        raise HTTPException(status_code=400, detail="User is already blocked")
    
    # Create block record
    block = {
        "blocker_id": current_user_id,
        "blocked_id": blocked_user_id,
        "reason": block_data.reason,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.user_blocks.insert_one(block)
    
    # Also create an admin notification/report for the block
    admin_notification = {
        "type": "user_blocked",
        "blocker_id": current_user_id,
        "blocked_id": blocked_user_id,
        "reason": block_data.reason,
        "status": "pending_review",
        "created_at": datetime.now(timezone.utc),
        "reviewed_at": None
    }
    await db.admin_notifications.insert_one(admin_notification)
    
    # Remove any follow relationships
    await db.follows.delete_many({
        "$or": [
            {"follower_id": current_user_id, "following_id": blocked_user_id},
            {"follower_id": blocked_user_id, "following_id": current_user_id}
        ]
    })
    
    # Update follower/following counts for both users
    current_user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if current_user:
        following_count = await db.follows.count_documents({"follower_id": current_user_id})
        followers_count = await db.follows.count_documents({"following_id": current_user_id})
        await db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"following_count": following_count, "followers_count": followers_count}}
        )
    
    blocked_following_count = await db.follows.count_documents({"follower_id": blocked_user_id})
    blocked_followers_count = await db.follows.count_documents({"following_id": blocked_user_id})
    await db.users.update_one(
        {"_id": ObjectId(blocked_user_id)},
        {"$set": {"following_count": blocked_following_count, "followers_count": blocked_followers_count}}
    )
    
    logger.info(f"User {current_user_id} blocked user {blocked_user_id}")
    
    return {
        "success": True,
        "message": "User blocked successfully. They will no longer appear in your feed."
    }

@api_router.delete("/moderation/block/{blocked_user_id}")
async def unblock_user(
    blocked_user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Unblock a previously blocked user"""
    
    result = await db.user_blocks.delete_one({
        "blocker_id": current_user_id,
        "blocked_id": blocked_user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Block not found")
    
    logger.info(f"User {current_user_id} unblocked user {blocked_user_id}")
    
    return {
        "success": True,
        "message": "User unblocked successfully"
    }

@api_router.get("/moderation/blocked-users")
async def get_blocked_users(
    current_user_id: str = Depends(get_current_user)
):
    """Get list of users blocked by current user"""
    
    blocks = await db.user_blocks.find({
        "blocker_id": current_user_id
    }).sort("created_at", -1).to_list(100)
    
    blocked_users = []
    for block in blocks:
        user = await db.users.find_one({"_id": ObjectId(block["blocked_id"])})
        if user:
            blocked_users.append({
                "id": str(block["_id"]),
                "blocked_user_id": block["blocked_id"],
                "blocked_username": user.get("username", "Unknown"),
                "blocked_name": user.get("name", ""),
                "blocked_avatar": user.get("avatar"),
                "blocked_at": block["created_at"].isoformat()
            })
    
    return {"blocked_users": blocked_users}

@api_router.get("/moderation/is-blocked/{user_id}")
async def check_if_blocked(
    user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Check if a user is blocked (mutual check)"""
    
    # Check if current user blocked them OR they blocked current user
    block = await db.user_blocks.find_one({
        "$or": [
            {"blocker_id": current_user_id, "blocked_id": user_id},
            {"blocker_id": user_id, "blocked_id": current_user_id}
        ]
    })
    
    return {
        "is_blocked": block is not None,
        "blocked_by_me": block is not None and block.get("blocker_id") == current_user_id,
        "blocked_by_them": block is not None and block.get("blocker_id") == user_id
    }

# Helper function to get blocked user IDs for feed filtering
async def get_blocked_user_ids(user_id: str) -> set:
    """Get all user IDs that should be filtered from a user's feed (mutual blocks)"""
    blocks = await db.user_blocks.find({
        "$or": [
            {"blocker_id": user_id},
            {"blocked_id": user_id}
        ]
    }).to_list(1000)
    
    blocked_ids = set()
    for block in blocks:
        if block["blocker_id"] == user_id:
            blocked_ids.add(block["blocked_id"])
        else:
            blocked_ids.add(block["blocker_id"])
    
    return blocked_ids

# ============================================
# ADMIN MODERATION ENDPOINTS
# ============================================

@api_router.get("/moderation/admin/reports")
async def get_pending_reports(
    status: str = "pending",
    limit: int = 50,
    current_user_id: str = Depends(get_current_user)
):
    """Get content reports for admin review"""
    
    # Check if user is admin
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user or not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    query = {}
    if status != "all":
        query["status"] = status
    
    reports = await db.content_reports.find(query).sort("created_at", -1).limit(limit).to_list(limit)
    
    result = []
    for report in reports:
        # Get reporter info
        reporter = await db.users.find_one({"_id": ObjectId(report["reporter_id"])})
        
        # Get content info
        content_preview = None
        content_author = None
        
        if report["content_type"] == "post":
            post = await db.posts.find_one({"_id": ObjectId(report["content_id"])})
            if post:
                content_preview = post.get("caption", "")[:100]
                author_id = post.get("author_id") or post.get("user_id")
                if author_id:
                    author = await db.users.find_one({"_id": ObjectId(author_id)})
                    content_author = author.get("username") if author else "Unknown"
        elif report["content_type"] == "comment":
            comment = await db.comments.find_one({"_id": ObjectId(report["content_id"])})
            if comment:
                content_preview = comment.get("text", "")[:100]
                if comment.get("user_id"):
                    author = await db.users.find_one({"_id": ObjectId(comment["user_id"])})
                    content_author = author.get("username") if author else "Unknown"
        elif report["content_type"] == "profile":
            profile = await db.users.find_one({"_id": ObjectId(report["content_id"])})
            if profile:
                content_preview = f"Profile: {profile.get('username', 'Unknown')}"
                content_author = profile.get("username")
        
        # Calculate time since report
        time_since = datetime.now(timezone.utc) - report["created_at"].replace(tzinfo=timezone.utc)
        hours_pending = time_since.total_seconds() / 3600
        is_urgent = hours_pending > 20  # Flag if approaching 24 hour deadline
        
        result.append({
            "id": str(report["_id"]),
            "reporter_username": reporter.get("username") if reporter else "Unknown",
            "content_type": report["content_type"],
            "content_id": report["content_id"],
            "content_preview": content_preview,
            "content_author": content_author,
            "content_author_id": report.get("content_author_id"),
            "category": report["category"],
            "reason": report.get("reason"),
            "status": report["status"],
            "created_at": report["created_at"].isoformat(),
            "hours_pending": round(hours_pending, 1),
            "is_urgent": is_urgent,
            "reviewed_at": report.get("reviewed_at").isoformat() if report.get("reviewed_at") else None,
            "action_taken": report.get("action_taken")
        })
    
    # Get counts
    pending_count = await db.content_reports.count_documents({"status": "pending"})
    urgent_count = await db.content_reports.count_documents({
        "status": "pending",
        "created_at": {"$lt": datetime.now(timezone.utc) - timedelta(hours=20)}
    })
    
    return {
        "reports": result,
        "pending_count": pending_count,
        "urgent_count": urgent_count
    }

@api_router.get("/moderation/admin/blocks")
async def get_block_notifications(
    status: str = "pending_review",
    limit: int = 50,
    current_user_id: str = Depends(get_current_user)
):
    """Get user block notifications for admin review"""
    
    # Check if user is admin
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user or not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    query = {"type": "user_blocked"}
    if status != "all":
        query["status"] = status
    
    notifications = await db.admin_notifications.find(query).sort("created_at", -1).limit(limit).to_list(limit)
    
    result = []
    for notif in notifications:
        blocker = await db.users.find_one({"_id": ObjectId(notif["blocker_id"])})
        blocked = await db.users.find_one({"_id": ObjectId(notif["blocked_id"])})
        
        result.append({
            "id": str(notif["_id"]),
            "blocker_username": blocker.get("username") if blocker else "Unknown",
            "blocker_id": notif["blocker_id"],
            "blocked_username": blocked.get("username") if blocked else "Unknown",
            "blocked_id": notif["blocked_id"],
            "reason": notif.get("reason"),
            "status": notif["status"],
            "created_at": notif["created_at"].isoformat(),
            "reviewed_at": notif.get("reviewed_at").isoformat() if notif.get("reviewed_at") else None
        })
    
    return {"notifications": result}

@api_router.post("/moderation/admin/reports/{report_id}/action")
async def take_action_on_report(
    report_id: str,
    action_data: dict,
    current_user_id: str = Depends(get_current_user)
):
    """Take action on a content report (remove content, ban user, or dismiss)"""
    
    # Check if user is admin
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user or not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    action = action_data.get("action")  # "remove_content", "ban_user", "dismiss"
    
    if action not in ["remove_content", "ban_user", "dismiss", "remove_and_ban"]:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    report = await db.content_reports.find_one({"_id": ObjectId(report_id)})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    action_taken = []
    
    if action in ["remove_content", "remove_and_ban"]:
        # Remove the content
        if report["content_type"] == "post":
            await db.posts.delete_one({"_id": ObjectId(report["content_id"])})
            # Also delete comments on this post
            await db.comments.delete_many({"post_id": report["content_id"]})
            # Delete likes
            await db.likes.delete_many({"post_id": report["content_id"]})
            action_taken.append("content_removed")
        elif report["content_type"] == "comment":
            await db.comments.delete_one({"_id": ObjectId(report["content_id"])})
            action_taken.append("content_removed")
    
    if action in ["ban_user", "remove_and_ban"]:
        # Ban the content author
        content_author_id = report.get("content_author_id")
        if content_author_id:
            await db.users.update_one(
                {"_id": ObjectId(content_author_id)},
                {
                    "$set": {
                        "is_banned": True,
                        "banned_at": datetime.now(timezone.utc),
                        "banned_by": current_user_id,
                        "ban_reason": f"Content violation: {report['category']}"
                    }
                }
            )
            action_taken.append("user_banned")
    
    if action == "dismiss":
        action_taken.append("dismissed")
    
    # Update report status
    new_status = "action_taken" if action != "dismiss" else "dismissed"
    await db.content_reports.update_one(
        {"_id": ObjectId(report_id)},
        {
            "$set": {
                "status": new_status,
                "reviewed_at": datetime.now(timezone.utc),
                "reviewed_by": current_user_id,
                "action_taken": ", ".join(action_taken)
            }
        }
    )
    
    logger.info(f"Admin {current_user_id} took action '{action}' on report {report_id}")
    
    return {
        "success": True,
        "action_taken": action_taken,
        "message": f"Action completed: {', '.join(action_taken)}"
    }

@api_router.get("/moderation/admin/stats")
async def get_moderation_stats(
    current_user_id: str = Depends(get_current_user)
):
    """Get moderation statistics for admin dashboard"""
    
    # Check if user is admin
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user or not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    now = datetime.now(timezone.utc)
    last_24h = now - timedelta(hours=24)
    last_7d = now - timedelta(days=7)
    
    # Report stats
    pending_reports = await db.content_reports.count_documents({"status": "pending"})
    urgent_reports = await db.content_reports.count_documents({
        "status": "pending",
        "created_at": {"$lt": now - timedelta(hours=20)}
    })
    reports_24h = await db.content_reports.count_documents({"created_at": {"$gte": last_24h}})
    reports_7d = await db.content_reports.count_documents({"created_at": {"$gte": last_7d}})
    resolved_24h = await db.content_reports.count_documents({
        "reviewed_at": {"$gte": last_24h},
        "status": {"$in": ["action_taken", "dismissed"]}
    })
    
    # Block stats
    blocks_24h = await db.user_blocks.count_documents({"created_at": {"$gte": last_24h}})
    blocks_7d = await db.user_blocks.count_documents({"created_at": {"$gte": last_7d}})
    total_blocks = await db.user_blocks.count_documents({})
    
    # Banned users
    banned_users = await db.users.count_documents({"is_banned": True})
    
    # Reports by category
    category_pipeline = [
        {"$match": {"created_at": {"$gte": last_7d}}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    category_stats = await db.content_reports.aggregate(category_pipeline).to_list(10)
    
    return {
        "reports": {
            "pending": pending_reports,
            "urgent": urgent_reports,
            "last_24h": reports_24h,
            "last_7d": reports_7d,
            "resolved_24h": resolved_24h
        },
        "blocks": {
            "last_24h": blocks_24h,
            "last_7d": blocks_7d,
            "total": total_blocks
        },
        "banned_users": banned_users,
        "reports_by_category": {item["_id"]: item["count"] for item in category_stats}
    }

# Content filtering on post creation - update the existing post endpoint
# This is a helper that will be called before creating posts

async def check_content_before_post(caption: str) -> dict:
    """Check content before allowing post creation"""
    result = check_content(caption, strict=True)
    return result

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