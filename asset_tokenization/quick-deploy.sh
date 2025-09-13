#!/bin/bash

# Quick Deploy Script for HumanityToken
# ====================================

echo "🚀 Quick Deploy - HumanityToken Platform"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Kill existing processes
echo -e "${BLUE}🛑 Stopping existing processes...${NC}"
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "node.*index.js" 2>/dev/null || true

# Install backend dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd production-backend
npm install --silent

# Start backend
echo -e "${BLUE}🔧 Starting backend server...${NC}"
node src/index.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo -e "${BLUE}🎨 Starting frontend server...${NC}"
cd ../ui
node server.js &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 2

# Test endpoints
echo -e "${BLUE}🔍 Testing endpoints...${NC}"
if curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${YELLOW}⚠️ Backend may not be ready yet${NC}"
fi

if curl -s http://localhost:3003 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${YELLOW}⚠️ Frontend may not be ready yet${NC}"
fi

echo -e "${GREEN}🎉 HumanityToken Platform is ready!${NC}"
echo -e "${YELLOW}📊 Access your application:${NC}"
echo -e "   🌐 Frontend: http://localhost:3003"
echo -e "   🔧 Backend API: http://localhost:3001"
echo -e "   ❤️ Health Check: http://localhost:3001/health"
echo ""
echo -e "${YELLOW}🔧 To stop the platform:${NC}"
echo -e "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${BLUE}💡 Features:${NC}"
echo -e "   ✅ Real wallet integration (Phantom, MetaMask)"
echo -e "   ✅ Humanity-focused projects"
echo -e "   ✅ Production-ready backend"
echo -e "   ✅ Real-time analytics"
echo -e "   ✅ Deploy-ready configuration"

# Open browser
echo -e "${BLUE}🌐 Opening browser...${NC}"
open http://localhost:3003 2>/dev/null || true
