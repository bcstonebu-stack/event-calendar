#!/bin/bash

echo "=========================================="
echo "🚀 Event Calendar Deployment Script"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/engine/install/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Function to generate random password
generate_password() {
    # Try openssl first, fall back to other methods
    if command -v openssl &> /dev/null; then
        openssl rand -base64 24 | tr -d "=+/" | cut -c1-24
    elif command -v /dev/urandom &> /dev/null; then
        cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 24 | head -n 1
    else
        # Fallback to date-based random
        date +%s | sha256sum | base64 | head -c 24
    fi
}

# Prompt for deployment type
echo "📍 How will users access this calendar?"
echo ""
echo "1) Domain name (e.g., calendar.mysite.com)"
echo "2) IP address (e.g., 192.168.1.100 or 100.86.36.51)"
echo "3) Localhost only (default - for testing)"
echo ""
read -p "Enter your choice (1/2/3) [3]: " choice
choice=${choice:-3}

case $choice in
    1)
        read -p "Enter your domain name (e.g., calendar.mysite.com): " domain
        if [ -z "$domain" ]; then
            echo "❌ Domain name cannot be empty!"
            exit 1
        fi
        API_URL="http://${domain}:3001/api"
        FRONTEND_URL="http://${domain}"
        ;;
    2)
        read -p "Enter your server IP address (e.g., 100.86.36.51): " ip
        if [ -z "$ip" ]; then
            echo "❌ IP address cannot be empty!"
            exit 1
        fi
        API_URL="http://${ip}:3001/api"
        FRONTEND_URL="http://${ip}"
        ;;
    3)
        API_URL="http://localhost:3001/api"
        FRONTEND_URL="http://localhost"
        ;;
    *)
        echo "❌ Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "📝 Configuration:"
echo "   Frontend URL: $FRONTEND_URL"
echo "   API URL: $API_URL"
echo ""

# Ask about password
read -p "Generate secure random password? (Y/n) [Y]: " gen_password
gen_password=${gen_password:-Y}

if [[ $gen_password =~ ^[Yy]$ ]]; then
    POSTGRES_PASSWORD=$(generate_password)
    echo "✅ Generated secure password"
else
    read -p "Enter database password [calendar_password]: " custom_password
    POSTGRES_PASSWORD=${custom_password:-calendar_password}
fi

echo ""
echo "🔧 Creating configuration files..."

# Create .env file
if [ -f .env ]; then
    read -p "⚠️  .env file already exists. Overwrite? (y/N) [N]: " overwrite
    overwrite=${overwrite:-N}
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo "Using existing .env file..."
    else
        cp .env.example .env
    fi
else
    cp .env.example .env
fi

# Update .env with user's settings
sed -i.bak "s|VITE_API_URL=.*|VITE_API_URL=$API_URL|g" .env
sed -i.bak "s|POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$POSTGRES_PASSWORD|g" .env
rm -f .env.bak

echo "✅ Frontend .env configured"

# Create server/.env file
if [ -f server/.env ]; then
    read -p "⚠️  server/.env file already exists. Overwrite? (y/N) [N]: " overwrite_server
    overwrite_server=${overwrite_server:-N}
    if [[ ! $overwrite_server =~ ^[Yy]$ ]]; then
        echo "Using existing server/.env file..."
    else
        cp server/.env.example server/.env
    fi
else
    cp server/.env.example server/.env
fi

# Update server/.env with password and correct database host
sed -i.bak "s|change_this_password|$POSTGRES_PASSWORD|g" server/.env
sed -i.bak "s|localhost:5432|postgres:5432|g" server/.env
sed -i.bak "s|NODE_ENV=development|NODE_ENV=production|g" server/.env
rm -f server/.env.bak

echo "✅ Backend .env configured"
echo ""

# Ask if user wants to deploy now
read -p "🚀 Deploy now? (Y/n) [Y]: " deploy_now
deploy_now=${deploy_now:-Y}

if [[ $deploy_now =~ ^[Yy]$ ]]; then
    echo ""
    echo "🐳 Starting Docker containers..."
    echo "   This may take a few minutes for the first build..."
    echo ""

    docker compose up -d --build

    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 10

    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "📍 Your Event Calendar is now running at:"
    echo "   Frontend: $FRONTEND_URL"
    echo "   Backend API: ${API_URL%/api}/health"
    echo ""
    echo "📝 Useful commands:"
    echo "   View logs:        docker compose logs -f"
    echo "   Stop services:    docker compose down"
    echo "   Restart services: docker compose restart"
    echo "   Remove data:      docker compose down -v"
    echo ""

    # Try to check if services are running
    if docker compose ps | grep -q "Up"; then
        echo "✅ All services are running!"
    else
        echo "⚠️  Some services may not be running. Check with: docker compose ps"
    fi
else
    echo ""
    echo "⏸️  Configuration saved. Deploy later with:"
    echo "   docker compose up -d --build"
    echo ""
fi

echo "=========================================="
echo "✨ Deployment script completed!"
echo "=========================================="
