# Authentication Tracking System

## Overview
Comprehensive authentication tracking system that monitors and stores user auth information, login history, active sessions, and security events.

## Features Implemented

### 1. Login Event Tracking
- **What's Tracked:**
  - User ID
  - Login method (google_oauth, email_password, demo)
  - IP address
  - User agent
  - Device information
  - Success/failure status
  - Timestamp
  - Failure reason (if applicable)

- **Storage:** `login_events` collection in MongoDB

### 2. Active Session Management
- **What's Tracked:**
  - User ID
  - Session token
  - Login method
  - IP address
  - User agent
  - Device type (mobile, desktop, tablet)
  - Created at timestamp
  - Last activity timestamp
  - Expiration time
  - Active status

- **Storage:** `user_sessions` collection in MongoDB

### 3. Authentication Metadata
Stored in `users` collection under `auth_metadata` field:
- **Login methods used** (list of all methods a user has used)
- **First login timestamp**
- **Last login timestamp**
- **Total login count**
- **Failed login attempts** (resets on successful login)
- **Last failed login timestamp**
- **Password changed timestamp** (for future password change tracking)

## API Endpoints

### Get Active Sessions
```http
GET /api/auth/sessions
Authorization: Bearer {token}
```

**Response:**
```json
{
  "sessions": [
    {
      "session_token": "abc123...",
      "login_method": "email_password",
      "device_type": "mobile",
      "ip_address": "192.168.1.1",
      "created_at": "2025-06-15T10:30:00Z",
      "last_activity": "2025-06-15T12:45:00Z",
      "is_current": false
    }
  ],
  "total": 1
}
```

### Get Login History
```http
GET /api/auth/login-history?limit=50
Authorization: Bearer {token}
```

**Response:**
```json
{
  "history": [
    {
      "login_method": "email_password",
      "success": true,
      "ip_address": "192.168.1.1",
      "device_info": {},
      "timestamp": "2025-06-15T10:30:00Z",
      "failure_reason": null
    },
    {
      "login_method": "google_oauth",
      "success": false,
      "ip_address": "192.168.1.2",
      "device_info": {},
      "timestamp": "2025-06-14T09:15:00Z",
      "failure_reason": "Invalid session ID"
    }
  ],
  "total": 2
}
```

### Get Auth Metadata
```http
GET /api/auth/metadata
Authorization: Bearer {token}
```

**Response:**
```json
{
  "login_methods": ["email_password", "google_oauth"],
  "first_login_at": "2025-01-15T08:00:00Z",
  "last_login_at": "2025-06-15T10:30:00Z",
  "total_logins": 127,
  "failed_login_attempts": 0,
  "last_failed_login": null
}
```

## Database Collections

### `login_events`
Stores all login attempts (successful and failed):
```javascript
{
  "_id": ObjectId,
  "user_id": "user_abc123",
  "login_method": "email_password",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "device_info": {},
  "success": true,
  "timestamp": ISODate("2025-06-15T10:30:00Z"),
  "failure_reason": null
}
```

### `user_sessions`
Tracks active user sessions:
```javascript
{
  "_id": ObjectId,
  "user_id": "user_abc123",
  "session_token": "jwt_token_here",
  "login_method": "email_password",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "device_type": "mobile",
  "created_at": ISODate("2025-06-15T10:30:00Z"),
  "last_activity": ISODate("2025-06-15T12:45:00Z"),
  "expires_at": ISODate("2025-06-22T10:30:00Z"),
  "is_active": true
}
```

### `users` collection - `auth_metadata` field
```javascript
{
  "_id": ObjectId,
  "username": "john_doe",
  "email": "john@example.com",
  ...
  "auth_metadata": {
    "login_methods": ["email_password", "google_oauth"],
    "first_login_at": ISODate("2025-01-15T08:00:00Z"),
    "last_login_at": ISODate("2025-06-15T10:30:00Z"),
    "total_logins": 127,
    "failed_login_attempts": 0,
    "last_failed_login": null,
    "password_changed_at": ISODate("2025-03-20T14:00:00Z")
  }
}
```

