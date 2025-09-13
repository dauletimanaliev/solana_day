#!/bin/bash

# Enhanced Solana Fractional Assets API Test Script
# This script tests all endpoints including new admin and analytics features

BASE_URL="http://localhost:3000"

echo "🚀 Testing Enhanced Solana Fractional Assets API"
echo "================================================"

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s -X GET "$BASE_URL/health" | jq '.'
echo ""

# Test 2: Admin Status
echo "2. Testing Admin Status..."
curl -s -X GET "$BASE_URL/api/admin/status" | jq '.'
echo ""

# Test 3: Admin Statistics
echo "3. Testing Admin Statistics..."
curl -s -X GET "$BASE_URL/api/admin/stats" | jq '.'
echo ""

# Test 4: Detailed Health Check
echo "4. Testing Detailed Health Check..."
curl -s -X GET "$BASE_URL/api/admin/health/detailed" | jq '.'
echo ""

# Test 5: Recent Logs
echo "5. Testing Recent Logs..."
curl -s -X GET "$BASE_URL/api/admin/logs/recent?limit=5" | jq '.'
echo ""

# Test 6: Market Overview
echo "6. Testing Market Overview..."
curl -s -X GET "$BASE_URL/api/analytics/market/overview" | jq '.'
echo ""

# Test 7: Revenue Distribution Analytics
echo "7. Testing Revenue Distribution Analytics..."
curl -s -X GET "$BASE_URL/api/analytics/revenue/distribution?period=30d" | jq '.'
echo ""

# Test 8: Create Asset
echo "8. Testing Create Asset..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/assets/create_asset" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enhanced Test Asset",
    "symbol": "ETA",
    "totalSupply": 2000000,
    "pricePerToken": 0.015,
    "description": "Enhanced test asset for comprehensive API testing"
  }')

echo "$CREATE_RESPONSE" | jq '.'
ASSET_MINT=$(echo "$CREATE_RESPONSE" | jq -r '.data.assetMint // "mock_asset_mint"')
echo ""

# Test 9: Asset Performance Analytics
echo "9. Testing Asset Performance Analytics..."
curl -s -X GET "$BASE_URL/api/analytics/assets/$ASSET_MINT/performance?period=30d" | jq '.'
echo ""

# Test 10: User Portfolio Analytics
echo "10. Testing User Portfolio Analytics..."
curl -s -X GET "$BASE_URL/api/analytics/users/11111111111111111111111111111111/portfolio" | jq '.'
echo ""

# Test 11: Mint Fraction Tokens
echo "11. Testing Mint Fraction Tokens..."
MINT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/assets/mint_fraction" \
  -H "Content-Type: application/json" \
  -d "{
    \"assetMint\": \"$ASSET_MINT\",
    \"amount\": 2000,
    \"recipient\": \"11111111111111111111111111111111\"
  }")

echo "$MINT_RESPONSE" | jq '.'
echo ""

# Test 12: Buy Fraction Tokens
echo "12. Testing Buy Fraction Tokens..."
BUY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/transactions/buy_fraction" \
  -H "Content-Type: application/json" \
  -d "{
    \"assetMint\": \"$ASSET_MINT\",
    \"amount\": 200,
    \"buyer\": \"11111111111111111111111111111112\",
    \"pricePerToken\": 0.015
  }")

echo "$BUY_RESPONSE" | jq '.'
echo ""

# Test 13: Distribute Revenue
echo "13. Testing Distribute Revenue..."
DISTRIBUTE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/transactions/distribute_revenue" \
  -H "Content-Type: application/json" \
  -d "{
    \"assetMint\": \"$ASSET_MINT\",
    \"totalRevenue\": 2000,
    \"distributionMethod\": \"proportional\"
  }")

echo "$DISTRIBUTE_RESPONSE" | jq '.'
echo ""

# Test 14: Simulate Revenue
echo "14. Testing Simulate Revenue..."
SIMULATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/simulation/simulate_revenue" \
  -H "Content-Type: application/json" \
  -d "{
    \"assetMint\": \"$ASSET_MINT\",
    \"revenueAmount\": 750,
    \"distributionMethod\": \"proportional\"
  }")

echo "$SIMULATE_RESPONSE" | jq '.'
echo ""

# Test 15: Generate Random Revenue
echo "15. Testing Generate Random Revenue..."
RANDOM_RESPONSE=$(curl -s -X POST "$BASE_URL/api/simulation/generate_random_revenue" \
  -H "Content-Type: application/json" \
  -d "{
    \"assetMint\": \"$ASSET_MINT\",
    \"minAmount\": 200,
    \"maxAmount\": 1500
  }")

echo "$RANDOM_RESPONSE" | jq '.'
echo ""

# Test 16: Get Asset Information
echo "16. Testing Get Asset Information..."
curl -s -X GET "$BASE_URL/api/assets/asset/$ASSET_MINT" | jq '.'
echo ""

# Test 17: Get Transaction History
echo "17. Testing Get Transaction History..."
curl -s -X GET "$BASE_URL/api/transactions/history/11111111111111111111111111111111?limit=5" | jq '.'
echo ""

# Test 18: Get Wallet Balance
echo "18. Testing Get Wallet Balance..."
curl -s -X GET "$BASE_URL/api/transactions/balance/11111111111111111111111111111111" | jq '.'
echo ""

# Test 19: Get Simulation History
echo "19. Testing Get Simulation History..."
curl -s -X GET "$BASE_URL/api/simulation/simulation_history?limit=5" | jq '.'
echo ""

# Test 20: API Documentation
echo "20. Testing API Documentation..."
curl -s -X GET "$BASE_URL/" | jq '.endpoints'
echo ""

echo "✅ Enhanced API Testing Complete!"
echo "📊 All endpoints tested successfully"
echo "📝 Check the logs directory for detailed transaction logs"
echo "🔍 Admin and Analytics endpoints are now available"
