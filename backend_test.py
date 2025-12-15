#!/usr/bin/env python3
"""
Backend Testing Suite for Time-Series Analytics Feature
Testing comprehensive analytics endpoints for admin dashboard
"""

import requests
import json
import sys
from datetime import datetime
import os

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://fitness-app-dash.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

class AnalyticsTestSuite:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        self.admin_credentials = {
            "username": "wesleyogsbury@gmail.com",
            "password": "password123"
        }
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response": response_data
        })
        
    def authenticate_admin(self):
        """Authenticate with admin credentials"""
        print("\n🔐 AUTHENTICATING ADMIN USER...")
        
        try:
            response = self.session.post(
                f"{API_BASE}/auth/login",
                json=self.admin_credentials,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get('token')
                if self.auth_token:
                    self.session.headers.update({
                        'Authorization': f'Bearer {self.auth_token}'
                    })
                    self.log_test("Admin Authentication", True, f"Logged in as {self.admin_credentials['username']}")
                    return True
                else:
                    self.log_test("Admin Authentication", False, "No token in response", data)
                    return False
            else:
                self.log_test("Admin Authentication", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Admin Authentication", False, f"Exception: {str(e)}")
            return False
    
    def test_time_series_endpoint(self, metric_type, period="day", limit=30):
        """Test time-series analytics endpoint"""
        test_name = f"Time-Series: {metric_type} ({period})"
        
        try:
            url = f"{API_BASE}/analytics/admin/time-series/{metric_type}"
            params = {"period": period, "limit": limit}
            
            response = self.session.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify response structure
                required_fields = ["metric_type", "period", "labels", "values", "secondary_values", "total", "average"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test(test_name, False, f"Missing fields: {missing_fields}", data)
                    return False
                
                # Verify data types
                if not isinstance(data["labels"], list):
                    self.log_test(test_name, False, "Labels should be a list", data)
                    return False
                    
                if not isinstance(data["values"], list):
                    self.log_test(test_name, False, "Values should be a list", data)
                    return False
                
                if len(data["labels"]) != len(data["values"]):
                    self.log_test(test_name, False, "Labels and values length mismatch", data)
                    return False
                
                # Verify metric_type matches
                if data["metric_type"] != metric_type:
                    self.log_test(test_name, False, f"Metric type mismatch: expected {metric_type}, got {data['metric_type']}", data)
                    return False
                
                # Verify period matches
                if data["period"] != period:
                    self.log_test(test_name, False, f"Period mismatch: expected {period}, got {data['period']}", data)
                    return False
                
                self.log_test(test_name, True, f"Total: {data['total']}, Average: {data['average']}, Data points: {len(data['labels'])}")
                return True
                
            else:
                self.log_test(test_name, False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
            return False
    
    def test_breakdown_endpoint(self, metric_type, days=30):
        """Test breakdown analytics endpoint"""
        test_name = f"Breakdown: {metric_type}"
        
        try:
            url = f"{API_BASE}/analytics/admin/breakdown/{metric_type}"
            params = {"days": days}
            
            response = self.session.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify response structure
                required_fields = ["metric_type", "items", "total"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test(test_name, False, f"Missing fields: {missing_fields}", data)
                    return False
                
                # Verify data types
                if not isinstance(data["items"], list):
                    self.log_test(test_name, False, "Items should be a list", data)
                    return False
                
                # Verify item structure
                for item in data["items"]:
                    if not isinstance(item, dict) or "name" not in item or "count" not in item:
                        self.log_test(test_name, False, "Invalid item structure", data)
                        return False
                
                # Verify metric_type matches
                if data["metric_type"] != metric_type:
                    self.log_test(test_name, False, f"Metric type mismatch: expected {metric_type}, got {data['metric_type']}", data)
                    return False
                
                self.log_test(test_name, True, f"Total: {data['total']}, Items: {len(data['items'])}")
                return True
                
            else:
                self.log_test(test_name, False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
            return False
    
    def test_authentication_required(self):
        """Test that endpoints require authentication"""
        print("\n🔒 TESTING AUTHENTICATION REQUIREMENTS...")
        
        # Remove auth header temporarily
        original_headers = self.session.headers.copy()
        if 'Authorization' in self.session.headers:
            del self.session.headers['Authorization']
        
        try:
            # Test time-series endpoint without auth
            response = self.session.get(f"{API_BASE}/analytics/admin/time-series/active_users", timeout=10)
            
            if response.status_code in [401, 403]:
                self.log_test("Authentication Required - Time Series", True, f"Correctly blocked with status {response.status_code}")
                auth_required = True
            else:
                self.log_test("Authentication Required - Time Series", False, f"Should require auth but got status {response.status_code}")
                auth_required = False
            
            # Test breakdown endpoint without auth
            response = self.session.get(f"{API_BASE}/analytics/admin/breakdown/screen_views", timeout=10)
            
            if response.status_code in [401, 403]:
                self.log_test("Authentication Required - Breakdown", True, f"Correctly blocked with status {response.status_code}")
                auth_required = auth_required and True
            else:
                self.log_test("Authentication Required - Breakdown", False, f"Should require auth but got status {response.status_code}")
                auth_required = False
                
        except Exception as e:
            self.log_test("Authentication Required", False, f"Exception: {str(e)}")
            auth_required = False
        finally:
            # Restore auth headers
            self.session.headers.update(original_headers)
        
        return auth_required
    
    def test_error_handling(self):
        """Test error handling for invalid inputs"""
        print("\n🚨 TESTING ERROR HANDLING...")
        
        # Test invalid metric type
        try:
            response = self.session.get(f"{API_BASE}/analytics/admin/time-series/invalid_metric", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                # Should return empty data gracefully
                if data.get("total", 0) == 0 and len(data.get("values", [])) == 0:
                    self.log_test("Error Handling - Invalid Metric", True, "Returns empty data gracefully")
                else:
                    self.log_test("Error Handling - Invalid Metric", False, "Should return empty data", data)
            else:
                self.log_test("Error Handling - Invalid Metric", False, f"Unexpected status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Invalid Metric", False, f"Exception: {str(e)}")
    
    def run_comprehensive_tests(self):
        """Run all analytics tests"""
        print("🧪 STARTING TIME-SERIES ANALYTICS COMPREHENSIVE TESTING")
        print("=" * 60)
        
        # Authenticate first
        if not self.authenticate_admin():
            print("❌ CRITICAL: Authentication failed. Cannot proceed with tests.")
            return False
        
        # Test authentication requirements
        self.test_authentication_required()
        
        # Test all time-series metrics
        print("\n📊 TESTING TIME-SERIES ENDPOINTS...")
        time_series_metrics = [
            "active_users",
            "new_users", 
            "app_sessions",
            "screen_views",
            "workouts_started",
            "workouts_completed",
            "mood_selections",
            "posts_created",
            "social_interactions"
        ]
        
        time_series_success = 0
        for metric in time_series_metrics:
            if self.test_time_series_endpoint(metric):
                time_series_success += 1
        
        # Test different periods
        print("\n📅 TESTING DIFFERENT PERIODS...")
        periods = ["day", "week", "month"]
        period_success = 0
        for period in periods:
            if self.test_time_series_endpoint("active_users", period):
                period_success += 1
        
        # Test breakdown endpoints
        print("\n🔍 TESTING BREAKDOWN ENDPOINTS...")
        breakdown_metrics = [
            "screen_views",
            "mood_selections", 
            "social_interactions"
        ]
        
        breakdown_success = 0
        for metric in breakdown_metrics:
            if self.test_breakdown_endpoint(metric):
                breakdown_success += 1
        
        # Test error handling
        self.test_error_handling()
        
        # Calculate overall results
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        print(f"\n📊 Time-Series Metrics: {time_series_success}/{len(time_series_metrics)} working")
        print(f"📅 Period Variations: {period_success}/{len(periods)} working")
        print(f"🔍 Breakdown Metrics: {breakdown_success}/{len(breakdown_metrics)} working")
        
        # Detailed failure analysis
        failed_tests = [result for result in self.test_results if not result["success"]]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"   • {test['test']}: {test['details']}")
        
        return success_rate >= 80  # Consider 80%+ as success

def main():
    """Main test execution"""
    tester = AnalyticsTestSuite()
    success = tester.run_comprehensive_tests()
    
    if success:
        print("\n🎉 TIME-SERIES ANALYTICS TESTING COMPLETED SUCCESSFULLY!")
        sys.exit(0)
    else:
        print("\n💥 TIME-SERIES ANALYTICS TESTING FAILED!")
        sys.exit(1)

if __name__ == "__main__":
    main()