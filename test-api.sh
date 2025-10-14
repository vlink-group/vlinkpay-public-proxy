#!/bin/bash

echo "🔧 VLinkPay Public Proxy API - Quick Test Script"
echo "================================================="

# Kiểm tra xem server có đang chạy không
echo "📡 Testing server endpoints..."

# Test root endpoint
echo -e "\n1. Testing root endpoint:"
curl -s -H "Origin: https://example.com" http://localhost:3000/ | jq '.'

# Test health endpoint
echo -e "\n2. Testing health endpoint:"
curl -s http://localhost:3000/health | jq '.'

# Test API status
echo -e "\n3. Testing API status:"
curl -s http://localhost:3000/api/v1/status | jq '.'

# Test CORS preflight
echo -e "\n4. Testing CORS preflight:"
curl -s -X OPTIONS \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  http://localhost:3000/api/v1/test -i

# Test POST endpoint
echo -e "\n5. Testing POST endpoint with data:"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Origin: https://example.com" \
  -d '{"message": "Hello from test script", "timestamp": "'$(date -Iseconds)'"}' \
  http://localhost:3000/api/v1/test | jq '.'

# Test VLinkExchange market info
echo -e "\n6. Testing VLinkExchange market info:"
curl -s -H "Origin: https://example.com" \
  http://localhost:3000/api/v1/exchange/market/info | jq 'if type == "array" then "Array with \(length) items" else . end'

echo -e "\n✅ Test completed!"