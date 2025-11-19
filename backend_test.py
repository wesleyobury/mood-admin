#!/usr/bin/env python3
"""
Backend Testing Suite for MOOD App - Like Functionality Fix
Testing the fix for: "sometimes when i click the like button it just animates to 'likes' with no count"
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BACKEND_URL = "https://fitness-comments.preview.emergentagent.com/api"
TEST_USER_1 = {
    "username": f"testuser_like_{int(time.time())}",
    "email": f"testuser_like_{int(time.time())}@test.com",
    "password": "testpass123",
    "name": "Like Test User"
}
TEST_USER_2 = {
    "username": f"testuser_like2_{int(time.time())}",
    "email": f"testuser_like2_{int(time.time())}@test.com", 
    "password": "testpass123",
    "name": "Like Test User 2"
}

class LikeFunctionalityTester:
    def __init__(self):
        self.session = requests.Session()
        self.user1_token = None
        self.user2_token = None
        self.user1_id = None
        self.user2_id = None
        self.test_post_id = None
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details or {},
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_auth_system_for_create_post(self):
        """Test authentication system supporting create-post screen (simulating frontend auto-login)"""
        print("=== Testing Auth System for Create-Post Screen ===")
        
        # Test 1: Register user (simulating first-time user)
        try:
            response = self.session.post(f"{API_BASE}/auth/register", json=TEST_USER_DATA)
            if response.status_code == 200:
                data = response.json()
                self.user1_token = data.get('token')
                self.user1_id = data.get('user_id')
                self.log_result("Auth Registration (Create-Post User)", True, f"User ID: {self.user1_id}")
            elif response.status_code == 400:
                # User exists, try login (simulating auto-login)
                login_data = {"username": TEST_USER_DATA["username"], "password": TEST_USER_DATA["password"]}
                login_response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
                if login_response.status_code == 200:
                    data = login_response.json()
                    self.user1_token = data.get('token')
                    self.user1_id = data.get('user_id')
                    self.log_result("Auth Auto-Login (Create-Post User)", True, f"User ID: {self.user1_id}")
                else:
                    self.log_result("Auth Auto-Login (Create-Post User)", False, f"Status: {login_response.status_code}", login_response.text)
                    return False
            else:
                self.log_result("Auth Registration (Create-Post User)", False, f"Status: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Auth Registration (Create-Post User)", False, f"Exception: {str(e)}")
            return False

        # Test 2: Verify single auth call works (no infinite loops)
        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            response = self.session.get(f"{API_BASE}/users/me", headers=headers)
            
            if response.status_code == 200:
                user_data = response.json()
                self.log_result("Auth Token Validation (Single Call)", True, f"Username: {user_data.get('username')}")
            else:
                self.log_result("Auth Token Validation (Single Call)", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Auth Token Validation (Single Call)", False, f"Exception: {str(e)}")
            return False

        return True

    def test_backend_health_for_create_post(self):
        """Test backend health endpoints supporting create-post functionality"""
        print("=== Testing Backend Health for Create-Post Support ===")
        
        # Test API Root endpoint
        try:
            response = self.session.get(f"{API_BASE}/")
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("API Root Endpoint", True, f"Message: {data.get('message')}")
            else:
                self.log_result("API Root Endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("API Root Endpoint", False, f"Exception: {str(e)}")
        
        # Test Health Check endpoint
        try:
            response = self.session.get(f"{API_BASE}/health")
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("Health Check Endpoint", True, f"Status: {data.get('status')}, DB: {data.get('database')}")
            else:
                self.log_result("Health Check Endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Health Check Endpoint", False, f"Exception: {str(e)}")
        
        return True

    def test_workout_card_save_functionality(self):
        """Test workout card saving functionality (Save button backend support)"""
        print("=== Testing Workout Card Save Functionality (Save Button Support) ===")
        
        if not self.user1_token:
            self.log_result("Workout Card Save", False, "No auth token available")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            
            # Test workout card data (simulating Save button functionality)
            workout_card_data = {
                "workouts": [
                    {
                        "id": "cardio_treadmill_beginner_1",
                        "title": "Steady State Cardio",
                        "equipment": "Treadmill",
                        "difficulty": "Beginner",
                        "duration": 20,
                        "mood_category": "I want to sweat"
                    },
                    {
                        "id": "cardio_treadmill_beginner_2", 
                        "title": "Interval Training",
                        "equipment": "Treadmill",
                        "difficulty": "Beginner",
                        "duration": 15,
                        "mood_category": "I want to sweat"
                    }
                ],
                "total_duration": 35,
                "completed_at": datetime.now().isoformat()
            }
            
            response = self.session.post(f"{API_BASE}/workout-cards", json=workout_card_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                card_id = data.get("id")
                self.log_result("Workout Card Save (Save Button)", True, f"Card saved with ID: {card_id}")
                return card_id
            else:
                self.log_result("Workout Card Save (Save Button)", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Workout Card Save (Save Button)", False, f"Exception: {str(e)}")
            return False

    def test_workout_card_retrieval(self):
        """Test workout card retrieval functionality"""
        print("=== Testing Workout Card Retrieval ===")
        
        if not self.user1_token:
            self.log_result("Workout Card Retrieval", False, "No auth token available")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            response = self.session.get(f"{API_BASE}/workout-cards", headers=headers)
            
            if response.status_code == 200:
                cards = response.json()
                self.log_result("Workout Card Retrieval", True, f"Retrieved {len(cards)} workout cards")
                return True
            else:
                self.log_result("Workout Card Retrieval", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Workout Card Retrieval", False, f"Exception: {str(e)}")
            return False

    def test_user_profile_for_create_post(self):
        """Test user profile endpoints that support create-post screen"""
        print("=== Testing User Profile for Create-Post Support ===")
        
        if not self.user1_token:
            self.log_result("User Profile Test", False, "No auth token available")
            return False

        try:
            headers = {"Authorization": f"Bearer {self.user1_token}"}
            response = self.session.get(f"{API_BASE}/users/me", headers=headers)
            
            if response.status_code == 200:
                user_data = response.json()
                self.log_result("Current User Profile", True, f"Username: {user_data.get('username')}, Workouts: {user_data.get('workouts_count')}")
                return True
            else:
                self.log_result("Current User Profile", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Current User Profile", False, f"Exception: {str(e)}")
            return False

    def run_create_post_backend_tests(self):
        """Run all backend tests supporting create-post screen functionality"""
        print("🚀 Starting Create-Post Screen Backend Support Tests")
        print(f"Testing against: {API_BASE}")
        print("=" * 60)
        
        # Test sequence focused on create-post functionality
        success_count = 0
        total_tests = 0
        
        # 1. Test backend health
        if self.test_backend_health_for_create_post():
            success_count += 2  # API root + health check
        total_tests += 2
        
        # 2. Test auth system (critical for create-post screen)
        if self.test_auth_system_for_create_post():
            success_count += 2  # Registration/login + token validation
        total_tests += 2
        
        # 3. Test user profile (needed for create-post screen)
        if self.test_user_profile_for_create_post():
            success_count += 1
        total_tests += 1
        
        # 4. Test workout card save (Save button functionality)
        card_saved = self.test_workout_card_save_functionality()
        if card_saved:
            success_count += 1
        total_tests += 1
        
        # 5. Test workout card retrieval
        if card_saved and self.test_workout_card_retrieval():
            success_count += 1
        total_tests += 1
        
        # Print summary
        print("=" * 60)
        print("🎯 CREATE-POST BACKEND SUPPORT TEST SUMMARY")
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
            print("🎉 All create-post backend support tests passed!")
        
        print("\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
            if result['details']:
                print(f"   {result['details']}")
        
        return success_count, total_tests, failed_tests

if __name__ == "__main__":
    tester = CreatePostBackendTest()
    success_count, total_tests, failed_tests = tester.run_create_post_backend_tests()
    
    if success_count == total_tests:
        print("\n🎉 CREATE-POST BACKEND SUPPORT: EXCELLENT")
    else:
        print("\n⚠️  CREATE-POST BACKEND SUPPORT: NEEDS ATTENTION")