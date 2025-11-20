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
BACKEND_URL = "https://tapname.preview.emergentagent.com/api"
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
    
    def setup_test_users(self):
        """Create test users and get authentication tokens"""
        print("\n🔧 Setting up test users...")
        
        # Register User 1
        try:
            response = self.session.post(f"{BACKEND_URL}/auth/register", json=TEST_USER_1)
            if response.status_code == 200:
                data = response.json()
                self.user1_token = data["token"]
                self.user1_id = data["user_id"]
                self.log_result("User 1 Registration", True, "Test user 1 created successfully")
            else:
                self.log_result("User 1 Registration", False, f"Failed to create user 1: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("User 1 Registration", False, f"Exception creating user 1: {str(e)}")
            return False
        
        # Register User 2
        try:
            response = self.session.post(f"{BACKEND_URL}/auth/register", json=TEST_USER_2)
            if response.status_code == 200:
                data = response.json()
                self.user2_token = data["token"]
                self.user2_id = data["user_id"]
                self.log_result("User 2 Registration", True, "Test user 2 created successfully")
            else:
                self.log_result("User 2 Registration", False, f"Failed to create user 2: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("User 2 Registration", False, f"Exception creating user 2: {str(e)}")
            return False
        
        return True
    
    def create_test_post(self):
        """Create a test post for like testing"""
        print("\n📝 Creating test post...")
        
        headers = {"Authorization": f"Bearer {self.user1_token}"}
        post_data = {
            "caption": "Test post for like functionality testing 🏋️‍♂️ #fitness #test",
            "media_urls": [],
            "hashtags": ["fitness", "test"]
        }
        
        try:
            response = self.session.post(f"{BACKEND_URL}/posts", json=post_data, headers=headers)
            if response.status_code == 200:
                data = response.json()
                self.test_post_id = data["id"]
                self.log_result("Test Post Creation", True, f"Test post created with ID: {self.test_post_id}")
                return True
            else:
                self.log_result("Test Post Creation", False, f"Failed to create test post: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log_result("Test Post Creation", False, f"Exception creating test post: {str(e)}")
            return False
    
    def test_like_endpoint_response_format(self):
        """Test that like endpoint returns correct response format"""
        print("\n🧪 Testing like endpoint response format...")
        
        headers = {"Authorization": f"Bearer {self.user2_token}"}
        
        try:
            # First like
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ["liked", "likes_count", "message"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Verify data types and values
                    if (isinstance(data["liked"], bool) and 
                        isinstance(data["likes_count"], int) and 
                        isinstance(data["message"], str) and
                        data["liked"] == True and
                        data["likes_count"] >= 1):
                        
                        self.log_result("Like Response Format", True, 
                                      "Response contains all required fields with correct types",
                                      {"response": data})
                        return True
                    else:
                        self.log_result("Like Response Format", False,
                                      "Response fields have incorrect types or values",
                                      {"response": data})
                        return False
                else:
                    self.log_result("Like Response Format", False,
                                  f"Missing required fields: {missing_fields}",
                                  {"response": data})
                    return False
            else:
                self.log_result("Like Response Format", False,
                              f"Like request failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Like Response Format", False, f"Exception testing like response: {str(e)}")
            return False
    
    def test_unlike_endpoint_response_format(self):
        """Test that unlike endpoint returns correct response format"""
        print("\n🧪 Testing unlike endpoint response format...")
        
        headers = {"Authorization": f"Bearer {self.user2_token}"}
        
        try:
            # Unlike (should already be liked from previous test)
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ["liked", "likes_count", "message"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Verify data types and values
                    if (isinstance(data["liked"], bool) and 
                        isinstance(data["likes_count"], int) and 
                        isinstance(data["message"], str) and
                        data["liked"] == False and
                        data["likes_count"] >= 0):
                        
                        self.log_result("Unlike Response Format", True,
                                      "Unlike response contains all required fields with correct types",
                                      {"response": data})
                        return True
                    else:
                        self.log_result("Unlike Response Format", False,
                                      "Unlike response fields have incorrect types or values",
                                      {"response": data})
                        return False
                else:
                    self.log_result("Unlike Response Format", False,
                                  f"Missing required fields in unlike response: {missing_fields}",
                                  {"response": data})
                    return False
            else:
                self.log_result("Unlike Response Format", False,
                              f"Unlike request failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Unlike Response Format", False, f"Exception testing unlike response: {str(e)}")
            return False
    
    def test_likes_count_accuracy(self):
        """Test that likes_count increments and decrements correctly"""
        print("\n🧪 Testing likes count accuracy...")
        
        headers = {"Authorization": f"Bearer {self.user2_token}"}
        
        try:
            # Start fresh - unlike if currently liked
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            if response.status_code == 200 and response.json().get("liked") == True:
                # Unlike to start from 0
                self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            
            # Test sequence: like -> unlike -> like
            expected_counts = []
            actual_counts = []
            
            # Like (should increment)
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            if response.status_code == 200:
                data = response.json()
                actual_counts.append(data.get("likes_count", -1))
                expected_counts.append(1)
            
            # Unlike (should decrement)
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            if response.status_code == 200:
                data = response.json()
                actual_counts.append(data.get("likes_count", -1))
                expected_counts.append(0)
            
            # Like again (should increment)
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            if response.status_code == 200:
                data = response.json()
                actual_counts.append(data.get("likes_count", -1))
                expected_counts.append(1)
            
            # Verify accuracy
            if actual_counts == expected_counts:
                self.log_result("Likes Count Accuracy", True,
                              "Likes count increments and decrements correctly",
                              {"expected": expected_counts, "actual": actual_counts})
                return True
            else:
                self.log_result("Likes Count Accuracy", False,
                              "Likes count not accurate",
                              {"expected": expected_counts, "actual": actual_counts})
                return False
                
        except Exception as e:
            self.log_result("Likes Count Accuracy", False, f"Exception testing likes count accuracy: {str(e)}")
            return False
    
    def test_multiple_like_unlike_cycles(self):
        """Test multiple like/unlike cycles (5 times)"""
        print("\n🧪 Testing multiple like/unlike cycles...")
        
        headers = {"Authorization": f"Bearer {self.user2_token}"}
        
        try:
            # Start from unliked state
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            if response.status_code == 200 and response.json().get("liked") == True:
                # Unlike to start fresh
                self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            
            cycle_results = []
            
            for cycle in range(5):
                # Like
                like_response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
                if like_response.status_code != 200:
                    self.log_result("Multiple Cycles", False, f"Like failed in cycle {cycle + 1}")
                    return False
                
                like_data = like_response.json()
                
                # Unlike
                unlike_response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
                if unlike_response.status_code != 200:
                    self.log_result("Multiple Cycles", False, f"Unlike failed in cycle {cycle + 1}")
                    return False
                
                unlike_data = unlike_response.json()
                
                cycle_results.append({
                    "cycle": cycle + 1,
                    "like_count": like_data.get("likes_count"),
                    "unlike_count": unlike_data.get("likes_count"),
                    "like_status": like_data.get("liked"),
                    "unlike_status": unlike_data.get("liked")
                })
            
            # Verify all cycles worked correctly
            all_cycles_passed = True
            for result in cycle_results:
                if (result["like_count"] != 1 or result["unlike_count"] != 0 or
                    result["like_status"] != True or result["unlike_status"] != False):
                    all_cycles_passed = False
                    break
            
            if all_cycles_passed:
                self.log_result("Multiple Like/Unlike Cycles", True,
                              "All 5 like/unlike cycles completed successfully",
                              {"cycles": cycle_results})
                return True
            else:
                self.log_result("Multiple Like/Unlike Cycles", False,
                              "Some cycles failed",
                              {"cycles": cycle_results})
                return False
                
        except Exception as e:
            self.log_result("Multiple Like/Unlike Cycles", False, f"Exception during multiple cycles: {str(e)}")
            return False
    
    def test_edge_cases(self):
        """Test edge cases: post with 0 likes, negative counts, etc."""
        print("\n🧪 Testing edge cases...")
        
        headers = {"Authorization": f"Bearer {self.user2_token}"}
        
        try:
            # Ensure post starts with 0 likes
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            if response.status_code == 200 and response.json().get("liked") == True:
                # Unlike to get to 0
                self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            
            # Test 1: Post with 0 likes
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("likes_count") == 1 and data.get("liked") == True:
                    self.log_result("Edge Case - Zero Likes", True,
                                  "Post with 0 likes handles like correctly",
                                  {"response": data})
                else:
                    self.log_result("Edge Case - Zero Likes", False,
                                  "Post with 0 likes doesn't handle like correctly",
                                  {"response": data})
                    return False
            
            # Test 2: Verify count never goes negative
            # Unlike the post
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("likes_count") == 0 and data.get("liked") == False:
                    self.log_result("Edge Case - Non-negative Count", True,
                                  "Count correctly stays at 0 when unliking",
                                  {"response": data})
                else:
                    self.log_result("Edge Case - Non-negative Count", False,
                                  "Count went negative or incorrect",
                                  {"response": data})
                    return False
            
            # Test 3: Try to like when already at 0 (should go to 1)
            response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("likes_count") == 1 and data.get("liked") == True:
                    self.log_result("Edge Case - Toggle from Zero", True,
                                  "Toggling from 0 likes works correctly",
                                  {"response": data})
                    return True
                else:
                    self.log_result("Edge Case - Toggle from Zero", False,
                                  "Toggling from 0 likes failed",
                                  {"response": data})
                    return False
            
        except Exception as e:
            self.log_result("Edge Cases", False, f"Exception during edge case testing: {str(e)}")
            return False
    
    def test_likes_count_always_present(self):
        """Test that likes_count is always present in response (never undefined/null)"""
        print("\n🧪 Testing likes_count always present...")
        
        headers = {"Authorization": f"Bearer {self.user2_token}"}
        
        try:
            # Test multiple operations to ensure likes_count is always present
            operations = []
            
            for i in range(3):
                # Like
                response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    operations.append({
                        "operation": "like",
                        "has_likes_count": "likes_count" in data,
                        "likes_count_value": data.get("likes_count"),
                        "is_number": isinstance(data.get("likes_count"), int)
                    })
                
                # Unlike
                response = self.session.post(f"{BACKEND_URL}/posts/{self.test_post_id}/like", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    operations.append({
                        "operation": "unlike",
                        "has_likes_count": "likes_count" in data,
                        "likes_count_value": data.get("likes_count"),
                        "is_number": isinstance(data.get("likes_count"), int)
                    })
            
            # Check all operations had likes_count present and as number
            all_present = all(op["has_likes_count"] and op["is_number"] for op in operations)
            
            if all_present:
                self.log_result("Likes Count Always Present", True,
                              "likes_count field always present and is a number",
                              {"operations": operations})
                return True
            else:
                self.log_result("Likes Count Always Present", False,
                              "likes_count field missing or not a number in some responses",
                              {"operations": operations})
                return False
                
        except Exception as e:
            self.log_result("Likes Count Always Present", False, f"Exception testing likes_count presence: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all like functionality tests"""
        print("🚀 Starting Like Functionality Testing Suite")
        print("=" * 60)
        
        # Setup
        if not self.setup_test_users():
            print("❌ Failed to setup test users. Aborting tests.")
            return False
        
        if not self.create_test_post():
            print("❌ Failed to create test post. Aborting tests.")
            return False
        
        # Run tests
        tests = [
            self.test_like_endpoint_response_format,
            self.test_unlike_endpoint_response_format,
            self.test_likes_count_accuracy,
            self.test_multiple_like_unlike_cycles,
            self.test_edge_cases,
            self.test_likes_count_always_present
        ]
        
        passed_tests = 0
        total_tests = len(tests)
        
        for test in tests:
            if test():
                passed_tests += 1
        
        # Summary
        print("\n" + "=" * 60)
        print("🏁 LIKE FUNCTIONALITY TEST SUMMARY")
        print("=" * 60)
        
        success_rate = (passed_tests / total_tests) * 100
        print(f"Tests Passed: {passed_tests}/{total_tests} ({success_rate:.1f}%)")
        
        if passed_tests == total_tests:
            print("🎉 ALL TESTS PASSED - Like functionality fix is working correctly!")
            return True
        else:
            print(f"⚠️  {total_tests - passed_tests} tests failed - Like functionality needs attention")
            return False

def main():
    """Main test execution"""
    tester = LikeFunctionalityTester()
    success = tester.run_all_tests()
    
    # Print detailed results
    print("\n📋 DETAILED TEST RESULTS:")
    print("-" * 40)
    for result in tester.test_results:
        print(f"{result['status']}: {result['test']}")
        print(f"   {result['message']}")
        if result['details']:
            print(f"   Details: {json.dumps(result['details'], indent=2)}")
        print()
    
    return success

if __name__ == "__main__":
    main()