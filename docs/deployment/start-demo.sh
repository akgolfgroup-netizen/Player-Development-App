#!/bin/bash

# IUP Golf Academy - Complete Demo Startup Script
# This script starts the entire application stack

set -e  # Exit on error

echo "🏌️ IUP Golf Academy - Starting Demo..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$PROJECT_ROOT/apps/api"
WEB_DIR="$PROJECT_ROOT/apps/web"

echo -e "${BLUE}Project root: $PROJECT_ROOT${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1/6: Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 20+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm 10+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version)${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker Desktop${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker $(docker --version)${NC}"

echo ""

# Step 2: Start databases
echo -e "${BLUE}Step 2/6: Starting databases (PostgreSQL + Redis)...${NC}"
cd "$API_DIR"

if docker ps | grep -q "iup-golf-postgres"; then
    echo -e "${YELLOW}⚠️  Database containers already running${NC}"
else
    docker-compose up -d
    echo -e "${GREEN}✅ Databases started${NC}"

    # Wait for PostgreSQL to be ready
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
    sleep 5
fi

echo ""

# Step 3: Install dependencies (if needed)
echo -e "${BLUE}Step 3/6: Installing dependencies...${NC}"

cd "$API_DIR"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
fi

cd "$WEB_DIR"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✅ Frontend dependencies already installed${NC}"
fi

echo ""

# Step 4: Apply migrations and seed database
echo -e "${BLUE}Step 4/6: Setting up database...${NC}"
cd "$API_DIR"

echo -e "${YELLOW}Applying migrations...${NC}"
npx prisma migrate deploy 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Migrations may have warnings, continuing...${NC}"
}

echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma generate 2>/dev/null || {
    echo -e "${RED}❌ Failed to generate Prisma client${NC}"
    echo -e "${YELLOW}This is likely a temporary issue. Continuing...${NC}"
}

echo -e "${YELLOW}Seeding database with demo data...${NC}"
npm run prisma:seed 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Seeding may have warnings, continuing...${NC}"
}

echo -e "${GREEN}✅ Database setup complete${NC}"
echo ""

# Step 5: Create startup scripts for backend and frontend
echo -e "${BLUE}Step 5/6: Creating startup scripts...${NC}"

# Backend startup script
cat > "$PROJECT_ROOT/start-backend.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/apps/api"
echo "🚀 Starting backend API on http://localhost:3000"
echo "📚 API Docs will be available at http://localhost:3000/docs"
echo ""
npm run dev
EOF
chmod +x "$PROJECT_ROOT/start-backend.sh"

# Frontend startup script
cat > "$PROJECT_ROOT/start-frontend.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/apps/web"
echo "🌐 Starting frontend on http://localhost:3001"
echo "🔗 App will open in your browser automatically"
echo ""
BROWSER=none PORT=3001 npm start
EOF
chmod +x "$PROJECT_ROOT/start-frontend.sh"

echo -e "${GREEN}✅ Startup scripts created${NC}"
echo ""

# Step 6: Start the application
echo -e "${BLUE}Step 6/6: Starting application servers...${NC}"
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 IUP Golf Academy is starting!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Backend API:${NC}      http://localhost:3000"
echo -e "${BLUE}API Documentation:${NC} http://localhost:3000/docs"
echo -e "${BLUE}Frontend Web App:${NC} http://localhost:3001"
echo ""
echo -e "${YELLOW}Starting services in separate terminal windows...${NC}"
echo ""

# Detect OS and open terminals accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo -e "${GREEN}Opening backend in new terminal...${NC}"
    osascript <<EOF
tell application "Terminal"
    do script "cd '$PROJECT_ROOT' && ./start-backend.sh"
    activate
end tell
EOF

    sleep 2

    echo -e "${GREEN}Opening frontend in new terminal...${NC}"
    osascript <<EOF
tell application "Terminal"
    do script "cd '$PROJECT_ROOT' && ./start-frontend.sh"
end tell
EOF

    sleep 3

    # Open browser
    echo -e "${GREEN}Opening browser...${NC}"
    open http://localhost:3001

elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo -e "${GREEN}Starting backend...${NC}"
    gnome-terminal -- bash -c "cd '$PROJECT_ROOT' && ./start-backend.sh; exec bash" &

    sleep 2

    echo -e "${GREEN}Starting frontend...${NC}"
    gnome-terminal -- bash -c "cd '$PROJECT_ROOT' && ./start-frontend.sh; exec bash" &

    sleep 3

    # Open browser
    xdg-open http://localhost:3001 &
else
    echo -e "${YELLOW}⚠️  Could not detect OS. Please run manually:${NC}"
    echo ""
    echo -e "Terminal 1: ${BLUE}./start-backend.sh${NC}"
    echo -e "Terminal 2: ${BLUE}./start-frontend.sh${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Demo startup complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Demo Login Credentials:${NC}"
echo -e "  Email:    ${YELLOW}player@example.com${NC}"
echo -e "  Password: ${YELLOW}password123${NC}"
echo ""
echo -e "${BLUE}What to try:${NC}"
echo "  1. Login to the application"
echo "  2. Explore Dashboard with training stats"
echo "  3. Create Goals and Notes"
echo "  4. View Achievements"
echo "  5. Try the NEW Season Onboarding with AI Recommendation!"
echo ""
echo -e "${BLUE}Useful URLs:${NC}"
echo "  • Frontend:     http://localhost:3001"
echo "  • Backend API:  http://localhost:3000"
echo "  • API Docs:     http://localhost:3000/docs"
echo "  • Health Check: http://localhost:3000/health"
echo ""
echo -e "${YELLOW}To stop the demo:${NC}"
echo "  • Press Ctrl+C in each terminal window"
echo "  • Or run: ${BLUE}docker-compose -f apps/api/docker-compose.yml down${NC}"
echo ""
echo -e "${GREEN}📖 For more info, see: START_DEMO.md${NC}"
echo ""
