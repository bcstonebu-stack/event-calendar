#!/bin/bash

echo "🚀 Event Calendar Setup Script"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first:"
    echo "   https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Desktop:"
    echo "   https://www.docker.com/products/docker-desktop/"
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Function to generate random password
generate_password() {
    # Generate a 24-character random password
    openssl rand -base64 24 | tr -d "=+/" | cut -c1-24
}

# Create .env files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file with secure password..."

    # Generate random password
    POSTGRES_PASSWORD=$(generate_password)

    # Create .env file from example
    cp .env.example .env

    # Update password in .env (macOS compatible sed)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/change_this_password_in_production/$POSTGRES_PASSWORD/g" .env
    else
        sed -i "s/change_this_password_in_production/$POSTGRES_PASSWORD/g" .env
    fi

    echo "✅ Frontend .env created with secure password"
else
    echo "✅ Frontend .env already exists"
    # Extract password from existing .env
    POSTGRES_PASSWORD=$(grep POSTGRES_PASSWORD .env | cut -d '=' -f2)
fi

if [ ! -f server/.env ]; then
    echo "📝 Creating server .env file with matching password..."

    # Create server .env from example
    cp server/.env.example server/.env

    # Update password and host in server/.env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/change_this_password/$POSTGRES_PASSWORD/g" server/.env
        sed -i '' "s/localhost/postgres/g" server/.env
    else
        sed -i "s/change_this_password/$POSTGRES_PASSWORD/g" server/.env
        sed -i "s/localhost/postgres/g" server/.env
    fi

    echo "✅ Backend .env created with matching password"
else
    echo "✅ Backend .env already exists"
fi

echo ""
echo "🐳 Starting Docker containers..."
echo ""

# Start Docker Compose
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📍 Your Event Calendar is now running at:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3001/api"
echo "   Health Check: http://localhost:3001/api/health"
echo ""
echo "📝 Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Remove data:      docker-compose down -v"
echo ""
