#!/usr/bin/env python3
"""
MOOD App Backend API Testing Suite
Tests all backend endpoints for authentication, workouts, and social features
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://workout-buddy-420.preview.emergentagent.com/api"
TEST_USER_DATA = {
    "username": "moodtester2025",
    "email": "moodtest2025@example.com", 
    "password": "SecurePass123!",
    "name": "Mood Test User"
}

TEST_USER_2_DATA = {
    "username": "moodtester2_2025",
    "email": "moodtest2_2025@example.com",
    "password": "SecurePass456!",
    "name": "Second Test User"
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
        url = f"{BASE_URL}{endpoint}"
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
    
    def test_social_features(self):
        """Test social media features"""
        print("\n=== Testing Social Features ===")
        
        if not self.auth_token:
            self.log_result("Social Features", False, "No auth token available for social testing")
            return
        
        # Test creating a post
        post_data = {
            "caption": "Just finished an amazing workout! 💪 #MoodApp #Fitness",
            "workout_id": None  # No specific workout for this test
        }
        
        post_id = None
        try:
            response = self.make_request("POST", "/posts", post_data)
            
            if response.status_code == 200:
                data = response.json()
                post_id = data.get("id")
                self.log_result("Create Post", True, f"Post created successfully: {post_id}")
            else:
                self.log_result("Create Post", False, f"Failed to create post: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Post", False, f"Create post request failed: {str(e)}")
        
        # Test getting posts feed
        try:
            response = self.make_request("GET", "/posts")
            
            if response.status_code == 200:
                posts = response.json()
                self.log_result("Get Posts Feed", True, f"Retrieved {len(posts)} posts from feed")
            else:
                self.log_result("Get Posts Feed", False, f"Failed to get posts: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Posts Feed", False, f"Get posts request failed: {str(e)}")
        
        # Test liking a post (if we have a post_id)
        if post_id:
            try:
                response = self.make_request("POST", f"/posts/{post_id}/like")
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result("Like Post", True, f"Post like action: {data.get('message', 'Success')}")
                else:
                    self.log_result("Like Post", False, f"Failed to like post: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Like Post", False, f"Like post request failed: {str(e)}")
            
            # Test commenting on a post
            comment_data = {
                "post_id": post_id,
                "text": "Great workout! Keep it up! 🔥"
            }
            
            try:
                response = self.make_request("POST", "/comments", comment_data)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result("Create Comment", True, f"Comment created: {data.get('id', 'Success')}")
                else:
                    self.log_result("Create Comment", False, f"Failed to create comment: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Create Comment", False, f"Create comment request failed: {str(e)}")
    
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
        """Run comprehensive backend API tests"""
        print("🚀 Starting MOOD App Backend API Tests")
        print(f"Testing against: {BASE_URL}")
        print("=" * 60)
        
        # Run all test suites
        self.test_health_endpoints()
        self.test_user_registration()
        self.test_user_login()
        self.test_protected_endpoint_access()
        self.test_workout_endpoints()
        self.test_social_features()
        self.test_follow_system()
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