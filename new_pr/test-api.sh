#!/bin/bash

# Solana Fractional Assets API Test Script
# This script tests all the main API endpoints

BASE_URL="http://localhost:3000"

echo "🚀 Testing Solana Fractional Assets API"
echo "========================================"

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s -X GET "$BASE_URL/health" | jq '.'
echo ""

# Test 2: Create Asset
echo "2. Testing Create Asset..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/assets/create_asset" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Real Estate",
    "symbol": "TRE",
    "totalSupply": 1000000,
    "pricePerToken": 0.01,
    "description": "Test fractional asset for API testing"
  }')

echo "$CREATE_RESPONSE" | jq '.'
ASSET_MINT=$(echo "$CREATE_RESPONSE" | jq -r '.data.assetMint // "mock_asset_mint"')
echo ""

# Test 3: Mint Fraction Tokens
echo "3. Testing Mint Fraction Tokens..."
MINT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/assets/mint_fraction" \
  -H "Content-Type: application/json" \
  -d "{
    \"assetMint\": \"$ASSET_MINT\",
    \"amount\": 1000,
    \"recipient\": \"11111111111111111111111111111111\"
  }")

echo "$MINT_RESPONSE" | jq '.'
echo ""

# Test 4: Buy Fraction Tokens
echo "4. Testing Buy Fraction Tokens..."
BUY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/transactions/buy_fraction" \
  -H "Content-Type: application/json" \
  -d "{
    \"assetMint\": \"$ASSET_MINT\",
    \"amount\": 100,
    \"buyer\": \"11111111111111111111111111111112\",
    \"pricePerToken\": 0.01
  }")

echo "$BUY_RESPONSE" | jq '.'
echo ""

# Test 5: Distribute Revenue
echo "5. Testing Distribute Revenue..."
DISTRIBUTE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/transactions/distribute_revenue" \
  -H "Content-Type: application/json" \
  -d "{
    \"assetMint\": \"$ASSET_MINT\",
    \"totalRevenue\": 1000,
    \"distributionMethod\": \"proportional\"
  }")

echo "$DISTRIBUTE_RESPONSE" | jq '.'
echo ""

# Test 6: Simulate Revenue
echo "6. Testing Simulate Revenue..."
SIMULATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/simulation/simulate_revenue" \
  -H "Content-Type: application/json" \
  -d "{
    \"assetMint\": \"$ASSET_MINT\",
    \"revenueAmount\": 500,
    \"distributionMethod\": \"proportional\"
  }")

echo "$SIMULATE_RESPONSE" | jq '.'
echo ""

# Test 7: Generate Random Revenue
echo "7. Testing Generate Random Revenue..."
RANDOM_RESPONSE=$(curl -s -X POST "$BASE_URL/api/simulation/generate_random_revenue" \
  -H "Content-Type: application/json" \
  -d "{
    \"assetMint\": \"$ASSET_MINT\",
    \"minAmount\": 100,
    \"maxAmount\": 1000
  }")

echo "$RANDOM_RESPONSE" | jq '.'
echo ""

# Test 8: Get Asset Information
echo "8. Testing Get Asset Information..."
curl -s -X GET "$BASE_URL/api/assets/asset/$ASSET_MINT" | jq '.'
echo ""

# Test 9: Get Transaction History
echo "9. Testing Get Transaction History..."
curl -s -X GET "$BASE_URL/api/transactions/history/11111111111111111111111111111111" | jq '.'
echo ""

# Test 10: Get Wallet Balance
echo "10. Testing Get Wallet Balance..."
curl -s -X GET "$BASE_URL/api/transactions/balance/11111111111111111111111111111111" | jq '.'
echo ""

# Test 11: Get Simulation History
echo "11. Testing Get Simulation History..."
curl -s -X GET "$BASE_URL/api/simulation/simulation_history" | jq '.'
echo ""

echo "✅ API Testing Complete!"
echo "Check the logs directory for detailed transaction logs."
