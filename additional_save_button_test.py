#!/usr/bin/env python3
"""
Additional Save Button Backend Testing
Test edge cases and error scenarios for the Save button functionality
"""

import requests
import json
import time
from pathlib import Path
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

class SaveButtonEdgeCaseTest:
    def __init__(self):
        self.session = requests.Session()
        self.token = None
        self.user_id = None
        
    def setup_auth(self):
        """Setup authentication for testing"""
        test_user = {
            "username": f"savebtn_test_{int(time.time())}",
            "email": f"savebtn_{int(time.time())}@test.com",
            "password": "SecurePass123!",
            "name": "Save Button Edge Case Tester"
        }
        
        response = self.session.post(f"{API_BASE}/auth/register", json=test_user)
        if response.status_code == 200:
            data = response.json()
            self.token = data.get('token')
            self.user_id = data.get('user_id')
            return True
        return False
    
    def test_save_button_scenarios(self):
        """Test various Save button scenarios"""
        print("🧪 TESTING SAVE BUTTON EDGE CASES")
        print("=" * 50)
        
        if not self.setup_auth():
            print("❌ Failed to setup authentication")
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Test 1: Valid workout card save (normal case)
        print("Test 1: Valid workout card save")
        valid_data = {
            "workouts": [
                {
                    "id": "test_workout_1",
                    "title": "Test Workout",
                    "equipment": "Bodyweight",
                    "difficulty": "Beginner",
                    "duration": 30,
                    "mood_category": "I want to sweat"
                }
            ],
            "total_duration": 30,
            "completed_at": datetime.now().isoformat()
        }
        
        response = self.session.post(f"{API_BASE}/workout-cards", json=valid_data, headers=headers)
        if response.status_code == 200:
            print("✅ Valid save successful")
        else:
            print(f"❌ Valid save failed: {response.status_code} - {response.text}")
        
        # Test 2: Empty workouts array
        print("\\nTest 2: Empty workouts array")
        empty_data = {
            "workouts": [],
            "total_duration": 0,
            "completed_at": datetime.now().isoformat()
        }
        
        response = self.session.post(f"{API_BASE}/workout-cards", json=empty_data, headers=headers)
        print(f"Status: {response.status_code} - Expected: 422 or 400 (validation error)")
        
        # Test 3: Missing required fields
        print("\\nTest 3: Missing required fields")
        incomplete_data = {
            "workouts": [{"id": "test"}]
            # Missing total_duration and completed_at
        }
        
        response = self.session.post(f"{API_BASE}/workout-cards", json=incomplete_data, headers=headers)
        print(f"Status: {response.status_code} - Expected: 422 (validation error)")
        
        # Test 4: Invalid auth token
        print("\\nTest 4: Invalid auth token")
        invalid_headers = {"Authorization": "Bearer invalid_token"}
        
        response = self.session.post(f"{API_BASE}/workout-cards", json=valid_data, headers=invalid_headers)
        print(f"Status: {response.status_code} - Expected: 401 (unauthorized)")
        
        # Test 5: No auth token
        print("\\nTest 5: No auth token")
        
        response = self.session.post(f"{API_BASE}/workout-cards", json=valid_data)
        print(f"Status: {response.status_code} - Expected: 403 or 401 (unauthorized)")
        
        # Test 6: Large workout card (stress test)
        print("\\nTest 6: Large workout card")
        large_data = {
            "workouts": [
                {
                    "id": f"workout_{i}",
                    "title": f"Workout {i}",
                    "equipment": "Treadmill",
                    "difficulty": "Advanced",
                    "duration": 45,
                    "mood_category": "I want to sweat"
                } for i in range(10)  # 10 workouts
            ],
            "total_duration": 450,
            "completed_at": datetime.now().isoformat()
        }
        
        response = self.session.post(f"{API_BASE}/workout-cards", json=large_data, headers=headers)
        if response.status_code == 200:
            print("✅ Large workout card save successful")
        else:
            print(f"❌ Large workout card save failed: {response.status_code}")

if __name__ == "__main__":
    tester = SaveButtonEdgeCaseTest()
    tester.test_save_button_scenarios()