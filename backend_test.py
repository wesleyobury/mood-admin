#!/usr/bin/env python3
"""
Backend API Testing for Followers and Following Functionality
Testing the specific endpoints requested in the review.
"""

import requests
import json
import sys
from typing import Dict, List, Any

# Get backend URL from frontend .env
BACKEND_URL = "https://fitconnect-40.preview.emergentagent.com/api"

class FollowersFollowingTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.current_user_id = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
    
    def find_and_login_test_user(self) -> bool:
        """Find available test users and login with one of them"""
        # First, try to create a test user for authentication
        try:
            from datetime import datetime
            test_user_data = {
                "username": f"testuser_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "email": f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
                "password": "testpass123",
                "name": "Test User"
            }
            
            response = self.session.post(f"{BACKEND_URL}/auth/register", json=test_user_data)
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get("token")
                self.current_user_id = data.get("user_id")
                
                if self.auth_token and self.current_user_id:
                    # Set authorization header for future requests
                    self.session.headers.update({
                        "Authorization": f"Bearer {self.auth_token}"
                    })
                    self.log_test("Create and login test user", True, f"User ID: {self.current_user_id}")
                    return True
                else:
                    self.log_test("Create and login test user", False, "Missing token or user_id in response")
            else:
                self.log_test("Create and login test user", False, f"Registration failed: {response.status_code}")
        except Exception as e:
            self.log_test("Create and login test user", False, f"Exception: {str(e)}")
        
        # If registration failed, try known test users
        test_users = [
            {"username": "cardioking", "password": "test123"},
            {"username": "strengthbeast", "password": "test123"},
            {"username": "yogaflow_", "password": "test123"},
            {"username": "fitnessguru", "password": "test123"},
            {"username": "hiitmaster", "password": "test123"}
        ]
        
        for user_creds in test_users:
            try:
                response = self.session.post(f"{BACKEND_URL}/auth/login", json=user_creds)
                
                if response.status_code == 200:
                    data = response.json()
                    self.auth_token = data.get("token")
                    self.current_user_id = data.get("user_id")
                    
                    if self.auth_token and self.current_user_id:
                        # Set authorization header for future requests
                        self.session.headers.update({
                            "Authorization": f"Bearer {self.auth_token}"
                        })
                        self.log_test(f"Login with {user_creds['username']}", True, f"User ID: {self.current_user_id}")
                        return True
                        
            except Exception as e:
                continue
        
        self.log_test("Login with any test user", False, "Could not login with any known test users")
        return False
    
    def test_followers_endpoint(self) -> bool:
        """Test GET /api/users/{user_id}/followers endpoint"""
        try:
            if not self.current_user_id:
                self.log_test("GET /api/users/{user_id}/followers", False, "No user ID available")
                return False
            
            url = f"{BACKEND_URL}/users/{self.current_user_id}/followers"
            response = self.session.get(url)
            
            if response.status_code == 200:
                followers = response.json()
                
                # Verify it's a list
                if not isinstance(followers, list):
                    self.log_test("GET /api/users/{user_id}/followers", False, f"Response is not a list: {type(followers)}")
                    return False
                
                # Check response structure if there are followers
                if len(followers) > 0:
                    follower = followers[0]
                    required_fields = ['id', 'username', 'name', 'avatar', 'bio', 'followers_count', 'following_count']
                    missing_fields = []
                    
                    for field in required_fields:
                        if field not in follower:
                            missing_fields.append(field)
                    
                    if missing_fields:
                        self.log_test("GET /api/users/{user_id}/followers", False, f"Missing fields: {missing_fields}")
                        return False
                    
                    self.log_test("GET /api/users/{user_id}/followers", True, f"Found {len(followers)} followers with correct structure")
                else:
                    self.log_test("GET /api/users/{user_id}/followers", True, "Empty followers list (valid response)")
                
                return True
            else:
                self.log_test("GET /api/users/{user_id}/followers", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("GET /api/users/{user_id}/followers", False, f"Exception: {str(e)}")
            return False
    
    def test_following_endpoint(self) -> bool:
        """Test GET /api/users/{user_id}/following endpoint"""
        try:
            if not self.current_user_id:
                self.log_test("GET /api/users/{user_id}/following", False, "No user ID available")
                return False
            
            url = f"{BACKEND_URL}/users/{self.current_user_id}/following"
            response = self.session.get(url)
            
            if response.status_code == 200:
                following = response.json()
                
                # Verify it's a list
                if not isinstance(following, list):
                    self.log_test("GET /api/users/{user_id}/following", False, f"Response is not a list: {type(following)}")
                    return False
                
                # Check response structure if there are following users
                if len(following) > 0:
                    following_user = following[0]
                    required_fields = ['id', 'username', 'name', 'avatar', 'bio', 'followers_count', 'following_count']
                    missing_fields = []
                    
                    for field in required_fields:
                        if field not in following_user:
                            missing_fields.append(field)
                    
                    if missing_fields:
                        self.log_test("GET /api/users/{user_id}/following", False, f"Missing fields: {missing_fields}")
                        return False
                    
                    self.log_test("GET /api/users/{user_id}/following", True, f"Found {len(following)} following users with correct structure")
                else:
                    self.log_test("GET /api/users/{user_id}/following", True, "Empty following list (valid response)")
                
                return True
            else:
                self.log_test("GET /api/users/{user_id}/following", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("GET /api/users/{user_id}/following", False, f"Exception: {str(e)}")
            return False
    
    def test_with_different_user(self) -> bool:
        """Test endpoints with a different user ID to verify they work for any user"""
        try:
            # First, let's get a list of users to find another user ID
            response = self.session.get(f"{BACKEND_URL}/posts")
            
            if response.status_code != 200:
                self.log_test("Test with different user", False, "Could not fetch posts to find other users")
                return False
            
            posts = response.json()
            if not posts or len(posts) == 0:
                self.log_test("Test with different user", False, "No posts found to get other user IDs")
                return False
            
            # Get a different user ID from the first post
            other_user_id = posts[0]['author']['id']
            
            if other_user_id == self.current_user_id:
                # Try to find a different user
                for post in posts:
                    if post['author']['id'] != self.current_user_id:
                        other_user_id = post['author']['id']
                        break
            
            if other_user_id == self.current_user_id:
                self.log_test("Test with different user", True, "Only one user found in system (current user)")
                return True
            
            # Test followers endpoint with different user
            followers_url = f"{BACKEND_URL}/users/{other_user_id}/followers"
            followers_response = self.session.get(followers_url)
            
            # Test following endpoint with different user
            following_url = f"{BACKEND_URL}/users/{other_user_id}/following"
            following_response = self.session.get(following_url)
            
            if followers_response.status_code == 200 and following_response.status_code == 200:
                followers = followers_response.json()
                following = following_response.json()
                
                if isinstance(followers, list) and isinstance(following, list):
                    self.log_test("Test with different user", True, f"Both endpoints work for user {other_user_id}")
                    return True
                else:
                    self.log_test("Test with different user", False, "Responses are not lists")
                    return False
            else:
                self.log_test("Test with different user", False, f"Followers status: {followers_response.status_code}, Following status: {following_response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Test with different user", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all followers and following tests"""
        print("🧪 FOLLOWERS AND FOLLOWING FUNCTIONALITY TESTING")
        print("=" * 60)
        print(f"Backend URL: {BACKEND_URL}")
        print()
        
        # Test 1: Login
        if not self.find_and_login_test_user():
            print("\n❌ Cannot proceed without successful login")
            return False
        
        print()
        
        # Test 2: Followers endpoint
        followers_success = self.test_followers_endpoint()
        
        # Test 3: Following endpoint  
        following_success = self.test_following_endpoint()
        
        # Test 4: Test with different user
        different_user_success = self.test_with_different_user()
        
        print()
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        success_rate = (passed / total) * 100 if total > 0 else 0
        
        print(f"Tests Passed: {passed}/{total} ({success_rate:.1f}%)")
        print()
        
        # Show failed tests
        failed_tests = [result for result in self.test_results if not result["success"]]
        if failed_tests:
            print("❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"   • {test['test']}: {test['details']}")
        else:
            print("✅ ALL TESTS PASSED!")
        
        print()
        
        # Overall assessment
        critical_tests = ["Create and login test user", "GET /api/users/{user_id}/followers", "GET /api/users/{user_id}/following"]
        critical_passed = sum(1 for result in self.test_results if result["test"] in critical_tests and result["success"])
        
        if critical_passed == len(critical_tests):
            print("🎉 FOLLOWERS AND FOLLOWING FUNCTIONALITY: WORKING PERFECTLY")
            return True
        else:
            print("🚨 FOLLOWERS AND FOLLOWING FUNCTIONALITY: CRITICAL ISSUES FOUND")
            return False

def main():
    """Main test execution"""
    tester = FollowersFollowingTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()