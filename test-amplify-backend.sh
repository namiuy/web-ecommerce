#!/bin/bash

# Script to test if Amplify can reach the new backend

echo "========================================="
echo "Testing Backend Connectivity from Amplify"
echo "========================================="
echo ""

BACKEND_URL="https://api-ecommerce.nami.com.uy"

echo "1. Testing DNS resolution..."
nslookup api-ecommerce.nami.com.uy
echo ""

echo "2. Testing SSL certificate..."
openssl s_client -connect api-ecommerce.nami.com.uy:443 -servername api-ecommerce.nami.com.uy </dev/null 2>/dev/null | openssl x509 -noout -dates
echo ""

echo "3. Testing /api/brands endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s\n" "${BACKEND_URL}/api/brands"
echo ""

echo "4. Testing /api/products endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s\n" "${BACKEND_URL}/api/products?limit=1"
echo ""

echo "5. Testing /api/stock endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s\n" "${BACKEND_URL}/api/stock?code=STLT235SB&server=lindo4"
echo ""

echo "6. Testing /api/auth/me endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s\n" -X POST "${BACKEND_URL}/api/auth/me" -H "Content-Type: application/json" -H "Authorization: Bearer test"
echo ""

echo "========================================="
echo "If all endpoints return 200/307/401, backend is working correctly"
echo "========================================="
