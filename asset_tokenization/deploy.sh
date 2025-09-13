#!/bin/bash

# Production Deployment Script
# ============================

echo "🚀 Starting Asset Tokenization Platform Deployment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd production-backend
npm install --production
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd ../ui
npm install --production
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

echo -e "${BLUE}🗄️ Setting up database...${NC}"
cd ../production-backend
node -e "
const Database = require('./src/database/database');
const db = new Database();
db.init().then(() => {
    console.log('✅ Database initialized successfully');
    process.exit(0);
}).catch(err => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
});
"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database setup failed${NC}"
    exit 1
fi

echo -e "${BLUE}🔧 Creating production configuration...${NC}"
cat > production-backend/.env << EOF
NODE_ENV=production
PORT=3001
DATABASE_URL=./src/database/tokenization.db
CORS_ORIGIN=http://localhost:3003
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WS_URL=wss://api.mainnet-beta.solana.com
EOF

echo -e "${BLUE}🌐 Creating nginx configuration...${NC}"
cat > nginx.conf << EOF
server {
    listen 80;
    server_name localhost;

    # Frontend
    location / {
        proxy_pass http://localhost:3003;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo -e "${BLUE}📋 Creating systemd service files...${NC}"

# Backend service
sudo tee /etc/systemd/system/asset-tokenization-backend.service > /dev/null << EOF
[Unit]
Description=Asset Tokenization Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$(pwd)/production-backend
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Frontend service
sudo tee /etc/systemd/system/asset-tokenization-frontend.service > /dev/null << EOF
[Unit]
Description=Asset Tokenization Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$(pwd)/ui
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=PORT=3003

[Install]
WantedBy=multi-user.target
EOF

echo -e "${BLUE}🔄 Enabling and starting services...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable asset-tokenization-backend
sudo systemctl enable asset-tokenization-frontend
sudo systemctl start asset-tokenization-backend
sudo systemctl start asset-tokenization-frontend

echo -e "${BLUE}🔍 Checking service status...${NC}"
sleep 5

if systemctl is-active --quiet asset-tokenization-backend; then
    echo -e "${GREEN}✅ Backend service is running${NC}"
else
    echo -e "${RED}❌ Backend service failed to start${NC}"
    sudo systemctl status asset-tokenization-backend
fi

if systemctl is-active --quiet asset-tokenization-frontend; then
    echo -e "${GREEN}✅ Frontend service is running${NC}"
else
    echo -e "${RED}❌ Frontend service failed to start${NC}"
    sudo systemctl status asset-tokenization-frontend
fi

echo -e "${BLUE}🌐 Testing endpoints...${NC}"
sleep 3

# Test backend
if curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}✅ Backend API is responding${NC}"
else
    echo -e "${RED}❌ Backend API is not responding${NC}"
fi

# Test frontend
if curl -s http://localhost:3003 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}📊 Access your application:${NC}"
echo -e "   Frontend: http://localhost:3003"
echo -e "   Backend API: http://localhost:3001"
echo -e "   Health Check: http://localhost:3001/health"
echo ""
echo -e "${YELLOW}🔧 Management commands:${NC}"
echo -e "   Check status: sudo systemctl status asset-tokenization-*"
echo -e "   Restart: sudo systemctl restart asset-tokenization-*"
echo -e "   Stop: sudo systemctl stop asset-tokenization-*"
echo -e "   Logs: sudo journalctl -u asset-tokenization-* -f"
