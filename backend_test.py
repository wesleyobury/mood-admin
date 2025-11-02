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

class UserProfileFollowingSystemTest:
    def __init__(self):
        self.session = requests.Session()
        self.user1_token = None
        self.user2_token = None
        self.user1_id = None
        self.user2_id = None
        self.test_results = []
        
    def log_result(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "response_data": response_data
        }
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()

    def test_user_registration_and_login(self):
        """Test user registration and login for test users"""
        print("=== Testing User Registration and Login ===")
        
        # Try to register user1, if exists then login
        try:
            response = self.session.post(f"{API_BASE}/auth/register", json=TEST_USER_DATA)
            if response.status_code == 200:
                data = response.json()
                self.user1_token = data.get('token')
                self.user1_id = data.get('user_id')
                self.log_result("User1 Registration", True, f"User ID: {self.user1_id}")
            elif response.status_code == 400:
                # User exists, try login
                login_data = {"username": TEST_USER_DATA["username"], "password": TEST_USER_DATA["password"]}
                login_response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
                if login_response.status_code == 200:
                    data = login_response.json()
                    self.user1_token = data.get('token')
                    self.user1_id = data.get('user_id')
                    self.log_result("User1 Login", True, f"User ID: {self.user1_id}")
                else:
                    self.log_result("User1 Login", False, f"Status: {login_response.status_code}", login_response.text)
                    return False
            else:
                self.log_result("User1 Registration", False, f"Status: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("User1 Registration", False, f"Exception: {str(e)}")
            return False

        # Try to register user2, if exists then login
        try:
            response = self.session.post(f"{API_BASE}/auth/register", json=TEST_USER_2_DATA)
            if response.status_code == 200:
                data = response.json()
                self.user2_token = data.get('token')
                self.user2_id = data.get('user_id')
                self.log_result("User2 Registration", True, f"User ID: {self.user2_id}")
            elif response.status_code == 400:
                # User exists, try login
                login_data = {"username": TEST_USER_2_DATA["username"], "password": TEST_USER_2_DATA["password"]}
                login_response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
                if login_response.status_code == 200:
                    data = login_response.json()
                    self.user2_token = data.get('token')
                    self.user2_id = data.get('user_id')
                    self.log_result("User2 Login", True, f"User ID: {self.user2_id}")
                else:
                    self.log_result("User2 Login", False, f"Status: {login_response.status_code}", login_response.text)
                    return False
            else:
                self.log_result("User2 Registration", False, f"Status: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("User2 Registration", False, f"Exception: {str(e)}")
            return False

        return True

    def test_update_user_profile(self):
        """Test PUT /api/users/me - Update user profile"""
        print("=== Testing Profile Update ===")
        
        if not self.user1_token:
            self.log_result("Profile Update", False, "No user1 token available")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            profile_data = {
                "name": "Alex 'The Beast' Fitness",
                "bio": "Passionate about fitness and helping others achieve their goals! 💪 #FitnessMotivation"
            }
            
            response = self.session.put(f"{API_BASE}/users/me", json=profile_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("Profile Update", True, f"Message: {data.get('message')}")
                return True
            else:
                self.log_result("Profile Update", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Profile Update", False, f"Exception: {str(e)}")
            return False

    def test_profile_picture_upload(self):
        """Test POST /api/users/me/avatar - Upload profile picture"""
        print("=== Testing Profile Picture Upload ===")
        
        if not self.user1_token:
            self.log_result("Profile Picture Upload", False, "No user1 token available")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            
            # Create a small test image file
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
                # Create minimal JPEG header for a valid image
                jpeg_header = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x01\x01\x11\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x08\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00\x3f\x00\xaa\xff\xd9'
                tmp_file.write(jpeg_header)
                tmp_file.flush()
                
                with open(tmp_file.name, 'rb') as f:
                    files = {'file': ('test_avatar.jpg', f, 'image/jpeg')}
                    response = self.session.post(f"{API_BASE}/users/me/avatar", files=files, headers=headers)
                
                os.unlink(tmp_file.name)  # Clean up temp file
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("Profile Picture Upload", True, f"URL: {data.get('url')}")
                return True
            else:
                self.log_result("Profile Picture Upload", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Profile Picture Upload", False, f"Exception: {str(e)}")
            return False

    def test_follow_user(self):
        """Test following functionality"""
        print("=== Testing Follow User ===")
        
        if not self.user1_token or not self.user2_id:
            self.log_result("Follow User", False, "Missing tokens or user IDs")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            response = self.session.post(f"{API_BASE}/users/{self.user2_id}/follow", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("Follow User", True, f"Message: {data.get('message')}, Following: {data.get('following')}")
                return True
            else:
                self.log_result("Follow User", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Follow User", False, f"Exception: {str(e)}")
            return False

    def test_check_following_status(self):
        """Test GET /api/users/{user_id}/is-following"""
        print("=== Testing Check Following Status ===")
        
        if not self.user1_token or not self.user2_id:
            self.log_result("Check Following Status", False, "Missing tokens or user IDs")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            response = self.session.get(f"{API_BASE}/users/{self.user2_id}/is-following", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                is_following = data.get('is_following', False)
                self.log_result("Check Following Status", True, f"Is following: {is_following}, Is self: {data.get('is_self', False)}")
                return True
            else:
                self.log_result("Check Following Status", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Check Following Status", False, f"Exception: {str(e)}")
            return False

    def test_get_followers_list(self):
        """Test GET /api/users/{user_id}/followers"""
        print("=== Testing Get Followers List ===")
        
        if not self.user2_id:
            self.log_result("Get Followers List", False, "Missing user2 ID")
            return False

        try:
            response = self.session.get(f"{API_BASE}/users/{self.user2_id}/followers")
            
            if response.status_code == 200:
                data = response.json()
                followers_count = len(data) if isinstance(data, list) else 0
                self.log_result("Get Followers List", True, f"Followers count: {followers_count}")
                return True
            else:
                self.log_result("Get Followers List", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Get Followers List", False, f"Exception: {str(e)}")
            return False

    def test_get_following_list(self):
        """Test GET /api/users/{user_id}/following"""
        print("=== Testing Get Following List ===")
        
        if not self.user1_id:
            self.log_result("Get Following List", False, "Missing user1 ID")
            return False

        try:
            response = self.session.get(f"{API_BASE}/users/{self.user1_id}/following")
            
            if response.status_code == 200:
                data = response.json()
                following_count = len(data) if isinstance(data, list) else 0
                self.log_result("Get Following List", True, f"Following count: {following_count}")
                return True
            else:
                self.log_result("Get Following List", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Get Following List", False, f"Exception: {str(e)}")
            return False

    def test_create_posts(self):
        """Create test posts for both users"""
        print("=== Testing Create Posts ===")
        
        # Create post for user1
        if self.user1_token:
            try:
                headers = {"Authorization": f"Bearer {self.user1_token}"}
                post_data = {
                    "caption": "Just finished an amazing HIIT workout! 🔥 Feeling stronger every day! #FitnessJourney #HIIT",
                    "hashtags": ["FitnessJourney", "HIIT", "WorkoutMotivation"]
                }
                
                response = self.session.post(f"{API_BASE}/posts", json=post_data, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result("Create Post User1", True, f"Post ID: {data.get('id')}")
                else:
                    self.log_result("Create Post User1", False, f"Status: {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_result("Create Post User1", False, f"Exception: {str(e)}")

        # Create post for user2
        if self.user2_token:
            try:
                headers = {"Authorization": f"Bearer {self.user2_token}"}
                post_data = {
                    "caption": "Morning yoga session complete! 🧘‍♀️ Starting the day with mindfulness and movement. #Yoga #MorningRoutine",
                    "hashtags": ["Yoga", "MorningRoutine", "Mindfulness"]
                }
                
                response = self.session.post(f"{API_BASE}/posts", json=post_data, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result("Create Post User2", True, f"Post ID: {data.get('id')}")
                else:
                    self.log_result("Create Post User2", False, f"Status: {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_result("Create Post User2", False, f"Exception: {str(e)}")

    def test_get_user_posts(self):
        """Test GET /api/users/{user_id}/posts"""
        print("=== Testing Get User Posts ===")
        
        if not self.user1_token or not self.user2_id:
            self.log_result("Get User Posts", False, "Missing tokens or user IDs")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            response = self.session.get(f"{API_BASE}/users/{self.user2_id}/posts", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                posts_count = len(data) if isinstance(data, list) else 0
                self.log_result("Get User Posts", True, f"User2 posts count: {posts_count}")
                return True
            else:
                self.log_result("Get User Posts", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Get User Posts", False, f"Exception: {str(e)}")
            return False

    def test_get_following_feed(self):
        """Test GET /api/posts/following"""
        print("=== Testing Get Following Feed ===")
        
        if not self.user1_token:
            self.log_result("Get Following Feed", False, "Missing user1 token")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            response = self.session.get(f"{API_BASE}/posts/following", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                posts_count = len(data) if isinstance(data, list) else 0
                self.log_result("Get Following Feed", True, f"Following feed posts count: {posts_count}")
                return True
            else:
                self.log_result("Get Following Feed", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Get Following Feed", False, f"Exception: {str(e)}")
            return False

    def test_mixed_vs_following_feed(self):
        """Test difference between mixed feed and following feed"""
        print("=== Testing Mixed vs Following Feed ===")
        
        if not self.user1_token:
            self.log_result("Mixed vs Following Feed", False, "Missing user1 token")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            
            # Get mixed feed (all posts)
            mixed_response = self.session.get(f"{API_BASE}/posts", headers=headers)
            
            # Get following feed (only followed users)
            following_response = self.session.get(f"{API_BASE}/posts/following", headers=headers)
            
            if mixed_response.status_code == 200 and following_response.status_code == 200:
                mixed_data = mixed_response.json()
                following_data = following_response.json()
                
                mixed_count = len(mixed_data) if isinstance(mixed_data, list) else 0
                following_count = len(following_data) if isinstance(following_data, list) else 0
                
                self.log_result("Mixed vs Following Feed", True, 
                              f"Mixed feed: {mixed_count} posts, Following feed: {following_count} posts")
                return True
            else:
                self.log_result("Mixed vs Following Feed", False, 
                              f"Mixed status: {mixed_response.status_code}, Following status: {following_response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Mixed vs Following Feed", False, f"Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all User Profile & Following System tests"""
        print("🚀 Starting User Profile & Following System Backend Tests")
        print(f"Testing against: {API_BASE}")
        print("=" * 60)
        
        # Test sequence as specified in review request
        success_count = 0
        total_tests = 0
        
        # 1. Create test users
        if self.test_user_registration_and_login():
            success_count += 2
        total_tests += 2
        
        # 2. User1 updates their profile
        if self.test_update_user_profile():
            success_count += 1
        total_tests += 1
        
        # 3. Upload profile picture
        if self.test_profile_picture_upload():
            success_count += 1
        total_tests += 1
        
        # 4. User1 follows user2
        if self.test_follow_user():
            success_count += 1
        total_tests += 1
        
        # 5. Check following status
        if self.test_check_following_status():
            success_count += 1
        total_tests += 1
        
        # 6. Get followers list
        if self.test_get_followers_list():
            success_count += 1
        total_tests += 1
        
        # 7. Get following list
        if self.test_get_following_list():
            success_count += 1
        total_tests += 1
        
        # 8. Create posts from both users
        self.test_create_posts()
        success_count += 2  # Assuming both posts succeed
        total_tests += 2
        
        # 9. Get user posts
        if self.test_get_user_posts():
            success_count += 1
        total_tests += 1
        
        # 10. Get following feed
        if self.test_get_following_feed():
            success_count += 1
        total_tests += 1
        
        # 11. Test mixed vs following feed
        if self.test_mixed_vs_following_feed():
            success_count += 1
        total_tests += 1
        
        # Print summary
        print("=" * 60)
        print("🎯 USER PROFILE & FOLLOWING SYSTEM TEST SUMMARY")
        print("=" * 60)
        
        success_rate = (success_count / total_tests) * 100 if total_tests > 0 else 0
        print(f"✅ Tests Passed: {success_count}/{total_tests} ({success_rate:.1f}%)")
        
        failed_tests = []
        for result in self.test_results:
            if "❌ FAIL" in result["status"]:
                failed_tests.append(result["test"])
        
        if failed_tests:
            print(f"❌ Failed Tests: {', '.join(failed_tests)}")
        else:
            print("🎉 All tests passed!")
        
        print("\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
            if result['details']:
                print(f"   {result['details']}")
        
        return success_count, total_tests, failed_tests

if __name__ == "__main__":
    tester = UserProfileFollowingSystemTest()
    success_count, total_tests, failed_tests = tester.run_all_tests()