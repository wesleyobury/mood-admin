#!/usr/bin/env python3
"""
Backend API Testing for User Profile & Following System
Tests the newly implemented User Profile & Following System backend endpoints
"""

import requests
import json
import os
from pathlib import Path
import tempfile
from datetime import datetime

# Load environment variables
def load_env():
    env_path = Path("/app/frontend/.env")
    env_vars = {}
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value.strip('"')
    return env_vars

env_vars = load_env()
BASE_URL = env_vars.get('EXPO_PUBLIC_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BASE_URL}/api"

TEST_USER_DATA = {
    "username": "fitness_enthusiast_2025",
    "email": "fitness@example.com",
    "password": "SecurePass123!",
    "name": "Alex Fitness"
}

TEST_USER_2_DATA = {
    "username": "workout_buddy_2025",
    "email": "buddy@example.com", 
    "password": "SecurePass456!",
    "name": "Jordan Workout"
}

class MoodAppTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.user_id = None
        self.auth_token_2 = None
        self.user_id_2 = None
        self.test_results = []
        
    def log_result(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> requests.Response:
        """Make HTTP request with proper error handling"""
        url = f"{API_BASE}{endpoint}"
        request_headers = {"Content-Type": "application/json"}
        
        if headers:
            request_headers.update(headers)
            
        if self.auth_token and "Authorization" not in request_headers:
            request_headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=request_headers, params=data)
            elif method.upper() == "POST":
                response = self.session.post(url, headers=request_headers, json=data)
            elif method.upper() == "PUT":
                response = self.session.put(url, headers=request_headers, json=data)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=request_headers)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
    
    def test_health_endpoints(self):
        """Test API health and connectivity"""
        print("\n=== Testing Health Endpoints ===")
        
        # Test root endpoint
        try:
            response = self.make_request("GET", "/")
            if response.status_code == 200:
                data = response.json()
                self.log_result("API Root Endpoint", True, f"API is running: {data.get('message', 'No message')}")
            else:
                self.log_result("API Root Endpoint", False, f"Unexpected status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("API Root Endpoint", False, f"Connection failed: {str(e)}")
        
        # Test health check endpoint
        try:
            response = self.make_request("GET", "/health")
            if response.status_code == 200:
                data = response.json()
                self.log_result("Health Check Endpoint", True, f"Health status: {data.get('status', 'unknown')}")
            else:
                self.log_result("Health Check Endpoint", False, f"Unexpected status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Health Check Endpoint", False, f"Health check failed: {str(e)}")
    
    def test_user_registration(self):
        """Test user registration"""
        print("\n=== Testing User Registration ===")
        
        try:
            response = self.make_request("POST", "/auth/register", TEST_USER_DATA)
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user_id" in data:
                    self.auth_token = data["token"]
                    self.user_id = data["user_id"]
                    self.log_result("User Registration", True, f"User registered successfully with ID: {self.user_id}")
                else:
                    self.log_result("User Registration", False, "Missing token or user_id in response", data)
            elif response.status_code == 400:
                # User might already exist, try to login instead
                self.log_result("User Registration", True, "User already exists (expected for repeated tests)")
                self.test_user_login()
            else:
                self.log_result("User Registration", False, f"Registration failed with status {response.status_code}", response.text)
        except Exception as e:
            self.log_result("User Registration", False, f"Registration request failed: {str(e)}")
    
    def test_user_login(self):
        """Test user login"""
        print("\n=== Testing User Login ===")
        
        login_data = {
            "username": TEST_USER_DATA["username"],
            "password": TEST_USER_DATA["password"]
        }
        
        try:
            response = self.make_request("POST", "/auth/login", login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user_id" in data:
                    self.auth_token = data["token"]
                    self.user_id = data["user_id"]
                    self.log_result("User Login", True, f"Login successful for user ID: {self.user_id}")
                else:
                    self.log_result("User Login", False, "Missing token or user_id in response", data)
            else:
                self.log_result("User Login", False, f"Login failed with status {response.status_code}", response.text)
        except Exception as e:
            self.log_result("User Login", False, f"Login request failed: {str(e)}")
    
    def test_protected_endpoint_access(self):
        """Test accessing protected endpoints with JWT token"""
        print("\n=== Testing Protected Endpoint Access ===")
        
        if not self.auth_token:
            self.log_result("Protected Endpoint Access", False, "No auth token available for testing")
            return
        
        try:
            response = self.make_request("GET", "/users/me")
            
            if response.status_code == 200:
                data = response.json()
                if "username" in data and data["username"] == TEST_USER_DATA["username"]:
                    self.log_result("Protected Endpoint Access", True, f"Successfully accessed user profile: {data['username']}")
                else:
                    self.log_result("Protected Endpoint Access", False, "Unexpected user data returned", data)
            else:
                self.log_result("Protected Endpoint Access", False, f"Failed to access protected endpoint: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Protected Endpoint Access", False, f"Protected endpoint request failed: {str(e)}")
    
    def test_workout_endpoints(self):
        """Test workout-related endpoints"""
        print("\n=== Testing Workout Endpoints ===")
        
        # Test getting all workouts
        try:
            response = self.make_request("GET", "/workouts")
            
            if response.status_code == 200:
                workouts = response.json()
                self.log_result("Get All Workouts", True, f"Retrieved {len(workouts)} workouts")
            else:
                self.log_result("Get All Workouts", False, f"Failed to get workouts: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get All Workouts", False, f"Workout request failed: {str(e)}")
        
        # Test mood-based workout filtering
        test_moods = ["i want to sweat", "i want to push and gain muscle", "im feeling lazy"]
        
        for mood in test_moods:
            try:
                response = self.make_request("GET", f"/workouts/mood/{mood}")
                
                if response.status_code == 200:
                    workouts = response.json()
                    self.log_result(f"Mood Filter: {mood}", True, f"Retrieved {len(workouts)} workouts for mood")
                else:
                    self.log_result(f"Mood Filter: {mood}", False, f"Failed to filter by mood: {response.status_code}", response.text)
            except Exception as e:
                self.log_result(f"Mood Filter: {mood}", False, f"Mood filter request failed: {str(e)}")
        
        # Test creating a workout (if authenticated)
        if self.auth_token:
            workout_data = {
                "title": "Test Mood Workout",
                "mood_category": "i want to sweat",
                "exercises": [
                    {"name": "Push-ups", "reps": 20, "sets": 3},
                    {"name": "Squats", "reps": 15, "sets": 3}
                ],
                "duration": 30,
                "difficulty": "intermediate",
                "equipment": ["bodyweight"],
                "calories_estimate": 200
            }
            
            try:
                response = self.make_request("POST", "/workouts", workout_data)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result("Create Workout", True, f"Workout created successfully: {data.get('title', 'Unknown')}")
                else:
                    self.log_result("Create Workout", False, f"Failed to create workout: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Create Workout", False, f"Create workout request failed: {str(e)}")
    
    def create_test_image(self):
        """Create a test image file for upload testing"""
        try:
            # Create a simple test image
            img = Image.new('RGB', (100, 100), color='red')
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='JPEG')
            img_bytes.seek(0)
            return img_bytes
        except Exception as e:
            print(f"Error creating test image: {e}")
            return None

    def test_file_upload_single(self):
        """Test POST /api/upload - Single file upload"""
        try:
            img_data = self.create_test_image()
            if not img_data:
                self.log_result("Single File Upload", False, "Could not create test image")
                return False
            
            files = {'file': ('test_image.jpg', img_data, 'image/jpeg')}
            # Remove JSON content-type for file upload
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.post(f"{API_BASE}/upload", files=files, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                file_url = data.get('url')
                self.log_result("Single File Upload", True, f"File URL: {file_url}")
                return file_url
            else:
                self.log_result("Single File Upload", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Single File Upload", False, f"Exception: {str(e)}")
            return False

    def test_file_upload_multiple(self):
        """Test POST /api/upload/multiple - Multiple file upload (up to 5)"""
        try:
            files = []
            for i in range(3):  # Test with 3 files
                img_data = self.create_test_image()
                if img_data:
                    files.append(('files', (f'test_image_{i}.jpg', img_data, 'image/jpeg')))
            
            if not files:
                self.log_result("Multiple File Upload", False, "Could not create test images")
                return False
            
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.post(f"{API_BASE}/upload/multiple", files=files, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                urls = data.get('urls', [])
                self.log_result("Multiple File Upload", True, f"Uploaded {len(urls)} files")
                return urls
            else:
                self.log_result("Multiple File Upload", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Multiple File Upload", False, f"Exception: {str(e)}")
            return False

    def test_static_file_access(self, file_url):
        """Test accessing uploaded files via /uploads/ static endpoint"""
        try:
            if not file_url:
                self.log_result("Static File Access", False, "No file URL to test")
                return False
            
            # Try to access the file
            full_url = f"{BASE_URL}{file_url}"
            response = requests.get(full_url)
            
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                self.log_result("Static File Access", True, f"Content-Type: {content_type}")
                return True
            else:
                self.log_result("Static File Access", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Static File Access", False, f"Exception: {str(e)}")
            return False

    def test_social_features(self):
        """Test Instagram-inspired social feed features"""
        print("\n=== Testing Social Feed Features ===")
        
        if not self.auth_token:
            self.log_result("Social Features", False, "No auth token available for social testing")
            return
        
        # Test file uploads first
        print("\n--- File Upload Tests ---")
        single_file_url = self.test_file_upload_single()
        multiple_file_urls = self.test_file_upload_multiple()
        
        if single_file_url:
            self.test_static_file_access(single_file_url)
        
        # Test creating a post with media URLs
        print("\n--- Post Creation Tests ---")
        media_urls = []
        if multiple_file_urls:
            media_urls = multiple_file_urls[:2]  # Use first 2 images
        
        post_data = {
            "caption": "Testing social feed post creation with multiple images! 🏋️‍♂️ #workout #fitness #test",
            "media_urls": media_urls,
            "hashtags": ["workout", "fitness", "test"]
        }
        
        post_id = None
        try:
            response = self.make_request("POST", "/posts", post_data)
            
            if response.status_code == 200:
                data = response.json()
                post_id = data.get("id")
                self.log_result("Create Post with Media", True, f"Post ID: {post_id}, Media count: {len(media_urls)}")
            else:
                self.log_result("Create Post with Media", False, f"Failed to create post: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Post with Media", False, f"Create post request failed: {str(e)}")
        
        # Test getting posts feed
        print("\n--- Posts Feed Tests ---")
        try:
            response = self.make_request("GET", "/posts")
            
            if response.status_code == 200:
                posts = response.json()
                if isinstance(posts, list):
                    post_count = len(posts)
                    
                    # Check if posts have required fields
                    if posts:
                        first_post = posts[0]
                        has_media_urls = 'media_urls' in first_post
                        has_author = 'author' in first_post
                        has_created_at = 'created_at' in first_post
                        
                        details = f"Found {post_count} posts, media_urls: {has_media_urls}, author: {has_author}"
                        self.log_result("Get Posts Feed", True, details)
                        
                        # Verify newest first order
                        if len(posts) > 1:
                            first_date = posts[0].get('created_at')
                            second_date = posts[1].get('created_at')
                            if first_date and second_date:
                                newest_first = first_date >= second_date
                                self.log_result("Posts Order (Newest First)", newest_first, 
                                              f"First: {first_date}, Second: {second_date}")
                    else:
                        self.log_result("Get Posts Feed", True, "No posts found (empty feed)")
                else:
                    self.log_result("Get Posts Feed", False, "Response is not a list")
            else:
                self.log_result("Get Posts Feed", False, f"Failed to get posts: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Posts Feed", False, f"Get posts request failed: {str(e)}")
        
        # Test social interactions
        print("\n--- Social Interaction Tests ---")
        if post_id:
            # Test liking a post
            try:
                response = self.make_request("POST", f"/posts/{post_id}/like")
                
                if response.status_code == 200:
                    data = response.json()
                    liked = data.get('liked', False)
                    message = data.get('message', '')
                    self.log_result("Like Post", True, f"Liked: {liked}, Message: {message}")
                else:
                    self.log_result("Like Post", False, f"Failed to like post: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Like Post", False, f"Like post request failed: {str(e)}")
            
            # Test unliking a post (same endpoint toggles)
            try:
                response = self.make_request("POST", f"/posts/{post_id}/like")
                
                if response.status_code == 200:
                    data = response.json()
                    liked = data.get('liked', True)
                    message = data.get('message', '')
                    # Should be False if we're unliking
                    success = not liked
                    self.log_result("Unlike Post", success, f"Liked: {liked}, Message: {message}")
                else:
                    self.log_result("Unlike Post", False, f"Failed to unlike post: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Unlike Post", False, f"Unlike post request failed: {str(e)}")
            
            # Test commenting on a post
            comment_data = {
                "post_id": post_id,
                "text": "Great workout! Keep it up! 💪"
            }
            
            try:
                response = self.make_request("POST", "/comments", comment_data)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result("Add Comment", True, f"Comment created: {data.get('id', 'Success')}")
                else:
                    self.log_result("Add Comment", False, f"Failed to create comment: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Add Comment", False, f"Create comment request failed: {str(e)}")
            
            # Test getting comments for the post
            try:
                response = self.make_request("GET", f"/posts/{post_id}/comments")
                
                if response.status_code == 200:
                    comments = response.json()
                    if isinstance(comments, list):
                        comment_count = len(comments)
                        self.log_result("Get Comments", True, f"Found {comment_count} comments")
                    else:
                        self.log_result("Get Comments", False, "Response is not a list")
                else:
                    self.log_result("Get Comments", False, f"Failed to get comments: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Get Comments", False, f"Get comments request failed: {str(e)}")
        
        # Test API endpoint discrepancies
        print("\n--- API Endpoint Verification ---")
        
        # Check for /api/uploadfile/ endpoint (mentioned in review but not implemented)
        try:
            response = self.make_request("POST", "/uploadfile/")
            if response.status_code == 404:
                self.log_result("API Discrepancy: /uploadfile/", False, "Endpoint /api/uploadfile/ not found - use /api/upload or /api/upload/multiple instead")
            else:
                self.log_result("API Discrepancy: /uploadfile/", True, f"Unexpected response: {response.status_code}")
        except Exception as e:
            self.log_result("API Discrepancy: /uploadfile/", False, f"Endpoint /api/uploadfile/ not found: {str(e)}")
        
        # Check for DELETE /api/posts/{post_id}/like endpoint (mentioned in review but not implemented)
        if post_id:
            try:
                response = self.make_request("DELETE", f"/posts/{post_id}/like")
                if response.status_code == 405:  # Method not allowed
                    self.log_result("API Discrepancy: DELETE like", False, "DELETE /api/posts/{post_id}/like not implemented - POST endpoint toggles like/unlike")
                else:
                    self.log_result("API Discrepancy: DELETE like", True, f"Unexpected response: {response.status_code}")
            except Exception as e:
                self.log_result("API Discrepancy: DELETE like", False, f"DELETE like endpoint issue: {str(e)}")
        
        # Check for POST /api/posts/{post_id}/comments endpoint (mentioned in review but implemented as /api/comments)
        if post_id:
            try:
                response = self.make_request("POST", f"/posts/{post_id}/comments", {"text": "Test comment"})
                if response.status_code == 404:
                    self.log_result("API Discrepancy: POST comments", False, "POST /api/posts/{post_id}/comments not found - use POST /api/comments instead")
                else:
                    self.log_result("API Discrepancy: POST comments", True, f"Unexpected response: {response.status_code}")
            except Exception as e:
                self.log_result("API Discrepancy: POST comments", False, f"POST comments endpoint issue: {str(e)}")
    
    def test_follow_system(self):
        """Test user follow/unfollow functionality"""
        print("\n=== Testing Follow System ===")
        
        if not self.auth_token:
            self.log_result("Follow System", False, "No auth token available for follow testing")
            return
        
        # Create a second user to test following
        try:
            response = self.make_request("POST", "/auth/register", TEST_USER_2_DATA, headers={"Authorization": ""})
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token_2 = data["token"]
                self.user_id_2 = data["user_id"]
                self.log_result("Create Second User", True, f"Second user created: {self.user_id_2}")
            elif response.status_code == 400:
                # User exists, try login
                login_data = {
                    "username": TEST_USER_2_DATA["username"],
                    "password": TEST_USER_2_DATA["password"]
                }
                response = self.make_request("POST", "/auth/login", login_data, headers={"Authorization": ""})
                if response.status_code == 200:
                    data = response.json()
                    self.auth_token_2 = data["token"]
                    self.user_id_2 = data["user_id"]
                    self.log_result("Login Second User", True, f"Second user logged in: {self.user_id_2}")
        except Exception as e:
            self.log_result("Setup Second User", False, f"Failed to setup second user: {str(e)}")
            return
        
        # Test following the second user
        if self.user_id_2:
            try:
                response = self.make_request("POST", f"/users/{self.user_id_2}/follow")
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result("Follow User", True, f"Follow action: {data.get('message', 'Success')}")
                else:
                    self.log_result("Follow User", False, f"Failed to follow user: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Follow User", False, f"Follow user request failed: {str(e)}")
    
    def test_user_workout_logging(self):
        """Test logging completed workouts"""
        print("\n=== Testing User Workout Logging ===")
        
        if not self.auth_token:
            self.log_result("Workout Logging", False, "No auth token available for workout logging")
            return
        
        workout_log_data = {
            "workout_id": "test_workout_id_123",
            "duration_actual": 25,
            "notes": "Great workout session!",
            "mood_before": "tired",
            "mood_after": "energized"
        }
        
        try:
            response = self.make_request("POST", "/user-workouts", workout_log_data)
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("Log Workout Completion", True, f"Workout logged: {data.get('message', 'Success')}")
            else:
                self.log_result("Log Workout Completion", False, f"Failed to log workout: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Log Workout Completion", False, f"Workout logging request failed: {str(e)}")
        
        # Test getting user workout history
        try:
            response = self.make_request("GET", "/user-workouts")
            
            if response.status_code == 200:
                workouts = response.json()
                self.log_result("Get Workout History", True, f"Retrieved {len(workouts)} workout entries")
            else:
                self.log_result("Get Workout History", False, f"Failed to get workout history: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Workout History", False, f"Workout history request failed: {str(e)}")
    
    def run_all_tests(self):
        """Run comprehensive backend API tests focusing on social feed features"""
        print("🚀 Starting Backend Social Feed API Tests")
        print(f"Testing against: {BASE_URL}")
        print("=" * 60)
        
        # Run essential setup tests
        self.test_health_endpoints()
        self.test_user_registration()
        self.test_user_login()
        self.test_protected_endpoint_access()
        
        # Focus on social feed features
        self.test_social_features()
        
        # Run additional tests for completeness
        self.test_follow_system()
        self.test_workout_endpoints()
        self.test_user_workout_logging()
        
        # Summary
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['message']}")
        
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "results": self.test_results
        }

if __name__ == "__main__":
    tester = MoodAppTester()
    results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    if results["failed"] > 0:
        exit(1)
    else:
        print("\n🎉 All tests passed!")
        exit(0)