## Implementation Details

### Files Created/Modified

**New File:**
- `/app/backend/auth_tracking.py` - Core tracking functionality

**Modified Files:**
- `/app/backend/server.py` - Integrated tracking into login endpoints and added new API endpoints

### Functions in `auth_tracking.py`

1. **`track_login_event()`** - Records login attempt
2. **`update_auth_metadata()`** - Updates user's auth metadata
3. **`create_session_record()`** - Creates session record
4. **`update_session_activity()`** - Updates last activity
5. **`deactivate_session()`** - Marks session as inactive (logout)
6. **`get_active_sessions()`** - Retrieves active sessions
7. **`get_login_history()`** - Retrieves login history
8. **`track_password_change()`** - Tracks password changes
9. **`detect_device_type()`** - Detects device from user agent
10. **`get_client_ip()`** - Extracts client IP from request
11. **`get_user_agent()`** - Extracts user agent from request

## Usage Example

### Tracking a Login
The system automatically tracks logins when users authenticate:

```python
# In login endpoint
await track_login_event(
    db, user_id, "email_password", True,
    ip_address, user_agent
)
await update_auth_metadata(db, user_id, "email_password", True)
await create_session_record(
    db, user_id, token, "email_password",
    ip_address, user_agent
)
```

### Retrieving User's Login History
```python
# Frontend can call
GET /api/auth/login-history

# Shows last 50 login attempts with timestamps, IPs, and success status
```

## Security Benefits

1. **Breach Detection** - Quickly identify unauthorized access attempts
2. **Suspicious Activity Monitoring** - Track unusual login patterns
3. **Session Management** - View and manage active sessions
4. **Audit Trail** - Complete history of authentication events
5. **Failed Login Tracking** - Identify brute force attempts

## Future Enhancements

1. **Geolocation tracking** - Add IP geolocation for login locations
2. **Session revocation** - Allow users to terminate specific sessions
3. **Email alerts** - Notify users of suspicious login attempts
4. **Two-factor authentication** - Add 2FA tracking
5. **Login anomaly detection** - ML-based suspicious activity detection
6. **Rate limiting** - Automatic account lockout after failed attempts

## Example Use Cases

### 1. Security Dashboard
Users can view:
- Where they're logged in (device types, locations)
- When they last logged in
- Failed login attempts on their account

### 2. Compliance & Auditing
- Track all authentication events for compliance
- Generate reports on user access patterns
- Investigate security incidents

### 3. User Experience
- Show users their active devices
- Allow users to log out of other sessions
- Display login history for transparency

## Testing the Implementation

### Test Login Tracking
```bash
# Make a login request
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'

# Get login history
curl -X GET http://localhost:8001/api/auth/login-history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Session Management
```bash
# Get active sessions
curl -X GET http://localhost:8001/api/auth/sessions \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get auth metadata
curl -X GET http://localhost:8001/api/auth/metadata \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## MongoDB Indexes (Recommended)

For optimal performance, create these indexes:

```javascript
// login_events collection
db.login_events.createIndex({ "user_id": 1, "timestamp": -1 })
db.login_events.createIndex({ "success": 1 })

// user_sessions collection
db.user_sessions.createIndex({ "user_id": 1, "is_active": 1 })
db.user_sessions.createIndex({ "session_token": 1 })
db.user_sessions.createIndex({ "expires_at": 1 })

// users collection
db.users.createIndex({ "auth_metadata.last_login_at": -1 })
```

## Notes

- All timestamps are stored in UTC
- IP addresses are extracted from X-Forwarded-For or X-Real-IP headers for proxied requests
- Device type detection is based on user agent string analysis
- Session tokens are truncated in API responses for security
- Failed login attempts reset to 0 on successful login
