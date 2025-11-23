#!/usr/bin/env python3
"""
Backend API Testing Script for Database Seeding Verification
Tests the specific endpoints mentioned in the review request to verify seeded data.
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://fitconnect-40.preview.emergentagent.com/api"

# Test users mentioned in the review request
TEST_USERS = ["fitnessguru", "yogalife", "cardioking", "strengthqueen", "hiitmaster"]

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.auth_token = None
        self.test_user_id = None
        
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
        if details and not success:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test basic health endpoints"""
        try:
            # Test API root
            response = self.session.get(f"{BACKEND_URL}/")
            if response.status_code == 200:
                data = response.json()
                self.log_result("API Root Health", True, f"API responding: {data.get('message', 'OK')}")
            else:
                self.log_result("API Root Health", False, f"Status {response.status_code}", {"response": response.text})
                
            # Test health endpoint
            response = self.session.get(f"{BACKEND_URL}/health")
            if response.status_code == 200:
                data = response.json()
                self.log_result("Health Check", True, f"Status: {data.get('status', 'unknown')}")
            else:
                self.log_result("Health Check", False, f"Status {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
    
    def setup_auth(self):
        """Setup authentication for testing"""
        try:
            # Try to register a test user for authentication
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
                self.test_user_id = data.get("user_id")
                self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                self.log_result("Auth Setup", True, "Test user registered and authenticated")
                return True
            else:
                self.log_result("Auth Setup", False, f"Registration failed: {response.status_code}", {"response": response.text})
                return False
                
        except Exception as e:
            self.log_result("Auth Setup", False, f"Auth setup error: {str(e)}")
            return False
    
    def test_posts_endpoint(self):
        """Test GET /api/posts to verify test posts are visible"""
        try:
            response = self.session.get(f"{BACKEND_URL}/posts")
            if response.status_code == 200:
                posts = response.json()
                if isinstance(posts, list):
                    posts_count = len(posts)
                    if posts_count > 0:
                        # Check first post structure
                        first_post = posts[0]
                        required_fields = ['id', 'author', 'caption', 'likes_count', 'comments_count', 'media_urls']
                        missing_fields = [field for field in required_fields if field not in first_post]
                        
                        if not missing_fields:
                            # Check author information
                            author = first_post.get('author', {})
                            author_fields = ['id', 'username']
                            missing_author_fields = [field for field in author_fields if field not in author]
                            
                            if not missing_author_fields:
                                self.log_result("Posts Endpoint", True, 
                                    f"Found {posts_count} posts with proper structure", 
                                    {"sample_post": {
                                        "author": author.get('username'),
                                        "caption": first_post.get('caption', '')[:50] + "...",
                                        "likes_count": first_post.get('likes_count'),
                                        "comments_count": first_post.get('comments_count'),
                                        "media_count": len(first_post.get('media_urls', []))
                                    }})
                                return posts
                            else:
                                self.log_result("Posts Endpoint", False, 
                                    f"Author missing fields: {missing_author_fields}")
                        else:
                            self.log_result("Posts Endpoint", False, 
                                f"Posts missing required fields: {missing_fields}")
                    else:
                        self.log_result("Posts Endpoint", False, "No posts found in feed")
                else:
                    self.log_result("Posts Endpoint", False, "Response is not a list", {"response_type": type(posts)})
            else:
                self.log_result("Posts Endpoint", False, f"Status {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Posts Endpoint", False, f"Request error: {str(e)}")
        
        return []
    
    def test_user_lookup(self):
        """Find test users by username"""
        found_users = {}
        
        # First, try to get all posts and extract unique authors
        try:
            response = self.session.get(f"{BACKEND_URL}/posts?limit=100")
            if response.status_code == 200:
                posts = response.json()
                authors = {}
                for post in posts:
                    author = post.get('author', {})
                    username = author.get('username', '')
                    if username in TEST_USERS:
                        authors[username] = author.get('id')
                
                if authors:
                    self.log_result("Test Users Found", True, 
                        f"Found {len(authors)} test users in posts", 
                        {"users": list(authors.keys())})
                    return authors
                else:
                    self.log_result("Test Users Found", False, 
                        f"None of the expected test users found in posts", 
                        {"expected": TEST_USERS})
            else:
                self.log_result("Test Users Lookup", False, f"Failed to get posts: {response.status_code}")
                
        except Exception as e:
            self.log_result("Test Users Lookup", False, f"Error: {str(e)}")
        
        return {}
    
    def test_user_posts_endpoint(self, user_id, username):
        """Test GET /api/users/{user_id}/posts for a specific user"""
        try:
            response = self.session.get(f"{BACKEND_URL}/users/{user_id}/posts")
            if response.status_code == 200:
                posts = response.json()
                if isinstance(posts, list):
                    posts_count = len(posts)
                    if posts_count > 0:
                        self.log_result(f"User Posts - {username}", True, 
                            f"Found {posts_count} posts for user {username}")
                        return posts
                    else:
                        self.log_result(f"User Posts - {username}", False, 
                            f"No posts found for user {username}")
                else:
                    self.log_result(f"User Posts - {username}", False, 
                        "Response is not a list", {"response_type": type(posts)})
            else:
                self.log_result(f"User Posts - {username}", False, 
                    f"Status {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result(f"User Posts - {username}", False, f"Request error: {str(e)}")
        
        return []
    
    def test_comments_endpoint(self, post_id, post_caption=""):
        """Test GET /api/posts/{post_id}/comments for a post"""
        try:
            response = self.session.get(f"{BACKEND_URL}/posts/{post_id}/comments")
            if response.status_code == 200:
                comments = response.json()
                if isinstance(comments, list):
                    comments_count = len(comments)
                    if comments_count > 0:
                        # Check first comment structure
                        first_comment = comments[0]
                        required_fields = ['id', 'text', 'author']
                        missing_fields = [field for field in required_fields if field not in first_comment]
                        
                        if not missing_fields:
                            author = first_comment.get('author', {})
                            self.log_result("Comments Endpoint", True, 
                                f"Found {comments_count} comments for post", 
                                {"post_caption": post_caption[:30] + "...",
                                 "sample_comment": {
                                     "author": author.get('username', 'unknown'),
                                     "text": first_comment.get('text', '')[:50] + "..."
                                 }})
                            return comments
                        else:
                            self.log_result("Comments Endpoint", False, 
                                f"Comments missing required fields: {missing_fields}")
                    else:
                        self.log_result("Comments Endpoint", True, 
                            f"No comments found for post (this is acceptable)")
                        return []
                else:
                    self.log_result("Comments Endpoint", False, 
                        "Response is not a list", {"response_type": type(comments)})
            else:
                self.log_result("Comments Endpoint", False, 
                    f"Status {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result("Comments Endpoint", False, f"Request error: {str(e)}")
        
        return []
    
    def test_user_profile_endpoint(self, user_id, username):
        """Test GET /api/users/{user_id} for user profile"""
        try:
            response = self.session.get(f"{BACKEND_URL}/users/{user_id}")
            if response.status_code == 200:
                user = response.json()
                required_fields = ['id', 'username', 'email', 'followers_count', 'following_count', 'workouts_count']
                missing_fields = [field for field in required_fields if field not in user]
                
                if not missing_fields:
                    self.log_result(f"User Profile - {username}", True, 
                        f"Profile data complete for {username}", 
                        {"profile": {
                            "username": user.get('username'),
                            "name": user.get('name', ''),
                            "bio": user.get('bio', '')[:50] + "..." if user.get('bio') else '',
                            "followers_count": user.get('followers_count'),
                            "following_count": user.get('following_count'),
                            "workouts_count": user.get('workouts_count')
                        }})
                    return user
                else:
                    self.log_result(f"User Profile - {username}", False, 
                        f"Profile missing required fields: {missing_fields}")
            else:
                self.log_result(f"User Profile - {username}", False, 
                    f"Status {response.status_code}", {"response": response.text})
                
        except Exception as e:
            self.log_result(f"User Profile - {username}", False, f"Request error: {str(e)}")
        
        return None
    
    def run_seeding_verification_tests(self):
        """Run all database seeding verification tests"""
        print("🧪 STARTING DATABASE SEEDING VERIFICATION TESTS")
        print("=" * 60)
        
        # 1. Health check
        self.test_health_check()
        
        # 2. Setup authentication
        if not self.setup_auth():
            print("❌ Cannot proceed without authentication")
            return
        
        # 3. Test posts endpoint
        posts = self.test_posts_endpoint()
        
        # 4. Find test users
        test_users = self.test_user_lookup()
        
        # 5. Test user posts endpoints
        if test_users:
            for username, user_id in test_users.items():
                self.test_user_posts_endpoint(user_id, username)
        
        # 6. Test comments endpoint (use first post if available)
        if posts:
            first_post = posts[0]
            post_id = first_post.get('id')
            post_caption = first_post.get('caption', '')
            if post_id:
                self.test_comments_endpoint(post_id, post_caption)
        
        # 7. Test user profile endpoints
        if test_users:
            for username, user_id in test_users.items():
                self.test_user_profile_endpoint(user_id, username)
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("🏁 DATABASE SEEDING VERIFICATION SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if "✅ PASS" in result["status"])
        failed = sum(1 for result in self.test_results if "❌ FAIL" in result["status"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed} ✅")
        print(f"Failed: {failed} ❌")
        print(f"Success Rate: {(passed/total*100):.1f}%" if total > 0 else "0%")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if "❌ FAIL" in result["status"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n📊 DETAILED RESULTS:")
        for result in self.test_results:
            print(f"  {result['status']}: {result['test']}")

if __name__ == "__main__":
    tester = BackendTester()
    tester.run_seeding_verification_tests()